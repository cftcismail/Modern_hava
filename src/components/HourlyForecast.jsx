import React from 'react';
import { motion } from 'framer-motion';

const WEATHER_ICONS = {
    Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️',
    Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️',
    Haze: '🌫️', Smoke: '🌫️', Dust: '🌫️', Sand: '🌫️',
};

const getIcon = (c) => WEATHER_ICONS[c] ?? '🌡️';

const HourlyForecast = ({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <motion.div
            className="hourly-wrapper"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="section-label">Saatlik Tahmin</div>
            <div className="hourly-scroll">
                {items.map((item) => {
                    const date = new Date(item.time * 1000);
                    const hour = date.getHours().toString().padStart(2, '0') + ':00';
                    return (
                        <div key={item.time} className="hourly-card">
                            <span className="hourly-time">{hour}</span>
                            <span className="hourly-icon">{getIcon(item.condition)}</span>
                            <span className="hourly-temp">{Math.round(item.temp)}°</span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default HourlyForecast;
