import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articles } from '../../data/articles';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const filteredArticles = query.length >= 2
    ? articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelect = (slug) => {
    setQuery('');
    setIsFocused(false);
    navigate(`/article/${slug}`);
  };

  return (
    <div id="search-bar" className="relative w-full max-w-xl">
      <div
        className={`relative flex items-center rounded-full transition-all duration-300 ${
          isFocused
            ? 'shadow-md border border-senadee-light bg-white'
            : 'shadow-sm border border-transparent bg-white hover:border-senadee-light'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-5 h-5 ml-4 transition-colors ${isFocused ? 'text-primary-container' : 'text-outline'}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          placeholder="Cari gejala atau topik kesehatan preventif di sini..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full px-3 py-3 bg-transparent text-on-surface placeholder-outline focus:outline-none text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="mr-3 p-1 rounded-full hover:bg-surface-container-low text-outline hover:text-on-surface-variant transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isFocused && filteredArticles.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-2xl shadow-xl border border-surface-container-low overflow-hidden z-50 animate-slide-down">
          {filteredArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => handleSelect(article.slug)}
              className="w-full px-4 py-3 text-left hover:bg-primary-fixed transition-colors flex items-start gap-3 border-b border-surface last:border-none cursor-pointer"
            >
              <span className="text-primary-container mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-on-surface line-clamp-1">{article.title}</p>
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{article.excerpt}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {isFocused && query.length >= 2 && filteredArticles.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-2xl shadow-xl border border-surface-container-low p-4 z-50 animate-slide-down">
          <p className="text-sm text-on-surface-variant text-center">Tidak ada artikel yang ditemukan untuk "{query}"</p>
        </div>
      )}
    </div>
  );
}
