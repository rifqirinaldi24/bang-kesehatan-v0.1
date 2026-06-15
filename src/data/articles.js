export const PILLARS = [
  {
    id: 'family-health',
    name: 'Kesehatan Keluarga',
    nameEn: 'Family Health',
    icon: '👨‍👩‍👧‍👦',
    color: 'pillar-family',
    percentage: 35,
    description: 'Tips dan panduan kesehatan untuk seluruh anggota keluarga',
  },
  {
    id: 'nutrition',
    name: 'Nutrisi',
    nameEn: 'Nutrition',
    icon: '🥗',
    color: 'pillar-nutrition',
    percentage: 25,
    description: 'Panduan nutrisi seimbang dan pola makan sehat',
  },
  {
    id: 'fitness',
    name: 'Kebugaran',
    nameEn: 'Fitness',
    icon: '🏃‍♀️',
    color: 'pillar-fitness',
    percentage: 20,
    description: 'Olahraga dan aktivitas fisik untuk gaya hidup aktif',
  },
  {
    id: 'preventive-health',
    name: 'Kesehatan Preventif',
    nameEn: 'Preventive Health',
    icon: '🛡️',
    color: 'pillar-preventive',
    percentage: 20,
    description: 'Langkah pencegahan dan deteksi dini penyakit',
  },
];

export const articles = [
  {
    id: 1,
    articleId: 'SND-001',
    slug: 'mitos-dan-fakta-nutrisi-anak',
    title: 'Mitos dan Fakta Nutrisi Anak: Panduan Lengkap untuk Orang Tua',
    excerpt: 'Banyak mitos beredar soal nutrisi anak. Yuk, bedakan mana yang fakta dan mana yang sekadar mitos agar si kecil tumbuh sehat optimal.',
    category: 'family-health',
    author: 'dr. Sarah Wijaya, Sp.A',
    authorAvatar: null,
    date: '2026-06-05',
    readingTime: 8,
    isVerified: true,
    isFeatured: true,
    imageUrl: null,
    content: [
      {
        heading: 'Mengapa Nutrisi Anak Penting?',
        text: 'Nutrisi yang tepat pada masa kanak-kanak merupakan fondasi penting bagi pertumbuhan dan perkembangan optimal. Menurut data WHO, sekitar 45% kematian anak di bawah 5 tahun berkaitan dengan malnutrisi. Di Indonesia sendiri, prevalensi stunting pada balita masih menjadi perhatian utama pemerintah.\n\nPemenuhan nutrisi yang baik tidak hanya memengaruhi pertumbuhan fisik, tetapi juga perkembangan kognitif, daya tahan tubuh, dan kesehatan jangka panjang anak. Oleh karena itu, penting bagi orang tua untuk memahami kebutuhan nutrisi anak berdasarkan usia dan tahap perkembangannya.',
      },
      {
        heading: 'Mitos 1: Anak Gemuk Berarti Anak Sehat',
        text: 'Ini adalah mitos yang paling umum dipercaya oleh masyarakat Indonesia. Faktanya, anak dengan berat badan berlebih justru berisiko mengalami berbagai masalah kesehatan, termasuk diabetes tipe 2, gangguan jantung, dan masalah psikologis.\n\nIndikator kesehatan anak yang tepat bukan dilihat dari gemuk atau kurusnya, melainkan dari grafik pertumbuhan yang sesuai dengan standar WHO. Konsultasikan dengan dokter anak untuk memantau tumbuh kembang si kecil secara berkala.',
      },
      {
        heading: 'Mitos 2: Susu Formula Lebih Baik dari ASI',
        text: 'World Health Organization (WHO) merekomendasikan pemberian ASI eksklusif selama 6 bulan pertama kehidupan bayi. ASI mengandung antibodi alami yang tidak bisa ditiru oleh susu formula manapun.\n\nASI juga mengandung prebiotik dan probiotik alami yang membantu membangun sistem pencernaan bayi yang sehat. Namun, jika ibu memiliki kondisi medis tertentu yang menghalangi pemberian ASI, susu formula tetap menjadi alternatif yang aman dengan konsultasi dokter.',
      },
      {
        heading: 'Fakta: Kebutuhan Zat Besi Anak Sering Terabaikan',
        text: 'Defisiensi zat besi adalah masalah nutrisi yang paling umum pada anak-anak di seluruh dunia. Zat besi penting untuk pembentukan hemoglobin dan perkembangan otak.\n\nSumber zat besi terbaik untuk anak meliputi daging merah tanpa lemak, hati ayam, bayam, kacang-kacangan, dan sereal yang difortifikasi. Untuk meningkatkan penyerapan zat besi, berikan makanan yang kaya vitamin C bersamaan dengan sumber zat besi.',
      },
      {
        heading: 'Tips Praktis Memenuhi Nutrisi Anak',
        text: 'Berikut beberapa tips yang bisa diterapkan orang tua sehari-hari:\n\n1. Sajikan menu yang bervariasi setiap hari dengan prinsip "Isi Piringku"\n2. Libatkan anak dalam proses memasak untuk meningkatkan minat makan\n3. Hindari memaksa anak makan, karena dapat menimbulkan trauma\n4. Batasi konsumsi gula, garam, dan makanan ultra-proses\n5. Pastikan anak minum air putih yang cukup sesuai usianya',
      },
    ],
    takeaways: [
      'Pantau tumbuh kembang anak melalui grafik pertumbuhan WHO, bukan hanya dari berat badan',
      'Prioritaskan ASI eksklusif selama 6 bulan pertama',
      'Pastikan asupan zat besi anak tercukupi melalui daging, sayuran hijau, dan kacang-kacangan',
      'Sajikan menu bervariasi setiap hari dan libatkan anak dalam proses memasak',
      'Konsultasi rutin dengan dokter anak setiap 3-6 bulan',
    ],
  },
  {
    id: 2,
    articleId: 'SND-002',
    slug: 'panduan-mpasi-6-bulan-pertama',
    title: 'Panduan Lengkap MPASI: Menu Sehat untuk 6 Bulan Pertama',
    excerpt: 'Memulai MPASI bisa jadi membingungkan bagi orang tua baru. Simak panduan lengkap dari ahli gizi tentang menu dan jadwal MPASI yang tepat.',
    category: 'nutrition',
    author: 'Nadia Kusuma, S.Gz, M.Gizi',
    authorAvatar: null,
    date: '2026-06-03',
    readingTime: 10,
    isVerified: true,
    isFeatured: true,
    imageUrl: null,
    content: [
      {
        heading: 'Kapan Waktu Tepat Memulai MPASI?',
        text: 'Menurut rekomendasi WHO dan IDAI (Ikatan Dokter Anak Indonesia), MPASI sebaiknya dimulai saat bayi berusia 6 bulan. Pada usia ini, kebutuhan nutrisi bayi sudah tidak bisa dipenuhi oleh ASI saja.\n\nTanda-tanda bayi siap MPASI meliputi: mampu duduk dengan bantuan minimal, refleks menjulurkan lidah sudah berkurang, menunjukkan ketertarikan terhadap makanan, dan mampu menggenggam benda.',
      },
      {
        heading: 'Prinsip Dasar MPASI yang Tepat',
        text: 'MPASI yang baik harus memenuhi prinsip AFATVAH: Age appropriate (sesuai usia), Frequency (frekuensi yang tepat), Amount (jumlah yang cukup), Texture (tekstur yang sesuai), Variety (variasi makanan), Active/responsive feeding (pemberian makan responsif), dan Hygiene (kebersihan).\n\nPastikan setiap porsi MPASI mengandung karbohidrat, protein hewani, protein nabati, sayuran, dan lemak tambahan.',
      },
      {
        heading: 'Menu MPASI Minggu Pertama',
        text: 'Pada minggu pertama, berikan MPASI dengan tekstur puree halus (disaring). Mulai dengan 2-3 sendok makan per porsi, 2 kali sehari.\n\nContoh menu:\n- Hari 1-2: Puree beras merah + kaldu ayam\n- Hari 3-4: Puree kentang + wortel + daging ayam giling\n- Hari 5-6: Puree labu kuning + ikan salmon\n- Hari 7: Puree ubi + hati ayam + bayam',
      },
      {
        heading: 'Alergi Makanan: Yang Perlu Diwaspadai',
        text: 'Penelitian terbaru menunjukkan bahwa menunda pengenalan makanan alergenik justru meningkatkan risiko alergi. Perkenalkan makanan alergenik seperti telur, kacang tanah, dan ikan sejak awal MPASI.\n\nBerikan satu jenis makanan baru setiap 3 hari untuk memantau reaksi alergi. Tanda-tanda alergi makanan meliputi ruam kulit, diare, muntah, atau pembengkakan.',
      },
    ],
    takeaways: [
      'Mulai MPASI tepat di usia 6 bulan, tidak lebih awal atau terlambat',
      'Pastikan setiap porsi mengandung karbohidrat, protein, sayur, dan lemak',
      'Mulai dengan tekstur puree halus, lalu tingkatkan secara bertahap',
      'Perkenalkan makanan alergenik sejak awal MPASI dengan metode 3 hari',
      'Tetap berikan ASI sebagai pendamping hingga usia 2 tahun',
    ],
  },
  {
    id: 3,
    articleId: 'SND-003',
    slug: 'olahraga-rumahan-ibu-bekerja',
    title: '7 Olahraga Rumahan Efektif untuk Ibu Bekerja: Cukup 15 Menit!',
    excerpt: 'Tidak punya waktu ke gym? Olahraga rumahan ini bisa dilakukan kapan saja dan terbukti efektif menjaga kebugaran tubuh ibu bekerja.',
    category: 'fitness',
    author: 'Fitri Handayani, S.Ft, AIFO',
    authorAvatar: null,
    date: '2026-06-01',
    readingTime: 6,
    isVerified: true,
    isFeatured: false,
    imageUrl: null,
    content: [
      {
        heading: 'Mengapa Ibu Bekerja Perlu Olahraga Rutin?',
        text: 'Sebagai ibu bekerja, Anda menghadapi tekanan ganda dari pekerjaan dan tanggung jawab rumah tangga. Olahraga rutin terbukti mampu mengurangi stres, meningkatkan energi, dan memperbaiki kualitas tidur.\n\nPenelitian dari Harvard Medical School menunjukkan bahwa olahraga intensitas sedang selama 15 menit per hari sudah cukup memberikan manfaat kesehatan yang signifikan.',
      },
      {
        heading: '7 Gerakan Olahraga Rumahan',
        text: '1. Jumping Jacks (2 menit) - Pemanasan dan kardio ringan\n2. Squat (3 set x 12 repetisi) - Menguatkan paha dan bokong\n3. Push-up modifikasi (3 set x 10 repetisi) - Menguatkan dada dan lengan\n4. Plank (3 set x 30 detik) - Menguatkan otot inti\n5. Lunges (3 set x 10 per kaki) - Menguatkan kaki dan keseimbangan\n6. Mountain Climbers (2 set x 20 detik) - Kardio dan kekuatan\n7. Stretching (3 menit) - Pendinginan dan fleksibilitas',
      },
      {
        heading: 'Tips Konsistensi Olahraga',
        text: 'Kunci utama olahraga adalah konsistensi, bukan intensitas. Berikut tips agar Anda bisa konsisten:\n\n- Jadwalkan waktu olahraga seperti meeting penting\n- Mulai dari 10 menit, lalu tingkatkan bertahap\n- Ajak anak untuk olahraga bersama sebagai quality time\n- Gunakan pengingat di handphone\n- Catat progres Anda untuk motivasi',
      },
    ],
    takeaways: [
      'Cukup 15 menit olahraga per hari untuk menjaga kebugaran',
      'Lakukan 7 gerakan dasar: Jumping Jacks, Squat, Push-up, Plank, Lunges, Mountain Climbers, Stretching',
      'Jadwalkan olahraga seperti meeting penting untuk menjaga konsistensi',
      'Libatkan anak sebagai partner olahraga untuk quality time',
    ],
  },
  {
    id: 4,
    articleId: 'SND-004',
    slug: 'vaksinasi-anak-jadwal-lengkap',
    title: 'Jadwal Vaksinasi Anak 2026: Panduan Lengkap Imunisasi Wajib & Tambahan',
    excerpt: 'Vaksinasi adalah langkah pencegahan paling efektif untuk melindungi anak dari penyakit berbahaya. Ketahui jadwal lengkap dan jenis vaksin yang dibutuhkan.',
    category: 'preventive-health',
    author: 'dr. Ahmad Faisal, Sp.A(K)',
    authorAvatar: null,
    date: '2026-05-28',
    readingTime: 12,
    isVerified: true,
    isFeatured: false,
    imageUrl: null,
    content: [
      {
        heading: 'Pentingnya Vaksinasi untuk Anak',
        text: 'Vaksinasi adalah salah satu intervensi kesehatan masyarakat yang paling berhasil dalam sejarah kedokteran. Di Indonesia, program imunisasi nasional telah berhasil mengeliminasi beberapa penyakit berbahaya seperti polio dan tetanus neonatorum.\n\nNamun, masih banyak orang tua yang ragu atau enggan memvaksinasi anaknya karena informasi yang salah. Data IDAI menunjukkan bahwa cakupan imunisasi dasar lengkap di Indonesia masih perlu ditingkatkan.',
      },
      {
        heading: 'Jadwal Imunisasi Wajib (Program Pemerintah)',
        text: 'Berikut jadwal imunisasi wajib sesuai rekomendasi Kementerian Kesehatan RI 2026:\n\n- Lahir: Hepatitis B (HB-0) dan BCG\n- 2 bulan: DPT-HB-Hib 1, Polio (IPV) 1, Rotavirus 1\n- 3 bulan: DPT-HB-Hib 2, Polio (IPV) 2, Rotavirus 2\n- 4 bulan: DPT-HB-Hib 3, Polio (IPV) 3, Rotavirus 3\n- 9 bulan: Campak-Rubella (MR) 1\n- 18 bulan: DPT-HB-Hib booster, Campak-Rubella (MR) 2',
      },
      {
        heading: 'Vaksin Tambahan yang Direkomendasikan',
        text: 'Selain imunisasi wajib, IDAI merekomendasikan beberapa vaksin tambahan:\n\n- PCV (Pneumokokus): Mencegah pneumonia dan meningitis\n- Influenza: Diberikan setiap tahun mulai usia 6 bulan\n- Varisela: Mencegah cacar air\n- Hepatitis A: Diberikan mulai usia 1 tahun\n- Tifoid: Diberikan mulai usia 2 tahun',
      },
      {
        heading: 'Mengatasi KIPI (Kejadian Ikutan Pasca Imunisasi)',
        text: 'KIPI adalah gejala yang muncul setelah imunisasi dan umumnya bersifat ringan serta sementara. Gejala yang umum meliputi:\n\n- Demam ringan (di bawah 38.5°C)\n- Nyeri dan bengkak di lokasi suntikan\n- Rewel atau gelisah\n\nPenanganan: kompres dingin di lokasi suntikan, berikan parasetamol jika demam, dan pastikan anak cukup minum. Segera ke dokter jika demam tinggi atau gejala tidak membaik dalam 48 jam.',
      },
    ],
    takeaways: [
      'Pastikan anak mendapat semua imunisasi wajib sesuai jadwal Kemenkes',
      'Pertimbangkan vaksin tambahan seperti PCV, Influenza, dan Varisela',
      'KIPI umumnya ringan dan sementara, jangan panik',
      'Catat jadwal vaksinasi di buku KIA dan konsultasikan dengan dokter anak',
      'Vaksinasi bukan hanya melindungi anak Anda, tapi juga masyarakat sekitar (herd immunity)',
    ],
  },
  {
    id: 5,
    articleId: 'SND-005',
    slug: 'mengelola-screen-time-anak',
    title: 'Panduan Mengelola Screen Time Anak di Era Digital: Berapa Lama yang Aman?',
    excerpt: 'Screen time berlebihan berdampak buruk pada perkembangan anak. Pelajari batasan yang direkomendasikan dan tips mengelola waktu layar.',
    category: 'family-health',
    author: 'dr. Lina Permata, Sp.A, M.Kes',
    authorAvatar: null,
    date: '2026-05-25',
    readingTime: 7,
    isVerified: true,
    isFeatured: false,
    imageUrl: null,
    content: [
      {
        heading: 'Dampak Screen Time Berlebihan',
        text: 'American Academy of Pediatrics (AAP) telah lama mengingatkan tentang dampak negatif screen time berlebihan pada anak. Dampak tersebut meliputi gangguan tidur, obesitas, keterlambatan perkembangan bahasa, dan masalah perilaku.\n\nDi Indonesia, survei terbaru menunjukkan bahwa rata-rata anak usia 2-5 tahun menghabiskan lebih dari 3 jam per hari di depan layar, jauh melebihi rekomendasi WHO.',
      },
      {
        heading: 'Rekomendasi Screen Time Berdasarkan Usia',
        text: 'WHO dan AAP merekomendasikan batasan screen time sebagai berikut:\n\n- Di bawah 18 bulan: Hindari screen time kecuali video call\n- 18-24 bulan: Boleh screen time berkualitas tinggi, didampingi orang tua\n- 2-5 tahun: Maksimal 1 jam per hari\n- 6 tahun ke atas: Tetapkan batas yang konsisten, pastikan tidak mengganggu tidur dan aktivitas fisik',
      },
      {
        heading: 'Tips Mengelola Screen Time',
        text: 'Berikut strategi praktis yang bisa diterapkan orang tua:\n\n1. Buat "zona bebas gadget" di rumah (ruang makan, kamar tidur)\n2. Terapkan aturan "gadget off" 1 jam sebelum tidur\n3. Dampingi anak saat menggunakan gadget\n4. Pilih konten edukatif yang interaktif\n5. Jadilah role model — kurangi penggunaan gadget Anda sendiri\n6. Sediakan alternatif aktivitas: buku, mainan, permainan outdoor',
      },
    ],
    takeaways: [
      'Anak di bawah 2 tahun sebaiknya tidak terpapar layar kecuali video call',
      'Anak 2-5 tahun maksimal 1 jam screen time per hari',
      'Buat zona dan waktu bebas gadget di rumah',
      'Dampingi anak dan pilih konten edukatif berkualitas',
      'Jadilah role model dalam penggunaan gadget yang bijak',
    ],
  },
  {
    id: 6,
    articleId: 'SND-006',
    slug: 'resep-smoothie-bowl-sehat',
    title: '5 Resep Smoothie Bowl Bernutrisi Tinggi untuk Sarapan Keluarga',
    excerpt: 'Sarapan sehat tidak harus ribet! Coba 5 resep smoothie bowl yang kaya nutrisi, mudah dibuat, dan disukai seluruh keluarga.',
    category: 'nutrition',
    author: 'Chef Rina Susanti, S.Gz',
    authorAvatar: null,
    date: '2026-05-20',
    readingTime: 5,
    isVerified: true,
    isFeatured: false,
    imageUrl: null,
    content: [
      {
        heading: 'Mengapa Smoothie Bowl?',
        text: 'Smoothie bowl adalah pilihan sarapan yang sempurna untuk keluarga sibuk. Selain mudah dan cepat dibuat (hanya 5-10 menit), smoothie bowl juga bisa dikustomisasi sesuai selera dan kebutuhan nutrisi masing-masing anggota keluarga.\n\nDibandingkan smoothie biasa, smoothie bowl lebih mengenyangkan karena teksturnya lebih kental dan dimakan dengan topping yang perlu dikunyah, sehingga memberikan sinyal kenyang lebih baik ke otak.',
      },
      {
        heading: 'Resep 1: Tropical Green Bowl',
        text: 'Bahan base: 1 buah pisang beku, 1 genggam bayam, 1/2 buah mangga, 100ml susu almond\n\nTopping: Granola, irisan kiwi, biji chia, kelapa parut\n\nKandungan nutrisi: Kaya vitamin C, zat besi, serat, dan antioksidan. Bayam memberikan zat besi tanpa mengubah rasa karena tertutupi oleh manisnya buah.',
      },
      {
        heading: 'Resep 2: Berry Protein Bowl',
        text: 'Bahan base: 1 cup campuran berry beku, 1 buah pisang, 2 sdm yogurt Greek, 1 sdm selai kacang\n\nTopping: Buah berry segar, almond slice, madu, biji rami\n\nKandungan nutrisi: Tinggi protein dan antioksidan. Yogurt Greek dan selai kacang memberikan protein yang membantu anak kenyang lebih lama.',
      },
    ],
    takeaways: [
      'Smoothie bowl hanya butuh 5-10 menit persiapan',
      'Gunakan buah beku sebagai base untuk tekstur yang kental',
      'Tambahkan sayuran hijau (bayam/kale) untuk nutrisi ekstra tanpa mengubah rasa',
      'Variasikan topping dengan granola, biji-bijian, dan buah segar',
      'Libatkan anak memilih topping mereka sendiri untuk meningkatkan minat makan',
    ],
  },
  {
    id: 7,
    articleId: 'SND-007',
    slug: 'deteksi-dini-diabetes-keluarga',
    title: 'Deteksi Dini Diabetes: Tanda-Tanda yang Sering Diabaikan Keluarga Muda',
    excerpt: 'Diabetes tipe 2 semakin banyak menyerang usia muda. Kenali tanda-tanda awal dan langkah pencegahan yang bisa dilakukan seluruh keluarga.',
    category: 'preventive-health',
    author: 'dr. Budi Santoso, Sp.PD-KEMD',
    authorAvatar: null,
    date: '2026-05-18',
    readingTime: 9,
    isVerified: true,
    isFeatured: false,
    imageUrl: null,
    content: [
      {
        heading: 'Tren Diabetes pada Usia Muda',
        text: 'Data International Diabetes Federation (IDF) menunjukkan Indonesia berada di peringkat ke-5 dunia untuk jumlah penderita diabetes. Yang mengkhawatirkan, tren diabetes tipe 2 semakin banyak ditemukan pada kelompok usia 20-40 tahun.\n\nGaya hidup modern dengan konsumsi makanan tinggi gula, kurang aktivitas fisik, dan stres berlebih menjadi faktor utama peningkatan kasus diabetes pada usia produktif.',
      },
      {
        heading: 'Tanda-Tanda Awal yang Sering Diabaikan',
        text: 'Banyak orang tidak menyadari dirinya mengidap prediabetes. Berikut tanda-tanda yang perlu diwaspadai:\n\n1. Sering merasa haus berlebihan (polidipsia)\n2. Frekuensi buang air kecil meningkat, terutama malam hari\n3. Mudah lelah dan mengantuk setelah makan\n4. Luka yang lambat sembuh\n5. Penglihatan kabur\n6. Kulit kering dan gatal, terutama di area lipatan\n7. Kesemutan atau mati rasa di tangan dan kaki\n8. Penurunan berat badan tanpa sebab yang jelas',
      },
      {
        heading: 'Langkah Pencegahan untuk Keluarga',
        text: 'Pencegahan diabetes dimulai dari kebiasaan keluarga:\n\n- Kurangi konsumsi gula dan makanan olahan\n- Perbanyak sayur, buah, dan makanan berserat tinggi\n- Olahraga bersama keluarga minimal 30 menit per hari\n- Cek gula darah rutin, terutama jika ada riwayat keluarga\n- Kelola stres dengan baik melalui meditasi atau hobi\n- Jaga berat badan ideal dengan BMI 18.5-24.9',
      },
    ],
    takeaways: [
      'Cek gula darah puasa secara rutin, minimal setahun sekali',
      'Waspadai tanda-tanda: sering haus, sering BAK, mudah lelah, luka lambat sembuh',
      'Kurangi gula dan makanan olahan dalam menu harian keluarga',
      'Olahraga bersama keluarga minimal 30 menit per hari',
      'Jika ada riwayat diabetes di keluarga, lakukan pemeriksaan lebih sering',
    ],
  },
  {
    id: 8,
    articleId: 'SND-008',
    slug: 'yoga-untuk-pemula-di-rumah',
    title: 'Yoga untuk Pemula: 10 Pose Dasar yang Bisa Dilakukan di Rumah',
    excerpt: 'Mulai perjalanan yoga Anda dari rumah! 10 pose dasar ini cocok untuk pemula dan membantu mengurangi stres serta meningkatkan fleksibilitas.',
    category: 'fitness',
    author: 'Maya Indah, RYT-200',
    authorAvatar: null,
    date: '2026-05-15',
    readingTime: 7,
    isVerified: true,
    isFeatured: false,
    imageUrl: null,
    content: [
      {
        heading: 'Manfaat Yoga untuk Kesehatan',
        text: 'Yoga bukan sekadar olahraga, melainkan praktik holistik yang menggabungkan gerakan fisik, pernapasan, dan meditasi. Penelitian dari Johns Hopkins Medicine menunjukkan bahwa yoga secara rutin dapat:\n\n- Mengurangi stres dan kecemasan hingga 30%\n- Meningkatkan fleksibilitas dan keseimbangan\n- Mengurangi nyeri punggung bawah\n- Meningkatkan kualitas tidur\n- Menurunkan tekanan darah',
      },
      {
        heading: 'Peralatan yang Dibutuhkan',
        text: 'Untuk memulai yoga di rumah, Anda hanya membutuhkan:\n\n1. Matras yoga (atau karpet tebal sebagai alternatif)\n2. Pakaian yang nyaman dan elastis\n3. Ruangan yang cukup luas (minimal 2x2 meter)\n4. Opsional: blok yoga dan tali yoga untuk modifikasi pose',
      },
      {
        heading: '10 Pose Dasar untuk Pemula',
        text: 'Lakukan setiap pose selama 5-8 tarikan napas:\n\n1. Mountain Pose (Tadasana) - Berdiri tegak, fondasi semua pose\n2. Forward Fold (Uttanasana) - Membungkuk ke depan, peregangan hamstring\n3. Downward Dog (Adho Mukha Svanasana) - Pose V terbalik\n4. Warrior I (Virabhadrasana I) - Menguatkan kaki dan membuka dada\n5. Warrior II (Virabhadrasana II) - Menguatkan paha dan meningkatkan stamina\n6. Tree Pose (Vrksasana) - Melatih keseimbangan\n7. Cat-Cow (Marjaryasana-Bitilasana) - Peregangan tulang belakang\n8. Child\'s Pose (Balasana) - Pose istirahat dan relaksasi\n9. Bridge Pose (Setu Bandhasana) - Menguatkan punggung dan glute\n10. Corpse Pose (Savasana) - Relaksasi total di akhir sesi',
      },
    ],
    takeaways: [
      'Mulai dengan 15-20 menit per sesi, 3 kali seminggu',
      'Fokus pada pernapasan, bukan fleksibilitas',
      'Jangan memaksakan pose — dengarkan tubuh Anda',
      'Konsisten lebih penting daripada durasi yang lama',
      'Gunakan video tutorial untuk memastikan alignment yang benar',
    ],
  },
];

/**
 * Get articles filtered by category/pillar
 */
export function getArticlesByCategory(categoryId) {
  return articles.filter((article) => article.category === categoryId);
}

/**
 * Get a single article by slug
 */
export function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

/**
 * Get featured articles
 */
export function getFeaturedArticles() {
  return articles.filter((article) => article.isFeatured);
}

/**
 * Get pillar info by id
 */
export function getPillarById(id) {
  return PILLARS.find((pillar) => pillar.id === id);
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
