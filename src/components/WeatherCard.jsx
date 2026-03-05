import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Wind, Thermometer, ArrowDown, ArrowUp } from 'lucide-react';

const SunArc = ({ sunrise, sunset, timezone }) => {
    if (!sunrise || !sunset) return null;

    // Convert to local time of the queried city
    const nowUtc = Math.floor(Date.now() / 1000);
    const nowLocal = nowUtc + (timezone || 0);
    const riseLocal = sunrise + (timezone || 0);
    const setLocal = sunset + (timezone || 0);

    const total = setLocal - riseLocal;
    const elapsed = Math.max(0, Math.min(total, nowLocal - riseLocal));
    const progress = total > 0 ? elapsed / total : 0;

    const toHHMM = (utcTs) => {
        const d = new Date((utcTs) * 1000);
        return d.toUTCString().slice(17, 22);
    };

    // SVG arc: semi-circle from left to right
    const W = 220, H = 110, R = 90, cx = W / 2, cy = H;
    const toPoint = (t) => {
        const angle = Math.PI - t * Math.PI; // 0→π reversed so left=rise, right=set
        return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
    };
    const sun = toPoint(progress);
    const arcPath = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`;

    return (
        <div className="sun-arc-wrapper">
            <svg viewBox={`0 0 ${W} ${H}`} className="sun-arc-svg">
                {/* track */}
                <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeLinecap="round" />
                {/* filled progress */}
                {progress > 0 && (
                    <path
                        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${sun.x} ${sun.y}`}
                        fill="none"
                        stroke="rgba(255,200,80,0.7)"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                )}
                {/* sun dot */}
                <circle cx={sun.x} cy={sun.y} r="7" fill="#ffd54f" />
                <circle cx={sun.x} cy={sun.y} r="12" fill="rgba(255,213,79,0.25)" />
            </svg>
            <div className="sun-arc-times">
                <span>🌅 {toHHMM(sunrise)}</span>
                <span>🌇 {toHHMM(sunset)}</span>
            </div>
        </div>
    );
};

const WeatherCard = ({ data, loading, onShowForecast }) => {
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
                    <div style={{ textTransform: 'capitalize', fontSize: '1.2rem', color: 'var(--secondary-text)', marginBottom: '1.2rem' }}>
                        {data.description}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
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

                    {/* Min / Max */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--secondary-text)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ArrowDown size={14} style={{ color: '#64b5f6' }} />{Math.round(data.tempMin)}°
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ArrowUp size={14} style={{ color: '#ef9a9a' }} />{Math.round(data.tempMax)}°
                        </span>
                    </div>

                    {/* Stats grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        background: 'var(--glass-bg)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid var(--glass-border)',
                        marginBottom: '1.2rem',
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

                    {/* Sun Arc */}
                    <SunArc sunrise={data.sunrise} sunset={data.sunset} timezone={data.timezone} />

                    {/* 7-Day forecast button */}
                    {onShowForecast && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onShowForecast}
                            className="glass-button forecast-btn"
                        >
                            📅 7 Günlük Tahmin
                        </motion.button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WeatherCard;
