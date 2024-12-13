import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name } = req.body;
  const user = await prisma.user.create({
    data: { name },
  });
  res.json(user);
});

export default router;
