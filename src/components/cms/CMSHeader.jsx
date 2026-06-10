export default function CMSHeader({ title, subtitle, headerActions }) {
  return (
    <header className="bg-white/80 backdrop-blur-md dark:bg-inverse-surface/80 border-b border-border-muted dark:border-outline-variant shadow-[0_4px_20px_rgba(14,165,164,0.05)] sticky top-0 z-30 flex justify-between items-center h-[72px] px-margin-mobile md:px-margin-desktop w-full">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors duration-200">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex flex-col">
          {subtitle && (
            <span className="font-label-sm text-label-sm text-on-surface-variant">{subtitle}</span>
          )}
          <h2 className="font-label-md text-label-md font-bold truncate max-w-[200px] md:max-w-md">
            {title || 'Dashboard'}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex gap-2 text-on-surface-variant">
          <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors duration-200">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
        
        {/* Render dynamic header actions passed from current page */}
        {headerActions}
      </div>
    </header>
  );
}
