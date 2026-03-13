/**
 * API client for MCP-backed REST endpoints
 * Uses /api in dev (Vite proxy) and production
 */

const API_BASE = '/api';

export async function fetchWeather(city: string) {
  const res = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(city)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function fetchCities() {
  const res = await fetch(`${API_BASE}/cities`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data.cities as string[];
}

export async function fetchPrompt(city: string) {
  const res = await fetch(`${API_BASE}/prompt?city=${encodeURIComponent(city)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
