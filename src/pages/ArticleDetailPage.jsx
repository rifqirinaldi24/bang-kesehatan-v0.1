import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import SEOHead from '../components/seo/SEOHead';
import HumanVerifiedBadge from '../components/ui/HumanVerifiedBadge';
import TakeawaysBox from '../components/ui/TakeawaysBox';
import { getArticleBySlug, getPillarById, formatDate } from '../data/articles';
import { formatReadingTime } from '../utils/readingTime';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const article = useMemo(() => getArticleBySlug(slug), [slug]);
  const pillar = useMemo(() => article ? getPillarById(article.category) : null, [article]);

  // Scroll spy for table of contents
  useEffect(() => {
    if (!article) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    article.content.forEach((_, index) => {
      const el = document.getElementById(`section-${index}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [article]);

  // 404 handler
  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <SEOHead title="Artikel Tidak Ditemukan" />
        <span className="text-6xl mb-6 block">😔</span>
        <h1 className="text-3xl font-heading font-bold text-on-surface mb-4">
          Artikel Tidak Ditemukan
        </h1>
        <p className="text-on-surface-variant mb-8">
          Maaf, artikel yang Anda cari tidak tersedia atau sudah dihapus.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-brand font-bold hover:bg-primary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const PILLAR_TAG_COLORS = {
    'family-health': 'bg-pink-100 text-pink-700',
    'nutrition': 'bg-amber-100 text-amber-700',
    'fitness': 'bg-blue-100 text-blue-700',
    'preventive-health': 'bg-violet-100 text-violet-700',
  };

  return (
    <>
      <SEOHead
        title={article.title}
        description={article.excerpt}
        path={`/article/${article.slug}`}
      />

      <article className="animate-fade-in">
        {/* Article Header */}
        <header className="relative bg-gradient-to-br from-surface to-primary-fixed/30 border-b border-surface-container-low">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-outline line-clamp-1">{article.title}</span>
            </nav>

            {/* Category Tag */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 ${PILLAR_TAG_COLORS[article.category] || ''}`}>
              {pillar?.icon} {pillar?.name}
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-on-surface leading-tight mb-6">
              {article.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6">
              
              <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-x-6 gap-y-4">
                {/* Author */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ditulis Oleh</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-container to-tertiary-container flex items-center justify-center text-on-primary-container text-[10px] font-bold shadow-sm">
                      {article.author?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-on-surface">{article.author}</span>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-8 bg-border-muted"></div>

                {/* Reviewer */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ditinjau Oleh</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                    <span className="text-sm font-semibold text-on-surface">{article.reviewer || 'Tim Medis Senadee'}</span>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-8 bg-border-muted"></div>

                {/* Date */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Terakhir Diperbarui</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">calendar_today</span>
                    <span className="text-sm font-semibold text-on-surface">{formatDate(article.date)}</span>
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              {article.isVerified && (
                <div className="mt-2 lg:mt-0">
                  <HumanVerifiedBadge />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex gap-10">
            {/* Table of Contents - Sidebar (desktop) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h4 className="font-heading font-semibold text-on-surface text-sm mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-primary-container">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  Daftar Isi
                </h4>
                <nav id="table-of-contents" className="space-y-1">
                  {article.content.map((section, index) => (
                    <a
                      key={index}
                      href={`#section-${index}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 border-l-2 ${
                        activeSection === `section-${index}`
                          ? 'text-primary bg-primary-fixed border-primary-container font-medium'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface border-transparent'
                      }`}
                    >
                      {section.heading}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 max-w-3xl">
              {/* Mobile TOC */}
              <details className="lg:hidden mb-8 rounded-2xl border border-surface-container bg-surface overflow-hidden group">
                <summary className="px-5 py-4 cursor-pointer font-heading font-semibold text-on-surface text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-primary-container">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    Daftar Isi
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-outline group-open:rotate-180 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <nav className="px-5 pb-4 space-y-1">
                  {article.content.map((section, index) => (
                    <a
                      key={index}
                      href={`#section-${index}`}
                      className="block px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-primary-fixed transition-colors"
                    >
                      {section.heading}
                    </a>
                  ))}
                </nav>
              </details>

              {/* Article Content */}
              <div className="prose-custom">
                {article.content.map((section, index) => (
                  <section key={index} id={`section-${index}`} className="mb-10 scroll-mt-24">
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-on-surface mb-4 flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-fixed text-primary text-sm font-bold flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      {section.heading}
                    </h2>
                    <div className="text-on-surface font-body text-base sm:text-lg leading-relaxed whitespace-pre-line pl-11">
                      {section.text}
                    </div>
                  </section>
                ))}
              </div>

              {/* Actionable Takeaways */}
              <TakeawaysBox takeaways={article.takeaways} />

              {/* Article Reference ID (Opsi B) */}
              {article.articleId && (
                <div className="mt-10 pt-8 border-t border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-mono bg-surface-container-low px-3 py-1.5 rounded-lg w-fit">
                    <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                    Ref: {article.articleId}
                  </div>
                  
                  {/* Back button */}
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-brand font-bold text-on-surface-variant hover:text-primary hover:bg-primary-fixed border border-surface-container hover:border-primary-fixed transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Kembali
                  </button>
                </div>
              )}

              {!article.articleId && (
                <div className="mt-10 pt-8 border-t border-surface-container">
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-brand font-bold text-on-surface-variant hover:text-primary hover:bg-primary-fixed border border-surface-container hover:border-primary-fixed transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Kembali
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
