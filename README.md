# BAYLOS SHOP — UPGRADE V7 PRO

Upgrade ini mempertahankan project Supabase yang sudah dipakai Baylos. `config.js` disalin dari koneksi yang sudah ada; jangan membuat project Supabase baru.

## Toko
- UI modern marketplace-style dengan identitas Baylos.
- Hero/banner, kategori, promo, best seller, terbaru.
- Search, filter, sort, wishlist, detail produk.
- Detail produk mendukung sampai 4 gambar jika kolom `image_urls` tersedia.
- Mobile Android + desktop responsive.
- Analytics page view, product detail, impression, affiliate click.

## Admin
- Supabase Auth login.
- Dashboard katalog.
- Analytics pengunjung: sesi, page view, detail produk, klik beli, sumber trafik, device, produk yang paling sering diklik.
- CRUD produk.
- Upload hingga 4 gambar ke Storage bucket `product-images`.
- Edit nama, kategori, harga, label, link affiliate, deskripsi, urutan, status.
- Theme Studio: warna, banner, judul/deskripsi, layout.

## Penting soal "pembeli"
Baylos saat ini memakai `affiliate_url`. Analytics dapat menghitung niat beli/klik affiliate, tetapi tidak dapat mengetahui transaksi final di marketplace/affiliate tanpa API/webhook/conversion feed dari jaringan affiliate. Jadi admin tidak menampilkan angka pembelian seolah-olah sudah diketahui.

## Instalasi GitHub Pages
1. Backup repo saat ini.
2. Replace `index.html`, `baylos-style.css`, `baylos-app.js`, dan `admin.html`.
3. Pertahankan `config.js` lama.
4. Upload `SUPABASE-MIGRATION-V7.sql`.
5. Jalankan SQL sekali di Supabase SQL Editor.
6. Commit dan tunggu GitHub Pages build.
7. Toko: `/index.html` atau root Pages. Admin: `/admin.html`.

Jangan upload `service_role` key.
