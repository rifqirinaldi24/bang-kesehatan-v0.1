export const MOCK_AUDIT_LOGS = [
  {
    id: 'LOG-001',
    timestamp: '2026-06-15T10:30:00Z',
    user: 'dr. Sarah Wijaya, Sp.A',
    role: 'Editor',
    action: 'PUBLISH_ARTICLE',
    target: 'SND-001 (Mitos dan Fakta Nutrisi Anak)',
    status: 'SUCCESS',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-06-15T09:15:22Z',
    user: 'Admin Sistem',
    role: 'Superadmin',
    action: 'UPDATE_ROLE',
    target: 'User: dr. Budi Santoso -> Editor',
    status: 'SUCCESS',
    ipAddress: '10.0.0.5'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-06-14T15:45:10Z',
    user: 'Nadia Kusuma',
    role: 'Writer',
    action: 'SAVE_DRAFT',
    target: 'SND-009 (Manfaat Jahe Merah)',
    status: 'SUCCESS',
    ipAddress: '192.168.1.105'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-06-14T15:44:00Z',
    user: 'Nadia Kusuma',
    role: 'Writer',
    action: 'LOGIN',
    target: 'System',
    status: 'SUCCESS',
    ipAddress: '192.168.1.105'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-06-14T10:20:00Z',
    user: 'Unknown',
    role: 'None',
    action: 'LOGIN_FAILED',
    target: 'System (Invalid Password)',
    status: 'FAILED',
    ipAddress: '114.120.45.67'
  },
  {
    id: 'LOG-006',
    timestamp: '2026-06-13T08:00:00Z',
    user: 'dr. Ahmad Faisal',
    role: 'Editor',
    action: 'VERIFY_ARTICLE',
    target: 'SND-004 (Jadwal Vaksinasi Anak)',
    status: 'SUCCESS',
    ipAddress: '192.168.1.200'
  }
];

const STORAGE_KEY = 'senadee_audit_logs';

function generateLogId() {
  return 'LOG-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function initializeLogs() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_AUDIT_LOGS));
    return [...MOCK_AUDIT_LOGS];
  }
  return JSON.parse(stored);
}

export function getAuditLogs() {
  return initializeLogs().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function addAuditLog({ user, role = 'User', action, target, status = 'SUCCESS', ipAddress = '127.0.0.1' }) {
  const logs = initializeLogs();
  const newLog = {
    id: generateLogId(),
    timestamp: new Date().toISOString(),
    user: user || 'Unknown',
    role,
    action,
    target,
    status,
    ipAddress
  };
  logs.unshift(newLog);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}
