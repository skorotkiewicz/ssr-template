import { Router } from "express";
import messagesRouter from "./messages.js";
import usersRouter from "./users.js";

const router = Router();

router.use("/messages", messagesRouter);
router.use("/users", usersRouter);

export default router;
