import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, loading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() !== '') {
            onSearch(query);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ position: 'relative', width: '100%' }}
        >
            <input
                type="text"
                className="glass-input"
                placeholder="Şehir adı giriniz..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    fontSize: '1.1rem',
                    borderRadius: '16px',
                }}
            />
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
