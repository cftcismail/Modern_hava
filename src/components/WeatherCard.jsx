import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line
import { Droplets, Wind, Thermometer, ArrowDown, ArrowUp, Eye, Gauge, Share2 } from 'lucide-react';
import { convertTemp, tempLabel } from './UnitToggle';

// Wind degree → compass label
const windDir = (deg) => {
    if (deg == null) return '—';
    const dirs = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'KBB', 'KB', 'KKB'];
    return dirs[Math.round(deg / 22.5) % 16];
};

// SVG compass needle
const CompassIcon = ({ deg }) => {
    if (deg == null) return <Wind size={22} color="rgba(255,255,255,0.7)" />;
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1="12" y1="4" x2="12" y2="12"
                stroke="#ef9a9a" strokeWidth="2.5" strokeLinecap="round"
                transform={`rotate(${deg}, 12, 12)`} />
            <line x1="12" y1="12" x2="12" y2="20"
                stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"
                transform={`rotate(${deg}, 12, 12)`} />
            <circle cx="12" cy="12" r="2.5" fill="white" />
        </svg>
    );
};

const StatCell = ({ icon, label, value }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        {icon}
        <span style={{ fontSize: '0.82rem', color: 'var(--secondary-text)', textAlign: 'center' }}>{label}</span>
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{value}</span>
    </div>
);

const SunArc = ({ sunrise, sunset, timezone, nowTs }) => {
    if (!sunrise || !sunset) return null;

    const nowUtc = Number.isFinite(nowTs) ? nowTs : sunrise;
    const nowLocal = nowUtc + (timezone || 0);
    const riseLocal = sunrise + (timezone || 0);
    const setLocal = sunset + (timezone || 0);

    const total = setLocal - riseLocal;
    const elapsed = Math.max(0, Math.min(total, nowLocal - riseLocal));
    const progress = total > 0 ? elapsed / total : 0;

    const toHHMM = (utcTs) => {
        const tz = timezone || 0;
        const d = new Date((utcTs + tz) * 1000);
        return d.toUTCString().slice(17, 22);
    };

    const W = 220, H = 150, R = 86, cx = W / 2, cy = H - 30;
    const toPoint = (t) => {
        const angle = Math.PI - t * Math.PI;
        // x-eksenine gore simetri: alt yay yerine ust yayda ciz
        return { x: cx + R * Math.cos(angle), y: cy - R * Math.sin(angle) };
    };

    const buildArcPath = (endT) => {
        const clamped = Math.max(0, Math.min(1, endT));
        const segments = Math.max(2, Math.ceil(clamped * 64));
        const points = [];

        for (let i = 0; i <= segments; i += 1) {
            points.push(toPoint((i / segments) * clamped));
        }

        return points
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
            .join(' ');
    };

    const sun = toPoint(progress);
    const arcPath = buildArcPath(1);
    const progressPath = buildArcPath(progress);

    return (
        <div className="sun-arc-wrapper">
            <svg viewBox={`0 0 ${W} ${H}`} className="sun-arc-svg">
                <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeLinecap="round" />
                {progress > 0 && (
                    <path
                        d={progressPath}
                        fill="none"
                        stroke="rgba(255,200,80,0.7)"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                )}
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

const WeatherCard = ({ data, loading, onShowForecast, unit = 'C' }) => {
    if (loading && !data) return null;

    const handleShare = async () => {
        const text = `${data.city}: ${tempLabel(data.temp, unit)}, ${data.description}`;
        if (navigator.share) {
            await navigator.share({ title: 'Hava Durumu', text });
        } else {
            await navigator.clipboard.writeText(text);
            alert('Panoya kopyalandı: ' + text);
        }
    };

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
                    {/* Header row: city name + share */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{data.city}</h2>
                        <motion.button
                            className="share-btn glass-button"
                            onClick={handleShare}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Paylaş"
                        >
                            <Share2 size={16} />
                        </motion.button>
                    </div>

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
                            {convertTemp(data.temp, unit)}°
                        </div>
                    </div>

                    {/* Min / Max */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--secondary-text)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ArrowDown size={14} style={{ color: '#64b5f6' }} />{convertTemp(data.tempMin, unit)}°
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ArrowUp size={14} style={{ color: '#ef9a9a' }} />{convertTemp(data.tempMax, unit)}°
                        </span>
                    </div>

                    {/* Stats grid — 6 cells */}
                    <div className="stats-grid">
                        <StatCell
                            icon={<Thermometer size={22} color="rgba(255,255,255,0.7)" />}
                            label="Hissedilen"
                            value={`${convertTemp(data.feelsLike, unit)}°`}
                        />
                        <StatCell
                            icon={<Droplets size={22} color="rgba(255,255,255,0.7)" />}
                            label="Nem"
                            value={`%${data.humidity}`}
                        />
                        <StatCell
                            icon={<CompassIcon deg={data.windDeg} />}
                            label={`Rüzgar ${windDir(data.windDeg)}`}
                            value={`${Math.round(data.windSpeed)} km/h`}
                        />
                        <StatCell
                            icon={<Gauge size={22} color="rgba(255,255,255,0.7)" />}
                            label="Basınç"
                            value={`${data.pressure} hPa`}
                        />
                        <StatCell
                            icon={<Eye size={22} color="rgba(255,255,255,0.7)" />}
                            label="Görüş"
                            value={data.visibility != null ? `${data.visibility} km` : '—'}
                        />
                        <StatCell
                            icon={<Wind size={22} color="rgba(255,255,255,0.7)" />}
                            label="Rüzgar Yönü"
                            value={data.windDeg != null ? `${data.windDeg}°` : '—'}
                        />
                    </div>

                    {/* Sun Arc */}
                    <SunArc sunrise={data.sunrise} sunset={data.sunset} timezone={data.timezone} nowTs={data.timestamp} />

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
