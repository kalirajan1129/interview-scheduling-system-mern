import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-950">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-950/40 via-surface-950 to-surface-950 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <Navbar />
        <main className="animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
