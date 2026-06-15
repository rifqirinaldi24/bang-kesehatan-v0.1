// ============================================================
// parameterStore.js — Data Parameter / Master Settings (localStorage)
// ============================================================

const STORAGE_KEY = 'senadee_parameters';

const DEFAULT_PARAMETERS = [
  // General
  { key: 'site_name',              label: 'Nama Situs',                value: 'Senadee',                    type: 'text',     group: 'General',  description: 'Nama utama situs yang ditampilkan di header dan SEO.' },
  { key: 'site_tagline',           label: 'Tagline',                   value: 'Pikiran Tenang, Langkah Sehat',     type: 'text',     group: 'General',  description: 'Slogan/tagline situs.' },
  { key: 'contact_email',          label: 'Email Kontak',              value: 'hello@senadee.com',           type: 'text',     group: 'General',  description: 'Email utama untuk kontak publik.' },
  { key: 'footer_text',            label: 'Teks Footer',               value: '© 2026 Senadee. All rights reserved.', type: 'text', group: 'General', description: 'Teks copyright di footer.' },

  // SEO
  { key: 'meta_title_suffix',      label: 'Suffix Meta Title',         value: ' - Senadee',                 type: 'text',     group: 'SEO',      description: 'Ditambahkan di akhir setiap title tag halaman.' },
  { key: 'default_meta_description', label: 'Meta Description Default', value: 'Portal kesehatan terpercaya untuk keluarga Indonesia.', type: 'textarea', group: 'SEO', description: 'Deskripsi default jika halaman tidak punya meta description sendiri.' },
  { key: 'og_image_url',           label: 'OG Image URL',              value: '/logo.png',                         type: 'text',     group: 'SEO',      description: 'URL gambar default untuk Open Graph sharing.' },

  // Display
  { key: 'articles_per_page',      label: 'Jumlah Artikel per Halaman', value: '10',                               type: 'number',   group: 'Display',  description: 'Berapa artikel yang ditampilkan per halaman di beranda.' },
  { key: 'show_reading_time',      label: 'Tampilkan Estimasi Baca',   value: 'true',                              type: 'boolean',  group: 'Display',  description: 'Apakah menampilkan estimasi waktu baca di setiap artikel.' },
  { key: 'show_verified_badge',    label: 'Tampilkan Badge Verified',  value: 'true',                              type: 'boolean',  group: 'Display',  description: 'Apakah menampilkan badge "Human Verified" di artikel.' },
  { key: 'primary_color',          label: 'Warna Utama',               value: '#006a69',                           type: 'color',    group: 'Display',  description: 'Warna primer brand situs.' },

  // API
  { key: 'gemini_api_key',         label: 'Gemini API Key',            value: '',                                  type: 'text',     group: 'API',      description: 'API Key untuk Google Gemini AI. Disimpan di .env.local saat produksi.' },
  { key: 'analytics_id',           label: 'Google Analytics ID',       value: '',                                  type: 'text',     group: 'API',      description: 'Tracking ID untuk Google Analytics (contoh: G-XXXXXXXXXX).' },
];

function initialize() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PARAMETERS));
    return DEFAULT_PARAMETERS.map(p => ({ ...p }));
  }
  return JSON.parse(stored);
}

function save(params) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
}

export function getParameters() {
  return initialize();
}

export function getParametersByGroup(group) {
  return getParameters().filter(p => p.group === group);
}

export function getParameterGroups() {
  const params = getParameters();
  return [...new Set(params.map(p => p.group))];
}

export function getParameterByKey(key) {
  const params = getParameters();
  const param = params.find(p => p.key === key);
  return param ? param.value : null;
}

export function updateParameter(key, value) {
  const params = initialize();
  const index = params.findIndex(p => p.key === key);
  if (index === -1) throw new Error(`Parameter "${key}" tidak ditemukan.`);
  params[index].value = value;
  save(params);
  return params[index];
}

export function updateParametersBatch(updates) {
  // updates = [{ key, value }, ...]
  const params = initialize();
  updates.forEach(({ key, value }) => {
    const index = params.findIndex(p => p.key === key);
    if (index !== -1) {
      params[index].value = value;
    }
  });
  save(params);
  return params;
}

export function resetParameters() {
  save(DEFAULT_PARAMETERS);
  return DEFAULT_PARAMETERS.map(p => ({ ...p }));
}
