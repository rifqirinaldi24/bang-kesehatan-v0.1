export default function TakeawaysBox({ takeaways }) {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <div
      id="actionable-takeaways"
      className="relative mt-10 rounded-2xl overflow-hidden border border-tertiary-fixed-dim bg-gradient-to-br from-tertiary-fixed to-primary-fixed"
    >
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary-container via-tertiary to-primary-container" />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-tertiary flex items-center justify-center shadow-md shadow-primary-container/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-white"
            >
              <path
                fillRule="evenodd"
                d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-on-surface">
              Langkah Praktis untuk Anda
            </h3>
            <p className="text-xs text-on-surface-variant">Actionable Takeaways</p>
          </div>
        </div>

        {/* Takeaway items */}
        <ul className="space-y-3">
          {takeaways.map((item, index) => (
            <li key={index} className="flex items-start gap-3 group">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-container text-white text-xs font-bold flex items-center justify-center mt-0.5 group-hover:bg-tertiary transition-colors">
                {index + 1}
              </span>
              <span className="text-on-surface text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
