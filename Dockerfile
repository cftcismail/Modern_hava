FROM node:20-alpine

WORKDIR /app

# Paket tanımlarını kopyala ve yükle
COPY package.json package-lock.json* ./
RUN npm install

# Projenin geri kalanını kopyala
COPY . .

# Vite'in default portunu expose et
EXPOSE 5173

# Vite applikasyonunu host modunda ayağa kaldır (dışarıdan erişim için)
CMD ["npm", "run", "dev", "--", "--host"]
