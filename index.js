const express = require("express");
const helmet = require("helmet");
const socket = require("socket.io")

const PORT = process.env.PORT || 8000
const server = express();

server.use(helmet());
server.use(express.json());

const socket = new WebSocket('ws://localhost:3000')
server.get("/", (req, res) => {
    res.send(`Sanity check`);
  });

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}...`);
});