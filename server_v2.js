const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
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

const ioV2 = socketIO(server);

server.listen(3332, () => {
  const url = `http://localhost:3332`;

  console.log(
    `Server started:\n\x1b]8;;${url}\x07${url}\x1b]8;;\x07 - io version = 2`
  );
});

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

  const eventPayload = payload !== undefined ? payload : eventsData[eventName];
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
