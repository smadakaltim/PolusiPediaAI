# Publikasi Polusipedia AI di Render

## 1. Unggah proyek ke GitHub

1. Buat repository baru di GitHub, misalnya `polusipedia-ai`.
2. Unggah seluruh isi folder proyek ini ke repository tersebut.
3. Pastikan file `.env.local` atau file yang berisi API key tidak ikut diunggah.

## 2. Buat Web Service di Render

1. Masuk ke Render.
2. Pilih **New > Blueprint** untuk memakai `render.yaml`, atau **New > Web Service**.
3. Hubungkan repository GitHub `polusipedia-ai`.
4. Jika memakai Web Service manual, isi:
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`
5. Tambahkan Environment Variable:
   - `GEMINI_API_KEY` = API key Gemini Anda
   - `NODE_ENV` = `production`
   - `GEMINI_MODEL` = `gemini-3.6-flash`
   - `AI_RATE_LIMIT` = `10`
6. Klik **Deploy Web Service**.

## 3. Setelah berhasil

Buka URL `https://nama-layanan.onrender.com` dan uji:

- Halaman utama tampil.
- Kalkulasi polusi bekerja.
- `/api/health` menampilkan status `ok`.
- Analisis AI dapat menghasilkan respons.

## Catatan keamanan

- Jangan menaruh `GEMINI_API_KEY` di file React atau GitHub.
- API key hanya dimasukkan melalui menu Environment di Render.
- Endpoint AI telah diberi batas default 10 permintaan per IP setiap 15 menit.
