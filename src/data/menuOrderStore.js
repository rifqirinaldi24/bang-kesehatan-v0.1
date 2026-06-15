// ============================================================
// menuOrderStore.js — Sidebar Menu Order (localStorage)
// ============================================================

const STORAGE_KEY = 'senadee_menu_order';

// Default menu definitions (semua menu yang tersedia di sistem)
const DEFAULT_MENU_ORDER = [
  // Main Nav
  { id: 'dashboard',    name: 'Dashboard',          icon: 'dashboard',         path: '/cms',           permission: 'dashboard',    section: 'main', visible: true, order: 1 },
  { id: 'articles',     name: 'Semua Artikel',      icon: 'list_alt',          path: '/cms/articles',  permission: 'editor',       section: 'main', visible: true, order: 2 },
  { id: 'drafts',       name: 'Draft Artikel',      icon: 'edit_document',     path: '/cms/drafts',    permission: 'editor',       section: 'main', visible: true, order: 3 },
  { id: 'editor',       name: 'Tulis Baru',         icon: 'edit_square',       path: '/cms/editor',    permission: 'editor',       section: 'main', visible: true, order: 4 },
  { id: 'users',        name: 'User Directory',     icon: 'group',             path: '/cms/users',     permission: 'manage_users', section: 'main', visible: true, order: 5 },
  { id: 'audit',        name: 'Audit Trail',        icon: 'history',           path: '/cms/audit',     permission: 'dashboard',    section: 'main', visible: true, order: 6 },
  { id: 'log-process',  name: 'Log Process',        icon: 'receipt_long',      path: '/cms/log-process', permission: 'editor',     section: 'main', visible: true, order: 7 },
  // Bottom Nav
  { id: 'categories',   name: 'Parameter Kategori', icon: 'category',          path: '/cms/categories',  permission: 'settings', section: 'bottom', visible: true, order: 1 },
  { id: 'menu-order',   name: 'Urutan Menu',        icon: 'reorder',           path: '/cms/menu-order',  permission: 'settings', section: 'bottom', visible: true, order: 2 },
  { id: 'parameters',   name: 'Data Parameter',     icon: 'tune',              path: '/cms/parameters',  permission: 'settings', section: 'bottom', visible: true, order: 3 },
  { id: 'roles',        name: 'Role Manager',       icon: 'admin_panel_settings', path: '/cms/roles',   permission: 'manage_roles', section: 'bottom', visible: true, order: 4 },
  { id: 'status',       name: 'System Status',      icon: 'check_circle',      path: '/cms/status',    permission: null,           section: 'bottom', visible: true, order: 5 },
];

function initialize() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MENU_ORDER));
    return DEFAULT_MENU_ORDER.map(m => ({ ...m }));
  }
  // Migration: merge any new default menus that don't exist in stored data
  const parsed = JSON.parse(stored);
  const storedIds = parsed.map(m => m.id);
  let hasNew = false;
  DEFAULT_MENU_ORDER.forEach(def => {
    if (!storedIds.includes(def.id)) {
      parsed.push({ ...def });
      hasNew = true;
    }
  });
  if (hasNew) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }
  return parsed;
}

function save(menuOrder) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(menuOrder));
}

export function getMenuOrder() {
  return initialize().sort((a, b) => a.order - b.order);
}

export function getMenusBySection(section) {
  return getMenuOrder().filter(m => m.section === section);
}

export function saveMenuOrder(menuOrder) {
  save(menuOrder);
}

export function moveMenuUp(id, section) {
  const all = initialize();
  const sectionItems = all.filter(m => m.section === section).sort((a, b) => a.order - b.order);
  const index = sectionItems.findIndex(m => m.id === id);
  if (index <= 0) return all;

  // Swap orders
  const temp = sectionItems[index].order;
  sectionItems[index].order = sectionItems[index - 1].order;
  sectionItems[index - 1].order = temp;

  // Merge back
  const otherItems = all.filter(m => m.section !== section);
  const result = [...otherItems, ...sectionItems];
  save(result);
  return result;
}

export function moveMenuDown(id, section) {
  const all = initialize();
  const sectionItems = all.filter(m => m.section === section).sort((a, b) => a.order - b.order);
  const index = sectionItems.findIndex(m => m.id === id);
  if (index === -1 || index >= sectionItems.length - 1) return all;

  const temp = sectionItems[index].order;
  sectionItems[index].order = sectionItems[index + 1].order;
  sectionItems[index + 1].order = temp;

  const otherItems = all.filter(m => m.section !== section);
  const result = [...otherItems, ...sectionItems];
  save(result);
  return result;
}

export function toggleMenuVisibility(id) {
  const all = initialize();
  const item = all.find(m => m.id === id);
  if (!item) return all;
  // Dashboard cannot be hidden
  if (item.id === 'dashboard') return all;
  item.visible = !item.visible;
  save(all);
  return all;
}

export function resetMenuOrder() {
  save(DEFAULT_MENU_ORDER);
  return DEFAULT_MENU_ORDER.map(m => ({ ...m }));
}

export { DEFAULT_MENU_ORDER };
