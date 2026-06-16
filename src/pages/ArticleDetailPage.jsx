import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import SEOHead from '../components/seo/SEOHead';
import HumanVerifiedBadge from '../components/ui/HumanVerifiedBadge';
import TakeawaysBox from '../components/ui/TakeawaysBox';
import { getArticleBySlug, getPillarById, formatDate } from '../data/articles';
import { formatReadingTime } from '../utils/readingTime';
import { marked } from 'marked';

marked.use({
  renderer: {
    heading(text, level) {
      if (level === 2) return `<h2 class="text-xl sm:text-2xl font-heading font-bold text-on-surface mt-10 mb-4 flex items-start gap-3">${text}</h2>`;
      if (level === 3) return `<h3 class="text-lg sm:text-xl font-heading font-bold text-on-surface mt-8 mb-3">${text}</h3>`;
      return `<h${level}>${text}</h${level}>`;
    },
    paragraph(text) {
      return `<p class="mb-6">${text}</p>`;
    },
    list(body, ordered) {
      const listClass = ordered ? 'list-decimal' : 'list-disc';
      const tag = ordered ? 'ol' : 'ul';
      return `<${tag} class="${listClass} pl-6 mb-6 space-y-2">${body}</${tag}>`;
    },
    listitem(text) {
      return `<li>${text}</li>`;
    },
    strong(text) {
      return `<strong class="font-bold text-on-surface">${text}</strong>`;
    },
    em(text) {
      return `<em class="italic">${text}</em>`;
    }
  }
});

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const article = useMemo(() => getArticleBySlug(slug), [slug]);
  const pillar = useMemo(() => article ? getPillarById(article.category) : null, [article]);

  // Combine sections back to a full markdown string
  const fullMarkdown = useMemo(() => {
    if (!article || !article.content) return '';
    return article.content.map(section => {
      // Don't prepend "Pendahuluan" as a heading if it was implicitly added
      const heading = (section.heading && section.heading !== 'Pendahuluan') ? `## ${section.heading}\n` : '';
      return heading + section.text;
    }).join('\n\n');
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

  return (
    <>
      <SEOHead
        title={article.title}
        description={article.content?.[0]?.text?.substring(0, 160) || ''}
        image={article.imageUrl}
        path={`/article/${article.slug}`}
      />

      <article className="min-h-screen bg-surface pb-20">
        {/* Article Header */}
        <header className="pt-24 lg:pt-32 pb-10 bg-surface-container-lowest border-b border-surface-container">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            {/* Category Breadcrumb */}
            {pillar && (
              <div className="flex items-center gap-3 mb-6">
                <Link
                  to={`/?category=${pillar.id}`}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold font-brand transition-colors bg-${pillar.color}/10 text-${pillar.color} hover:bg-${pillar.color}/20`}
                >
                  <span className="text-base">{pillar.icon}</span>
                  {pillar.name}
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-border-muted"></span>
                <span className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {formatReadingTime(article.readingTime)}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-on-surface leading-tight mb-8">
              {article.title}
            </h1>

            {/* Featured Image */}
            {article.imageUrl && (
              <figure className="mb-10 rounded-2xl overflow-hidden aspect-[21/9] bg-surface-container border border-surface-container shadow-sm">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </figure>
            )}

            {/* Author & Reviewer Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-surface-container bg-surface-container-lowest">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {/* Author */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ditulis Oleh</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">edit_document</span>
                    <span className="text-sm font-semibold text-on-surface">{article.author}</span>
                  </div>
                </div>

                {/* Reviewer */}
                {article.reviewer && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ditinjau Oleh</span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">stethoscope</span>
                      <span className="text-sm font-semibold text-on-surface">dr. {article.reviewer}</span>
                    </div>
                  </div>
                )}

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex-1 min-w-0">
            {/* Article Content with Custom Markdown Renderer */}
            <div className="prose-custom text-on-surface font-body text-base sm:text-lg leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: marked.parse(fullMarkdown) }}>
            </div>

              {/* Actionable Takeaways */}
              <TakeawaysBox takeaways={article.takeaways} />

              {/* FAQ Accordion Card */}
              {article.faq && article.faq.length > 0 && (
                <div className="mt-12 bg-surface-container-lowest border border-surface-container shadow-sm rounded-2xl overflow-hidden">
                  <div className="p-5 sm:p-6 border-b border-surface-container bg-surface-container-lowest">
                    <h3 className="font-heading font-bold text-xl text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">live_help</span>
                      Frequently Asked Questions
                    </h3>
                  </div>
                  <div className="divide-y divide-surface-container">
                    {article.faq.map((item, idx) => (
                      <div key={idx} className="group">
                        <button
                          onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                          className="w-full text-left px-5 sm:px-6 py-4 flex items-start justify-between gap-4 hover:bg-surface-container-lowest transition-colors cursor-pointer focus:outline-none focus:bg-surface-container-lowest"
                        >
                          <span className={`font-body-md font-bold transition-colors ${openFaq === idx ? 'text-primary' : 'text-on-surface'}`}>
                            {item.question}
                          </span>
                          <span className={`material-symbols-outlined transition-transform duration-300 flex-shrink-0 ${openFaq === idx ? 'rotate-180 text-primary' : 'text-on-surface-variant'}`}>
                            expand_more
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                          <div className="px-5 sm:px-6 pb-5 text-on-surface-variant font-body-md leading-relaxed">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {article.references && (
                <div className="mt-10 p-5 bg-surface-container-low rounded-2xl border border-surface-container">
                  <h4 className="font-heading font-bold text-lg text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant">book</span>
                    Referensi
                  </h4>
                  <div className="text-sm text-on-surface-variant whitespace-pre-line font-body leading-relaxed pl-7 -indent-7">
                    {article.references}
                  </div>
                </div>
              )}

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

          </div>
        </div>
      </article>
    </>
  );
}

