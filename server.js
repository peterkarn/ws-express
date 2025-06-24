require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIOv2 = require("socket.io");
const socketIOv4 = require("socket.io-latest");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const PORT_V2 = process.env.PORT_V2 || 3332;
const PORT_V4 = process.env.PORT_V4 || 3334;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SERVER_VERSION = process.env.SERVER_VERSION;
const RENDER_PORT = process.env.PORT;

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3332", "http://localhost:3334"];

const corsOptions = {
  origin: corsOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

function createWebsocketServer(version) {
  if (!version || (version !== "v2" && version !== "v4")) {
    throw new Error("Version must be 'v2' or 'v4'");
  }

  const app = express();
  app.use(cors(corsOptions));
  const server = http.Server(app);

  // Initialize Socket.IO based on version
  const io = version === "v2" ? socketIOv2(server) : socketIOv4(server);

  const eventsPath = path.join(__dirname, `events/${version}/all_events.json`);
  const indexPath = path.join(__dirname, `public/index_${version}.html`);
  const defaultPort = version === "v2" ? PORT_V2 : PORT_V4;

  app.use(express.static(path.join(__dirname, "public")));

  // GET /api/events - Returns list of available events
  app.get("/api/events", (req, res) => {
    try {
      const eventsData = JSON.parse(fs.readFileSync(eventsPath, "utf8"));

      if (version === "v2") {
        // V2: Simple event structure
        const events = Object.keys(eventsData).map((name) => ({ name }));
        res.json(events);
      } else {
        // V4: Events with potential variants
        const events = Object.entries(eventsData).map(([name, value]) => {
          if (Array.isArray(value)) {
            return { name, variants: value.map((v) => v.variant) };
          }
          return { name };
        });
        res.json(events);
      }
    } catch (error) {
      console.error("Error reading events file:", error);
      res.status(500).json({ error: "Failed to load events" });
    }
  });

  // POST /api/send-mock-event - Sends a mock event through WebSocket
  app.post("/api/send-mock-event", express.json(), (req, res) => {
    try {
      const eventsData = JSON.parse(fs.readFileSync(eventsPath, "utf8"));
      const { eventName, variant, payload } = req.body;

      if (!(eventName in eventsData)) {
        return res.status(400).json({ error: "Unknown event" });
      }

      let eventPayload;

      if (version === "v2") {
        // V2: Simple payload handling
        eventPayload = payload !== undefined ? payload : eventsData[eventName];
      } else {
        // V4: Handle variants if present
        if (Array.isArray(eventsData[eventName])) {
          const foundVariant = eventsData[eventName].find(
            (v) => v.variant === variant
          );

          if (!foundVariant) {
            return res.status(400).json({ error: "Unknown variant for event" });
          }

          eventPayload = payload !== undefined ? payload : foundVariant.payload;
        } else {
          eventPayload =
            payload !== undefined ? payload : eventsData[eventName];
        }
      }

      // Emit the event through WebSocket
      io.emit(eventName, eventPayload);

      // Console debug info
      console.log(`📡 [${version.toUpperCase()}] Event sent to clients:`);
      console.log(`   Event: ${eventName}`);
      if (version === "v4" && variant) {
        console.log(`   Variant: ${variant}`);
      }
      console.log(`   Payload:`, JSON.stringify(eventPayload, null, 2));
      console.log(`   Timestamp: ${new Date().toISOString()}`);
      console.log(
        `   Connected clients: ${io.engine.clientsCount || "Unknown"}`
      );

      const response = { status: "sent", event: eventName };
      if (version === "v4" && variant) {
        response.variant = variant;
      }

      res.json(response);
    } catch (error) {
      console.error("Error sending mock event:", error);
      res.status(500).json({ error: "Failed to send event" });
    }
  });

  // GET /api/all-events - Returns all events with their payloads
  app.get("/api/all-events", (req, res) => {
    try {
      const eventsData = JSON.parse(fs.readFileSync(eventsPath, "utf8"));
      res.json(eventsData);
    } catch (error) {
      console.error("Error reading events file:", error);
      res.status(500).json({ error: "Failed to load events" });
    }
  });

  // Serve the appropriate HTML file based on version
  app.get("/", (req, res) => {
    res.sendFile(indexPath);
  });

  // Add connection/disconnection logging
  io.on("connection", (socket) => {
    console.log(`🔌 [${version.toUpperCase()}] Client connected:`);
    console.log(`   Socket ID: ${socket.id}`);
    console.log(`   Total clients: ${io.engine.clientsCount}`);
    console.log(`   Timestamp: ${new Date().toISOString()}`);

    socket.on("disconnect", (reason) => {
      console.log(`🔌 [${version.toUpperCase()}] Client disconnected:`);
      console.log(`   Socket ID: ${socket.id}`);
      console.log(`   Reason: ${reason}`);
      console.log(`   Remaining clients: ${io.engine.clientsCount}`);
      console.log(`   Timestamp: ${new Date().toISOString()}`);
    });
  });

  // Start the server
  const port = IS_PRODUCTION && RENDER_PORT ? RENDER_PORT : defaultPort;

  server.listen(port, () => {
    const displayUrl = IS_PRODUCTION
      ? `Server running on port ${port}`
      : `http://localhost:${port}`;

    console.log(`Socket.io ${version} server started: ${displayUrl}`);
  });

  return { app, server, io, version };
}

// Initialize server based on environment variable
if (SERVER_VERSION === "v2") {
  createWebsocketServer("v2");
} else if (SERVER_VERSION === "v4") {
  createWebsocketServer("v4");
} else {
  console.error(
    "Please set SERVER_VERSION environment variable to 'v2' or 'v4'"
  );
  process.exit(1);
}

// Export the function for use in other modules
module.exports = { createWebsocketServer };
