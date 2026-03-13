/**
 * REST API for React app
 *
 * Uses shared weather logic directly (not MCP client) to avoid Windows stdio
 * timeout issues. The MCP server (server.ts) still works with Cursor/Inspector.
 */

import express from "express";
import cors from "cors";
import { getWeatherByCity, SUPPORTED_CITIES } from "../weather.js";

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// REST Endpoints
// ---------------------------------------------------------------------------

/** GET /api/weather?city=London */
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city as string;
    if (!city) {
      return res.status(400).json({ error: "Missing city parameter" });
    }
    const data = await getWeatherByCity(city);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

/** GET /api/cities */
app.get("/api/cities", async (req, res) => {
  try {
    const cities = SUPPORTED_CITIES.trim().split("\n");
    res.json({ cities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

/** GET /api/prompt?city=Chennai - Same format as MCP weather-inquiry prompt */
app.get("/api/prompt", async (req, res) => {
  try {
    const city = req.query.city as string;
    if (!city) {
      return res.status(400).json({ error: "Missing city parameter" });
    }
    res.json({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `What's the current weather in ${city}? Please fetch the live data and tell me the temperature, humidity, and conditions.`,
          },
        },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Weather API running at http://localhost:${PORT}`);
  console.log("Endpoints: GET /api/weather?city=X, /api/cities, /api/prompt?city=X");
});
