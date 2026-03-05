import React, { useState } from 'react';
import WeatherBackground from './components/WeatherBackground';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import PopularCities from './components/PopularCities';
import CityScrollTicker from './components/CityScrollTicker';
import HourlyForecast from './components/HourlyForecast';
import AQIBadge from './components/AQIBadge';
import FavoriteCities from './components/FavoriteCities';
import ForecastModal from './components/ForecastModal';
import { useFavorites } from './hooks/useFavorites';
import {
    fetchWeatherByCity,
    fetchWeatherByCoords,
    fetchHourlyForecast,
    fetchDailyForecast,
    fetchAQI,
} from './services/weatherApi';
import './index.css';

function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hourly, setHourly] = useState([]);
    const [dailyForecast, setDailyForecast] = useState([]);
    const [aqi, setAqi] = useState(null);
    const [showForecast, setShowForecast] = useState(false);
    const { favorites, add: addFav, remove: removeFav, has: isFav } = useFavorites();

    const loadExtras = async (lat, lon) => {
        const [h, d, a] = await Promise.all([
            fetchHourlyForecast(lat, lon),
            fetchDailyForecast(lat, lon),
            fetchAQI(lat, lon),
        ]);
        setHourly(h);
        setDailyForecast(d);
        setAqi(a);
    };

    const handleSearch = async (city) => {
        setLoading(true);
        setError(null);
        setShowForecast(false);

        try {
            const data = await fetchWeatherByCity(city);
            setWeatherData(data);
            addFav(data.city);
            loadExtras(data.lat, data.lon);
        } catch (err) {
            setError(err.message);
            setWeatherData(null);
            setHourly([]);
            setDailyForecast([]);
            setAqi(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLocate = async (lat, lon) => {
        setLoading(true);
        setError(null);
        setShowForecast(false);

        try {
            const data = await fetchWeatherByCoords(lat, lon);
            setWeatherData(data);
            addFav(data.city);
            loadExtras(data.lat, data.lon);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <WeatherBackground condition={weatherData?.condition} icon={weatherData?.icon} />

            <main className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 10 }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Hava Durumu</h1>
                    <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>Anlık sıcaklık değerlerini öğrenin</p>
                </div>

                <SearchBar onSearch={handleSearch} onLocate={handleLocate} loading={loading} />

                <FavoriteCities favorites={favorites} onSelect={handleSearch} onRemove={removeFav} />

                <div>
                    <PopularCities onSelect={handleSearch} />
                </div>

                <CityScrollTicker onSelect={handleSearch} />

                {error && (
                    <div style={{ padding: '1rem', background: 'rgba(255,50,50,0.2)', borderRadius: '12px', border: '1px solid rgba(255,50,50,0.5)', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                {aqi && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <AQIBadge aqi={aqi} />
                    </div>
                )}

                <WeatherCard
                    data={weatherData}
                    loading={loading}
                    onShowForecast={dailyForecast.length > 0 ? () => setShowForecast(true) : null}
                />

                <HourlyForecast items={hourly} />
            </main>

            <ForecastModal
                city={weatherData?.city}
                days={showForecast ? dailyForecast : []}
                onClose={() => setShowForecast(false)}
            />
        </div>
    );
}

export default App;
