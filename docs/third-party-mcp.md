# Third-Party MCP Integration

This project demonstrates **dual MCP integration**: a custom local MCP server and third-party external MCP servers. This shows that the system is capable of using both custom and external MCPs in a single setup.

---

## MCP Servers in This Project

| Server | Type | Description |
|--------|------|-------------|
| **weather-data-fetcher** | Custom (local) | Our own MCP server — geocodes city, fetches live weather via Open-Meteo; exposes tools, resources, and prompts |
| **weather-mcp** | Third-party (external) | [@dangahagan/weather-mcp](https://www.npmjs.com/package/@dangahagan/weather-mcp) — comprehensive weather server with forecasts, historical data, alerts, air quality, marine conditions; no API keys |

---

## Why Both?

- **Custom server**: Demonstrates building an MCP from scratch with tools, resources, and prompts — full control and learning.
- **Third-party server**: Demonstrates integrating external MCP servers — extensibility and ecosystem compatibility.

---

## Configuration (.cursor/mcp.json)

```json
{
  "mcpServers": {
    "weather-data-fetcher": {
      "command": "npx",
      "args": ["tsx", "server.ts"],
      "cwd": ".",
      "env": {}
    },
    "weather-mcp": {
      "command": "npx",
      "args": ["-y", "@dangahagan/weather-mcp@latest"]
    }
  }
}
```

With this config, Cursor will:
- Run your custom server for `getWeatherDataByCity`, `weather://cities`, `weather://help`, and `weather-inquiry` prompt
- Run the third-party server for extended weather tools (forecasts, historical data, alerts, etc.)

---

## Example: Using the Third-Party Weather MCP

Once configured, you can ask in Cursor:

- *"What's the 7-day forecast for Tokyo?"* — uses `weather-mcp` forecast tool
- *"Get air quality for Mumbai"* — uses `weather-mcp` air quality tool
- *"What's the weather in London right now?"* — can use either server (both support current conditions)

---

## Adding More Third-Party MCP Servers

You can add other official or community MCP servers. Examples:

| Server | Command | Use Case |
|--------|---------|----------|
| **@modelcontextprotocol/server-filesystem** | `npx -y @modelcontextprotocol/server-filesystem <path>` | Read/write files, directory operations |
| **@modelcontextprotocol/server-everything** | `npx -y @modelcontextprotocol/server-everything` | Protocol testing (all MCP features) |

Add any server to `mcpServers` in `.cursor/mcp.json` — Cursor loads all configured servers and the LLM can call tools from any of them.

---

## MCP Registry

Browse publicly available MCP servers at the [Official MCP Registry](https://registry.modelcontextprotocol.io/). Many servers support `npx` installation with no extra setup.
