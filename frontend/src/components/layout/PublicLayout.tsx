import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { NovaFloatingButton } from '../nova/NovaFloatingButton';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background relative">
      <Navbar />
      <main className="flex-1 w-full pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      {/* Global NOVA AI Assistant */}
      <NovaFloatingButton />
    </div>
  );
};
export default PublicLayout;
