import { useState, useMemo } from 'react';
import { getUsers, addUser, updateUser, deleteUser, toggleUserStatus } from '../../data/userStore';
import { useAuth } from '../../context/AuthContext';

const ROLE_BADGES = {
  superuser: { bg: '#FEF3C7', color: '#92400E', label: 'Superuser' },
  admin:     { bg: '#DBEAFE', color: '#1E40AF', label: 'Admin' },
  editor:    { bg: '#D1FAE5', color: '#065F46', label: 'Editor' },
  writer:    { bg: '#EDE9FE', color: '#5B21B6', label: 'Writer' },
};

const INITIAL_FORM = { name: '', email: '', password: '', role: 'writer', title: '', phone: '' };

export default function UserDirectoryPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState(() => getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const refreshUsers = () => setUsers(getUsers());

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, filterRole]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Open modal for adding new user
  const handleAddNew = () => {
    setEditingUser(null);
    setForm(INITIAL_FORM);
    setFormError('');
    setShowModal(true);
  };

  // Open modal for editing existing user
  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, title: user.title || '', phone: user.phone || '' });
    setFormError('');
    setShowModal(true);
  };

  // Submit form (add or edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Nama dan Email wajib diisi.');
      return;
    }
    if (!editingUser && !form.password.trim()) {
      setFormError('Password wajib diisi untuk user baru.');
      return;
    }

    try {
      if (editingUser) {
        const updates = { name: form.name, email: form.email, role: form.role, title: form.title, phone: form.phone };
        if (form.password.trim()) updates.password = form.password;
        updateUser(editingUser.id, updates);
        showSuccess(`User "${form.name}" berhasil diperbarui.`);
      } else {
        addUser(form);
        showSuccess(`User "${form.name}" berhasil ditambahkan.`);
      }
      refreshUsers();
      setShowModal(false);
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Delete user
  const handleDelete = (id) => {
    try {
      deleteUser(id);
      refreshUsers();
      setDeleteConfirm(null);
      showSuccess('User berhasil dihapus.');
    } catch (err) {
      alert(err.message);
      setDeleteConfirm(null);
    }
  };

  // Toggle status
  const handleToggleStatus = (id) => {
    try {
      toggleUserStatus(id);
      refreshUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const canManageUser = (targetUser) => {
    if (currentUser?.role === 'superuser') return true;
    if (currentUser?.role === 'admin') {
      return targetUser.role !== 'superuser' && targetUser.role !== 'admin';
    }
    return false;
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface">User Directory</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Kelola semua pengguna CMS Bang Kesehatan</p>
        </div>
        <button onClick={handleAddNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:opacity-90 transition-opacity cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Tambah User Baru
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface cursor-pointer outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Semua Role</option>
          <option value="superuser">Superuser</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="writer">Writer</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Object.entries(ROLE_BADGES).map(([role, config]) => {
          const count = users.filter(u => u.role === role).length;
          return (
            <div key={role} className="bg-surface-container-lowest border border-border-muted rounded-xl p-4 text-center">
              <div className="font-display-sm text-display-sm font-bold" style={{ color: config.color }}>{count}</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">{config.label}</div>
            </div>
          );
        })}
      </div>

      {/* User Table */}
      <div className="bg-surface-container-lowest border border-border-muted rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-muted bg-surface-container-low/50">
                <th className="text-left px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant">User</th>
                <th className="text-left px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant">Role</th>
                <th className="text-left px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant hidden md:table-cell">Jabatan</th>
                <th className="text-center px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant">Status</th>
                <th className="text-left px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant hidden lg:table-cell">Bergabung</th>
                <th className="text-right px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-border-muted last:border-b-0 hover:bg-surface-container-low/30 transition-colors">
                  {/* User Info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: ROLE_BADGES[u.role]?.bg, color: ROLE_BADGES[u.role]?.color }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-label-md text-label-md font-semibold text-on-surface truncate">{u.name}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant truncate">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  {/* Role Badge */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: ROLE_BADGES[u.role]?.bg, color: ROLE_BADGES[u.role]?.color }}>
                      {u.role === 'superuser' && '🔒 '}
                      {ROLE_BADGES[u.role]?.label}
                    </span>
                  </td>
                  {/* Title */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="font-body-md text-body-md text-on-surface-variant">{u.title || '—'}</span>
                  </td>
                  {/* Status Toggle */}
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      disabled={u.role === 'superuser'}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        u.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      } ${u.role === 'superuser' ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80'}`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: u.status === 'active' ? '#16a34a' : '#dc2626' }}></span>
                      {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  {/* Date */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{formatDate(u.createdAt)}</span>
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    {canManageUser(u) && u.role !== 'superuser' ? (
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(u)} className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer" title="Edit">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => setDeleteConfirm(u)} className="p-2 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer" title="Hapus">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    ) : (
                      <span className="font-body-sm text-body-sm text-on-surface-variant italic">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <span className="material-symbols-outlined text-on-surface-variant mb-2" style={{ fontSize: '48px' }}>person_search</span>
                    <p className="font-body-md text-body-md text-on-surface-variant">Tidak ada user yang ditemukan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============ Modal Add/Edit ============ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg border border-border-muted overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-muted bg-surface-container-low/50">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {editingUser ? 'Edit User' : 'Tambah User Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5">Nama Lengkap *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="Contoh: dr. Siti Nurhaliza"
                  className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>

              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="contoh@bangkesehatan.com"
                  className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>

              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5">
                  Password {editingUser ? '(kosongkan jika tidak diubah)' : '*'}
                </label>
                <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
                  placeholder={editingUser ? '••••••••' : 'Minimal 6 karakter'}
                  className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>

              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5">Role *</label>
                <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}
                  disabled={editingUser?.role === 'superuser'}
                  className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface cursor-pointer outline-none focus:ring-2 focus:ring-primary">
                  {currentUser?.role === 'superuser' && <option value="admin">Admin</option>}
                  <option value="editor">Editor</option>
                  <option value="writer">Writer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5">Jabatan</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                    placeholder="Opsional"
                    className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5">No. Telepon</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                    placeholder="Opsional"
                    className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-border-muted text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                  {editingUser ? 'Simpan Perubahan' : 'Tambah User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ Delete Confirmation Modal ============ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm border border-border-muted p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-error-container" style={{ fontSize: '32px' }}>warning</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Hapus User?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Apakah Anda yakin ingin menghapus <strong>{deleteConfirm.name}</strong>? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 border border-border-muted text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-label-md text-label-md font-semibold hover:bg-red-700 transition-colors cursor-pointer">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
