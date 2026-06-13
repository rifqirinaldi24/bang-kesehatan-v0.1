import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function CMSSidebar({ collapsed, setCollapsed }) {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate ke login dulu TANPA state from, supaya tidak otomatis diredirect 
    // ke halaman terakhir (yg mungkin restricted untuk role user yg baru login)
    navigate('/cms/login', { replace: true });
    logout();
  };

  // Menu items dengan permission key
  const allNavItems = [
    { name: 'Dashboard', path: '/cms', icon: 'dashboard', permission: 'dashboard' },
    { name: 'Content Manager', path: '/cms/editor', icon: 'edit_square', permission: 'editor' },
    { name: 'AI Generation', path: '/cms/ai', icon: 'auto_awesome', permission: 'ai_generator' },
    { name: 'User Directory', path: '/cms/users', icon: 'group', permission: 'manage_users' },
    { name: 'Analytics', path: '/cms/analytics', icon: 'bar_chart', permission: 'analytics' },
  ];

  const allBottomNavItems = [
    { name: 'Role Manager', path: '/cms/roles', icon: 'admin_panel_settings', permission: 'manage_roles' },
    { name: 'Settings', path: '/cms/settings', icon: 'settings', permission: 'settings' },
    { name: 'System Status', path: '/cms/status', icon: 'check_circle', permission: null },
  ];

  // Filter berdasarkan permission
  const navItems = allNavItems.filter(item => !item.permission || hasPermission(item.permission));
  const bottomNavItems = allBottomNavItems.filter(item => !item.permission || hasPermission(item.permission));

  return (
    <nav 
      className={`bg-surface-container-lowest/80 backdrop-blur-md border-r border-border-muted h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 z-40 hidden md:flex ${
        collapsed ? 'w-[80px]' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className={`h-[72px] flex items-center border-b border-border-muted ${collapsed ? 'justify-center' : 'px-6 justify-between'}`}>
        {!collapsed && (
          <Link to="/cms" className="flex items-center gap-2 overflow-hidden outline-none">
            <img src="/logo.png" alt="Senadee Logo" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
            <span className="font-brand text-headline-md text-primary font-bold tracking-tight">Senadee</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/cms" className="outline-none flex-shrink-0">
            <img src="/logo.png" alt="Senadee Logo" className="w-8 h-8 rounded-lg object-contain" />
          </Link>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors ${collapsed ? 'hidden' : ''}`}
        >
          <span className="material-symbols-outlined text-[20px]">menu_open</span>
        </button>
      </div>

      {collapsed && (
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="mx-auto mt-4 w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
      )}

      {/* Main Nav */}
      <div className="flex-1 flex flex-col gap-1 py-6 px-3 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/cms/editor' && location.pathname.includes('/cms/editor'));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 rounded-lg font-body group relative ${
                isActive
                  ? 'text-senadee-primary bg-senadee-light/50 font-bold'
                  : 'text-on-surface-variant hover:bg-senadee-canvas hover:text-senadee-primary'
              }`}
              title={collapsed ? item.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-senadee-primary rounded-r-full"></div>
              )}
              <span
                className={`material-symbols-outlined transition-transform ${collapsed ? 'mx-auto' : ''} ${isActive ? 'text-primary' : 'group-hover:scale-110'}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {!collapsed && <span className="font-label-md text-sm whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-border-muted p-3 flex flex-col gap-1">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 rounded-lg font-body group ${collapsed ? 'justify-center' : ''} ${
                isActive
                  ? 'text-senadee-primary bg-senadee-light/50 font-bold'
                  : 'text-on-surface-variant hover:bg-senadee-canvas hover:text-senadee-primary'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <span className="material-symbols-outlined group-hover:rotate-45 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>{item.icon}</span>
              {!collapsed && <span className="font-label-md text-sm whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-all duration-200 rounded-lg group ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>logout</span>
          {!collapsed && <span className="font-label-md text-sm whitespace-nowrap">Sign Out</span>}
        </button>
        
        {/* User Profile */}
        <Link 
          to="/cms/profile"
          title={collapsed ? 'My Profile' : undefined}
          className={`mt-2 flex items-center gap-3 px-2 py-3 rounded-xl border border-transparent ${collapsed ? 'justify-center' : 'hover:border-border-muted hover:bg-surface-container-lowest transition-colors cursor-pointer'}`}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user?.name} className="w-8 h-8 rounded-full object-cover border border-border-muted flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold flex-shrink-0">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
          )}
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-label-sm text-sm text-on-surface truncate">{user?.name || 'Admin Sistem'}</span>
              <span className="text-[10px] text-outline uppercase font-semibold">{user?.role || 'ADMIN'}</span>
            </div>
          )}
        </Link>
      </div>
    </nav>
  );
}
