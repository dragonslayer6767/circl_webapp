import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed at top */}
      <Header />
      
      {/* Sidebar - Desktop only, fixed on left */}
      <Sidebar />
      
      {/* Main Content Area - Adjust padding based on sidebar */}
      <main className="pt-16 md:pl-64 pb-16 md:pb-0 min-h-screen transition-all duration-300">
        <div className="h-full">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation - Mobile only, fixed at bottom */}
      <BottomNav />
    </div>
  );
}
