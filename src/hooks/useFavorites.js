import { useState } from 'react';

const LS_KEY = 'hava_favoriler';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(LS_KEY)) ?? [];
        } catch {
            return [];
        }
    });

    const add = (city) => {
        setFavorites((prev) => {
            if (prev.includes(city)) return prev;
            const next = [city, ...prev].slice(0, 8);
            localStorage.setItem(LS_KEY, JSON.stringify(next));
            return next;
        });
    };

    const remove = (city) => {
        setFavorites((prev) => {
            const next = prev.filter((c) => c !== city);
            localStorage.setItem(LS_KEY, JSON.stringify(next));
            return next;
        });
    };

    const has = (city) => favorites.includes(city);

    return { favorites, add, remove, has };
};
