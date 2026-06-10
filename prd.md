# Product Requirements Document (PRD)

**Project Name:** Bang Kesehatan (Fase 1 - AI Health Media)
**Platform:** Web Application (Frontend)


**Target Persona:** Young Family (Misal: Rina, 32 Tahun, Karyawan Swasta) 
**Tech Stack:** React Vite (Frontend), Prisma ORM & PostgreSQL (Backend/Database), DokPloy (Deployment)

## 1. Overview & Objectives

Fase perdana ini bertujuan meluncurkan media kesehatan berbasis AI yang tepercaya dan mudah dipahami. Fokus utama aplikasi web ini adalah memberikan pengalaman membaca yang mulus, memfasilitasi pencarian informasi yang cepat, dan memastikan setiap konten memiliki penanda "Human Verified" sebagai implementasi nilai *Trust Above Everything*.

## 2. Core Features: Reader Portal (Antarmuka Pembaca)

Portal pembaca dirancang untuk memberikan informasi yang relevan dan dapat diterapkan, bukan sekadar teori medis.

| Fitur Utama | Deskripsi Kebutuhan (*Requirements*) |
| --- | --- |
| **Homepage & Pillar Navigation** | Menampilkan artikel terbaru dan terpopuler berdasarkan 4 pilar prioritas: *Family Health* (35%), *Nutrition* (25%), *Fitness* (20%), dan *Preventive Health* (20%).

 |
| **Article Detail Page** | Halaman baca artikel dengan tipografi yang nyaman, waktu baca estimasi, dan daftar isi (*table of contents*) interaktif. |
| **"Human Verified" Badge** | Indikator visual wajib pada setiap halaman artikel yang menunjukkan bahwa konten tersebut telah melewati proses validasi manusia sebelum dipublikasikan.

 |
| **Smart Search & Filter** | Kolom pencarian responsif untuk mencari artikel berdasarkan kata kunci, kategori, atau keluhan kesehatan agar pembaca mudah menemukan solusi.

 |
| **Actionable Takeaways Box** | Komponen ringkasan di akhir artikel yang merangkum langkah praktis, mendukung prinsip "Actionable Health Education".

 |

## 3. Core Features: CMS Portal (Antarmuka Editor)

CMS ini dirancang khusus untuk mengakomodasi alur kerja "AI-Native" dan "Human Verified".

| Fitur Utama | Deskripsi Kebutuhan (*Requirements*) |
| --- | --- |
| **Dashboard Analytics** | Menampilkan metrik dasar jumlah artikel yang di-draft, divalidasi, dan dipublikasikan. |
| **AI Draft Inbox** | Daftar antrean artikel yang dihasilkan oleh *AI Content Factory* untuk direviu oleh tim editor.

 |
| **Rich Text Editor & Validator** | Editor teks dengan fitur perbaikan *formatting*, penambahan sitasi medis, dan tombol krusial "Approve & Mark as Human Verified".

 |
| **Category & Pillar Management** | Modul untuk memasukkan artikel ke dalam kategori yang tepat sesuai pilar konten Bang Kesehatan.

 |
| **Author & Validator Role Management** | Sistem manajemen peran (*role*) yang membedakan akun penulis/AI, validator medis, dan administrator utama. |

## 4. User Flow

Untuk menghindari kompleksitas sistem di awal peluncuran, alur pengguna dirancang selugas mungkin.

### Alur Pembaca (Reader Flow)

1. 
**Landing:** Pembaca (seperti persona Rina) masuk ke *Homepage* melalui pencarian organik atau media sosial.


2. 
**Discovery:** Pembaca melihat navigasi pilar konten dan memilih kategori *Family Health*.


3. **Selection:** Pembaca mengklik salah satu artikel (misal: "Mitos dan Fakta Nutrisi Anak").
4. 
**Validation Check:** Pembaca melihat *badge* "Human Verified" di bawah judul, meningkatkan kepercayaan terhadap konten.


5. 
**Consumption:** Pembaca membaca artikel dan mengambil langkah praktis dari kotak *Actionable Takeaways* di akhir halaman.



### Alur Validasi Editor (CMS Flow)

1. **Login:** Validator masuk ke dalam sistem CMS menggunakan kredensial khusus.
2. **Draft Triage:** Validator membuka menu "AI Draft Inbox" dan memilih artikel yang menunggu peninjauan.
3. 
**Review & Editing:** Validator membaca draf AI, memverifikasi fakta medis, menyederhanakan bahasa, dan memastikan judul tidak *clickbait*.


4. 
**Verification & Publish:** Validator menekan tombol "Approve & Publish", yang secara otomatis membubuhkan label "Human Verified" dan mendistribusikan artikel ke Reader Portal.



## 5. Non-Functional Requirements

* 
**Responsive Design:** Wajib *mobile-first* karena target *Young Family* sangat aktif menggunakan perangkat seluler.


* **Performance:** *Loading time* di bawah 3 detik untuk Reader Portal; React Vite akan sangat membantu mencapai ini.
* **SEO Optimization:** Render HTML yang ramah *crawler* (menggunakan *Server-Side Rendering* atau *Static Site Generation* jika diperlukan dari Vite/React ecosystem, seperti Next.js atau Remix di masa depan, namun untuk MVP Vite SPA perlu dioptimasi dengan Helmet untuk *meta tags*).
* **Security:** Akses CMS dilindungi oleh sistem autentikasi yang aman dan terenkripsi.