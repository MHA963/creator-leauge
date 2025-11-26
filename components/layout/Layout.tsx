import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavBar } from './MobileNavBar';
import { User as UserType } from '../../types';
import { ViewType } from '../../services/useAppState';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: UserType | null;
  currentView: ViewType;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
  isMobile: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentUser,
  currentView,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onNavigate,
  onLogout,
  isMobile
}) => {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          currentUser={currentUser}
          currentView={currentView}
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={true}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50" onClick={onToggleMobileMenu}>
          <div onClick={(e) => e.stopPropagation()}>
            <Sidebar
              currentUser={currentUser}
              currentView={currentView}
              onNavigate={onNavigate}
              onLogout={onLogout}
              isOpen={isMobileMenuOpen}
              onClose={onToggleMobileMenu}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <MobileNavBar
          currentUser={currentUser}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMenu={onToggleMobileMenu}
        />
        <main className="flex-1 overflow-auto bg-gray-900 text-white">
          {children}
        </main>
      </div>
    </div>
  );
};
