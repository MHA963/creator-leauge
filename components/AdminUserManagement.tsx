import React, { useState } from 'react';
import { User } from '../types';
import { Card } from './ui/Card';
import { Plus, Copy, Check, Trash2, Edit2, X } from 'lucide-react';

interface AdminUserManagementProps {
  users: User[];
  onCreateUser?: (username: string, password: string) => void;
  onDeleteUser?: (userId: string) => void;
  onEditUser?: (userId: string, username: string) => void;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ 
  users, 
  onCreateUser,
  onDeleteUser,
  onEditUser 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState('');

  const handleCreate = () => {
    if (!username.trim() || !password.trim()) return;
    
    if (onCreateUser) {
      onCreateUser(username, password);
    }
    
    setUsername('');
    setPassword('');
    setShowForm(false);
  };

  const handleEditSubmit = (userId: string) => {
    if (!editUsername.trim()) return;
    
    if (onEditUser) {
      onEditUser(userId, editUsername);
    }
    
    setEditingId(null);
    setEditUsername('');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const displayUsers = users.filter(u => u.role === 'player');

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <Card title="Manage Player Accounts">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-black text-indigo-400">{displayUsers.length}</div>
            <span className="text-slate-400">Player Accounts</span>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center font-bold transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Player
          </button>
        </div>

        {showForm && (
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6 animate-in fade-in slide-in-from-top-4">
            <h3 className="font-bold text-white mb-4">Create New Player Account</h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-xs text-slate-400 mb-2">Username</label>
                <input 
                  type="text" 
                  placeholder="Enter username"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={15}
                />
                <p className="text-xs text-slate-500 mt-1">{username.length}/15 characters</p>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2">Password</label>
                <input 
                  type="password" 
                  placeholder="Enter password"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowForm(false);
                  setUsername('');
                  setPassword('');
                }}
                className="flex-1 px-4 py-2 text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                disabled={!username.trim() || !password.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {displayUsers.length > 0 ? (
          <div className="space-y-3">
            {displayUsers.map(user => (
              <div key={user.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                {editingId === user.id ? (
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full flex-shrink-0" />
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm"
                        maxLength={15}
                        title="Edit username"
                      />
                      <button
                        onClick={() => handleEditSubmit(user.id)}
                        disabled={!editUsername.trim()}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded font-bold text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditUsername('');
                        }}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm"
                        title="Cancel edit"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full flex-shrink-0" />
                      <div>
                        <div className="text-white font-mono font-bold">{user.username}</div>
                        <div className="text-xs text-slate-500">Password: {user.password || '••••••'}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingId(user.id);
                          setEditUsername(user.username);
                        }}
                        className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit username"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(`${user.username}:${user.password}`, user.id)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="Copy credentials"
                      >
                        {copiedId === user.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete user "${user.username}"?`)) {
                            onDeleteUser && onDeleteUser(user.id);
                          }
                        }}
                        className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
            <div className="text-3xl mb-2">👥</div>
            <p>No player accounts created yet.</p>
            <p className="text-xs mt-1">Create one to get started!</p>
          </div>
        )}
      </Card>
    </div>
  );
};
