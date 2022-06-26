import express from "express";
import game_router from "./modules/game.router.mjs";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";

import cors from "cors";
import log from "@ajar/marker";

const { PORT, HOST } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

let socketCount = 0;
let player1 = "";
let player2 = "";

io.on("connection", (socket) => {
  console.log("socket connected, ID:", socket.id);
  socketCount++;
  if (socketCount === 1) {
    player1 = socket;
    player1.emit("server-msg", "Welcome to the game! wait for another player");
    return;
  }
  if (socketCount === 2) {
    player2 = socket;
    player2.emit(
      "server-msg",
      "Welcome to the game! You are player 2, wait for your turn"
    );
    player1.emit("server-msg", "You are player 1, wait for your turn");

    player1.on("client-msg", (data) => {
      player2.emit("client-msg", data);
    });
    player2.on("client-msg", (data) => {
      player1.emit("client-msg", data);
    });
    return;
  }
}); 

app.use("/api", game_router);

app.use((req, res, next) => {
  res.status(404).send(` - 404 - url was not found`);
});

httpServer.listen(PORT, HOST, () => {
  log.magenta(`Server is listening on`, `http://${HOST}:${PORT}`);
});
