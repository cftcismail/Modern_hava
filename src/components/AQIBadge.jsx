import React from 'react';
import { motion } from 'framer-motion';

const AQIBadge = ({ aqi }) => {
    if (!aqi) return null;

    return (
        <motion.div
            className="aqi-badge"
            style={{ '--aqi-color': aqi.color }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            title={`Hava Kalite İndeksi: ${aqi.label}`}
        >
            <span className="aqi-dot" />
            <span className="aqi-label">HKİ</span>
            <span className="aqi-value">{aqi.label}</span>
        </motion.div>
    );
};

export default AQIBadge;
