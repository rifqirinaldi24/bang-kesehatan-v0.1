import { useState, useMemo, useEffect } from 'react';
import { getDoctors, addDoctor, updateDoctor, deleteDoctor, toggleDoctorStatus } from '../../data/doctorStore';

const INITIAL_FORM = { name: '', specialty: '', status: 'active' };

export default function DoctorDirectoryPage() {
  const [doctors, setDoctors] = useState(() => getDoctors());
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ESC Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (deleteConfirm) {
          setDeleteConfirm(null);
        } else if (showModal) {
          setShowModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteConfirm, showModal]);

  const refreshDoctors = () => setDoctors(getDoctors());

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (d.specialty && d.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [doctors, searchQuery]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddNew = () => {
    setEditingDoctor(null);
    setForm(INITIAL_FORM);
    setShowModal(true);
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({ name: doctor.name, specialty: doctor.specialty || '', status: doctor.status });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingDoctor) {
      updateDoctor({ ...editingDoctor, name: form.name, specialty: form.specialty, status: form.status });
      showSuccess('Dokter berhasil diperbarui!');
    } else {
      addDoctor({ name: form.name, specialty: form.specialty, status: form.status });
      showSuccess('Dokter berhasil ditambahkan!');
    }
    setShowModal(false);
    refreshDoctors();
  };

  const handleToggleStatus = (id) => {
    toggleDoctorStatus(id);
    refreshDoctors();
  };

  const confirmDelete = (doctor) => {
    setDeleteConfirm(doctor);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteDoctor(deleteConfirm.id);
      showSuccess('Dokter berhasil dihapus!');
      setDeleteConfirm(null);
      refreshDoctors();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background animate-fade-in relative z-0">
      {/* Toast Notification */}
      {successMsg && (
        <div className="absolute top-4 right-4 z-50 bg-primary text-on-primary px-4 py-3 rounded-lg shadow-elevation-3 font-body-md animate-slide-in-right flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          {successMsg}
        </div>
      )}

      {/* Header */}
      <header className="flex-shrink-0 border-b border-border-muted bg-surface/50 backdrop-blur-md sticky top-0 z-10">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Master Dokter</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Kelola direktori dokter / reviewer untuk portal Senadee</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity shadow-elevation-1"
          >
            <span className="material-symbols-outlined">add</span>
            Tambah Dokter
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Controls */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-border-muted flex gap-4">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                placeholder="Cari nama atau spesialisasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border-muted rounded-lg pl-10 pr-4 py-2 font-body-md text-body-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface-container-lowest rounded-xl border border-border-muted overflow-hidden shadow-elevation-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-border-muted">
                    <th className="p-4 font-label-md text-label-md font-bold text-on-surface">Nama Lengkap & Gelar</th>
                    <th className="p-4 font-label-md text-label-md font-bold text-on-surface">Spesialisasi</th>
                    <th className="p-4 font-label-md text-label-md font-bold text-on-surface">Status</th>
                    <th className="p-4 font-label-md text-label-md font-bold text-on-surface text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm">
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-on-surface-variant">
                        Belum ada dokter yang terdaftar atau ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors.map(doc => (
                      <tr key={doc.id} className="border-b border-border-muted hover:bg-surface-container-lowest transition-colors">
                        <td className="p-4 text-on-surface font-medium">{doc.name}</td>
                        <td className="p-4 text-on-surface-variant">{doc.specialty || '-'}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(doc.id)}
                            className={`px-3 py-1 rounded-full font-label-sm text-label-sm border transition-colors ${
                              doc.status === 'active' 
                                ? 'bg-primary-container text-on-primary-container border-transparent hover:opacity-80' 
                                : 'bg-surface text-on-surface-variant border-border-muted hover:bg-surface-container-low'
                            }`}
                          >
                            {doc.status === 'active' ? 'Aktif' : 'Nonaktif'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleEdit(doc)} className="text-primary hover:bg-primary-container p-2 rounded-full transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => confirmDelete(doc)} className="text-error hover:bg-error-container p-2 rounded-full transition-colors" title="Hapus">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-scrim/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl shadow-elevation-4 w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-border-muted flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {editingDoctor ? 'Edit Dokter' : 'Tambah Dokter'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="font-label-md text-label-md font-bold text-on-surface block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface border border-border-muted rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. dr. Rifqi Rinaldi, Sp.A"
                />
              </div>
              
              <div>
                <label className="font-label-md text-label-md font-bold text-on-surface block mb-1">Spesialisasi (Opsional)</label>
                <input
                  type="text"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full bg-surface border border-border-muted rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. Dokter Umum, Spesialis Anak..."
                />
              </div>

              <div>
                <label className="font-label-md text-label-md font-bold text-on-surface block mb-1">Status Awal</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-surface border border-border-muted rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 font-label-md text-label-md rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 font-label-md text-label-md rounded-full bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-elevation-1">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-scrim/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl shadow-elevation-4 w-full max-w-sm p-6 text-center animate-scale-in">
            <span className="material-symbols-outlined text-[48px] text-error mb-4">warning</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Hapus Dokter?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Anda yakin ingin menghapus <strong>{deleteConfirm.name}</strong>? Data ini tidak dapat dikembalikan.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2 font-label-md text-label-md rounded-full border border-border-muted text-on-surface hover:bg-surface-container-low transition-colors">
                Batal
              </button>
              <button onClick={handleDelete} className="px-5 py-2 font-label-md text-label-md rounded-full bg-error text-on-error hover:opacity-90 transition-opacity">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
