import { useState, useEffect } from 'react';
import CMSHeader from '../../components/cms/CMSHeader';
import { exportToCSV, exportToTXT, exportToExcel } from '../../utils/exportUtils';
import { MOCK_AUDIT_LOGS } from '../../data/auditLogs';

export default function AuditTrailPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs] = useState(MOCK_AUDIT_LOGS);

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showExportMenu, setShowExportMenu] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.export-dropdown-audit')) setShowExportMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'SUCCESS': return 'text-primary bg-primary-fixed';
      case 'FAILED': return 'text-error bg-error-container';
      default: return 'text-on-surface-variant bg-surface-container';
    }
  };

  const exportColumns = [
    { key: 'id', label: 'ID Log' },
    { key: 'timestamp', label: 'Waktu' },
    { key: 'user', label: 'Aktor' },
    { key: 'action', label: 'Aktivitas' },
    { key: 'ip', label: 'IP Address' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <>
      <CMSHeader title="Audit Trail" subtitle="System Security & Activity Logs" />
      
      <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
        
        <div className="mb-6 bg-surface-container-lowest border border-border-muted p-4 rounded-xl flex items-start gap-3">
          <span className="material-symbols-outlined text-outline">shield</span>
          <p className="font-body-sm text-sm text-on-surface-variant">
            Semua aktivitas sistem (Login, Edit, Publish, Delete) direkam di sini demi keamanan dan transparansi.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-border-muted shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-border-muted flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-low/30">
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                type="text"
                placeholder="Cari User, Aksi, atau Target..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border-muted rounded-lg font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            
            <div className="relative export-dropdown-audit">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border-muted hover:bg-surface-container-low rounded-lg font-label-sm text-label-sm font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export ⬇️
              </button>
              
              {showExportMenu && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-surface rounded-lg shadow-lg border border-border-muted overflow-hidden z-10 animate-fade-in">
                  <button onClick={() => { exportToCSV('audit_trail', filteredLogs, exportColumns); setShowExportMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-sm cursor-pointer">Download CSV</button>
                  <button onClick={() => { exportToTXT('audit_trail', filteredLogs, exportColumns); setShowExportMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-sm cursor-pointer border-t border-border-muted">Download TXT</button>
                  <button onClick={() => { exportToExcel('audit_trail', filteredLogs, exportColumns); setShowExportMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-sm cursor-pointer border-t border-border-muted">Download Excel</button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-muted font-label-sm text-label-sm text-on-surface-variant">
                  <th className="p-4 font-semibold whitespace-nowrap">Timestamp</th>
                  <th className="p-4 font-semibold">User (Role)</th>
                  <th className="p-4 font-semibold">Aksi</th>
                  <th className="p-4 font-semibold">Target / Detail</th>
                  <th className="p-4 font-semibold">IP Address</th>
                  <th className="p-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-on-surface">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border-muted last:border-b-0 hover:bg-senadee-canvas transition-colors">
                      <td className="p-4 text-outline whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4">
                        <div className="font-bold">{log.user}</div>
                        <div className="text-xs text-on-surface-variant">{log.role}</div>
                      </td>
                      <td className="p-4 font-mono text-xs">{log.action}</td>
                      <td className="p-4 max-w-[200px] truncate" title={log.target}>{log.target}</td>
                      <td className="p-4 text-outline font-mono text-xs">{log.ipAddress}</td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-on-surface-variant">
                      Tidak ada log ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
