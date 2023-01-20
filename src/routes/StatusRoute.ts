import express from "express";

export const serverStatusRouter = express.Router();

serverStatusRouter.get("/status", (req, res) => {
    res.status(200).json({ message: "OK" });
});