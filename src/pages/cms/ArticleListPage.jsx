import { useState, useEffect } from 'react';
import CMSHeader from '../../components/cms/CMSHeader';
import Toast from '../../components/ui/Toast';
import { getAllArticles, deleteArticle } from '../../data/articleStore';
import { formatDate } from '../../data/articles';
import { exportToCSV, exportToTXT, exportToExcel } from '../../utils/exportUtils';

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingArticle, setViewingArticle] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.export-dropdown-article')) setShowExportMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const refreshArticles = () => {
    const all = getAllArticles().filter(a => a.status === 'published');
    setArticles(all);
  };

  useEffect(() => {
    refreshArticles();
  }, []);

  // ESC Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (deleteConfirm) {
          setDeleteConfirm(null);
        } else if (viewingArticle) {
          setViewingArticle(null);
          document.body.style.overflow = '';
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteConfirm, viewingArticle]);

  const handleRowClick = (article) => {
    setViewingArticle(article);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseView = () => {
    setViewingArticle(null);
    document.body.style.overflow = '';
  };

  const handleRequestDelete = () => {
    // From View Modal, user clicks Delete → show confirmation
    setDeleteConfirm(viewingArticle);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteArticle(deleteConfirm.id);
      refreshArticles();
      setDeleteConfirm(null);
      setViewingArticle(null);
      document.body.style.overflow = '';
      showSuccess('Data Berhasil Dihapus');
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteFromTable = (id, e) => {
    e.stopPropagation();
    // Find article and show view modal first
    const article = articles.find(a => a.id === id);
    if (article) {
      setViewingArticle(article);
      document.body.style.overflow = 'hidden';
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.articleId && article.articleId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportColumns = [
    { key: 'articleId', label: 'ID Artikel' },
    { key: 'title', label: 'Judul Artikel' },
    { key: 'author', label: 'Penulis' },
    { key: 'category', label: 'Kategori' },
    { key: 'readingTime', label: 'Waktu Baca', getValue: row => `${row.readingTime} Menit` },
    { key: 'date', label: 'Tanggal Publish' }
  ];

  return (
    <>
      <Toast message={successMsg} onClose={() => setSuccessMsg('')} />
      <CMSHeader title="Semua Artikel" subtitle="Manage your published content" />
      
      <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
        <div className="bg-surface-container-lowest rounded-xl border border-border-muted shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-border-muted flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-low/30">
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                type="text"
                placeholder="Cari ID, Judul, atau Penulis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border-muted rounded-lg font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div className="relative export-dropdown-article">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border-muted hover:bg-surface-container-low rounded-lg font-label-sm text-label-sm font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export ⬇️
              </button>
              
              {showExportMenu && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-surface rounded-lg shadow-lg border border-border-muted overflow-hidden z-10 animate-fade-in">
                  <button onClick={() => { exportToCSV('semua_artikel', filteredArticles, exportColumns); setShowExportMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-sm cursor-pointer">Download CSV</button>
                  <button onClick={() => { exportToTXT('semua_artikel', filteredArticles, exportColumns); setShowExportMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-sm cursor-pointer border-t border-border-muted">Download TXT</button>
                  <button onClick={() => { exportToExcel('semua_artikel', filteredArticles, exportColumns); setShowExportMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-sm cursor-pointer border-t border-border-muted">Download Excel</button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-muted font-label-sm text-label-sm text-on-surface-variant">
                  <th className="p-4 font-semibold whitespace-nowrap">ID Artikel</th>
                  <th className="p-4 font-semibold">Judul / Link</th>
                  <th className="p-4 font-semibold">Penulis</th>
                  <th className="p-4 font-semibold">Tgl Publish</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-on-surface">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <tr 
                      key={article.id} 
                      onClick={() => handleRowClick(article)}
                      className="border-b border-border-muted last:border-b-0 hover:bg-senadee-canvas transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-mono text-outline">{article.articleId || '-'}</td>
                      <td className="p-4 max-w-xs truncate">
                        <p className="font-bold text-on-surface truncate" title={article.title}>{article.title}</p>
                        <a href={`/article/${article.slug}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-primary hover:underline text-xs truncate block mt-0.5">
                          /article/{article.slug}
                        </a>
                      </td>
                      <td className="p-4">{article.author}</td>
                      <td className="p-4">{formatDate(article.date || article.updatedAt)}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button onClick={(e) => handleDeleteFromTable(article.id, e)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-error transition-colors cursor-pointer" title="Review & Delete">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-on-surface-variant">
                      Tidak ada artikel yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW DETAIL MODAL (Read-Only, Card Modal) */}
      {viewingArticle && !deleteConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in" onClick={handleCloseView}>
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-border-muted" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-muted bg-surface-container-low/50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">article</span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Detail Artikel</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-mono">{viewingArticle.articleId}</p>
                </div>
              </div>
              <button onClick={handleCloseView} className="p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body (Read-Only Content) */}
            <div className="p-6 overflow-y-auto flex-1">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-3">{viewingArticle.title}</h2>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-on-surface-variant mb-6 pb-4 border-b border-border-muted">
                <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">person</span> {viewingArticle.author}
                </span>
                <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span> {formatDate(viewingArticle.date || viewingArticle.updatedAt)}
                </span>
                <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">category</span> {viewingArticle.category || '-'}
                </span>
                {viewingArticle.isVerified && (
                  <span className="flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                    <span className="material-symbols-outlined text-[16px]">verified</span> Verified
                  </span>
                )}
              </div>
              
              {/* Read-only content preview */}
              <div className="space-y-4">
                {viewingArticle.content?.map((sec, i) => (
                  <div key={i} className="bg-surface-container-low/30 rounded-xl p-4 border border-border-muted">
                    <h4 className="font-label-md text-label-md font-bold text-on-surface mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-primary-fixed text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      {sec.heading}
                    </h4>
                    <p className="text-on-surface-variant text-sm whitespace-pre-line leading-relaxed">{sec.text}</p>
                  </div>
                ))}
                {(!viewingArticle.content || viewingArticle.content.length === 0) && (
                  <p className="text-on-surface-variant italic text-center py-8">Tidak ada konten tersedia untuk pratinjau.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border-muted bg-surface-container-low/50 flex justify-between items-center">
              <button onClick={handleCloseView} className="px-5 py-2.5 border border-border-muted text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                Tutup
              </button>
              <button onClick={handleRequestDelete} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-label-md text-label-md font-semibold hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Hapus Artikel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (Card Modal) */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm border border-border-muted p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-error-container" style={{ fontSize: '32px' }}>warning</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Hapus Artikel?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-2">
              Apakah Anda yakin ingin menghapus:
            </p>
            <p className="font-label-md text-label-md font-bold text-on-surface mb-1">{deleteConfirm.title}</p>
            <p className="font-mono text-xs text-outline mb-6">{deleteConfirm.articleId}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleCancelDelete}
                className="px-5 py-2.5 border border-border-muted text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                Batal
              </button>
              <button onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-label-md text-label-md font-semibold hover:bg-red-700 transition-colors cursor-pointer">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
