import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../data/userStore';

export default function ForceResetPasswordPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      // Ganti password di database
      changePassword(user.id, oldPassword, newPassword);
      
      // Relogin otomatis untuk merefresh data user (menghilangkan flag requirePasswordReset)
      await login(user.email, newPassword);
      
      // Redirect ke Dashboard
      navigate('/cms', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-dim min-h-screen flex flex-col justify-center items-center text-on-surface antialiased relative px-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-error-container blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-surface-variant blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-[460px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-border-muted p-8 md:p-10 relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-error"></div>
        
        {/* Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              security_update_warning
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">Tindakan Diperlukan</h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-center">
            Demi keamanan, administrator mengharuskan Anda untuk mengganti password bawaan sebelum melanjutkan.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-error-container text-on-error-container rounded-lg font-label-sm text-label-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}
          
          <div>
            <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5" htmlFor="oldPassword">
              Password Saat Ini
            </label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-border-muted rounded-xl bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Masukkan password saat ini"
              required
            />
          </div>

          <div>
            <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5" htmlFor="newPassword">
              Password Baru
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-border-muted rounded-xl bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Minimal 6 karakter"
              required
            />
          </div>

          <div>
            <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5" htmlFor="confirmPassword">
              Konfirmasi Password Baru
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-border-muted rounded-xl bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Ulangi password baru"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm font-label-md text-label-md font-semibold text-white bg-primary hover:bg-on-primary-fixed-variant transition-colors duration-200 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                'Memperbarui...'
              ) : (
                <>
                  Simpan & Lanjutkan
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
