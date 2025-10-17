import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve built SPA assets
const spaDir = path.resolve(__dirname, "../spa");
app.use(express.static(spaDir));

// Health check
app.get(["/health", "/ping"], (_req, res) => res.json({ ok: true }));

// SPA fallback
app.get("*", (_req, res) => {
  res.sendFile(path.join(spaDir, "index.html"));
});

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
