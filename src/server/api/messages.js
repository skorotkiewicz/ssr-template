import { Router } from "express";
import { prisma } from "../db.js";
import { io } from "../socket.js";

const router = Router();

router.get("/", async (req, res) => {
  const page = Number.parseInt(req.query.page) || 1;
  const limit = 30;
  const offset = (page - 1) * limit;

  const messages = await prisma.message.findMany({
    take: limit,
    skip: offset,
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const totalMessages = await prisma.message.count();

  res.json({
    messages: messages.reverse(),
    hasMore: page * limit < totalMessages,
    total: totalMessages,
  });
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
