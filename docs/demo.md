# Demo Walkthrough

This document shows example conversations where the AI assistant calls MCP tools, reads resources, and uses prompt templates.

---

## Conversation 1: Weather Tool Call

### User

> What's the weather in Tokyo right now?

### What happens behind the scenes

**1. LLM decides to call tool:**

```json
{
  "tool_calls": [{
    "name": "getWeatherDataByCity",
    "arguments": { "city": "Tokyo" }
  }]
}
```

**2. MCP Server receives JSON-RPC:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "getWeatherDataByCity",
    "arguments": { "city": "Tokyo" }
  }
}
```

**3. Server calls Open-Meteo API:**

- Geocode: `Tokyo` → `lat: 35.6895, lon: 139.6917`
- Forecast: `temperature_2m: 22, relative_humidity_2m: 65, weather_code: 2, wind_speed_10m: 12`

**4. Tool response:**

```json
{
  "content": [{
    "type": "text",
    "text": "{\n  \"temp\": \"22°C\",\n  \"humidity\": \"65%\",\n  \"weather\": \"Partly cloudy\",\n  \"wind\": \"12 km/h\",\n  \"city\": \"Tokyo\",\n  \"country\": \"Japan\"\n}"
  }]
}
```

### Assistant Response

> Tokyo is currently 22°C with partly cloudy skies. Humidity is at 65% and winds are moderate at 12 km/h.

---

## Conversation 2: Resource Read

### User

> What cities can I check weather for?

### What happens behind the scenes

**1. LLM decides to read a resource:**

```json
{
  "method": "resources/read",
  "params": { "uri": "weather://cities" }
}
```

**2. Server returns:**

```json
{
  "contents": [{
    "uri": "weather://cities",
    "mimeType": "text/plain",
    "text": "London\nNew York\nTokyo\nBerlin\nParis\nMumbai"
  }]
}
```

### Assistant Response

> You can check weather for these cities: London, New York, Tokyo, Berlin, Paris, and Mumbai. You can also try any other city name — the tool accepts any city worldwide.

---

## Conversation 3: Prompt Template

### User Action

The user selects the **"Ask about weather"** prompt from the prompts list in the UI and enters **"Berlin"** as the city.

### What happens behind the scenes

**1. Client fetches the prompt:**

```json
{
  "method": "prompts/get",
  "params": {
    "name": "weather-inquiry",
    "arguments": { "city": "Berlin" }
  }
}
```

**2. Server returns a pre-filled message:**

```json
{
  "messages": [{
    "role": "user",
    "content": {
      "type": "text",
      "text": "What's the current weather in Berlin? Please fetch the live data and tell me the temperature, humidity, and conditions."
    }
  }]
}
```

**3. This message is injected into the chat. The LLM then calls the tool:**

```json
{
  "tool_calls": [{
    "name": "getWeatherDataByCity",
    "arguments": { "city": "Berlin" }
  }]
}
```

**4. Tool response:**

```json
{
  "temp": "18°C",
  "humidity": "55%",
  "weather": "Mainly clear",
  "wind": "8 km/h",
  "city": "Berlin",
  "country": "Germany"
}
```

### Assistant Response

> Berlin is currently enjoying mainly clear skies at 18°C. Humidity is comfortable at 55% with light winds at 8 km/h.

---

## Conversation 4: Error Handling

### User

> What's the weather in Xyzzyville?

### What happens behind the scenes

**1. LLM calls tool with the unknown city:**

```json
{ "arguments": { "city": "Xyzzyville" } }
```

**2. Geocoding returns no results. Tool response:**

```json
{
  "content": [{
    "type": "text",
    "text": "{\n  \"error\": \"City not found: Xyzzyville\"\n}"
  }]
}
```

### Assistant Response

> I wasn't able to find a city called "Xyzzyville." Could you double-check the spelling? You can try cities like London, Tokyo, New York, Berlin, Paris, or Mumbai.

---

## Conversation 5: Third-Party MCP (Extended Weather)

With `@dangahagan/weather-mcp` configured alongside our custom server, you can ask:

### User

> What's the 7-day forecast for Mumbai? Include air quality if possible.

### What happens behind the scenes

The LLM may call tools from the **third-party** `weather-mcp` server:
- `forecast` — multi-day forecasts
- `air_quality` — AQI and pollutant data

This demonstrates that the setup supports **both** custom and external MCP servers. See [Third-Party MCP Integration](third-party-mcp.md).

---

## REST API Demo

You can also test via the REST API directly:

```bash
# Tool: Get weather
curl "http://localhost:3001/api/weather?city=Mumbai"

# Resource: List cities
curl "http://localhost:3001/api/cities"

# Prompt: Get template
curl "http://localhost:3001/api/prompt?city=Paris"
```

### Sample curl output

```bash
$ curl -s "http://localhost:3001/api/weather?city=Mumbai" | jq .
{
  "temp": "32°C",
  "humidity": "70%",
  "weather": "Partly cloudy",
  "wind": "18 km/h",
  "city": "Mumbai",
  "country": "India"
}
```
