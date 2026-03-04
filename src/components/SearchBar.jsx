import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { geocodeCity } from '../services/weatherApi';

const SearchBar = ({ onSearch, loading }) => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const debounceRef = useRef(null);
    const suggestionsRef = useRef(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() !== '') {
            setShowSuggestions(false);
            onSearch(query);
        }
    };

    const handleSelect = (city) => {
        setQuery(city);
        setShowSuggestions(false);
        setActiveIndex(-1);
        onSearch(city);
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!query || query.trim().length === 0) {
            setSuggestions([]);
            return;
        }

        // debounce network calls
        debounceRef.current = setTimeout(async () => {
            try {
                const results = await geocodeCity(query, 8);
                // Format display text: "City, State, Country"
                const formatted = results.map(r => ({
                    label: `${r.name}${r.state ? ', ' + r.state : ''}${r.country ? ', ' + r.country : ''}`,
                    name: r.name,
                    lat: r.lat,
                    lon: r.lon,
                }));
                setSuggestions(formatted);
                setActiveIndex(-1);
            } catch (e) {
                setSuggestions([]);
            }
        }, 250);

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    // scroll active suggestion into view when navigating with keyboard
    useEffect(() => {
        if (activeIndex < 0) return;
        const container = suggestionsRef.current;
        if (!container) return;
        const items = container.querySelectorAll('.suggestion-item');
        const el = items[activeIndex];
        if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }, [activeIndex]);

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((idx) => (idx + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((idx) => (idx <= 0 ? suggestions.length - 1 : idx - 1));
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
                e.preventDefault();
                handleSelect(suggestions[activeIndex].name);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setActiveIndex(-1);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ position: 'relative', width: '100%' }}
            autoComplete="off"
        >
            <input
                type="text"
                className="glass-input"
                placeholder="Şehir adı giriniz..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); setActiveIndex(-1); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    fontSize: '1.1rem',
                    borderRadius: '16px',
                }}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions">
                    {suggestions.map((s, i) => (
                        <div
                            key={s.label}
                            className={`suggestion-item ${i === activeIndex ? 'active' : ''}`}
                            onMouseDown={() => handleSelect(s.name)}
                        >
                            <MapPin className="suggestion-icon" size={16} />
                            <div>{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            <button
                type="submit"
                className="glass-button"
                disabled={loading}
                style={{
                    position: 'absolute',
                    right: '8px',
                    top: '8px',
                    bottom: '8px',
                    width: '45px',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 'none'
                }}
            >
                {loading ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}
                    />
                ) : (
                    <Search size={20} />
                )}
            </button>
        </motion.form>
    );
};

export default SearchBar;
