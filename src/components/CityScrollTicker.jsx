import React, { useEffect, useState, useRef } from 'react';
import { fetchWeatherByCity } from '../services/weatherApi';

const TICKER_CITIES = [
    'İstanbul', 'Ankara', 'İzmir', 'Adana', 'Antalya',
    'Bursa', 'Trabzon', 'Konya', 'Samsun', 'Gaziantep',
];

const WEATHER_ICONS = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
    Smoke: '🌫️',
    Dust: '🌫️',
    Sand: '🌫️',
    Ash: '🌫️',
    Squall: '💨',
    Tornado: '🌪️',
};

const getIcon = (condition) => WEATHER_ICONS[condition] ?? '🌡️';

const CityCard = ({ city, temp, condition, description }) => (
    <div className="ticker-card">
        <span className="ticker-card-icon">{getIcon(condition)}</span>
        <div className="ticker-card-info">
            <span className="ticker-card-city">{city}</span>
            <span className="ticker-card-desc">{description}</span>
        </div>
        <span className="ticker-card-temp">{Math.round(temp)}°C</span>
    </div>
);

const CityScrollTicker = ({ onSelect }) => {
    const [cities, setCities] = useState([]);
    const [paused, setPaused] = useState(false);
    const trackRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            const results = await Promise.allSettled(
                TICKER_CITIES.map((c) => fetchWeatherByCity(c))
            );
            if (cancelled) return;
            const loaded = results
                .map((r, i) =>
                    r.status === 'fulfilled'
                        ? { ...r.value, key: TICKER_CITIES[i] }
                        : null
                )
                .filter(Boolean);
            setCities(loaded);
        };
        load();
        return () => { cancelled = true; };
    }, []);

    if (cities.length === 0) return null;

    // Duplicate the list for seamless looping
    const doubled = [...cities, ...cities];

    return (
        <div className="ticker-wrapper">
            <div className="ticker-label">Popüler Şehirler</div>
            <div
                className="ticker-viewport"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div
                    ref={trackRef}
                    className={`ticker-track${paused ? ' paused' : ''}`}
                >
                    {doubled.map((item, index) => (
                        <button
                            key={`${item.key}-${index}`}
                            className="ticker-card-btn"
                            onClick={() => onSelect && onSelect(item.city)}
                            title={`${item.city} hava durumunu göster`}
                        >
                            <CityCard
                                city={item.city}
                                temp={item.temp}
                                condition={item.condition}
                                description={item.description}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CityScrollTicker;
