import { Outlet } from 'react-router-dom';
import CMSSidebar from './CMSSidebar';
import { useState } from 'react';

export default function CMSLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex bg-dot-pattern">
      <CMSSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-64'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
