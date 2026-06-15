import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CMSHeader from '../../components/cms/CMSHeader';
import { getAllArticles, deleteArticle } from '../../data/articleStore';
import { formatDate } from '../../data/articles';
import ArticleEditorPage from './ArticleEditorPage';

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingArticle, setViewingArticle] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const refreshArticles = () => {
    const all = getAllArticles().filter(a => a.status === 'published');
    setArticles(all);
  };

  useEffect(() => {
    refreshArticles();
  }, []);

  const handleDelete = (id, e) => {
    e?.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      deleteArticle(id);
      refreshArticles();
      if (viewingArticle?.id === id) setViewingArticle(null);
    }
  };

  const handleRowClick = (article) => {
    setViewingArticle(article);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseView = () => {
    setViewingArticle(null);
    document.body.style.overflow = '';
  };

  const handleOpenEditor = (id, e) => {
    e?.stopPropagation();
    setViewingArticle(null);
    setEditingId(id);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseEditor = (needsRefresh) => {
    setEditingId(null);
    document.body.style.overflow = '';
    if (needsRefresh) {
      refreshArticles();
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.articleId && article.articleId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headerActions = null; // No Add button in History

  return (
    <>
      <CMSHeader title="Semua Artikel" subtitle="Article History & Management" headerActions={headerActions} />
      
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
                        <div className="flex justify-end gap-2">
                          <button onClick={(e) => handleOpenEditor(article.id, e)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-senadee-light hover:text-primary transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button onClick={(e) => handleDelete(article.id, e)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-error transition-colors cursor-pointer" title="Delete">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
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

      {/* VIEW MODAL */}
      {viewingArticle && (
        <div className="fixed inset-0 z-[100] bg-surface/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in" onClick={handleCloseView}>
          <div className="bg-surface-container-lowest w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border-muted" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border-muted bg-surface-container-low/50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">article</span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Detail Artikel</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-mono">{viewingArticle.articleId}</p>
                </div>
              </div>
              <button onClick={handleCloseView} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">{viewingArticle.title}</h2>
              <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-8 pb-4 border-b border-border-muted">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">person</span> {viewingArticle.author}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {formatDate(viewingArticle.date || viewingArticle.updatedAt)}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">category</span> {viewingArticle.category}</span>
              </div>
              
              <div className="prose-custom opacity-70">
                <p className="italic mb-4 text-on-surface-variant">Pratinjau konten kasar (Tidak mencakup layout web sesungguhnya):</p>
                {viewingArticle.content?.map((sec, i) => (
                  <div key={i} className="mb-4">
                    <h4 className="font-bold text-on-surface mb-1">{sec.heading}</h4>
                    <p className="text-on-surface-variant text-sm whitespace-pre-line">{sec.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-border-muted bg-surface-container-low/50 flex justify-between items-center">
              <button onClick={(e) => handleDelete(viewingArticle.id, e)} className="px-4 py-2 text-error font-label-md text-label-md rounded-lg hover:bg-error-container transition-colors cursor-pointer flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">delete</span> Hapus
              </button>
              <div className="flex gap-3">
                <button onClick={handleCloseView} className="px-4 py-2 text-on-surface font-label-md text-label-md border border-border-muted rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                  Tutup
                </button>
                <button onClick={(e) => handleOpenEditor(viewingArticle.id, e)} className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">edit</span> Edit Artikel
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FULLSCREEN EDITOR MODAL */}
      {editingId && (
        <div className="fixed inset-0 z-[110] bg-surface flex flex-col animate-fade-in">
          <ArticleEditorPage isModal={true} editId={editingId} onClose={handleCloseEditor} />
        </div>
      )}
    </>
  );
}
