import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const getBackgroundGradient = (condition) => {
    if (!condition) return 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'; // Varsayılan: Gece/Mavi

    const lowerCond = condition.toLowerCase();

    if (lowerCond.includes('clear')) {
        return 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)'; // Güneşli
    } else if (lowerCond.includes('cloud')) {
        return 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)'; // Bulutlu
    } else if (lowerCond.includes('rain') || lowerCond.includes('drizzle')) {
        return 'linear-gradient(135deg, #373B44 0%, #4286f4 100%)'; // Yağmurlu
    } else if (lowerCond.includes('snow')) {
        return 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)'; // Karlı
    } else if (lowerCond.includes('thunderstorm')) {
        return 'linear-gradient(135deg, #141E30 0%, #243B55 100%)'; // Fırtınalı
    }

    return 'linear-gradient(135deg, #614385 0%, #516395 100%)'; // Diğerleri
};

const WeatherBackground = ({ condition }) => {
    const bg = getBackgroundGradient(condition);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={condition || 'default'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: bg,
                    zIndex: 0,
                    pointerEvents: 'none'
                }}
            />
        </AnimatePresence>
    );
};

export default WeatherBackground;
