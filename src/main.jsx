import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import ArticleDetailPage from './pages/ArticleDetailPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import CMSLayout from './components/cms/CMSLayout.jsx';
import LoginPage from './pages/cms/LoginPage.jsx';
import DashboardPage from './pages/cms/DashboardPage.jsx';
import ArticleEditorPage from './pages/cms/ArticleEditorPage.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portal Routes */}
            <Route element={<App />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:slug" element={<ArticleDetailPage />} />
            </Route>
            
            {/* CMS Public Routes */}
            <Route path="/cms/login" element={<LoginPage />} />
            
            {/* CMS Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cms" element={<CMSLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="editor" element={<ArticleEditorPage />} />
                {/* Fallback for other CMS routes */}
                <Route path="*" element={<DashboardPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
