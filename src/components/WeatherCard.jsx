import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Wind, Thermometer } from 'lucide-react';

const WeatherCard = ({ data, loading }) => {
    if (loading && !data) return null;

    return (
        <AnimatePresence mode="wait">
            {data && !loading && (
                <motion.div
                    key="weather-card"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    style={{ width: '100%', textAlign: 'center' }}
                >
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{data.city}</h2>
                    <div style={{ textTransform: 'capitalize', fontSize: '1.2rem', color: 'var(--secondary-text)', marginBottom: '2rem' }}>
                        {data.description}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        {/* OWM icon (could be changed to modern SVGs later) */}
                        {data.icon && (
                            <img
                                src={`https://openweathermap.org/img/wn/${data.icon}@4x.png`}
                                alt="weather icon"
                                style={{ width: '120px', height: '120px', filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.2))' }}
                            />
                        )}
                        <div style={{ fontSize: '5rem', fontWeight: 700, lineHeight: 1 }}>
                            {Math.round(data.temp)}°
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        background: 'var(--glass-bg)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Thermometer size={24} color="rgba(255,255,255,0.7)" />
                            <span style={{ fontSize: '0.9rem', color: 'var(--secondary-text)' }}>Hissedilen</span>
                            <span style={{ fontWeight: 600 }}>{Math.round(data.feelsLike)}°</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Droplets size={24} color="rgba(255,255,255,0.7)" />
                            <span style={{ fontSize: '0.9rem', color: 'var(--secondary-text)' }}>Nem</span>
                            <span style={{ fontWeight: 600 }}>%{data.humidity}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Wind size={24} color="rgba(255,255,255,0.7)" />
                            <span style={{ fontSize: '0.9rem', color: 'var(--secondary-text)' }}>Rüzgar</span>
                            <span style={{ fontWeight: 600 }}>{Math.round(data.windSpeed)} km/h</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WeatherCard;
