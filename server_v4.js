const express = require("express");
const http = require("http");
const socketIO = require("socket.io-latest");
var cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");

const corsOptions = {
  origin: "http://localhost:3000", // Replace with the origin of your frontend application
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const server = http.Server(app);

const ioV4 = socketIO(server);

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

server.listen(3334, () => {
  const url = `http://localhost:3334`;

  console.log(
    `Server started:\n\x1b]8;;${url}\x07${url}\x1b]8;;\x07 - io version = 4`
  );
});
