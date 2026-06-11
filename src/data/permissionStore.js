// ============================================================
// permissionStore.js — Permission Matrix (Parameterized per Role)
// ============================================================

const STORAGE_KEY = 'bk_permissions';

// Daftar semua permission yang tersedia di sistem
export const ALL_PERMISSIONS = [
  { key: 'dashboard',     label: 'Dashboard',        icon: 'dashboard',      description: 'Melihat ringkasan dan statistik' },
  { key: 'editor',        label: 'Content Manager',  icon: 'edit_square',    description: 'Membuat dan mengedit artikel' },
  { key: 'ai_generator',  label: 'AI Generator',     icon: 'auto_awesome',   description: 'Menggunakan AI untuk generate artikel' },
  { key: 'publish',       label: 'Publish Artikel',  icon: 'publish',        description: 'Mempublikasikan artikel ke website' },
  { key: 'analytics',     label: 'Analytics',        icon: 'bar_chart',      description: 'Melihat data analytics dan traffic' },
  { key: 'manage_users',  label: 'User Directory',   icon: 'group',          description: 'Mengelola daftar user' },
  { key: 'manage_roles',  label: 'Role Manager',     icon: 'admin_panel_settings', description: 'Mengonfigurasi permission per role' },
  { key: 'settings',      label: 'System Settings',  icon: 'settings',       description: 'Pengaturan sistem' },
];

// Default permission matrix
const DEFAULT_MATRIX = {
  superuser: ['dashboard', 'editor', 'ai_generator', 'publish', 'analytics', 'manage_users', 'manage_roles', 'settings'],
  admin:     ['dashboard', 'editor', 'ai_generator', 'publish', 'analytics', 'manage_users'],
  editor:    ['dashboard', 'editor', 'ai_generator', 'publish'],
  writer:    ['dashboard', 'editor', 'ai_generator'],
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
  matrix.superuser = ALL_PERMISSIONS.map(p => p.key);
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
