import fs from "node:fs/promises";
import { Transform } from "node:stream";

const ABORT_DELAY = 10000;
let template;
let render;

export async function setupViteDevServer(vite) {
  template = await fs.readFile("index.html", "utf-8");
  template = await vite.transformIndexHtml("/", template);
  return vite;
}

export async function setupViteProd() {
  template = await fs.readFile("dist/client/index.html", "utf-8");
  render = (await import("../../dist/server/entry-server.js")).render;
}

export async function handleRender(req, res, vite) {
  const url = req.originalUrl;

  try {
    if (vite) {
      template = await fs.readFile("index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
    }

    let didError = false;

    const { pipe, abort } = render(url, {
      onShellError() {
        res.status(500);
        res.set({ "Content-Type": "text/html" });
        res.send("<h1>Something went wrong</h1>");
      },
      onShellReady() {
        res.status(didError ? 500 : 200);
        res.set({ "Content-Type": "text/html" });

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding);
            callback();
          },
        });

        const [htmlStart, htmlEnd] = template.split("<!--ssr-outlet-->");

        res.write(htmlStart);

        transformStream.on("finish", () => {
          res.end(htmlEnd);
        });

        pipe(transformStream);
      },
      onError(error) {
        didError = true;
        console.error(error);
      },
    });

    setTimeout(() => {
      abort();
    }, ABORT_DELAY);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error("Critical rendering error:", e);
    res.status(500).end(e.message);
  }
}
