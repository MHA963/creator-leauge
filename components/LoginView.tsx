
import React, { useState } from 'react';
import { Activity, Lock, User, Plus, X, CheckCircle2, Users, Trophy } from 'lucide-react';

interface LoginViewProps {
  onLogin: (username: string, pass: string) => void;
  onNewGame: (username: string, password: string, gameName: string) => void;
  error?: string;
  isNewGame?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNewGame, error, isNewGame = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gameName, setGameName] = useState('');
  const [showNewGame, setShowNewGame] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showNewGame) {
      // Show confirmation modal instead of immediately creating
      setShowConfirmation(true);
    } else {
      onLogin(username, password);
    }
  };

  const handleConfirmNewGame = () => {
    onNewGame(username, password, gameName);
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30">
                <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{showNewGame ? 'Create New Game' : 'Welcome Back'}</h1>
            <p className="text-slate-400">
              {showNewGame 
                ? 'Set up your first admin account' 
                : 'Enter your credentials to access Creator League'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent p-2.5 transition-all"
                        placeholder="Enter username"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent p-2.5 transition-all"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>

            {showNewGame && (
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Game Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Trophy className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="text"
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                            className="block w-full pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent p-2.5 transition-all"
                            placeholder="Enter your game name"
                            required
                        />
                    </div>
                </div>
            )}

            <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
            >
                {showNewGame ? 'Create Game & Admin Account' : 'Sign In'}
            </button>
        </form>
        
        <div className="mt-6 space-y-3">
          <button
              onClick={() => setShowNewGame(!showNewGame)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
              <Plus className="w-4 h-4" />
              {showNewGame ? 'Back to Login' : 'New Game'}
          </button>
          <div className="text-center text-xs text-slate-600">
              {showNewGame 
                ? 'You\'ll be the admin and can manage players after setup' 
                : 'Demo: "3mmo" (admin) or "ShadowBlade" (player)'}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Start New Game</h2>
              <button
                onClick={() => setShowConfirmation(false)}
                className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-slate-300 text-sm">
                You're about to create a fresh game. Here's what you can do:
              </p>

              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">Manage Players</p>
                    <p className="text-xs text-slate-400">Go to the Manage Players tab to create player profiles and assign roles</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">Create Competitions</p>
                    <p className="text-xs text-slate-400">On the home page, click Add Competition to create new competitions with themes and prizes</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">Add Challenges</p>
                    <p className="text-xs text-slate-400">Inside competitions, create weekly challenges with criteria and rules</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleConfirmNewGame}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
              >
                Confirm & Create Game
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setShowNewGame(false);
                  setUsername('');
                  setPassword('');
                  setGameName('');
                }}
                className="w-full py-2 px-4 border border-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
