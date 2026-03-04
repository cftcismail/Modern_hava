
# Modern Hava 🌤️

Modern, animasyonlu ve Docker ile çalışabilen bir React + Vite tabanlı hava durumu uygulaması.

> Şehir bazlı anlık hava durumu — canlı arama, dinamik gün/gece arka planları ve akıcı animasyonlar.

---

**Teknolojiler & Araçlar**

- ⚛️ React (Function Components + Hooks)
- ⚡ Vite (hızlı geliştirme)
- 🎞️ Framer Motion (akıcı animasyonlar)
- 🌐 Axios (HTTP istemcisi)
- 🗺️ OpenWeather Geocoding & Weather API
- 🐳 Docker & Docker Compose
- ✨ Lucide Icons (ikonlar)

---

**Öne Çıkan Özellikler**

- Dinamik arka plan: gün/gece ayrımı, güneş/ay glow
- Hava durumuna göre animasyonlar: bulutlar, yağmur, kar, yıldırım
- Parallax efektleri (fare hareketi ile derinlik)
- Arama için canlı autocomplete (OpenWeather geocoding) — debounced
- Klavye destekli autocomplete (↑ / ↓ / Enter / Esc) ve aktif önerinin otomatik kaydırılması
- Glassmorphism UI, mikro etkileşimler ve erişilebilir düğmeler

---

**Hızlı Başlangıç (Local)**

1. Gereksinimler

   - Node.js v18+
   - npm veya pnpm

2. Klonlayın ve bağımlılıkları kurun

```bash
git clone https://github.com/cftcismail/Modern_hava.git
cd Modern_hava
npm install
```

3. OpenWeather API anahtarınızı ekleyin (proje kökünde `.env`):

```env
VITE_OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

4. Geliştirme sunucusunu çalıştırın

```bash
npm run dev -- --host
```

Uygulama otomatik port seçebilir; terminalde gösterilen `Local` adresini açın.

---

**Docker ile Çalıştırma**

Docker yüklüyse (ve `docker-compose`) şu komutla çalıştırabilirsiniz:

```bash
docker compose up --build
```

Varsa `.env` dosyanızı kullanın veya CI/host ortamında `VITE_OPENWEATHER_API_KEY` ortam değişkenini sağlayın. Repo'ya anahtarları doğrudan commit etmeyin.

---

**Dosya Yapısı (kısa)**

- `src/components` — UI bileşenleri (`SearchBar`, `WeatherCard`, `WeatherBackground`, `PopularCities`)
- `src/services/weatherApi.js` — OpenWeather talepleri ve geocoding
- `src/index.css` — Temel stiller, glassmorphism ve animasyonlar
- `Dockerfile`, `docker-compose.yml` — Konteyner çalıştırma

---

**Güvenlik & İpuçları**

- `.env` dosyası `.gitignore`'a eklenmiştir. API anahtarlarını commit etmeyin.
- Eğer yanlışlıkla bir anahtar commitlediyseniz, GitHub push-protection bunu engeller; geçmişten temizlemek için `git filter-repo` ya da BFG gibi araçları kullanın.

---

**Yayınlama**

Basit deploy seçenekleri:

- Vercel / Netlify: GitHub repo bağlayıp otomatik deploy.
- VPS / Docker host: Repo'yu çekip `docker compose up --build` ile çalıştırın.

---

**Katkıda Bulunma**

PR'ler ve issue'lar bekleniyor — kod stili `prettier`/`eslint` ile hizalanabilir.

---

