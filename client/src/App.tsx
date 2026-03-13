import { useState } from 'react'
import { fetchWeather, fetchCities, fetchPrompt } from './api'
import './App.css'

interface WeatherData {
  city?: string
  country?: string
  temp?: string
  humidity?: string
  weather?: string
  wind?: string
  error?: string
}

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [cities, setCities] = useState<string[]>([])
  const [prompt, setPrompt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'weather' | 'cities' | 'prompt' | 'about'>('weather')

  const handleFetchWeather = async () => {
    if (!city.trim()) return
    setLoading(true)
    setError(null)
    setWeather(null)
    try {
      const data = await fetchWeather(city)
      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather')
    } finally {
      setLoading(false)
    }
  }

  const handleFetchCities = async () => {
    setLoading(true)
    setError(null)
    setCities([])
    try {
      const data = await fetchCities()
      setCities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cities')
    } finally {
      setLoading(false)
    }
  }

  const handleFetchPrompt = async () => {
    if (!city.trim()) return
    setLoading(true)
    setError(null)
    setPrompt(null)
    try {
      const data = await fetchPrompt(city)
      const text = data?.messages?.[0]?.content?.text ?? JSON.stringify(data, null, 2)
      setPrompt(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prompt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>MCP Weather Demo</h1>
        <p className="subtitle">React + REST API + Model Context Protocol</p>
      </header>

      <nav className="tabs">
        {(['weather', 'cities', 'prompt', 'about'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main className="content">
        {activeTab === 'weather' && (
          <section className="card">
            <h2>Weather (MCP Tool)</h2>
            <p className="card-desc">Calls <code>getWeatherDataByCity</code> via MCP</p>
            <div className="input-row">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city (e.g. London, Tokyo)"
                onKeyDown={(e) => e.key === 'Enter' && handleFetchWeather()}
              />
              <button onClick={handleFetchWeather} disabled={loading}>
                {loading ? 'Loading...' : 'Get Weather'}
              </button>
            </div>
            {weather && (
              <div className={`weather-result ${weather.error ? 'error' : ''}`}>
                {weather.error ? (
                  <p>{weather.error}</p>
                ) : (
                  <>
                    <h3>{weather.city}, {weather.country}</h3>
                    <div className="weather-grid">
                      <span><strong>Temp:</strong> {weather.temp}</span>
                      <span><strong>Humidity:</strong> {weather.humidity}</span>
                      <span><strong>Conditions:</strong> {weather.weather}</span>
                      <span><strong>Wind:</strong> {weather.wind}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'cities' && (
          <section className="card">
            <h2>Cities (MCP Resource)</h2>
            <p className="card-desc">Reads <code>weather://cities</code> resource</p>
            <button onClick={handleFetchCities} disabled={loading}>
              {loading ? 'Loading...' : 'Load Cities'}
            </button>
            {cities.length > 0 && (
              <div className="cities-list">
                {cities.map((c) => (
                  <span key={c} className="city-chip" onClick={() => { setCity(c); setActiveTab('weather'); }}>
                    {c}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'prompt' && (
          <section className="card">
            <h2>Prompt (MCP Prompt)</h2>
            <p className="card-desc">Gets <code>weather-inquiry</code> prompt template</p>
            <div className="input-row">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City for prompt"
                onKeyDown={(e) => e.key === 'Enter' && handleFetchPrompt()}
              />
              <button onClick={handleFetchPrompt} disabled={loading}>
                {loading ? 'Loading...' : 'Get Prompt'}
              </button>
            </div>
            {prompt && (
              <pre className="prompt-output">{prompt}</pre>
            )}
          </section>
        )}

        {activeTab === 'about' && (
          <section className="card about-card">
            <h2>How It Works</h2>
            <div className="architecture">
              <div className="arch-row">
                <span className="arch-box">React App</span>
                <span className="arch-arrow">fetch()</span>
                <span className="arch-box">Express API</span>
                <span className="arch-arrow">→</span>
                <span className="arch-box">weather.ts</span>
              </div>
            </div>
            <p>
              The API uses shared weather logic directly. The MCP server runs separately
              for Cursor/Inspector and uses the same logic.
            </p>
            <p>
              <strong>Third-party MCP:</strong> Cursor can run both our custom server and
              external MCPs (e.g. <code>@dangahagan/weather-mcp</code> for forecasts, air
              quality). See docs/third-party-mcp.md.
            </p>
            <h3>Tech Stack</h3>
            <ul>
              <li><strong>Frontend:</strong> React, TypeScript, Vite</li>
              <li><strong>Backend:</strong> Express, MCP Client SDK</li>
              <li><strong>MCP Server:</strong> Tools, Resources, Prompts</li>
              <li><strong>Weather API:</strong> Open-Meteo (free)</li>
            </ul>
            <h3>Run Locally</h3>
            <pre className="code-block">{`# Terminal 1 - Start API (spawns MCP server)
npm run api

# Terminal 2 - Start React app
cd client && npm run dev`}</pre>
          </section>
        )}

        {error && <p className="error-msg">{error}</p>}
      </main>

      <footer className="footer">
        <p>POC • MCP Weather Integration • Portfolio Project</p>
      </footer>
    </div>
  )
}

export default App
