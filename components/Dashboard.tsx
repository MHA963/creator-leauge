
import React, { useState } from 'react';
import { Challenge, Submission, User, ChallengeStatus } from '../types';
import { Card } from './ui/Card';
import { Calendar, Video, Upload, Wand2, Loader2, CheckCircle2, Trash2, Plus, ShieldAlert, Clock, Edit } from 'lucide-react';

interface DashboardProps {
  activeChallenge: Challenge;
  currentUser: User;
  submission?: Submission;
  onUpload: (tiktokUrl: string, description: string) => void;
  // Admin Props
  challenges?: Challenge[];
  onCreateChallenge?: (challenge: Challenge) => void;
  onEditChallenge?: (challenge: Challenge) => void;
  onDeleteChallenge?: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  activeChallenge, 
  currentUser, 
  submission, 
  onUpload,
  challenges,
  onCreateChallenge,
  onEditChallenge,
  onDeleteChallenge
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // Admin State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newChallenge, setNewChallenge] = useState<Partial<Challenge>>({
    title: '', 
    description: '', 
    status: 'upcoming', 
    week_number: 1, 
    rules: [''],
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });;

  // --- Handlers ---

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      onUpload(url, description);
      setIsUploading(false);
    }, 800);
  };


  const startEdit = (challenge: Challenge) => {
    setNewChallenge({
        ...challenge
    });
    setEditingId(challenge.id);
    setShowCreateForm(true);
  };

  const handleCreateSubmit = () => {
    if (!newChallenge.title || !newChallenge.week_number) return;
    
    const challengeData: Challenge = {
        id: editingId || `c-${Date.now()}`,
        competition_id: activeChallenge.competition_id,
        title: newChallenge.title || 'Untitled',
        description: newChallenge.description || '',
        week_number: newChallenge.week_number || 1,
        start_date: newChallenge.start_date || new Date().toISOString().split('T')[0],
        end_date: newChallenge.end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: newChallenge.status as ChallengeStatus || 'upcoming',
        rules: newChallenge.rules || [],
        criteria: newChallenge.criteria || []
    };

    if (editingId && onEditChallenge) {
        onEditChallenge(challengeData);
    } else if (onCreateChallenge) {
        onCreateChallenge(challengeData);
    }

    setShowCreateForm(false);
    setEditingId(null);
    // Reset with intelligent defaults
    const nextWeek = (challenges?.length || 0) + 1;
    setNewChallenge({ 
        title: '', 
        description: '', 
        status: 'upcoming', 
        week_number: nextWeek, 
        rules: [''],
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const handleCancelEdit = () => {
    setShowCreateForm(false);
    setEditingId(null);
    setNewChallenge({ 
        title: '', 
        description: '', 
        status: 'upcoming', 
        week_number: (challenges?.length || 0) + 1, 
        rules: [''],
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }

  // --- Render: Admin View ---
  if (currentUser.id === '3mmo') {
    return (
        <div className="space-y-8">
            <Card title="Admin Control Panel - Manage Challenges">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center text-red-400">
                        <ShieldAlert className="w-5 h-5 mr-2" />
                        <span className="font-bold">Authenticated as Host (3mmo)</span>
                    </div>
                    <button 
                        onClick={() => { setEditingId(null); setShowCreateForm(!showCreateForm); }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Challenge
                    </button>
                </div>

                {showCreateForm && (
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 animate-in fade-in slide-in-from-top-4">
                        <h3 className="font-bold text-white mb-4">{editingId ? 'Edit Challenge' : 'New Challenge Details'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Week #</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    value={newChallenge.week_number}
                                    onChange={e => setNewChallenge({...newChallenge, week_number: Number(e.target.value)})}
                                    title="Edit week number"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Status</label>
                                <select 
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    value={newChallenge.status}
                                    onChange={e => setNewChallenge({...newChallenge, status: e.target.value as ChallengeStatus})}
                                    title="Edit status"
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="active">Active</option>
                                    <option value="rating">Rating</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Start Date</label>
                                <input 
                                    type="date" 
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    value={newChallenge.start_date}
                                    onChange={e => setNewChallenge({...newChallenge, start_date: e.target.value})}
                                    title="Edit start date"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">End Date</label>
                                <input 
                                    type="date" 
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    value={newChallenge.end_date}
                                    onChange={e => setNewChallenge({...newChallenge, end_date: e.target.value})}
                                    title="Edit end date"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs text-slate-400 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    value={newChallenge.title}
                                    onChange={e => setNewChallenge({...newChallenge, title: e.target.value})}
                                    title="Edit title"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs text-slate-400 mb-1">Description</label>
                                <textarea 
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    rows={3}
                                    value={newChallenge.description}
                                    onChange={e => setNewChallenge({...newChallenge, description: e.target.value})}
                                    title="Edit description"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={handleCancelEdit} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                            <button onClick={handleCreateSubmit} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold">
                                {editingId ? 'Update Challenge' : 'Save Challenge'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {challenges?.map(challenge => (
                        <div key={challenge.id} className="flex items-center justify-between bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded text-slate-300">Week {challenge.week_number}</span>
                                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${challenge.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-slate-900 text-slate-500'}`}>{challenge.status}</span>
                                </div>
                                <h4 className="font-bold text-lg text-white">{challenge.title}</h4>
                                <p className="text-sm text-slate-400 mb-2">{challenge.description}</p>
                                <div className="flex items-center text-xs text-slate-500 space-x-4">
                                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {challenge.start_date}</span>
                                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {challenge.end_date}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button 
                                    onClick={() => startEdit(challenge)}
                                    className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-full transition-colors"
                                    title="Edit Challenge"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => onDeleteChallenge && onDeleteChallenge(challenge.id)}
                                    className="p-2 text-red-400 hover:bg-red-900/20 rounded-full transition-colors ml-2"
                                    title="Delete Challenge"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
  }

  // --- Render: Participant View (Default) ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Active Challenge Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900 to-purple-900 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
            <div className="relative p-8">
                <div className="flex items-center space-x-2 text-indigo-200 mb-2 font-medium uppercase tracking-widest text-xs">
                    <Calendar className="w-4 h-4" />
                    <span>Week {activeChallenge.week_number} Challenge</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{activeChallenge.title}</h1>
                <p className="text-indigo-100 text-lg mb-6 max-w-xl">{activeChallenge.description}</p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">Rules:</h3>
                    <ul className="list-disc list-inside text-indigo-100 space-y-1">
                        {activeChallenge.rules && activeChallenge.rules.map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Submission Status */}
        {submission ? (
            <Card title="Your Submission" className="border-green-500/30 bg-green-900/10">
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Uploaded Successfully</h3>
                        <p className="text-slate-400 mb-2">You've submitted for this week. Good luck!</p>
                        <p className="text-sm text-slate-500 italic">"{submission.note}"</p>
                    </div>
                </div>
            </Card>
        ) : (
            <Card title="Submit Your Video">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">TikTok URL</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-700 bg-slate-800 text-slate-400 text-sm">
                                <Video className="w-4 h-4" />
                            </span>
                            <input 
                                type="text" 
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://tiktok.com/@user/video..." 
                                className="flex-1 block w-full rounded-none rounded-r-md bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 placeholder-slate-600"
                            />
                        </div>
                    </div>
                    
                    <div>
                         <label className="block text-sm font-medium text-slate-300 mb-1">Description (for the Judge)</label>
                         <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block w-full rounded-md bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
                            rows={2}
                            placeholder="Describe your edit briefly..."
                         />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            onClick={handleUpload}
                            disabled={!url || isUploading}
                            className="flex-1 flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? 'Uploading...' : 'Submit Entry'} <Upload className="ml-2 w-4 h-4" />
                        </button>
                        
                    </div>
                </div>
            </Card>
        )}
      </div>

      {/* Sidebar / AI Coach */}
      <div className="space-y-6">
         <Card title="AI Coach" className="border-indigo-500/20 bg-gradient-to-b from-slate-900 to-indigo-950/30">
            <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                        <Wand2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Editing Tips</h4>
                        <p className="text-xs text-indigo-300">Powered by Gemini</p>
                    </div>
                </div>
                
                
            </div>
         </Card>

         <Card title="Week Schedule">
            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Submission Phase</span>
                    <span className="text-green-400 font-mono">{activeChallenge.start_date}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="flex items-center justify-between text-sm mt-4">
                    <span className="text-slate-400">Deadline</span>
                    <span className="text-red-400 font-mono">{activeChallenge.end_date}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center border-t border-slate-800 pt-2">Timeline managed by Admin</p>
            </div>
         </Card>
      </div>
    </div>
  );
};
