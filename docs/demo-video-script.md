# Demo Video Script — 60 Seconds

*Use this script when recording a walkthrough video for your portfolio.*

---

## Script

**[0:00–0:10] Problem**

> "When you ask an AI assistant 'What's the weather in Tokyo?', it can't actually check — it doesn't have access to live data. Model Context Protocol, or MCP, solves this. It's the standard for how AI assistants discover and call external tools."

**[0:10–0:25] Architecture**

> "Here's what I built. An MCP server that registers a weather tool. When an AI assistant — like Claude in Cursor — needs live weather data, it sends a JSON-RPC request to my server. The server validates the input with Zod, calls the Open-Meteo API, and returns structured JSON that the LLM uses to compose its answer."

*(Show architecture diagram on screen)*

**[0:25–0:40] Live Demo**

> "Let me show it working. I'll ask Cursor: 'What's the weather in London?' — watch the tool call happen. The MCP server fetches live data, and the assistant gives me the current temperature, humidity, and conditions."

*(Screen recording: type the question in Cursor, show the response)*

> "I also built a React frontend that calls the same logic through a REST API."

*(Switch to React app, click "Get Weather" for Tokyo)*

**[0:40–0:55] What It Demonstrates**

> "This project covers AI tool calling, input validation at the protocol boundary, structured responses, and a shared logic architecture where both the MCP server and REST API use the same business logic module."

**[0:55–1:00] Close**

> "The code, architecture docs, and security analysis are all on GitHub. Link in the description."

---

## Screen Recording Notes

| Timestamp | Show on Screen |
|-----------|----------------|
| 0:00–0:10 | Title card or architecture diagram |
| 0:10–0:25 | Mermaid diagram from README (or draw.io equivalent) |
| 0:25–0:35 | Cursor IDE: type question, show MCP tool call and response |
| 0:35–0:40 | React app: weather tab, click "Get Weather" |
| 0:40–0:55 | Code: `server.ts` tool registration, `weather.ts` logic |
| 0:55–1:00 | GitHub repo page or closing title card |

---

## Tips

- Record at 1920x1080 or higher
- Use a clean browser and IDE theme (dark mode recommended)
- Zoom into code sections so viewers can read them
- Keep terminal output visible when running commands
- Add captions if posting on LinkedIn (most viewers watch without sound)
