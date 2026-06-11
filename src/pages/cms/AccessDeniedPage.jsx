import { Link } from 'react-router-dom';

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dim">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Lock Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-error-container flex items-center justify-center">
          <span className="material-symbols-outlined text-on-error-container" style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}>lock</span>
        </div>

        {/* Title */}
        <h1 className="font-display-md text-display-md font-bold text-on-surface mb-3">403</h1>
        <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-4">Akses Ditolak</h2>
        
        {/* Description */}
        <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
          Anda tidak memiliki izin untuk mengakses halaman ini. 
          Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
        </p>

        {/* Back Button */}
        <Link 
          to="/cms" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
