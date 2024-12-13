import { Router } from "express";
import { prisma } from "../db.js";
import { io } from "../socket.js";

const router = Router();

router.get("/", async (req, res) => {
  const messages = await prisma.message.findMany({
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
});

router.post("/", async (req, res) => {
  const { content, userId } = req.body;
  const message = await prisma.message.create({
    data: { content, userId },
    include: { user: true },
  });
  io.emit("message", message);
  res.json(message);
});

export default router;
