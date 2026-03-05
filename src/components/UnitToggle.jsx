import React from 'react';
import { motion } from 'framer-motion';

const UnitToggle = ({ unit, onChange }) => (
    <motion.button
        className="unit-toggle"
        onClick={() => onChange(unit === 'C' ? 'F' : 'C')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Sıcaklık birimini değiştir"
    >
        <span className={`unit-option ${unit === 'C' ? 'active' : ''}`}>°C</span>
        <span className="unit-divider">/</span>
        <span className={`unit-option ${unit === 'F' ? 'active' : ''}`}>°F</span>
    </motion.button>
);

export const toF = (c) => Math.round(c * 9 / 5 + 32);
export const convertTemp = (c, unit) => unit === 'F' ? toF(c) : Math.round(c);
export const tempLabel = (c, unit) => `${convertTemp(c, unit)}°${unit}`;

export default UnitToggle;
