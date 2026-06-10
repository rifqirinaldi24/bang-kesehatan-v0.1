import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function CMSSidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/cms', icon: 'dashboard' },
    { name: 'Content Manager', path: '/cms/editor', icon: 'edit_square' },
    { name: 'AI Generation', path: '/cms/ai', icon: 'auto_awesome' },
    { name: 'User Directory', path: '/cms/users', icon: 'group' },
    { name: 'Analytics', path: '/cms/analytics', icon: 'bar_chart' },
  ];

  const bottomNavItems = [
    { name: 'Settings', path: '/cms/settings', icon: 'settings' },
    { name: 'System Status', path: '/cms/status', icon: 'check_circle' },
  ];

  return (
    <nav 
      className={`bg-surface-container-lowest/80 backdrop-blur-md border-r border-border-muted h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 z-40 hidden md:flex ${
        collapsed ? 'w-[80px]' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className={`h-[72px] flex items-center border-b border-border-muted ${collapsed ? 'justify-center' : 'px-6 justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold font-heading">
              B
            </div>
            <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">Bang</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold font-heading">
            B
          </div>
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
              className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 rounded-lg group relative ${
                isActive
                  ? 'text-primary bg-primary-fixed/30 font-medium'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
              title={collapsed ? item.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"></div>
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
        {bottomNavItems.map((item) => (
          <button 
            key={item.name}
            className={`flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all duration-200 rounded-lg group ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.name : undefined}
          >
            <span className="material-symbols-outlined group-hover:rotate-45 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>{item.icon}</span>
            {!collapsed && <span className="font-label-md text-sm whitespace-nowrap">{item.name}</span>}
          </button>
        ))}

        <button
          onClick={logout}
          className={`flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-all duration-200 rounded-lg group ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>logout</span>
          {!collapsed && <span className="font-label-md text-sm whitespace-nowrap">Sign Out</span>}
        </button>
        
        {/* User Profile */}
        <div className={`mt-2 flex items-center gap-3 px-2 py-3 rounded-xl border border-transparent ${collapsed ? 'justify-center' : 'hover:border-border-muted hover:bg-surface-container-lowest transition-colors cursor-pointer'}`}>
          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold flex-shrink-0">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-label-sm text-sm text-on-surface truncate">{user?.name || 'Admin Sistem'}</span>
              <span className="text-[10px] text-outline uppercase font-semibold">{user?.role || 'ADMIN'}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
