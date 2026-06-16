import { useState, useMemo } from 'react';
import SEOHead from '../components/seo/SEOHead';
import SearchBar from '../components/ui/SearchBar';
import PillarNav from '../components/ui/PillarNav';
import ArticleCard from '../components/ui/ArticleCard';
import { articles as hardcodedArticles, getFeaturedArticles, getAllPublishedArticles, PILLARS } from '../data/articles';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState(null);

  const allArticles = useMemo(() => getAllPublishedArticles(), []);
  const featuredArticles = useMemo(() => getFeaturedArticles(), []);
  const filteredArticles = useMemo(() => {
    if (!activeCategory) return allArticles;
    return allArticles.filter((a) => a.category === activeCategory);
  }, [activeCategory, allArticles]);

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
      <section id="hero-section" className="relative bg-gradient-to-br from-senadee-dark to-senadee-primary">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-senadee-light font-medium text-sm mb-6 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              100% Diverifikasi Tim Medis
            </div>

            {/* Heading */}
            <h1 className="font-tagline font-heading text-white text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6 animate-slide-up">
              Pikiran Tenang, <span className="text-senadee-light">Langkah Sehat.</span>
            </h1>

            {/* Short Subtitle */}
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Temukan panduan kesehatan yang valid, diverifikasi oleh tenaga medis ahli, dan mudah diterapkan dalam rutinitas Anda.
            </p>
          </div>
        </div>
        
        {/* Floating Search Bar (Overlap) */}
        <div className="absolute left-0 right-0 -bottom-8 flex justify-center px-4 sm:px-6 z-10 animate-scale-in" style={{ animationDelay: '200ms' }}>
          <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl p-2 rounded-[2rem] shadow-xl border border-white/40">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Pillar Navigation Section */}
      <section id="pillar-section" className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10 sm:pt-20 sm:pb-14 z-0">
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
