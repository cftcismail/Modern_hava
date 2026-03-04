# Modern Hava

Modern, animasyonlu ve Docker ile çalışabilen bir React + Vite hava durumu uygulaması.

**Kısa:** Arama ile dünya genelindeki şehirlerin anlık hava durumunu gösterir; dinamik arka planlar, parallax ve mikro-animasyonlar içerir.

**Teknolojiler:** React, Vite, Framer Motion, Axios, Docker

**Önemli dosyalar:**
- `src/services/weatherApi.js` - OpenWeather veri ve geocoding çağrıları
- `src/components/WeatherBackground.jsx` - Gün/gece + animasyonlu arka plan
- `src/components/SearchBar.jsx` - Otomatik tamamlama ve klavye navigasyonu
- [docker-compose.yml](docker-compose.yml) - Docker Compose servisi (host port:container port mapping)
- [Dockerfile](Dockerfile) - Container imajı yapılandırması

**Özellikler**
- Dinamik gün/gece arka planı, güneş/ay glow
- Hareketli bulutlar, yağmur, kar ve yıldırım animasyonları
- Parallax (fare hareketiyle) ve gölge derinliği
- Arama alanı için OpenWeather Geocoding tabanlı autocomplete (debounce)
- Klavye ile gezinme (↑/↓/Enter/Escape) ve öneride scrollIntoView

**Hızlı Başlangıç (Local)**

1. Gereksinimler:

   - Node.js (18+ önerilir)
   - npm

2. Depoları klonlayın ve bağımlılıkları kurun:

```bash
git clone https://github.com/USERNAME/REPO.git
cd Modern_hava
npm install
```

3. `.env` dosyasına OpenWeather API anahtarınızı ekleyin (proje kökünde):

```env
VITE_OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

4. Geliştirme sunucusunu başlatın:

```bash
npm run dev -- --host
```

Uygulama otomatik olarak bir port seçecektir (ör. `http://localhost:5173` veya Vite boş portlara taşırsa `5174/5175/...`).

**Docker ile çalıştırma**

1. Docker ve Docker Compose kurulu olmalı.
2. Çalıştırmadan önce `docker-compose.yml` içerisinde environment ayarlarını kontrol edin; API anahtarını doğrudan eklememeyi tercih edin (güvenlik).

Örnek çalıştırma (kök dizinden):

```bash
docker compose up --build
```

Eğer yerelde `5173` portu meşgulse, proje `docker-compose.yml` içinde host portu değiştirilmiş olabilir (ör. `5174:5173`). Tarayıcıda `http://localhost:5174/` ya da compose çıktısında görülen host portunu açın.

**Güvenlik Notu**
- `.env` ve hassas anahtarlar `.gitignore` içerisine eklenmiştir; commit geçmişine kesinlikle API anahtarı koymayın. Eğer yanlışlıkla anahtar commitlendiyse, GitHub push-protection / secret-scanning bunu engeller — geçmişten temizlemeniz gerekir.

**Yayınlama / Deploy**
- Repo'yu GitHub'a pushladıktan sonra Vercel/Netlify gibi servislerle kolayca deploy edebilirsiniz.
- Alternatif olarak sunucunuza Docker Compose ile çekip çalıştırabilirsiniz.

**Katkıda Bulunma**
- Yeni özellikler, hata düzeltmeleri ve stil iyileştirmeleri için PR açın.

**Licence**
- İsterseniz bir lisans ekleyin (MIT önerilir). Bu repo şu an lisans içermez.

---

Hazır hale gelmesi için başka bir şey ister misiniz? Örneğin `.github/workflows` için basit bir CI/CD pipeline hazırlayayım veya README'yi İngilizceye çeviririm.
