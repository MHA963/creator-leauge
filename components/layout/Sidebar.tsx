import React from 'react';
import { LogOut, Home, Trophy, Target, BarChart3, User, Settings } from 'lucide-react';
import { User as UserType } from '../../types';
import { ViewType } from '../../services/useAppState';

interface SidebarProps {
  currentUser: UserType | null;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  adminOnly?: boolean;
  currentUserRole?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick, adminOnly = false, currentUserRole }) => {
  if (adminOnly && currentUserRole !== 'leader') return null;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onLogout,
  isOpen = true,
  onClose
}) => {
  if (!isOpen && onClose) {
    return null;
  }

  return (
    <div className="w-64 bg-gray-800 text-white p-4 space-y-4 flex flex-col h-screen md:relative fixed md:w-64 z-40">
      {/* User Profile */}
      {currentUser && (
        <div className="pb-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.username} className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold text-sm">{currentUser.username}</p>
              <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        <SidebarItem
          icon={<Home size={20} />}
          label="Home"
          isActive={currentView === 'home'}
          onClick={() => onNavigate('home')}
          currentUserRole={currentUser?.role}
        />
        <SidebarItem
          icon={<Trophy size={20} />}
          label="Competitions"
          isActive={currentView === 'competition'}
          onClick={() => onNavigate('competition')}
          currentUserRole={currentUser?.role}
        />
        <SidebarItem
          icon={<Target size={20} />}
          label="Challenges"
          isActive={currentView === 'challenge'}
          onClick={() => onNavigate('challenge')}
          currentUserRole={currentUser?.role}
        />
        <SidebarItem
          icon={<BarChart3 size={20} />}
          label="Leaderboard"
          isActive={currentView === 'leaderboard'}
          onClick={() => onNavigate('leaderboard')}
          currentUserRole={currentUser?.role}
        />
        <SidebarItem
          icon={<User size={20} />}
          label="Profile"
          isActive={currentView === 'profile'}
          onClick={() => onNavigate('profile')}
          currentUserRole={currentUser?.role}
        />
        <SidebarItem
          icon={<Settings size={20} />}
          label="Manage Players"
          isActive={currentView === 'admin-users'}
          onClick={() => onNavigate('admin-users')}
          adminOnly={true}
          currentUserRole={currentUser?.role}
        />
      </nav>

      {/* Logout Button */}
      {currentUser && (
        <button
          onClick={onLogout}
          className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-3 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      )}
    </div>
  );
};
