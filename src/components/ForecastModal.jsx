import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line
import { X } from 'lucide-react';

const DAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

const WEATHER_ICONS = {
    Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️',
    Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️',
    Haze: '🌫️', Smoke: '🌫️', Dust: '🌫️', Sand: '🌫️',
};

const getIcon = (c) => WEATHER_ICONS[c] ?? '🌡️';

const ForecastModal = ({ city, days, onClose }) => {
    return (
        <AnimatePresence>
            {days && days.length > 0 && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        className="modal-panel glass-panel"
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 60, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    >
                        <div className="modal-header">
                            <h3>📅 {city} — 7 Günlük Tahmin</h3>
                            <button className="modal-close glass-button" onClick={onClose}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="forecast-list">
                            {days.map((day, i) => {
                                const date = new Date(day.time * 1000);
                                const dayName = i === 0 ? 'Bugün' : DAYS_TR[date.getDay()];
                                const dateStr = `${date.getDate()}/${date.getMonth() + 1}`;
                                return (
                                    <motion.div
                                        key={day.time}
                                        className="forecast-row"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                    >
                                        <div className="forecast-day">
                                            <span className="forecast-day-name">{dayName}</span>
                                            <span className="forecast-day-date">{dateStr}</span>
                                        </div>
                                        <span className="forecast-icon">{getIcon(day.condition)}</span>
                                        <span className="forecast-desc">{day.description}</span>
                                        <div className="forecast-temps">
                                            <span className="forecast-max">{Math.round(day.tempMax)}°</span>
                                            <span className="forecast-min">{Math.round(day.tempMin)}°</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ForecastModal;
