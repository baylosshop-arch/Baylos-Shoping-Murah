# BAYLOS SHOPING MURAH — UPGRADE 2.0

Upgrade ini mempertahankan koneksi Supabase yang sudah dipakai Baylos.

## FILE PROYEK

- `index.html` — PROJECT: BAYLOS-HOME-01 — halaman utama
- `baylos-style.css` — PROJECT: BAYLOS-UI-02 — desain desktop + Android/responsive
- `baylos-app.js` — PROJECT: BAYLOS-ENGINE-03 — fungsi aplikasi, produk, banner, analytics, wishlist, detail produk
- `config.js` — PROJECT: BAYLOS-SUPABASE-04 — konfigurasi koneksi Supabase
- `admin.html` — Admin Pro milik project sebelumnya; TIDAK diganti oleh paket ini

## FITUR UPGRADE 2.0

1. Banner horizontal yang nyaman di Android dan dapat swipe kiri/kanan.
2. Banner otomatis berpindah.
3. Tombol banner sebelumnya/berikutnya dan indikator banner.
4. Navigasi mobile + bottom navigation.
5. Search produk.
6. Kategori horizontal.
7. Slider Promo, Best Seller, Terbaru.
8. Sort harga murah/mahal, terbaru, nama A-Z.
9. Search khusus area Koleksi.
10. Wishlist tersimpan di browser dengan localStorage.
11. Filter Wishlist.
12. Detail produk dalam modal.
13. Share produk menggunakan Web Share API bila tersedia.
14. Link affiliate tetap dicatat sebagai `affiliate_click` melalui analytics.
15. Product view dan product detail view dicatat ke Supabase analytics.
16. Settings hero dari tabel `store_settings` tetap digunakan.
17. Produk aktif dari tabel `products` tetap digunakan.
18. Fallback produk demo tetap tersedia jika Supabase gagal/tidak dikonfigurasi.

## CARA PEMASANGAN DI GITHUB PAGES

### Cara paling aman

1. Buka repository GitHub kamu.
2. Pastikan repository yang dipakai untuk GitHub Pages adalah repository yang benar.
3. Buka folder/root repository.
4. Upload/replace file berikut:
   - `index.html`
   - `baylos-style.css`
   - `baylos-app.js`
5. JANGAN menghapus `config.js` yang sudah terhubung ke Supabase.
6. JANGAN menghapus `admin.html` jika Admin Pro masih digunakan.
7. Jika muncul pertanyaan Replace existing file, pilih Replace hanya untuk tiga file upgrade di atas.
8. Commit changes.
9. Tunggu GitHub Pages selesai build.
10. Buka URL Baylos Pages.
11. Refresh keras bila browser masih menampilkan versi lama.

## STRUKTUR AKHIR

BAYLOS/
├── index.html
├── baylos-style.css
├── baylos-app.js
├── config.js
├── admin.html
└── assets/              (opsional, jika dipakai project)

## JANGAN DILAKUKAN

- Jangan mengganti URL Supabase.
- Jangan memasukkan `service_role` key ke frontend.
- Jangan menghapus tabel Supabase.
- Jangan menghapus RLS yang sudah benar.
- Jangan menghapus `admin.html` jika tombol Admin masih dipakai.
- Jangan mengupload file backup seperti `index-v2-backup.html` ke root GitHub Pages jika tidak diperlukan.

## CEK SETELAH PEMASANGAN

Desktop:
- buka halaman utama
- klik menu Beranda/Kategori/Promo/Best Seller/Terbaru
- coba pencarian
- coba Detail
- coba Wishlist
- coba Beli
- coba banner next/prev

Android:
- buka dari Chrome Android
- swipe banner kiri/kanan
- swipe slider produk kiri/kanan
- buka menu ☰
- coba bottom navigation
- coba Detail/Wishlist/Beli

Supabase:
- cek `products`
- cek `store_settings`
- cek `analytics_events`
- pastikan event baru masuk setelah membuka produk atau klik affiliate

## LANGKAH UPGRADE BERIKUTNYA

Tahap 3 — Admin Pro 2.0:
- upload gambar ke Supabase Storage
- CRUD produk
- CRUD kategori
- kelola banner
- kelola label Promo/Best Seller/Terbaru
- statistik analytics

Tahap 4 — PWA:
- install Baylos ke layar Android
- icon aplikasi
- splash/manifest
- caching aman untuk aset statis

Tahap 5 — SEO & Performance:
- meta description
- Open Graph
- sitemap
- optimasi gambar WebP/AVIF
- lazy loading dan preload aset penting

Tahap 6 — Analytics Dashboard:
- visitor
- page view
- product view
- affiliate click
- sumber trafik
- device
- produk paling sering dilihat
