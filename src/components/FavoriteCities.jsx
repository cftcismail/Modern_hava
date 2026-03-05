import React from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line
import { Star, X } from 'lucide-react';



const FavoriteCities = ({ favorites, onSelect, onRemove }) => {
    if (!favorites || favorites.length === 0) return null;

    return (
        <div className="favorites-wrapper">
            <div className="section-label">
                <Star size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Favorilerim
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                <AnimatePresence>
                    {favorites.map((city) => (
                        <motion.div
                            key={city}
                            className="favorite-chip"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.2 }}
                        >
                            <button className="favorite-chip-name" onClick={() => onSelect(city)}>
                                {city}
                            </button>
                            <button className="favorite-chip-remove" onClick={() => onRemove(city)} title="Favorilerden çıkar">
                                <X size={11} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FavoriteCities;
