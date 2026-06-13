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
  const colorClass = 'bg-senadee-light text-senadee-dark';

  if (featured) {
    return (
      <Link
        to={`/article/${article.slug}`}
        id={`article-card-featured-${article.id}`}
        className="group block rounded-3xl overflow-hidden bg-white border border-surface-container-low card-hover shadow-sm"
      >
        {/* Featured Image Placeholder */}
        <div className="relative h-56 sm:h-64 bg-gradient-to-br from-senadee-dark to-senadee-primary overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)] " />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorClass} mb-2`}>
              {pillar?.icon} {pillar?.name}
            </span>
            <h3 className="text-xl sm:text-2xl font-body font-semibold text-white leading-snug group-hover:text-senadee-light transition-colors">
              {article.title}
            </h3>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
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
        <div className="absolute inset-0 bg-gradient-to-br from-senadee-light/50 to-senadee-canvas/50 group-hover:from-senadee-primary/20 transition-all duration-500" />
        <div className="absolute top-3 left-3">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {pillar?.icon} {pillar?.name}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-body font-semibold text-senadee-dark leading-snug mb-3 group-hover:text-senadee-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center justify-between">
          {article.isVerified && <HumanVerifiedBadge size="small" />}
        </div>
      </div>
    </Link>
  );
}
