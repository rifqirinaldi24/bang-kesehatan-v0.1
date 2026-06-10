import CMSHeader from '../../components/cms/CMSHeader';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  
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
                <h3 className="font-headline-lg text-headline-lg text-on-surface">12</h3>
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
                <h3 className="font-headline-lg text-headline-lg text-on-surface">45</h3>
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
                <h3 className="font-headline-lg text-headline-lg text-on-surface">38</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-border-muted shadow-sm min-h-[400px]">
             <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Recent Activity</h3>
             <div className="space-y-4">
               <p className="text-on-surface-variant">Activity feed will be displayed here...</p>
             </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-border-muted shadow-sm">
             <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Content Pillars</h3>
             <div className="space-y-4 mt-6">
               <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1 text-on-surface">
                    <span>Family Health</span>
                    <span>35%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1 text-on-surface">
                    <span>Nutrition</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1 text-on-surface">
                    <span>Fitness</span>
                    <span>20%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-tertiary h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1 text-on-surface">
                    <span>Preventive</span>
                    <span>20%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-outline h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
