import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CMSHeader from '../../components/cms/CMSHeader';
import { getAllArticles, deleteArticle } from '../../data/articleStore';
import { formatDate } from '../../data/articles';
import { useAuth } from '../../context/AuthContext';
import ArticleEditorPage from './ArticleEditorPage';

export default function DraftListPage() {
  const [drafts, setDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuth();

  const refreshDrafts = () => {
    // Only show draft articles
    const allDrafts = getAllArticles().filter(a => a.status === 'draft');
    
    // RBAC: If user is Writer, they can only see their own drafts
    // Assuming role 'superuser' or 'admin' or 'editor' can see all drafts
    // 'writer' can only see theirs. In this mock, we check user.role.
    let filteredDrafts = allDrafts;
    if (user?.role === 'Writer' || user?.role === 'writer') {
      filteredDrafts = allDrafts.filter(a => a.author === user.name);
    }
    
    setDrafts(filteredDrafts);
  };

  useEffect(() => {
    refreshDrafts();
  }, [user]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus draf ini?")) {
      deleteArticle(id);
      refreshDrafts();
    }
  };

  const handleOpenEditor = (id) => {
    setEditingId(id);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const handleCloseEditor = (needsRefresh) => {
    setEditingId(null);
    document.body.style.overflow = '';
    if (needsRefresh) {
      refreshDrafts();
    }
  };

  const filteredDrafts = drafts.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.articleId && article.articleId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headerActions = (
    <Link to="/cms/editor" className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px]">add</span>
      Tulis Baru
    </Link>
  );

  return (
    <>
      <CMSHeader title="Draft Artikel" subtitle="Manage your drafted content" headerActions={headerActions} />
      
      <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
        
        {user?.role?.toLowerCase() === 'writer' && (
          <div className="mb-6 bg-secondary-container/30 border border-secondary-container text-on-surface-variant p-4 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary">info</span>
            <p className="font-body-sm text-sm">
              Sebagai <b>Penulis (Writer)</b>, Anda hanya dapat melihat dan mengedit draf milik Anda sendiri.
            </p>
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-xl border border-border-muted shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-border-muted flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-low/30">
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                type="text"
                placeholder="Cari Draf..."
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
                  <th className="p-4 font-semibold whitespace-nowrap">ID Draft</th>
                  <th className="p-4 font-semibold">Judul Topik</th>
                  <th className="p-4 font-semibold">Penulis</th>
                  <th className="p-4 font-semibold">Terakhir Diubah</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-on-surface">
                {filteredDrafts.length > 0 ? (
                  filteredDrafts.map((article) => (
                    <tr 
                      key={article.id} 
                      onClick={() => handleOpenEditor(article.id)}
                      className="border-b border-border-muted last:border-b-0 hover:bg-senadee-canvas transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-mono text-outline">{article.articleId || 'Menunggu'}</td>
                      <td className="p-4 max-w-xs truncate">
                        <p className="font-bold text-on-surface truncate" title={article.title}>{article.title || 'Untitled Draft'}</p>
                      </td>
                      <td className="p-4">{article.author}</td>
                      <td className="p-4">{formatDate(article.updatedAt || new Date().toISOString())}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); handleOpenEditor(article.id); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-senadee-light hover:text-primary transition-colors cursor-pointer" title="Edit Draft">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button onClick={(e) => handleDelete(article.id, e)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-error transition-colors cursor-pointer" title="Delete Draft">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-on-surface-variant">
                      Tidak ada draf yang tersimpan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CARD EDITOR MODAL */}
      {editingId && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => handleCloseEditor(false)}>
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] border border-border-muted overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <ArticleEditorPage isModal={true} editId={editingId} onClose={handleCloseEditor} />
          </div>
        </div>
      )}
    </>
  );
}
