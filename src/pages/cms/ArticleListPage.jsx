import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CMSHeader from '../../components/cms/CMSHeader';
import { getAllArticles, deleteArticle } from '../../data/articleStore';
import { formatDate } from '../../data/articles';

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Only show published articles in "Semua Artikel" history view
    const all = getAllArticles().filter(a => a.status === 'published');
    setArticles(all);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      deleteArticle(id);
      setArticles(getAllArticles().filter(a => a.status === 'published'));
    }
  };

  const filteredArticles = articles.filter(article => 
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
                    <tr key={article.id} className="border-b border-border-muted last:border-b-0 hover:bg-senadee-canvas transition-colors">
                      <td className="p-4 font-mono text-outline">{article.articleId || '-'}</td>
                      <td className="p-4 max-w-xs truncate">
                        <p className="font-bold text-on-surface truncate" title={article.title}>{article.title}</p>
                        <a href={`/article/${article.slug}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs truncate">
                          /article/{article.slug}
                        </a>
                      </td>
                      <td className="p-4">{article.author}</td>
                      <td className="p-4">{formatDate(article.date || article.updatedAt)}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <Link to={`/cms/editor?id=${article.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-senadee-light hover:text-primary transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </Link>
                          <button onClick={() => handleDelete(article.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-error transition-colors cursor-pointer" title="Delete">
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
    </>
  );
}
