// ============================================================
// permissionStore.js — Permission Matrix (Parameterized per Role)
// ============================================================

import { getMenuOrder } from './menuOrderStore';

const STORAGE_KEY = 'bk_permissions';

// Daftar permission dasar (selain menu)
const BASE_PERMISSIONS = [
  { key: 'publish',       label: 'Publish Artikel',  icon: 'publish',        description: 'Mempublikasikan artikel ke website' },
  { key: 'analytics',     label: 'Analytics',        icon: 'bar_chart',      description: 'Melihat data analytics dan traffic' }
];

export function getAllAvailablePermissions() {
  const menus = getMenuOrder();
  
  // Ambil permission dari menu
  const menuPerms = menus
    .filter(m => m.permission)
    .map(m => ({
      key: m.permission,
      label: `Menu: ${m.name}`,
      icon: m.icon,
      description: `Akses menu ${m.name}`
    }));

  // Hilangkan duplikat key dari menu (karena beberapa menu bisa pakai permission sama)
  const uniqueMenuPerms = menuPerms.filter((v, i, a) => a.findIndex(t => (t.key === v.key)) === i);

  // Gabungkan dengan base permissions
  return [...BASE_PERMISSIONS, ...uniqueMenuPerms];
}

// Default permission matrix
const DEFAULT_MATRIX = {
  superuser: ['dashboard', 'editor', 'publish', 'analytics', 'manage_users', 'manage_roles', 'settings'],
  admin:     ['dashboard', 'editor', 'publish', 'analytics', 'manage_users', 'manage_doctors'],
  editor:    ['dashboard', 'editor', 'publish'],
  writer:    ['dashboard', 'editor'],
};

// Inisialisasi permission matrix
function initializePermissions() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MATRIX));
    return { ...DEFAULT_MATRIX };
  }
  const matrix = JSON.parse(stored);
  // Pastikan superuser selalu punya semua permission
  matrix.superuser = getAllAvailablePermissions().map(p => p.key);
  return matrix;
}

// ============ Public API ============

export function getPermissionMatrix() {
  return initializePermissions();
}

export function getRolePermissions(role) {
  const matrix = getPermissionMatrix();
  return matrix[role] || [];
}

export function updateRolePermissions(role, permissions) {
  if (role === 'superuser') {
    throw new Error('Permission Superuser tidak bisa diubah.');
  }

  const validRoles = ['admin', 'editor', 'writer'];
  if (!validRoles.includes(role)) {
    throw new Error('Role tidak valid.');
  }

  const matrix = getPermissionMatrix();
  matrix[role] = permissions;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matrix));
  return matrix;
}

export function hasPermission(role, permissionKey) {
  const permissions = getRolePermissions(role);
  return permissions.includes(permissionKey);
}

export function resetToDefault() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MATRIX));
  return { ...DEFAULT_MATRIX };
}
