import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Header - Fixed at top */}
      <Header />
      
      {/* Main Content Wrapper */}
      <div className="flex flex-1">
        {/* Sidebar - Desktop only, fixed on left */}
        <Sidebar />
        
        {/* Main Content Area - Adjust padding based on sidebar */}
        <main className="flex-1 pt-16 md:pl-64 pb-16 md:pb-0">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Bottom Navigation - Mobile only, fixed at bottom */}
      <BottomNav />
    </div>
  );
}
