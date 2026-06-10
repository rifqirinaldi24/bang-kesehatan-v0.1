import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem('bk_admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock authentication
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@bangkesehatan.com' && password === 'admin123') {
          const userData = {
            id: 1,
            name: 'Admin Sistem',
            email: 'admin@bangkesehatan.com',
            role: 'admin',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCPTVDfr0psFb6PDJAR8rSrK7Cw-XtFbli4d8hRha0EmlpVRfaYAziy8jaL4OQtf2EQgGXEhwi-RMXkmKD_ht5vEO3Z4U5GUYh0qOSNiOB4mP_wySNXpnK7hciPgyHTEgsGvgsETUJycq1LQvwYhOpOB6nwJT4Qvlz9vfjdLGmfcVUpP-q3gUYSkbY1yz6naWwDM5aT-5m91msv1fWfQD0n3S8GgFqU2S4ja7GpqtiwSBkIS2Ptj2fD7h4k645bg-IQZ4xoQksqfI'
          };
          setUser(userData);
          localStorage.setItem('bk_admin_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Email atau password salah.'));
        }
      }, 800); // simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bk_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
