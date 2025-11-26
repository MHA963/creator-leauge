import React from 'react';
import { Menu, X } from 'lucide-react';
import { User as UserType } from '../../types';

interface MobileNavBarProps {
  currentUser: UserType | null;
  isMobileMenuOpen: boolean;
  onToggleMenu: () => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  currentUser,
  isMobileMenuOpen,
  onToggleMenu
}) => {
  return (
    <div className="md:hidden bg-gray-800 text-white p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {currentUser && (
          <>
            <img src={currentUser.avatar} alt={currentUser.username} className="w-10 h-10 rounded-full" />
            <span className="font-semibold text-sm">{currentUser.username}</span>
          </>
        )}
      </div>
      <button
        onClick={onToggleMenu}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};
