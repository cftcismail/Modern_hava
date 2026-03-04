import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const POPULAR_CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Adana', 'Antalya', 'Bursa'];

const PopularCities = ({ onSelect }) => {
    return (
        <div style={{ width: '100%' }}>
            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--secondary-text)' }}>Popüler Şehirler</h3>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {POPULAR_CITIES.map((city) => (
                    <motion.button
                        key={city}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(city)}
                        className="city-chip"
                        title={city}
                    >
                        <MapPin size={14} className="city-icon" />
                        <span style={{ display: 'inline-block' }}>{city}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default PopularCities;
