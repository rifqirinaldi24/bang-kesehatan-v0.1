import { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser } from '../data/userStore';
import { getRolePermissions, hasPermission as checkPermission } from '../data/permissionStore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('bk_admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const userData = authenticateUser(email, password);
          // Ambil permissions berdasarkan role
          const permissions = getRolePermissions(userData.role);
          const fullUser = { ...userData, permissions };
          setUser(fullUser);
          localStorage.setItem('bk_admin_user', JSON.stringify(fullUser));
          resolve(fullUser);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bk_admin_user');
  };

  // Refresh permissions dari permissionStore (untuk saat Superuser mengubah role config)
  const refreshPermissions = () => {
    if (user) {
      const permissions = getRolePermissions(user.role);
      const updatedUser = { ...user, permissions };
      setUser(updatedUser);
      localStorage.setItem('bk_admin_user', JSON.stringify(updatedUser));
    }
  };

  // Helper: cek apakah user punya permission tertentu
  const hasPermission = (permissionKey) => {
    if (!user) return false;
    if (user.role === 'superuser') return true; // Superuser selalu punya semua akses
    return checkPermission(user.role, permissionKey);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission, refreshPermissions }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
