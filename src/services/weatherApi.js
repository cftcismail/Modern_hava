import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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
        if (error.response && error.response.status === 404) {
            throw new Error('Şehir bulunamadı, lütfen harf hatası yapmadığınızdan emin olun.');
        }
        throw new Error('Hava durumu verisi alınırken bir hata oluştu.');
    }
};
