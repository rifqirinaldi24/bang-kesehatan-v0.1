import CMSHeader from '../../components/cms/CMSHeader';
import { useAuth } from '../../context/AuthContext';
import { getAllArticles } from '../../data/articleStore';
import { MOCK_AUDIT_LOGS } from '../../data/auditLogs';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const articles = getAllArticles();
  const draftsCount = articles.filter(a => a.status === 'draft').length;
  const publishedCount = articles.filter(a => a.status === 'published').length;
  const verifiedCount = articles.filter(a => a.isVerified).length;
  const recentLogs = MOCK_AUDIT_LOGS.slice(0, 5);
  
  return (
    <>
      <CMSHeader title={`Welcome back, ${user?.name || 'Admin'}`} />
      
      <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-border-muted shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>draft</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Drafts Inbox</p>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">{draftsCount}</h3>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-border-muted shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Human Verified</p>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">{verifiedCount}</h3>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-border-muted shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Published</p>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">{publishedCount}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-border-muted shadow-sm min-h-[400px]">
             <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Recent Activity</h3>
             <div className="space-y-4">
               {recentLogs.map(log => (
                 <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors">
                   <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0 mt-1">
                     <span className="material-symbols-outlined text-[16px]">notifications</span>
                   </div>
                   <div>
                     <p className="font-body-sm text-sm text-on-surface">
                       <span className="font-bold">{log.user}</span> melakukan aksi <span className="font-mono text-xs bg-surface-container px-1 rounded">{log.action}</span>
                     </p>
                     <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                       Target: {log.target}
                     </p>
                     <p className="font-label-sm text-[10px] text-outline mt-1 uppercase">
                       {new Date(log.timestamp).toLocaleString('id-ID')}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-border-muted shadow-sm">
             <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Top Articles (Mock)</h3>
             <p className="text-xs text-on-surface-variant mb-6">Berdasarkan data bacaan fiktif minggu ini.</p>
             <div className="space-y-4">
               <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1 text-on-surface">
                    <span className="truncate pr-4">Mitos dan Fakta Nutrisi Anak</span>
                    <span>1.2k Views</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1 text-on-surface">
                    <span className="truncate pr-4">Jadwal Vaksinasi Anak 2026</span>
                    <span>950 Views</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1 text-on-surface">
                    <span className="truncate pr-4">Panduan Lengkap MPASI</span>
                    <span>820 Views</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-tertiary h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
