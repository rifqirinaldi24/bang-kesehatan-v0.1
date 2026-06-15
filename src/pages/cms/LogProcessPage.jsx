import { useState, useEffect } from 'react';
import CMSHeader from '../../components/cms/CMSHeader';
import { getLogs, clearLogs } from '../../data/logStore';
import { formatDate } from '../../data/articles'; // You can reuse formatDate or write a precise one

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}

export default function LogProcessPage() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const handleClearLogs = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua history log proses?")) {
      clearLogs();
      setLogs([]);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.articleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CMSHeader title="Log Process" subtitle="History Publish & Schedule Artikel" />
      
      <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
        <div className="bg-surface-container-lowest rounded-xl border border-border-muted shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-border-muted flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-low/30">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                type="text"
                placeholder="Cari ID, Judul, Aktor, Proses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border-muted rounded-lg font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <button 
              onClick={handleClearLogs}
              className="inline-flex items-center gap-2 px-4 py-2 text-error bg-error-container hover:bg-error/20 rounded-lg font-label-sm text-label-sm font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              Clear Logs
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-muted font-label-sm text-label-sm text-on-surface-variant">
                  <th className="p-4 font-semibold whitespace-nowrap">ID Log</th>
                  <th className="p-4 font-semibold">Waktu Proses</th>
                  <th className="p-4 font-semibold">Aktor</th>
                  <th className="p-4 font-semibold">Proses</th>
                  <th className="p-4 font-semibold">Artikel</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-on-surface">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr 
                      key={log.id} 
                      className="border-b border-border-muted last:border-b-0 hover:bg-senadee-canvas transition-colors"
                    >
                      <td className="p-4 font-mono text-xs text-outline">{log.id}</td>
                      <td className="p-4 whitespace-nowrap text-on-surface-variant">{formatDateTime(log.timestamp)}</td>
                      <td className="p-4 font-semibold">{log.actor}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container border border-border-muted text-xs font-semibold">
                          <span className="material-symbols-outlined text-[14px]">
                            {log.action.toLowerCase().includes('draft') ? 'draft' : 
                             log.action.toLowerCase().includes('schedule') ? 'schedule' : 'publish'}
                          </span>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate" title={log.articleTitle}>
                        {log.articleTitle}
                      </td>
                      <td className="p-4">
                        {log.status === 'Success' ? (
                          <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-bold">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Success
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded text-xs font-bold w-fit">
                              <span className="material-symbols-outlined text-[14px]">cancel</span> Failed
                            </span>
                            <span className="text-[10px] text-error max-w-[150px] truncate" title={log.reason}>{log.reason}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl mb-3 opacity-50">receipt_long</span>
                      <p>Tidak ada log proses ditemukan.</p>
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
