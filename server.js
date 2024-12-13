import express from "express";
import { createServer } from "node:http";
import { createServer as createViteServer } from "vite";
import { initializeSocket } from "./src/server/socket.js";
import apiRouter from "./src/server/api/index.js";
import {
  setupViteDevServer,
  setupViteProd,
  handleRender,
} from "./src/server/vite.js";

async function createApp() {
  const app = express();
  const httpServer = createServer(app);

  // Initialize Socket.IO
  initializeSocket(httpServer);

  // Middleware
  app.use(express.json());

  // API Routes
  app.use("/api", apiRouter);

  // Vite SSR setup
  const isProd = process.env.NODE_ENV === "production";
  let vite;

  if (isProd) {
    app.use(express.static("dist/client", { index: false }));
    await setupViteProd();
  } else {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    await setupViteDevServer(vite);
    app.use(vite.middlewares);
  }

  // Handle SSR
  app.use("*", async (req, res) => {
    try {
      await handleRender(req, res, vite);
    } catch (e) {
      console.error(e);
      res.status(500).end(e.stack);
    }
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createApp().catch(console.error);
