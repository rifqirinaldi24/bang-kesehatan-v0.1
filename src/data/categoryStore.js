// ============================================================
// categoryStore.js — CRUD Kategori Artikel (localStorage)
// ============================================================

const STORAGE_KEY = 'senadee_categories';

const DEFAULT_CATEGORIES = [
  { id: 1, key: 'family-health', name: 'Kesehatan Keluarga', icon: '👨‍👩‍👧', color: '#ec4899', isActive: true, order: 1 },
  { id: 2, key: 'nutrition', name: 'Nutrisi', icon: '🥗', color: '#f59e0b', isActive: true, order: 2 },
  { id: 3, key: 'fitness', name: 'Fitness & Olahraga', icon: '🏃', color: '#3b82f6', isActive: true, order: 3 },
  { id: 4, key: 'preventive-health', name: 'Kesehatan Preventif', icon: '🛡️', color: '#8b5cf6', isActive: true, order: 4 },
];

function initialize() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return [...DEFAULT_CATEGORIES];
  }
  return JSON.parse(stored);
}

function save(categories) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

export function getCategories() {
  return initialize().sort((a, b) => a.order - b.order);
}

export function getActiveCategories() {
  return getCategories().filter(c => c.isActive);
}

export function getCategoryByKey(key) {
  return getCategories().find(c => c.key === key);
}

export function addCategory(data) {
  const categories = initialize();
  const newId = Math.max(0, ...categories.map(c => c.id)) + 1;
  const newCategory = {
    id: newId,
    key: data.key || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: data.name,
    icon: data.icon || '📄',
    color: data.color || '#6b7280',
    isActive: data.isActive !== undefined ? data.isActive : true,
    order: categories.length + 1,
  };
  categories.push(newCategory);
  save(categories);
  return newCategory;
}

export function updateCategory(id, updates) {
  const categories = initialize();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Kategori tidak ditemukan.');
  categories[index] = { ...categories[index], ...updates };
  save(categories);
  return categories[index];
}

export function deleteCategory(id) {
  const categories = initialize();
  const filtered = categories.filter(c => c.id !== id);
  save(filtered);
  return filtered;
}

export function toggleCategoryStatus(id) {
  const categories = initialize();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Kategori tidak ditemukan.');
  categories[index].isActive = !categories[index].isActive;
  save(categories);
  return categories[index];
}

export function resetCategories() {
  save(DEFAULT_CATEGORIES);
  return [...DEFAULT_CATEGORIES];
}
