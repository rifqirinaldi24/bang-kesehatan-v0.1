import { useState, useMemo } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus, resetCategories } from '../../data/categoryStore';

const INITIAL_FORM = { name: '', key: '', icon: '📄', color: '#6b7280', isActive: true };

export default function CategoryParameterPage() {
  const [categories, setCategories] = useState(() => getCategories());
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const refresh = () => setCategories(getCategories());

  const filteredCategories = useMemo(() => {
    return categories.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.key.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setForm(INITIAL_FORM);
    setFormError('');
    setShowModal(true);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, key: cat.key, icon: cat.icon, color: cat.color, isActive: cat.isActive });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) {
      setFormError('Nama kategori wajib diisi.');
      return;
    }
    try {
      if (editingCategory) {
        updateCategory(editingCategory.id, form);
        showSuccess(`Kategori "${form.name}" berhasil diperbarui.`);
      } else {
        addCategory(form);
        showSuccess(`Kategori "${form.name}" berhasil ditambahkan.`);
      }
      refresh();
      setShowModal(false);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = (id) => {
    try {
      deleteCategory(id);
      refresh();
      setDeleteConfirm(null);
      showSuccess('Kategori berhasil dihapus.');
    } catch (err) {
      alert(err.message);
      setDeleteConfirm(null);
    }
  };

  const handleToggle = (id) => {
    toggleCategoryStatus(id);
    refresh();
  };

  const handleReset = () => {
    if (window.confirm('Reset semua kategori ke default? Data kustom akan hilang.')) {
      resetCategories();
      refresh();
      showSuccess('Kategori berhasil di-reset ke default.');
    }
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
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Parameter Kategori</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Kelola kategori/pilar artikel Bang Kesehatan</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-muted text-on-surface-variant rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Reset
          </button>
          <button onClick={handleAddNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:opacity-90 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Tambah Kategori
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-surface-container-lowest border border-border-muted rounded-xl p-4 text-center">
          <div className="font-display-sm text-display-sm font-bold text-primary">{categories.length}</div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">Total</div>
        </div>
        <div className="bg-surface-container-lowest border border-border-muted rounded-xl p-4 text-center">
          <div className="font-display-sm text-display-sm font-bold text-green-700">{categories.filter(c => c.isActive).length}</div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">Aktif</div>
        </div>
        <div className="bg-surface-container-lowest border border-border-muted rounded-xl p-4 text-center">
          <div className="font-display-sm text-display-sm font-bold text-red-700">{categories.filter(c => !c.isActive).length}</div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">Nonaktif</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-border-muted rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-muted bg-surface-container-low/50">
                <th className="text-left px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant">Icon</th>
                <th className="text-left px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant">Nama Kategori</th>
                <th className="text-left px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant hidden md:table-cell">Key / Slug</th>
                <th className="text-center px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant">Warna</th>
                <th className="text-center px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant">Status</th>
                <th className="text-right px-5 py-3.5 font-label-md text-label-md font-semibold text-on-surface-variant">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="border-b border-border-muted last:border-b-0 hover:bg-senadee-canvas transition-colors">
                  <td className="px-5 py-4 text-2xl">{cat.icon}</td>
                  <td className="px-5 py-4">
                    <span className="font-label-md text-label-md font-semibold text-on-surface">{cat.name}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="font-mono text-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">{cat.key}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border border-border-muted" style={{ backgroundColor: cat.color }}></div>
                      <span className="font-mono text-xs text-on-surface-variant hidden sm:inline">{cat.color}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleToggle(cat.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        cat.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: cat.isActive ? '#16a34a' : '#dc2626' }}></span>
                      {cat.isActive ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(cat)} className="p-2 rounded-lg text-on-surface-variant hover:bg-senadee-light/30 hover:text-senadee-primary transition-colors cursor-pointer" title="Edit">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => setDeleteConfirm(cat)} className="p-2 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer" title="Hapus">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <span className="material-symbols-outlined text-on-surface-variant mb-2" style={{ fontSize: '48px' }}>category</span>
                    <p className="font-body-md text-body-md text-on-surface-variant">Tidak ada kategori ditemukan.</p>
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-muted bg-surface-container-low/50">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {formError}
                </div>
              )}
              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5">Nama Kategori *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="Contoh: Kesehatan Mental"
                  className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5">Key / Slug</label>
                <input type="text" value={form.key} onChange={(e) => setForm({...form, key: e.target.value})}
                  placeholder="contoh: mental-health (otomatis jika kosong)"
                  className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5">Icon (Emoji)</label>
                  <input type="text" value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})}
                    placeholder="📄"
                    className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5">Warna</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.color} onChange={(e) => setForm({...form, color: e.target.value})}
                      className="w-10 h-10 rounded-lg border border-border-muted cursor-pointer" />
                    <input type="text" value={form.color} onChange={(e) => setForm({...form, color: e.target.value})}
                      className="flex-1 px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-border-muted text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                  {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
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
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Hapus Kategori?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Apakah Anda yakin ingin menghapus <strong>{deleteConfirm.icon} {deleteConfirm.name}</strong>?
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
