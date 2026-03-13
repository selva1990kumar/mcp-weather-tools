/**
 * Shared weather logic - used by both MCP server and REST API.
 * API uses this directly to avoid Windows stdio timeout issues with MCP client.
 */

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface WeatherData {
  temp: string;
  humidity: string;
  weather: string;
  wind: string;
  city: string;
  country?: string;
}

/** Fetches real weather from Open-Meteo API (free, no key required) */
export async function getWeatherByCity(
  city: string
): Promise<WeatherData | { error: string }> {
  try {
    const geoUrl = `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results?.length) {
      return { error: `City not found: ${city}` };
    }

    const geo: GeoResult = geoData.results[0];
    const { latitude, longitude, name, country } = geo;

    const weatherUrl = `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const current = weatherData.current;
    if (!current) {
      return { error: "Weather data unavailable" };
    }

    const weatherCodes: Record<number, string> = {
      0: "Clear",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Rime fog",
      51: "Light drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      80: "Light showers",
      95: "Thunderstorm",
    };
    const weather =
      weatherCodes[current.weather_code] ?? `Code ${current.weather_code}`;

    return {
      temp: `${current.temperature_2m}°C`,
      humidity: `${current.relative_humidity_2m}%`,
      weather,
      wind: `${current.wind_speed_10m} km/h`,
      city: name,
      country,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Failed to fetch weather: ${msg}` };
  }
}

export const SUPPORTED_CITIES =
  "London\nNew York\nTokyo\nBerlin\nParis\nMumbai";
