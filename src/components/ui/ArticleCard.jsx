import { Link } from 'react-router-dom';
import { getPillarById, formatDate } from '../../data/articles';
import HumanVerifiedBadge from './HumanVerifiedBadge';

const CATEGORY_COLORS = {
  'family-health': 'bg-pink-100 text-pink-700',
  'nutrition': 'bg-amber-100 text-amber-700',
  'fitness': 'bg-blue-100 text-blue-700',
  'preventive-health': 'bg-violet-100 text-violet-700',
};

export default function ArticleCard({ article, featured = false }) {
  const pillar = getPillarById(article.category);
  const colorClass = CATEGORY_COLORS[article.category] || 'bg-surface-container-low text-on-surface';

  if (featured) {
    return (
      <Link
        to={`/article/${article.slug}`}
        id={`article-card-featured-${article.id}`}
        className="group block rounded-3xl overflow-hidden bg-white border border-surface-container-low card-hover shadow-sm"
      >
        {/* Featured Image Placeholder */}
        <div className="relative h-56 sm:h-64 bg-gradient-to-br from-primary-container to-tertiary overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)] " />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorClass} mb-2`}>
              {pillar?.icon} {pillar?.name}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-primary-fixed transition-colors">
              {article.title}
            </h3>
          </div>
        </div>
        <div className="p-5">
          <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span>{formatDate(article.date)}</span>
              <span>·</span>
              <span>{article.readingTime} menit baca</span>
            </div>
            {article.isVerified && <HumanVerifiedBadge size="small" />}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/article/${article.slug}`}
      id={`article-card-${article.id}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-surface-container-low card-hover shadow-sm"
    >
      {/* Image Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-surface-container-low to-surface-container overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/50 to-tertiary-fixed/50 group-hover:from-primary-fixed-dim/50 group-hover:to-tertiary-fixed-dim/50 transition-all duration-500" />
        <div className="absolute top-3 left-3">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {pillar?.icon} {pillar?.name}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-on-surface-variant bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          {article.readingTime} mnt
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-on-surface leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-outline">{formatDate(article.date)}</span>
          {article.isVerified && <HumanVerifiedBadge size="small" />}
        </div>
      </div>
    </Link>
  );
}
