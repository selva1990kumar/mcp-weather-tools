/**
 * Custom hook: Call MCP-backed REST API from React
 *
 * Usage:
 *   const { weather, loading, error, fetchWeather } = useWeatherApi();
 *   fetchWeather("London");
 */

import { useState, useCallback } from "react";

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

export function useWeatherApi() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (city: string) => {
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
  }, []);

  const fetchCities = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cities`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data.cities as string[];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cities");
      return [];
    }
  }, []);

  const fetchPrompt = useCallback(async (city: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/prompt?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch prompt");
      return null;
    }
  }, []);

  return { weather, loading, error, fetchWeather, fetchCities, fetchPrompt };
}
