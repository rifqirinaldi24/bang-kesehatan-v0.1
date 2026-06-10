export default function HumanVerifiedBadge({ size = 'default' }) {
  const sizes = {
    small: 'px-2 py-1 text-xs gap-1',
    default: 'px-3 py-1.5 text-sm gap-1.5',
    large: 'px-4 py-2 text-base gap-2',
  };

  return (
    <span
      id="human-verified-badge"
      className={`inline-flex items-center ${sizes[size]} font-semibold rounded-full bg-gradient-to-r from-primary-container to-tertiary text-white shadow-md shadow-primary-container/20`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={size === 'small' ? 'w-3.5 h-3.5' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4'}
      >
        <path
          fillRule="evenodd"
          d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
          clipRule="evenodd"
        />
      </svg>
      <span>Diverifikasi Tim Medis</span>
    </span>
  );
}
