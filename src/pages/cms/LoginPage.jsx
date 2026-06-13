import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/cms';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-dim min-h-screen flex flex-col justify-between items-center text-on-surface antialiased relative">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-surface-variant blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-surface-container-high blur-3xl opacity-50"></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center w-full px-4 md:px-margin-desktop py-12">
        {/* Login Card */}
        <div className="w-full max-w-[420px] bg-white/90 backdrop-blur-xl rounded-xl shadow-[0_4px_20px_rgba(14,165,164,0.05)] border border-border-muted p-8 md:p-10 relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          
          {/* Header */}
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center mb-4 border border-border-muted">
              <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                admin_panel_settings
              </span>
            </div>
            <h1 className="font-brand text-headline-md text-primary font-bold">Senadee</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">Admin Console</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-error-container text-on-error-container rounded-lg font-label-sm text-label-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">mail</span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border-muted rounded-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent font-body-md text-body-md transition-all duration-200"
                  placeholder="admin@bangkesehatan.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                  Password
                </label>
                <a href="#" className="font-label-sm text-label-sm text-secondary hover:text-on-secondary-fixed-variant transition-colors duration-200">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border-muted rounded-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent font-body-md text-body-md transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-brand font-bold text-label-md text-on-primary bg-primary hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Secure indicator */}
          <div className="mt-8 flex items-center justify-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span className="font-label-sm text-label-sm">Secure Administrative Access</span>
          </div>
        </div>
      </main>

      {/* Footer Links */}
      <footer className="w-full py-6 flex justify-center gap-6 border-t border-border-muted/50 bg-surface-dim/80 backdrop-blur-sm z-10 relative">
        <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">dns</span>
          System Status
        </a>
        <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">policy</span>
          Security Policy
        </a>
      </footer>
    </div>
  );
}
