import { useState, useMemo } from 'react';
import SEOHead from '../components/seo/SEOHead';
import SearchBar from '../components/ui/SearchBar';
import PillarNav from '../components/ui/PillarNav';
import ArticleCard from '../components/ui/ArticleCard';
import { articles, getFeaturedArticles, PILLARS } from '../data/articles';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState(null);

  const featuredArticles = useMemo(() => getFeaturedArticles(), []);
  const filteredArticles = useMemo(() => {
    if (!activeCategory) return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const nonFeaturedArticles = useMemo(() => {
    return filteredArticles.filter((a) => !a.isFeatured || activeCategory);
  }, [filteredArticles, activeCategory]);

  return (
    <>
      <SEOHead
        title="Beranda"
        description="Senadee - Portal media kesehatan tepercaya untuk keluarga muda Indonesia. Temukan artikel kesehatan yang diverifikasi oleh tim medis."
        path="/"
      />

      {/* Hero Section */}
      <section id="hero-section" className="relative bg-senadee-canvas">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Heading */}
            <h1 className="font-tagline font-heading text-senadee-dark text-4xl md:text-6xl tracking-tight mb-8 animate-slide-up">
              Pikiran Tenang, Langkah Sehat.
            </h1>

            {/* Search Bar */}
            <div className="flex justify-center mt-6 animate-scale-in">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Pillar Navigation Section */}
      <section id="pillar-section" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface mb-2">
              Jelajahi Pilar Kesehatan
            </h2>
            <p className="text-on-surface-variant">Temukan artikel berdasarkan 4 pilar konten utama kami</p>
          </div>
        </div>

        {/* Pillar Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {PILLARS.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => setActiveCategory(activeCategory === pillar.id ? null : pillar.id)}
              className={`group relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 text-left cursor-pointer ${
                activeCategory === pillar.id
                  ? 'border-primary-container bg-primary-fixed shadow-md shadow-primary-container/10'
                  : 'border-surface-container-low bg-white hover:border-surface-container hover:shadow-sm'
              }`}
            >
              <span className="text-3xl sm:text-4xl mb-3 block">{pillar.icon}</span>
              <h3 className="font-heading font-bold text-on-surface text-sm sm:text-base mb-1">
                {pillar.name}
              </h3>
              <p className="text-xs text-on-surface-variant line-clamp-2 hidden sm:block">{pillar.description}</p>
              <div className="mt-2 flex items-center gap-1">
                <div className="h-1.5 rounded-full bg-surface-container flex-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-container to-tertiary-container transition-all duration-500"
                    style={{ width: `${pillar.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-outline font-medium">{pillar.percentage}%</span>
              </div>
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <PillarNav activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </section>

      {/* Featured Articles */}
      {!activeCategory && (
        <section id="featured-section" className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface mb-6">
            ✨ Artikel Pilihan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} featured />
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      <section id="articles-section" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface mb-6">
          {activeCategory ? '📋 Hasil Filter' : '📰 Artikel Terbaru'}
        </h2>

        {nonFeaturedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {nonFeaturedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface rounded-2xl border border-surface-container-low">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-on-surface-variant">Belum ada artikel di kategori ini.</p>
          </div>
        )}
      </section>
    </>
  );
}
