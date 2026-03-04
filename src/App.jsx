import React, { useState } from 'react';
import WeatherBackground from './components/WeatherBackground';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { fetchWeatherByCity } from './services/weatherApi';
import './index.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByCity(city);
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <WeatherBackground condition={weatherData?.condition} />

      <main className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 10 }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Hava Durumu</h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>Anlık sıcaklık değerlerini öğrenin</p>
        </div>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(255,50,50,0.2)', borderRadius: '12px', border: '1px solid rgba(255,50,50,0.5)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <WeatherCard data={weatherData} loading={loading} />
      </main>
    </div>
  );
}

export default App;
