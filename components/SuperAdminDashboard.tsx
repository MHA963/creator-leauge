import React, { useState } from 'react';
import { Users, Activity, Zap, Trash2, Edit2, BarChart3, LogOut, Shield, Calendar } from 'lucide-react';
import { User, Competition, Submission, Rating } from '../types';
import { Card } from './ui/Card';

interface SuperAdminDashboardProps {
  users: User[];
  competitions: Competition[];
  submissions: Submission[];
  ratings: Rating[];
  currentUser: User;
  onDeleteUser: (userId: string) => void;
  onLogout: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  users,
  competitions,
  submissions,
  ratings,
  currentUser,
  onDeleteUser,
  onLogout,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    totalAdmins: users.filter(u => u.role === 'leader').length,
    totalPlayers: users.filter(u => u.role === 'player').length,
    totalCompetitions: competitions.length,
    activeCompetitions: competitions.filter(c => c.status === 'active').length,
    totalSubmissions: submissions.length,
    totalRatings: ratings.length,
  };

  // Get recent logins (users with lastLogin)
  const recentLogins = users
    .filter(u => u.lastLogin)
    .sort((a, b) => new Date(b.lastLogin || '').getTime() - new Date(a.lastLogin || '').getTime())
    .slice(0, 5);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Group users by game
  const usersByGame = users.reduce((acc, user) => {
    const gameId = user.gameId || 'global';
    const gameName = user.gameName || 'Default Game';
    if (!acc[gameId]) {
      acc[gameId] = {
        gameId,
        gameName,
        admins: [] as User[],
        players: [] as User[]
      };
    }
    if (user.role === 'leader') {
      acc[gameId].admins.push(user);
    } else if (user.role === 'player') {
      acc[gameId].players.push(user);
    }
    return acc;
  }, {} as Record<string, { gameId: string; gameName: string; admins: User[]; players: User[] }>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-gray-300 text-sm">System Analytics & User Management</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Admin Info Card */}
      <Card className="mb-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400 text-sm">Administrator</p>
            <p className="text-white text-lg font-semibold">{currentUser.username}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Account Created</p>
            <p className="text-white text-lg font-semibold">{formatDate(currentUser.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Last Login</p>
            <p className="text-white text-lg font-semibold">{formatDate(currentUser.lastLogin)}</p>
          </div>
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-500/20 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-white text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-green-500/20 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Admin Accounts</p>
              <p className="text-white text-2xl font-bold">{stats.totalAdmins}</p>
            </div>
            <Shield className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="bg-purple-500/20 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Player Accounts</p>
              <p className="text-white text-2xl font-bold">{stats.totalPlayers}</p>
            </div>
            <Zap className="w-8 h-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-orange-500/20 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Competitions</p>
              <p className="text-white text-2xl font-bold">{stats.activeCompetitions}/{stats.totalCompetitions}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-400" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Activity */}
        <Card className="lg:col-span-1 bg-slate-800/50 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Activity
          </h2>
          <div className="space-y-3">
            <div className="bg-slate-700/50 p-3 rounded">
              <p className="text-gray-400 text-sm">Total Submissions</p>
              <p className="text-white font-semibold">{stats.totalSubmissions}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <p className="text-gray-400 text-sm">Total Ratings</p>
              <p className="text-white font-semibold">{stats.totalRatings}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <p className="text-gray-400 text-sm">Competitions</p>
              <p className="text-white font-semibold">{stats.totalCompetitions}</p>
            </div>
          </div>
        </Card>

        {/* Recent Logins */}
        <Card className="lg:col-span-2 bg-slate-800/50 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Logins
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentLogins.length > 0 ? (
              recentLogins.map(user => (
                <div key={user.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-white text-sm font-medium">{user.username}</p>
                      <p className="text-gray-400 text-xs capitalize">{user.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">{formatDate(user.lastLogin)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No recent logins</p>
            )}
          </div>
        </Card>
      </div>

      {/* User Management */}
      <Card className="mt-6 bg-slate-800/50 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-6">Games & Users</h2>
        
        {Object.values(usersByGame).length === 0 ? (
          <p className="text-gray-400 text-center py-8">No games created yet</p>
        ) : (
          <div className="space-y-6">
            {Object.values(usersByGame).map((game: any) => (
              <div key={game.gameId} className="border border-slate-600 rounded-lg overflow-hidden">
                {/* Game Header */}
                <div className="bg-slate-700/50 px-4 py-3 border-b border-slate-600">
                  <h3 className="text-white font-semibold text-lg">{game.gameName}</h3>
                  <p className="text-gray-400 text-xs">ID: {game.gameId}</p>
                </div>

                {/* Admins Section */}
                {game.admins.length > 0 && (
                  <div className="px-4 py-3 border-b border-slate-600 bg-slate-800/20">
                    <p className="text-green-400 font-semibold text-sm mb-3">Admins ({game.admins.length})</p>
                    <div className="space-y-2">
                      {game.admins.map(user => (
                        <div key={user.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded">
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-white text-sm font-medium">{user.username}</p>
                              <p className="text-gray-400 text-xs">Level {user.level} • {formatDate(user.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/30 text-green-200">Admin</span>
                            {user.role !== 'super-admin' && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete admin "${user.username}"? This will remove all their data.`)) {
                                    onDeleteUser(user.id);
                                  }
                                }}
                                className="text-red-400 hover:text-red-300 transition"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Players Section */}
                {game.players.length > 0 && (
                  <div className="px-4 py-3 bg-slate-800/20">
                    <p className="text-blue-400 font-semibold text-sm mb-3">Players ({game.players.length})</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {game.players.map(user => (
                        <div key={user.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded">
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-white text-sm font-medium">{user.username}</p>
                              <p className="text-gray-400 text-xs">Level {user.level} • {formatDate(user.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/30 text-blue-200">Player</span>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete player "${user.username}"? This will remove all their data.`)) {
                                  onDeleteUser(user.id);
                                }
                              }}
                              className="text-red-400 hover:text-red-300 transition"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {game.admins.length === 0 && game.players.length === 0 && (
                  <div className="px-4 py-3 text-gray-400 text-center text-sm">
                    No users in this game
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
