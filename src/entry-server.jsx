import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

export function render(url, options) {
  return renderToPipeableStream(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
    options,
  );
}
