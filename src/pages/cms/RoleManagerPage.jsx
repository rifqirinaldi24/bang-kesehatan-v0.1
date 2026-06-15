import { useState, useEffect, useCallback } from 'react';
import { getAllAvailablePermissions, getPermissionMatrix, updateRolePermissions, resetToDefault } from '../../data/permissionStore';
import { useAuth } from '../../context/AuthContext';
import CMSHeader from '../../components/cms/CMSHeader';

// ── Role metadata ──
const ROLES = [
  { key: 'superuser', label: 'Superuser', locked: true,  badgeBg: '#FEF3C7', badgeText: '#92400E', icon: 'shield_person' },
  { key: 'admin',     label: 'Admin',     locked: false, badgeBg: '#DBEAFE', badgeText: '#1E40AF', icon: 'admin_panel_settings' },
  { key: 'editor',    label: 'Editor',    locked: false, badgeBg: '#D1FAE5', badgeText: '#065F46', icon: 'edit_note' },
  { key: 'writer',    label: 'Writer',    locked: false, badgeBg: '#EDE9FE', badgeText: '#5B21B6', icon: 'draw' },
];

// ── Toggle Switch ──
function ToggleSwitch({ checked, disabled, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        width: 44,
        height: 24,
        borderRadius: 9999,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: disabled
          ? (checked ? '#86EFAC' : '#D1D5DB')
          : (checked ? '#22C55E' : '#D1D5DB'),
        transition: 'background-color 0.2s ease',
        opacity: disabled ? 0.7 : 1,
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: 9999,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </button>
  );
}

// ── Toast Notification ──
function Toast({ message, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        animation: 'slide-up 0.3s ease-out',
      }}
    >
      <div
        className="bg-on-surface text-surface shadow-lg"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 24px',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#4ADE80', fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
        {message}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  RoleManagerPage
// ════════════════════════════════════════════
export default function RoleManagerPage() {
  const { refreshPermissions } = useAuth();

  // Local copy of the full permission matrix for editing
  const [matrix, setMatrix] = useState(() => getPermissionMatrix());
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  // Derive a toggle value
  const isOn = (role, permKey) => (matrix[role] || []).includes(permKey);

  // Toggle handler (skip superuser)
  const handleToggle = (role, permKey, newValue) => {
    setMatrix(prev => {
      const current = prev[role] || [];
      const updated = newValue
        ? [...current, permKey]
        : current.filter(k => k !== permKey);
      return { ...prev, [role]: updated };
    });
    setDirty(true);
  };

  // Save
  const handleSave = useCallback(() => {
    setSaving(true);
    try {
      ['admin', 'editor', 'writer'].forEach(role => {
        updateRolePermissions(role, matrix[role]);
      });
      refreshPermissions();
      setDirty(false);
      setToast({ visible: true, message: 'Perubahan berhasil disimpan!' });
    } catch (err) {
      setToast({ visible: true, message: `Gagal menyimpan: ${err.message}` });
    } finally {
      setSaving(false);
    }
  }, [matrix, refreshPermissions]);

  // Reset to default
  const handleReset = useCallback(() => {
    const defaults = resetToDefault();
    setMatrix(defaults);
    refreshPermissions();
    setDirty(false);
    setToast({ visible: true, message: 'Permission di‑reset ke default.' });
  }, [refreshPermissions]);

  // Count active permissions per role
  const countActive = (role) => (matrix[role] || []).length;

  return (
    <>
      <CMSHeader
        title="Role Manager"
        subtitle="Permission Configuration"
      />

      <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* ── Page title section ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md text-on-surface">Konfigurasi Permission</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Atur hak akses untuk setiap role dalam sistem</p>
            </div>
          </div>
        </div>

        {/* ── Role summary cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {ROLES.map(role => (
            <div
              key={role.key}
              className="bg-surface-container-lowest rounded-xl border border-border-muted p-4 shadow-sm"
              style={{ transition: 'box-shadow 0.2s' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: role.badgeBg, color: role.badgeText }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
                    {role.icon}
                  </span>
                </div>
                <span
                  className="font-label-md text-label-md"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 10px',
                    borderRadius: 9999,
                    backgroundColor: role.badgeBg,
                    color: role.badgeText,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {role.label}
                  {role.locked && ' 🔒'}
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                {countActive(role.key)} / {allPermissions.length} permission aktif
              </p>
            </div>
          ))}
        </div>

        {/* ── Permission Matrix Table ── */}
        <div className="bg-surface-container-lowest rounded-xl border border-border-muted shadow-sm overflow-hidden mb-6">
          {/* Table header */}
          <div
            className="grid items-center border-b border-border-muted bg-surface-container-low"
            style={{ gridTemplateColumns: '1fr repeat(4, 100px)', padding: '14px 20px', gap: 8 }}
          >
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" style={{ fontSize: 11 }}>
              Permission
            </span>
            {ROLES.map(role => (
              <span
                key={role.key}
                className="font-label-md text-label-md text-center"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  padding: '3px 8px',
                  borderRadius: 9999,
                  backgroundColor: role.badgeBg,
                  color: role.badgeText,
                  fontSize: 11,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {role.label}
                {role.locked && ' 🔒'}
              </span>
            ))}
          </div>

          {/* Permission rows */}
          {allPermissions.map((perm, index) => (
            <div
              key={perm.key}
              className="grid items-center"
              style={{
                gridTemplateColumns: '1fr repeat(4, 100px)',
                padding: '14px 20px',
                gap: 8,
                backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--color-surface-container-low)',
                borderBottom: index < allPermissions.length - 1 ? '1px solid var(--color-border-muted)' : 'none',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'var(--color-surface-container-low)'; }}
            >
              {/* Permission info */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant"
                  style={{ flexShrink: 0 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{perm.icon}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p className="font-label-md text-label-md text-on-surface truncate">{perm.label}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant truncate" style={{ fontSize: 11 }}>
                    {perm.description}
                  </p>
                </div>
              </div>

              {/* Toggle for each role */}
              {ROLES.map(role => (
                <div key={role.key} className="flex items-center justify-center">
                  {role.locked ? (
                    <div className="flex items-center gap-1">
                      <ToggleSwitch checked={true} disabled={true} onChange={() => {}} />
                    </div>
                  ) : (
                    <ToggleSwitch
                      checked={isOn(role.key, perm.key)}
                      disabled={false}
                      onChange={(val) => handleToggle(role.key, perm.key, val)}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant hover:text-error transition-colors duration-200"
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: '1px solid var(--color-border-muted)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>restart_alt</span>
            Reset Default
          </button>

          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="flex items-center gap-2 font-label-md text-label-md"
            style={{
              padding: '10px 28px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: dirty ? 'var(--color-primary)' : 'var(--color-outline-variant)',
              color: dirty ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
              cursor: dirty ? 'pointer' : 'not-allowed',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              boxShadow: dirty ? '0 4px 14px rgba(0,106,105,0.25)' : 'none',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {saving ? 'progress_activity' : 'save'}
            </span>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

        {/* ── Info footer ── */}
        <div
          className="mt-8 rounded-xl border border-border-muted bg-surface-container-low"
          style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 12 }}
        >
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20, marginTop: 1 }}>info</span>
          <div>
            <p className="font-label-md text-label-md text-on-surface mb-1">Catatan Penting</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant" style={{ lineHeight: 1.6 }}>
              Permission <strong>Superuser</strong> tidak dapat diubah dan selalu memiliki akses penuh ke seluruh fitur.
              Perubahan pada role lain akan langsung berlaku setelah menekan "Simpan Perubahan".
              Gunakan "Reset Default" untuk mengembalikan semua permission ke pengaturan awal sistem.
            </p>
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </>
  );
}
