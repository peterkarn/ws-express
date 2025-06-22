require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIOv2 = require("socket.io");
const socketIOv4 = require("socket.io-latest");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Environment variables
const PORT_V2 = process.env.PORT_V2 || 3332;
const PORT_V4 = process.env.PORT_V4 || 3334;
// In production, Render will assign its own PORT
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SERVER_VERSION = process.env.SERVER_VERSION || "both"; // 'v2', 'v4', or 'both'

// For production on Render, we'll use a single server if PORT is provided
const RENDER_PORT = process.env.PORT;

// Parse CORS origins from environment variable
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3332", "http://localhost:3334"];

const corsOptions = {
  origin: corsOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Create v2 server if needed
function createV2Server() {
  const app = express();
  app.use(cors(corsOptions));
  const server = http.Server(app);
  const ioV2 = socketIOv2(server);

  app.use(express.static(path.join(__dirname, "public")));

  app.get("/api/events", (req, res) => {
    const eventsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "events/v2/all_events.json"), "utf8")
    );

    const events = Object.keys(eventsData).map((name) => ({ name }));
    res.json(events);
  });

  app.post("/api/send-mock-event", express.json(), (req, res) => {
    const { eventName, payload } = req.body;

    const eventsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "events/v2/all_events.json"), "utf8")
    );

    if (!(eventName in eventsData)) {
      return res.status(400).json({ error: "Unknown event" });
    }

    const eventPayload =
      payload !== undefined ? payload : eventsData[eventName];
    ioV2.emit(eventName, eventPayload);

    res.json({ status: "sent", event: eventName });
  });

  app.get("/api/all-events", (req, res) => {
    const eventsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "events/v2/all_events.json"), "utf8")
    );
    res.json(eventsData);
  });

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index_v2.html"));
  });

  const port = IS_PRODUCTION && RENDER_PORT ? RENDER_PORT : PORT_V2;

  server.listen(port, () => {
    const displayUrl = IS_PRODUCTION
      ? `Server running on port ${port}`
      : `http://localhost:${port}`;

    console.log(`Socket.io v2 server started: ${displayUrl}`);
  });

  return { app, server, io: ioV2 };
}

// Create v4 server if needed
function createV4Server() {
  const app = express();
  app.use(cors(corsOptions));
  const server = http.Server(app);
  const ioV4 = socketIOv4(server);

  app.use(express.static(path.join(__dirname, "public")));

  app.get("/api/events", (req, res) => {
    const eventsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "events/v4/all_events.json"), "utf8")
    );

    const events = Object.entries(eventsData).map(([name, value]) => {
      if (Array.isArray(value)) {
        return { name, variants: value.map((v) => v.variant) };
      }
      return { name };
    });

    res.json(events);
  });

  app.post("/api/send-mock-event", express.json(), (req, res) => {
    const { eventName, variant, payload } = req.body;

    const eventsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "events/v4/all_events.json"), "utf8")
    );

    let eventPayload;

    if (!(eventName in eventsData)) {
      return res.status(400).json({ error: "Unknown event" });
    }

    if (Array.isArray(eventsData[eventName])) {
      const foundVariant = eventsData[eventName].find(
        (v) => v.variant === variant
      );

      if (!foundVariant) {
        return res.status(400).json({ error: "Unknown variant for event" });
      }

      eventPayload = payload !== undefined ? payload : foundVariant.payload;
    } else {
      eventPayload = payload !== undefined ? payload : eventsData[eventName];
    }

    ioV4.emit(eventName, eventPayload);

    res.json({ status: "sent", event: eventName, variant });
  });

  app.get("/api/all-events", (req, res) => {
    const eventsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "events/v4/all_events.json"), "utf8")
    );
    res.json(eventsData);
  });

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index_v4.html"));
  });

  const port = IS_PRODUCTION && RENDER_PORT ? RENDER_PORT : PORT_V4;

  server.listen(port, () => {
    const displayUrl = IS_PRODUCTION
      ? `Server running on port ${port}`
      : `http://localhost:${port}`;

    console.log(`Socket.io v4 server started: ${displayUrl}`);
  });

  return { app, server, io: ioV4 };
}

// In production on Render with a provided PORT, only start one server version
if (IS_PRODUCTION && RENDER_PORT) {
  // On Render, we'll only run one server version based on SERVER_VERSION
  if (SERVER_VERSION === "v2") {
    createV2Server();
  } else {
    // Default to v4 if not specified
    createV4Server();
  }
} else {
  // In development or if no specific Render PORT, start server(s) based on SERVER_VERSION
  if (SERVER_VERSION === "v2") {
    createV2Server();
  } else if (SERVER_VERSION === "v4") {
    createV4Server();
  } else {
    // Default: start both servers
    createV2Server();
    createV4Server();
  }
}
