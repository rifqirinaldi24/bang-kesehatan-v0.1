import { useState } from 'react';
import { getMenuOrder, moveMenuUp, moveMenuDown, toggleMenuVisibility, resetMenuOrder } from '../../data/menuOrderStore';

export default function MenuOrderPage() {
  const [menuItems, setMenuItems] = useState(() => getMenuOrder());
  const [successMsg, setSuccessMsg] = useState('');

  const refresh = () => setMenuItems(getMenuOrder());

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleMoveUp = (id, section) => {
    moveMenuUp(id, section);
    refresh();
  };

  const handleMoveDown = (id, section) => {
    moveMenuDown(id, section);
    refresh();
  };

  const handleToggleVisibility = (id) => {
    toggleMenuVisibility(id);
    refresh();
  };

  const handleReset = () => {
    if (window.confirm('Reset urutan menu ke default?')) {
      resetMenuOrder();
      refresh();
      showSuccess('Urutan menu berhasil di-reset.');
    }
  };

  const mainMenus = menuItems.filter(m => m.section === 'main').sort((a, b) => a.order - b.order);
  const bottomMenus = menuItems.filter(m => m.section === 'bottom').sort((a, b) => a.order - b.order);

  const renderMenuList = (items, section, title) => (
    <div className="bg-surface-container-lowest border border-border-muted rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border-muted bg-surface-container-low/50">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Gunakan tombol ↑↓ untuk mengubah urutan.</p>
      </div>
      <div className="divide-y divide-border-muted">
        {items.map((item, index) => (
          <div key={item.id} className={`flex items-center gap-4 px-5 py-4 transition-colors ${!item.visible ? 'opacity-40' : 'hover:bg-senadee-canvas'}`}>
            {/* Order Controls */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleMoveUp(item.id, section)}
                disabled={index === 0}
                className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
              </button>
              <button
                onClick={() => handleMoveDown(item.id, section)}
                disabled={index === items.length - 1}
                className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
              </button>
            </div>

            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">{item.icon}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-label-md text-label-md font-semibold text-on-surface">{item.name}</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant font-mono">{item.path}</div>
            </div>

            {/* Permission Badge */}
            <div className="hidden sm:block">
              {item.permission ? (
                <span className="px-2 py-1 bg-surface-container rounded text-[10px] font-mono text-on-surface-variant uppercase">{item.permission}</span>
              ) : (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-[10px] font-semibold">PUBLIC</span>
              )}
            </div>

            {/* Visibility Toggle */}
            <button
              onClick={() => handleToggleVisibility(item.id)}
              disabled={item.id === 'dashboard'}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                item.id === 'dashboard' ? 'opacity-30 cursor-not-allowed' : 'hover:bg-surface-container'
              }`}
              title={item.visible ? 'Sembunyikan' : 'Tampilkan'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.visible ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Urutan Menu</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Atur urutan dan visibilitas menu sidebar CMS</p>
        </div>
        <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-muted text-on-surface-variant rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          Reset ke Default
        </button>
      </div>

      {/* Info Box */}
      <div className="mb-6 bg-secondary-container/30 border border-secondary-container text-on-surface-variant p-4 rounded-xl flex items-start gap-3">
        <span className="material-symbols-outlined text-secondary">info</span>
        <p className="font-body-sm text-sm">
          Perubahan urutan menu akan langsung tersimpan dan terlihat di sidebar setelah Anda berpindah halaman.
          Menu yang disembunyikan tetap bisa diakses lewat URL langsung, namun tidak muncul di sidebar.
        </p>
      </div>

      <div className="space-y-6">
        {renderMenuList(mainMenus, 'main', 'Menu Utama')}
        {renderMenuList(bottomMenus, 'bottom', 'Menu Bawah (Settings & Tools)')}
      </div>
    </div>
  );
}
