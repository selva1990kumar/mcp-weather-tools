/**
 * React example: Connect to MCP via REST API
 *
 * Architecture:
 *   React (browser) → fetch() → REST API (http://localhost:3001) → MCP Client → MCP Server
 *
 * Run the API first: npm run api
 * Then run your React app (Vite/CRA) and use this component.
 */

import { useState } from "react";

const API_BASE = "http://localhost:3001";

interface WeatherData {
  city?: string;
  country?: string;
  temp?: string;
  humidity?: string;
  weather?: string;
  wind?: string;
  error?: string;
}

export function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const res = await fetch(`${API_BASE}/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Weather (via MCP)</h1>
      <p style={{ color: "#666", marginBottom: 16 }}>
        React → REST API → MCP Client → MCP Server
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g. London)"
          style={{ padding: 8, width: 200 }}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
        <button onClick={fetchWeather} disabled={loading}>
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && (
        <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8 }}>
          {weather.error ? (
            <p style={{ color: "red" }}>{weather.error}</p>
          ) : (
            <>
              <h2>{weather.city}, {weather.country}</h2>
              <p><strong>Temp:</strong> {weather.temp}</p>
              <p><strong>Humidity:</strong> {weather.humidity}</p>
              <p><strong>Conditions:</strong> {weather.weather}</p>
              <p><strong>Wind:</strong> {weather.wind}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
