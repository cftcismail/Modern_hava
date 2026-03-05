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
            lat: data.coord.lat,
            lon: data.coord.lon,
            temp: data.main.temp,
            tempMin: data.main.temp_min,
            tempMax: data.main.temp_max,
            feelsLike: data.main.feels_like,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed * 3.6, // m/s to km/h donusumu
            condition: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
            timezone: data.timezone,
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

export const fetchWeatherByCoords = async (lat, lon) => {
    if (!API_KEY) {
        throw new Error('API Anahtarı (.env içerisinde VITE_OPENWEATHER_API_KEY) tanımlanmamış!');
    }

    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                lat,
                lon,
                appid: API_KEY,
                units: 'metric',
                lang: 'tr',
            },
        });

        const data = response.data;

        return {
            city: data.name,
            lat: data.coord.lat,
            lon: data.coord.lon,
            temp: data.main.temp,
            tempMin: data.main.temp_min,
            tempMax: data.main.temp_max,
            feelsLike: data.main.feels_like,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed * 3.6,
            condition: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
            timezone: data.timezone,
        };
    } catch (error) {
        throw new Error('Konum bazlı hava durumu verisi alınamadı.');
    }
};

export const fetchHourlyForecast = async (lat, lon) => {
    if (!API_KEY) return [];
    try {
        const response = await axios.get(`${BASE_URL}/forecast`, {
            params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'tr', cnt: 8 },
        });
        return response.data.list.map((item) => ({
            time: item.dt,
            temp: item.main.temp,
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
            description: item.weather[0].description,
        }));
    } catch {
        return [];
    }
};

export const fetchDailyForecast = async (lat, lon) => {
    if (!API_KEY) return [];
    try {
        const response = await axios.get(`${BASE_URL}/forecast`, {
            params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'tr', cnt: 40 },
        });
        // Group by day (keep first entry per day)
        const days = {};
        response.data.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            if (!days[key]) {
                days[key] = {
                    time: item.dt,
                    tempMin: item.main.temp_min,
                    tempMax: item.main.temp_max,
                    condition: item.weather[0].main,
                    icon: item.weather[0].icon,
                    description: item.weather[0].description,
                };
            } else {
                if (item.main.temp_min < days[key].tempMin) days[key].tempMin = item.main.temp_min;
                if (item.main.temp_max > days[key].tempMax) days[key].tempMax = item.main.temp_max;
            }
        });
        return Object.values(days).slice(0, 7);
    } catch {
        return [];
    }
};

export const fetchAQI = async (lat, lon) => {
    if (!API_KEY) return null;
    try {
        const response = await axios.get(`${BASE_URL}/air_pollution`, {
            params: { lat, lon, appid: API_KEY },
        });
        const aqi = response.data.list[0].main.aqi;
        const labels = ['', 'İyi', 'Makul', 'Orta', 'Kötü', 'Çok Kötü'];
        const colors = ['', '#4caf50', '#8bc34a', '#ff9800', '#f44336', '#9c27b0'];
        return { value: aqi, label: labels[aqi], color: colors[aqi] };
    } catch {
        return null;
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
