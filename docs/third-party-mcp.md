# Third-Party MCP Integration

This project demonstrates **dual MCP integration**: a custom local MCP server and **MCP servers from major companies** (Anthropic, Microsoft). This shows that the system can use both custom and external enterprise MCPs.

---

## MCP Servers in This Project

| Server | Type | Provider | Description |
|--------|------|----------|-------------|
| **weather-data-fetcher** | Custom (local) | This project | Our own MCP — geocodes city, fetches live weather via Open-Meteo; tools, resources, prompts |
| **filesystem** | Official | Anthropic / MCP | [@modelcontextprotocol/server-filesystem](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem) — read/write files, directories, search |
| **memory** | Official | Anthropic / MCP | [@modelcontextprotocol/server-memory](https://www.npmjs.com/package/@modelcontextprotocol/server-memory) — persistent knowledge graph memory |

---

## Why Big-Company MCP Servers?

- **Custom server**: Demonstrates building an MCP from scratch — full control and learning.
- **Official MCP servers**: Anthropic’s official reference servers (from [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)) — widely used, enterprise-grade.
- **Microsoft**: Also offers Azure, Microsoft Learn, and Microsoft Fabric MCP servers (see [microsoft/mcp](https://github.com/microsoft/mcp)).

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
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\Selva\\AI\\MCP"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

With this config, Cursor will:
- Run your custom server for `getWeatherDataByCity`, `weather://cities`, `weather://help`, and `weather-inquiry` prompt
- Run the **filesystem** server for file operations (read, write, search) within the project directory
- Run the **memory** server for persistent memory across conversations

---

## Example: Using Official MCP Servers

Once configured, you can ask in Cursor:

- *"What's the weather in London?"* — uses `weather-data-fetcher` (custom)
- *"Read the contents of docs/architecture.md"* — uses `filesystem` (Anthropic)
- *"Remember that I prefer Celsius for weather"* — uses `memory` (Anthropic)
- *"List files in the api folder"* — uses `filesystem` (Anthropic)

---

## Other Big-Company MCP Servers

| Server | Provider | Command | Notes |
|--------|----------|---------|-------|
| **server-filesystem** | Anthropic | `npx -y @modelcontextprotocol/server-filesystem <path>` | Read/write files |
| **server-memory** | Anthropic | `npx -y @modelcontextprotocol/server-memory` | Persistent memory |
| **server-github** | Anthropic | `npx -y @modelcontextprotocol/server-github` | Requires `GITHUB_PERSONAL_ACCESS_TOKEN` |
| **server-slack** | Anthropic | `npx -y @modelcontextprotocol/server-slack` | Requires Slack OAuth |
| **Microsoft Learn** | Microsoft | See [microsoft/mcp](https://github.com/microsoft/mcp) | Docs search, code samples |

---

## MCP Registry

Browse publicly available MCP servers at the [Official MCP Registry](https://registry.modelcontextprotocol.io/). Many servers support `npx` installation with no extra setup.
