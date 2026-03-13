import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getWeatherByCity, SUPPORTED_CITIES } from "./weather.js";

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "Weather Data Fetcher",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Resources (read-only data at URIs)
// ---------------------------------------------------------------------------

server.registerResource(
  "weather-cities",
  "weather://cities",
  {
    mimeType: "text/plain",
    description: "Plain text list of cities with weather data (example cities)",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "text/plain",
        text: SUPPORTED_CITIES,
      },
    ],
  })
);

server.registerResource(
  "weather-help",
  "weather://help",
  {
    mimeType: "text/plain",
    description: "Usage instructions for the weather MCP server",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "text/plain",
        text: `Weather MCP Server Help
------------------------
• Use getWeatherDataByCity tool with any city name.
• Try: London, Tokyo, New York, Berlin, Paris, Mumbai, etc.
• API: Open-Meteo (free, no API key).
• Read weather://cities for example cities.`,
      },
    ],
  })
);

// ---------------------------------------------------------------------------
// Tools (actions the LLM can call)
// ---------------------------------------------------------------------------

server.tool(
  "getWeatherDataByCity",
  {
    city: z.string().describe("City name to fetch live weather for"),
  },
  async ({ city }) => {
    const data = await getWeatherByCity(city);
    const jsonText = JSON.stringify(data, null, 2);
    return {
      content: [{ type: "text", text: jsonText }],
    };
  }
);

// ---------------------------------------------------------------------------
// Prompts (reusable templates for chat)
// ---------------------------------------------------------------------------

server.registerPrompt(
  "weather-inquiry",
  {
    title: "Ask about weather",
    description: "Pre-fill a weather question for any city",
    argsSchema: {
      city: z.string().describe("City to ask weather for"),
    },
  },
  async ({ city }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `What's the current weather in ${city}? Please fetch the live 
          data and tell me the temperature, humidity, and conditions.`,
        },
      },
    ],
  })
);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

async function init() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather Data Fetcher MCP server is running (real API).");
}

init();
