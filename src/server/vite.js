import fs from "node:fs/promises";

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

    const appHtml = render(url);
    const html = template.replace("<!--ssr-outlet-->", appHtml);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    if (vite) {
      vite.ssrFixStacktrace(e);
    }
    console.error(e);
    res.status(500).end(e.message);
  }
}
