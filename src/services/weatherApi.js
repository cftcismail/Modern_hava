import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEOCODE_URL = 'https://api.openweathermap.org/geo/1.0';

export const fetchWeatherByCity = async (city) => {
    if (!API_KEY) {
        throw new Error('API Anahtarı (.env içerisinde VITE_OPENWEATHER_API_KEY) tanımlanmamış!');
    }

    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric',
                lang: 'tr',
            },
        });

        const data = response.data;

        return {
            city: data.name,
            temp: data.main.temp,
            feelsLike: data.main.feels_like,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed * 3.6, // m/s to km/h donusumu
            condition: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
        };
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Şehir bulunamadı, lütfen harf hatası yapmadığınızdan emin olun.');
            }
            if (error.response.status === 401) {
                throw new Error('API anahtarı geçersiz. .env içindeki VITE_OPENWEATHER_API_KEY değerini kontrol edin.');
            }
            const msg = error.response.data && error.response.data.message ? error.response.data.message : 'Sunucudan hata döndü.';
            throw new Error(`Hava durumu verisi alınırken bir hata oluştu (${msg}).`);
        }
        throw new Error('Hava durumu verisi alınırken bir hata oluştu.');
    }
};

export const geocodeCity = async (query, limit = 8) => {
    if (!API_KEY) {
        throw new Error('API Anahtarı (.env içerisinde VITE_OPENWEATHER_API_KEY) tanımlanmamış!');
    }

    try {
        const response = await axios.get(`${GEOCODE_URL}/direct`, {
            params: {
                q: query,
                limit,
                appid: API_KEY,
            },
        });

        // response.data is an array of location objects: { name, lat, lon, country, state }
        return response.data.map((loc) => ({
            name: loc.name,
            state: loc.state || null,
            country: loc.country || null,
            lat: loc.lat,
            lon: loc.lon,
        }));
    } catch (error) {
        // don't throw UI-breaking errors for suggestions; return empty array
        return [];
    }
};
