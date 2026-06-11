// ============================================================
// userStore.js — Data layer untuk manajemen user (localStorage)
// ============================================================

const STORAGE_KEY = 'bk_users';

// Simple hash function for passwords (base64 — adequate for localStorage MVP)
function hashPassword(password) {
  return btoa(unescape(encodeURIComponent(password)));
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// Generate unique ID
function generateId() {
  return 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

// Default Superuser — dibuat otomatis saat pertama kali
const DEFAULT_SUPERUSER = {
  id: 'usr_superuser_001',
  name: 'dr. Rifqi Rinaldi',
  email: 'rifqi@bangkesehatan.com',
  password: hashPassword('superadmin123'),
  role: 'superuser',
  status: 'active',
  title: 'Founder & Superuser',
  phone: '',
  createdAt: new Date('2026-06-11').toISOString(),
};

// Inisialisasi: Pastikan Superuser selalu ada
function initializeUsers() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([DEFAULT_SUPERUSER]));
    return [DEFAULT_SUPERUSER];
  }
  const users = JSON.parse(stored);
  // Pastikan superuser tidak pernah hilang
  const hasSuperuser = users.some(u => u.id === 'usr_superuser_001');
  if (!hasSuperuser) {
    users.unshift(DEFAULT_SUPERUSER);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
  return users;
}

// ============ CRUD Functions ============

export function getUsers() {
  return initializeUsers();
}

export function getUserById(id) {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

export function addUser({ name, email, password, role, title = '', phone = '' }) {
  const users = getUsers();

  // Cek duplikat email
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email sudah digunakan oleh user lain.');
  }

  // Validasi role
  const validRoles = ['admin', 'editor', 'writer'];
  if (!validRoles.includes(role)) {
    throw new Error('Role tidak valid. Pilih: admin, editor, atau writer.');
  }

  const newUser = {
    id: generateId(),
    name,
    email: email.toLowerCase(),
    password: hashPassword(password),
    role,
    status: 'active',
    title,
    phone,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return newUser;
}

export function updateUser(id, updates) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User tidak ditemukan.');

  // Proteksi: Tidak bisa mengubah role Superuser
  if (users[index].role === 'superuser' && updates.role && updates.role !== 'superuser') {
    throw new Error('Tidak bisa mengubah role Superuser.');
  }

  // Cek duplikat email jika email berubah
  if (updates.email && updates.email.toLowerCase() !== users[index].email) {
    if (users.some(u => u.email.toLowerCase() === updates.email.toLowerCase() && u.id !== id)) {
      throw new Error('Email sudah digunakan oleh user lain.');
    }
  }

  // Hash password jika diupdate
  if (updates.password) {
    updates.password = hashPassword(updates.password);
  }

  users[index] = { ...users[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return users[index];
}

export function deleteUser(id) {
  const users = getUsers();
  const user = users.find(u => u.id === id);

  if (!user) throw new Error('User tidak ditemukan.');
  if (user.role === 'superuser') throw new Error('Akun Superuser tidak bisa dihapus.');

  const filtered = users.filter(u => u.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function toggleUserStatus(id) {
  const users = getUsers();
  const user = users.find(u => u.id === id);

  if (!user) throw new Error('User tidak ditemukan.');
  if (user.role === 'superuser') throw new Error('Status Superuser tidak bisa diubah.');

  user.status = user.status === 'active' ? 'inactive' : 'active';
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return user;
}

// ============ Authentication ============

export function authenticateUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) throw new Error('Email atau password salah.');
  if (!verifyPassword(password, user.password)) throw new Error('Email atau password salah.');
  if (user.status === 'inactive') throw new Error('Akun Anda telah dinonaktifkan. Hubungi administrator.');

  // Return user data tanpa password
  const { password: _, ...safeUser } = user;
  return safeUser;
}
