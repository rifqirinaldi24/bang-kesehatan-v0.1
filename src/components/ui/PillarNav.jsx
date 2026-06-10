import { PILLARS } from '../../data/articles';

const PILLAR_COLORS = {
  'pillar-family': {
    bg: 'bg-pink-50 hover:bg-pink-100',
    border: 'border-pink-200',
    text: 'text-pink-700',
    activeBg: 'bg-pink-500',
    activeText: 'text-white',
  },
  'pillar-nutrition': {
    bg: 'bg-amber-50 hover:bg-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-700',
    activeBg: 'bg-amber-500',
    activeText: 'text-white',
  },
  'pillar-fitness': {
    bg: 'bg-blue-50 hover:bg-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-700',
    activeBg: 'bg-blue-500',
    activeText: 'text-white',
  },
  'pillar-preventive': {
    bg: 'bg-violet-50 hover:bg-violet-100',
    border: 'border-violet-200',
    text: 'text-violet-700',
    activeBg: 'bg-violet-500',
    activeText: 'text-white',
  },
};

export default function PillarNav({ activeCategory, onCategoryChange }) {
  return (
    <nav id="pillar-navigation" className="flex flex-wrap gap-2 sm:gap-3">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border ${
          !activeCategory
            ? 'bg-primary text-white border-primary shadow-md shadow-primary-container/25'
            : 'bg-white text-on-surface-variant border-surface-container hover:border-primary-fixed-dim hover:text-primary'
        }`}
      >
        Semua Artikel
      </button>

      {PILLARS.map((pillar) => {
        const colors = PILLAR_COLORS[pillar.color];
        const isActive = activeCategory === pillar.id;

        return (
          <button
            key={pillar.id}
            onClick={() => onCategoryChange(pillar.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border ${
              isActive
                ? `${colors.activeBg} ${colors.activeText} border-transparent shadow-md`
                : `${colors.bg} ${colors.text} ${colors.border}`
            }`}
          >
            <span className="mr-1.5">{pillar.icon}</span>
            {pillar.name}
          </button>
        );
      })}
    </nav>
  );
}
