import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isHome ? 'glass' : 'bg-background/95 backdrop-blur-md border-b border-surface-container-low'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link
            to="/"
            id="navbar-logo"
            className="flex items-center gap-2 group outline-none"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Senadee Home"
          >
            <img src="/logo.png" alt="Senadee Logo" className="w-8 h-8 object-contain" />
            <span className="font-brand text-xl sm:text-2xl font-bold tracking-tight text-senadee-dark group-hover:text-senadee-primary transition-colors">
              Senadee
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="font-brand text-senadee-dark hover:text-senadee-primary font-bold transition-colors"
            >
              Beranda
            </Link>
            <Link
              to="/"
              className="font-brand text-senadee-dark hover:text-senadee-primary font-bold transition-colors"
            >
              Artikel
            </Link>
            <Link
              to="/"
              className="font-brand text-senadee-dark hover:text-senadee-primary font-bold transition-colors"
            >
              Komunitas
            </Link>
            <Link
              to="/"
              className="font-brand text-senadee-dark hover:text-senadee-primary font-bold transition-colors"
            >
              Tentang Kita
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-surface-container-low pt-3 animate-slide-down">
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-brand font-bold text-senadee-dark hover:text-senadee-primary transition-colors"
              >
                Beranda
              </Link>
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-brand font-bold text-senadee-dark hover:text-senadee-primary transition-colors"
              >
                Artikel
              </Link>
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-brand font-bold text-senadee-dark hover:text-senadee-primary transition-colors"
              >
                Komunitas
              </Link>
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-brand font-bold text-senadee-dark hover:text-senadee-primary transition-colors"
              >
                Tentang Kita
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
