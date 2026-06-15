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
import UserDirectoryPage from './pages/cms/UserDirectoryPage.jsx';
import RoleManagerPage from './pages/cms/RoleManagerPage.jsx';
import AccessDeniedPage from './pages/cms/AccessDeniedPage.jsx';
import ArticleListPage from './pages/cms/ArticleListPage.jsx';
import DraftListPage from './pages/cms/DraftListPage.jsx';
import AuditTrailPage from './pages/cms/AuditTrailPage.jsx';
import MyProfilePage from './pages/cms/MyProfilePage.jsx';
import ForceResetPasswordPage from './pages/cms/ForceResetPasswordPage.jsx';
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

            {/* CMS Access Denied (inside CMS layout) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cms/access-denied" element={<CMSLayout />}>
                <Route index element={<AccessDeniedPage />} />
              </Route>
            </Route>
            
            {/* CMS Protected Routes — General (semua user login) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cms" element={<CMSLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="articles" element={<ArticleListPage />} />
                <Route path="drafts" element={<DraftListPage />} />
                <Route path="editor" element={<ArticleEditorPage />} />
                <Route path="profile" element={<MyProfilePage />} />
              </Route>
              <Route path="/cms/force-reset" element={<ForceResetPasswordPage />} />
            </Route>

            {/* CMS Protected Routes — User Directory (butuh manage_users) */}
            <Route element={<ProtectedRoute requiredPermission="manage_users" />}>
              <Route path="/cms" element={<CMSLayout />}>
                <Route path="users" element={<UserDirectoryPage />} />
              </Route>
            </Route>

            {/* CMS Protected Routes — Role Manager (butuh manage_roles) */}
            <Route element={<ProtectedRoute requiredPermission="manage_roles" />}>
              <Route path="/cms" element={<CMSLayout />}>
                <Route path="roles" element={<RoleManagerPage />} />
                <Route path="audit" element={<AuditTrailPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
