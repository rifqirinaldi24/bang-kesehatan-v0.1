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
