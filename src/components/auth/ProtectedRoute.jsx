import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ requiredPermission }) {
  const { user, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-dim">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Belum login → redirect ke Login
  if (!user) {
    return <Navigate to="/cms/login" state={{ from: location }} replace />;
  }

  // Punya permission requirement tapi user tidak punya akses → 403
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/cms/access-denied" replace />;
  }

  // Jika user wajib ganti password, cegat semua akses KECUALI ke halaman force-reset
  if (user.requirePasswordReset && location.pathname !== '/cms/force-reset') {
    return <Navigate to="/cms/force-reset" replace />;
  }

  // Sebaliknya, jika sudah tidak perlu ganti password tapi mencoba masuk ke force-reset
  if (!user.requirePasswordReset && location.pathname === '/cms/force-reset') {
    return <Navigate to="/cms" replace />;
  }

  return <Outlet />;
}
