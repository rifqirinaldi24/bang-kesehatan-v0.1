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
      <section id="hero-section" className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-on-tertiary-fixed-variant">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-tertiary-container/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary-fixed-dim">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              100% Diverifikasi Tim Medis
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-tight mb-6 animate-slide-up">
              Informasi Kesehatan{' '}
              <span className="relative">
                <span className="relative z-10 text-primary-fixed-dim">Tepercaya</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-white/10 rounded-full -z-0" />
              </span>{' '}
              untuk Keluarga Anda
            </h1>

            <p className="text-lg sm:text-xl text-primary-fixed/80 leading-relaxed mb-10 max-w-2xl mx-auto animate-slide-up">
              Portal media kesehatan berbasis AI dengan konten yang telah divalidasi oleh tenaga medis profesional. Mudah dipahami, bisa langsung diterapkan.
            </p>

            {/* Search Bar */}
            <div className="flex justify-center animate-scale-in">
              <SearchBar />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10 text-primary-fixed/70 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{articles.length}+</span>
                <span className="text-sm">Artikel</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">4</span>
                <span className="text-sm">Pilar Kesehatan</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">100%</span>
                <span className="text-sm">Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="var(--color-surface)" />
          </svg>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
