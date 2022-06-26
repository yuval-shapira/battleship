import express, { json } from "express";
//import fetch from "node-fetch";

const router = express.Router();
let userName = "";

router.get("/:userName", (req, res) => {
  if (userName === "") {
    userName = req.params.userName;
    res.send(false);
  }
  res.send(userName);
});

export default router;
