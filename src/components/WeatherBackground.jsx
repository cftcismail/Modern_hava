import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const getBackgroundGradient = (condition, isNight) => {
    if (!condition) return isNight ? 'linear-gradient(135deg, #0f1724 0%, #1f2a44 100%)' : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';

    const lowerCond = condition.toLowerCase();

    if (lowerCond.includes('clear')) {
        return isNight ? 'linear-gradient(135deg, #0f1724 0%, #243B55 100%)' : 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)';
    } else if (lowerCond.includes('cloud')) {
        return isNight ? 'linear-gradient(135deg, #1f2933 0%, #3a4756 100%)' : 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)';
    } else if (lowerCond.includes('rain') || lowerCond.includes('drizzle')) {
        return isNight ? 'linear-gradient(135deg, #0b1720 0%, #254a66 100%)' : 'linear-gradient(135deg, #373B44 0%, #4286f4 100%)';
    } else if (lowerCond.includes('snow')) {
        return isNight ? 'linear-gradient(135deg, #0f1724 0%, #1e2b3a 100%)' : 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)';
    } else if (lowerCond.includes('thunderstorm')) {
        return 'linear-gradient(135deg, #0b0f14 0%, #1b2b3b 100%)';
    }

    return isNight ? 'linear-gradient(135deg, #141321 0%, #2b2f4a 100%)' : 'linear-gradient(135deg, #614385 0%, #516395 100%)';
};

const WeatherBackground = ({ condition, icon }) => {
    const containerRef = useRef(null);

    const isNight = icon ? icon.endsWith('n') : (new Date().getHours() < 6 || new Date().getHours() > 18);
    const bg = getBackgroundGradient(condition || '', isNight);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            // set CSS vars used for parallax transforms
            el.style.setProperty('--mx', `${x}px`);
            el.style.setProperty('--my', `${y}px`);
        };

        // subtle parallax by listening to mousemove on window for full-screen feel
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    // Determine simple condition type for overlays
    const lowerCond = (condition || '').toLowerCase();
    const isClear = lowerCond.includes('clear');
    const isCloudy = lowerCond.includes('cloud');
    const isRain = lowerCond.includes('rain') || lowerCond.includes('drizzle');
    const isSnow = lowerCond.includes('snow');
    const isThunder = lowerCond.includes('thunderstorm');

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={(condition || '') + (isNight ? '-night' : '-day')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                ref={containerRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: bg,
                    zIndex: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    // init css vars
                    '--mx': '0px',
                    '--my': '0px'
                }}
            >
                {/* Sun or Moon */}
                <div className={`sky-orb ${isNight ? 'moon' : 'sun'}`} />

                {/* Colored glow/tint for sun or moon to color the scene */}
                <div className={`sky-glow ${isNight ? 'moon' : 'sun'}`} />

                {/* Clouds */}
                <div className={`clouds ${isCloudy || isRain || isThunder ? 'visible' : ''}`}>
                    <div className="cloud cloud-1" />
                    <div className="cloud cloud-2" />
                    <div className="cloud cloud-3" />
                </div>

                {/* Rain */}
                {isRain && (
                    <div className="rain">
                        {Array.from({ length: 30 }).map((_, i) => {
                            const left = Math.random() * 100;
                            const delay = Math.random() * -1.5;
                            const dur = 0.7 + Math.random() * 0.8;
                            return (
                                <div
                                    key={i}
                                    className="raindrop"
                                    style={{ left: `${left}%`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Snow */}
                {isSnow && (
                    <div className="snow">
                        {Array.from({ length: 30 }).map((_, i) => {
                            const left = Math.random() * 100;
                            const delay = Math.random() * -6;
                            const dur = 4 + Math.random() * 4;
                            return (
                                <div
                                    key={i}
                                    className="snowflake"
                                    style={{ left: `${left}%`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Lightning */}
                {isThunder && (
                    <div className="lightning" />
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default WeatherBackground;
