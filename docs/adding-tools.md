# Adding Tools — Developer Guide

This guide explains how to add new tools to the MCP server.

---

## Overview

Adding a tool requires three steps:

1. **Write the business logic** in a shared module
2. **Register the tool** in `server.ts` with a name, input schema, and handler
3. **Expose via REST** (optional) in `api/index.ts` for browser access

---

## Step 1: Write Business Logic

Create or extend a shared module. Keep logic separate from MCP protocol concerns.

**Example:** Adding a city timezone tool.

Create `timezone.ts`:

```typescript
export interface TimezoneData {
  city: string;
  timezone: string;
  utcOffset: string;
  localTime: string;
}

export async function getTimezone(city: string): Promise<TimezoneData | { error: string }> {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results?.length) {
      return { error: `City not found: ${city}` };
    }

    const { name, timezone } = geoData.results[0];
    const now = new Date();
    const localTime = now.toLocaleString("en-US", { timeZone: timezone });

    return {
      city: name,
      timezone,
      utcOffset: new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "shortOffset",
      }).formatToParts(now).find(p => p.type === "timeZoneName")?.value ?? "unknown",
      localTime,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Failed to get timezone: ${msg}` };
  }
}
```

---

## Step 2: Register the Tool in `server.ts`

Import your logic and register with the MCP server:

```typescript
import { getTimezone } from "./timezone.js";

server.tool(
  "getTimezoneByCity",
  {
    city: z.string().describe("City name to look up timezone for"),
  },
  async ({ city }) => {
    const data = await getTimezone(city);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);
```

### Tool Registration API

```typescript
server.tool(name, inputSchema, handler)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Unique tool name. Use camelCase. The LLM uses this to decide which tool to call. |
| `inputSchema` | `Record<string, ZodType>` | Zod schema for input validation. Converted to JSON Schema automatically. |
| `handler` | `(args) => Promise<ToolResponse>` | Async function that executes the tool logic. |

### Input Schema Rules

- Use Zod types: `z.string()`, `z.number()`, `z.boolean()`, `z.enum([...])`, `z.optional()`
- Always add `.describe()` — the description is sent to the LLM and helps it understand the parameter
- The SDK validates inputs before your handler runs; invalid inputs return an error automatically

```typescript
{
  city: z.string().describe("City name (e.g., London, Tokyo)"),
  units: z.enum(["celsius", "fahrenheit"]).optional().describe("Temperature units"),
}
```

### Response Format

Return an object with a `content` array:

```typescript
return {
  content: [
    { type: "text", text: JSON.stringify(result, null, 2) }
  ],
};
```

For errors, set `isError: true`:

```typescript
return {
  content: [
    { type: "text", text: "City not found" }
  ],
  isError: true,
};
```

---

## Step 3: Expose via REST (Optional)

Add an endpoint in `api/index.ts`:

```typescript
import { getTimezone } from "../timezone.js";

app.get("/api/timezone", async (req, res) => {
  try {
    const city = req.query.city as string;
    if (!city) {
      return res.status(400).json({ error: "Missing city parameter" });
    }
    const data = await getTimezone(city);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});
```

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Tool name | camelCase, verb + noun | `getWeatherDataByCity`, `getTimezoneByCity` |
| Shared module | lowercase, noun | `weather.ts`, `timezone.ts` |
| Input parameter | camelCase | `city`, `units`, `dateRange` |
| REST endpoint | kebab-case, noun | `/api/weather`, `/api/timezone` |

---

## Testing Your Tool

### 1. MCP Inspector

```bash
npm run inspector
```

Open the Inspector UI, find your tool under "Tools", and test it with sample inputs.

### 2. REST API (if exposed)

```bash
curl http://localhost:3001/api/timezone?city=Tokyo
```

### 3. Cursor IDE

Restart Cursor after adding a tool. Ask: *"What timezone is Tokyo in?"* — the LLM should discover and call your new tool.

---

## Checklist

- [ ] Business logic in a shared module (not in `server.ts`)
- [ ] Zod schema with `.describe()` on every parameter
- [ ] Handler returns `{ content: [{ type: "text", text: ... }] }`
- [ ] Error cases return structured error objects, not thrown exceptions
- [ ] REST endpoint added (if needed for browser access)
- [ ] Tested via MCP Inspector or curl
