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
            className="flex items-center gap-2.5 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-container to-tertiary flex items-center justify-center shadow-md shadow-primary-container/20 group-hover:shadow-lg group-hover:shadow-primary-container/30 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            </div>
            <div>
              <span className="font-brand font-bold text-lg text-on-surface tracking-tight">
                Senadee
              </span>
            </div>
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
