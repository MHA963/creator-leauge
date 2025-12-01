
import React, { useState } from 'react';
import { Competition, Challenge, User, ChallengeStatus } from '../types';
import { Calendar, Trophy, Plus, Lock, ArrowRight, CheckCircle2, Zap, PlayCircle, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

interface CompetitionDetailProps {
  competition: Competition;
  challenges: Challenge[];
  user: User;
  onSelectChallenge: (id: string) => void;
  onAddChallenge?: (challenge: Challenge) => void;
  onEditChallenge?: (challenge: Challenge) => void;
  onDeleteChallenge?: (id: string) => void;
}

export const CompetitionDetail: React.FC<CompetitionDetailProps> = ({
  competition,
  challenges,
  user,
  onSelectChallenge,
  onAddChallenge,
  onEditChallenge,
  onDeleteChallenge
}) => {
  
  const isAdmin = user.role === 'leader';
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Challenge>>({
      title: '',
      description: '',
      week_number: (challenges.length || 0) + 1,
      status: 'active',
      criteria: ['Creativity', 'Technique', 'Impact'],
      targets: ['', '', ''],
      rules: [''],
      max_submissions: 1,
      background_image: ''
  });

  const handleOpenCreate = () => {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        week_number: (challenges.length || 0) + 1,
        status: 'active',
        criteria: ['Creativity', 'Technique', 'Impact'],
        targets: ['', '', ''],
        rules: [''],
        max_submissions: 1,
        background_image: ''
      });
      setShowForm(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, challenge: Challenge) => {
      e.stopPropagation();
      setEditingId(challenge.id);
      setFormData({ ...challenge });
      setShowForm(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (onDeleteChallenge) onDeleteChallenge(id);
  };

  const handleSave = () => {
      if (editingId && onEditChallenge) {
          onEditChallenge({
              ...formData,
              id: editingId,
              competition_id: competition.id,
          } as Challenge);
      } else if (onAddChallenge) {
          onAddChallenge({
              ...formData,
              id: `c-${Date.now()}`,
              competition_id: competition.id,
              week_number: formData.week_number || 1,
              status: formData.status || 'active',
              criteria: formData.criteria || [],
              rules: formData.rules || []
          } as Challenge);
      }
      setShowForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
        
        {/* Header */}
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${competition.theme_color} p-8 md:p-12 shadow-2xl`}>
             {/* Use competition background if available, else pattern */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                {competition.background_image ? (
                    <>
                        <img src={competition.background_image} className="w-full h-full object-cover opacity-30" alt="bg" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                    </>
                ) : (
                    <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                )}
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest mb-2">
                    <Calendar className="w-4 h-4" /> Monthly League
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">{competition.title}</h1>
                <p className="text-white/90 text-lg max-w-2xl drop-shadow-md">{competition.description}</p>
                
                <div className="mt-8 flex flex-wrap gap-4">
                    <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-3 text-white border border-white/10">
                        <div className="p-1 bg-yellow-500 rounded-lg text-black">
                            <Trophy className="w-4 h-4" />
                        </div>
                        <span className="font-bold">{competition.prize_pool}</span>
                    </div>
                    <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-2 text-white/80 border border-white/10 font-mono text-sm flex items-center">
                        {competition.start_date} — {competition.end_date}
                    </div>
                </div>
            </div>
        </div>

        {/* Challenges Section */}
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Weekly Challenges</h2>
                {isAdmin && (
                    <button 
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Challenge
                    </button>
                )}
            </div>

            {/* Admin Add/Edit Form */}
            {showForm && (
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 animate-in slide-in-from-top-2 shadow-xl">
                    <h4 className="font-bold text-white mb-4">{editingId ? 'Edit Challenge' : 'Add Challenge'}</h4>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4 flex-wrap">
                            <div className="w-24">
                                <label className="text-xs text-slate-500 mb-1 block">Week #</label>
                                <input 
                                    type="number"
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                                    value={formData.week_number} onChange={e => setFormData({...formData, week_number: Number(e.target.value)})}
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-xs text-slate-500 mb-1 block">Title</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div className="w-32">
                                <label className="text-xs text-slate-500 mb-1 block">Status</label>
                                <select 
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                                    value={formData.status} 
                                    onChange={e => setFormData({...formData, status: e.target.value as ChallengeStatus})}
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="active">Active</option>
                                    <option value="rating">Rating</option>
                                    <option value="locked">Locked</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="w-32">
                                <label className="text-xs text-slate-500 mb-1 block">Max Entries</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                                    value={formData.max_submissions || 1}
                                    onChange={e => setFormData({...formData, max_submissions: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 mb-1 block">Description</label>
                            <textarea 
                                rows={3}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs text-slate-500 mb-2 block">Targets (3 Checkpoint Points)</label>
                            <div className="space-y-2">
                                {(formData.targets || ['', '', '']).map((target, idx) => (
                                    <input 
                                        key={idx}
                                        type="text" 
                                        placeholder={`Target ${idx + 1} - What should creators focus on?`}
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none text-sm"
                                        value={target || ''} 
                                        onChange={e => {
                                            const newTargets = [...(formData.targets || ['', '', ''])];
                                            newTargets[idx] = e.target.value;
                                            setFormData({...formData, targets: newTargets});
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-500 mb-1 block">Background Image URL (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="https://..."
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                                value={formData.background_image || ''} 
                                onChange={e => setFormData({...formData, background_image: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                             <button onClick={() => setShowForm(false)} className="text-slate-400 px-4 hover:text-white">Cancel</button>
                             <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded font-bold">
                                 {editingId ? 'Save Changes' : 'Create'}
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {challenges.map((challenge, idx) => {
                    const isLocked = challenge.status === 'locked' && !isAdmin;
                    return (
                        <div 
                            key={challenge.id}
                            onClick={() => !isLocked && onSelectChallenge(challenge.id)}
                            className={`relative flex items-center p-6 rounded-2xl border transition-all overflow-hidden group ${
                                isLocked 
                                ? 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed' 
                                : 'bg-slate-900 border-slate-700 hover:border-indigo-500 cursor-pointer hover:shadow-xl hover:scale-[1.01]'
                            }`}
                        >
                            {/* Background Texture/Image */}
                            <div className="absolute inset-0 pointer-events-none z-0">
                                {challenge.background_image ? (
                                    <img 
                                        src={challenge.background_image} 
                                        alt="Challenge BG" 
                                        className="w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                )}
                                {/* Gradient overlay for text legibility */}
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900/60"></div>
                            </div>

                            {/* Left Status Indicator */}
                            <div className="relative z-10 mr-6 flex flex-col items-center min-w-[3rem]">
                                <span className="text-xs font-bold text-slate-500 uppercase mb-1">Week</span>
                                <span className="text-3xl font-black text-white">{challenge.week_number}</span>
                            </div>

                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold text-white drop-shadow-md">{challenge.title}</h3>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm ${
                                        challenge.status === 'active' ? 'bg-green-900 text-green-400 ring-1 ring-green-500/30' :
                                        challenge.status === 'rating' ? 'bg-yellow-900 text-yellow-400 ring-1 ring-yellow-500/30' :
                                        'bg-slate-800 text-slate-500'
                                    }`}>
                                        {challenge.status}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm drop-shadow-sm max-w-2xl">{challenge.description}</p>
                            </div>

                            {/* Actions (Admin) or Status (User) */}
                            <div className="relative z-10 ml-4 flex items-center gap-3">
                                {isAdmin ? (
                                    <>
                                        <button 
                                            onClick={(e) => handleOpenEdit(e, challenge)}
                                            className="p-2 text-blue-400 hover:bg-blue-900/50 rounded-lg transition-colors z-10 bg-black/30 backdrop-blur-sm"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDelete(e, challenge.id)}
                                            className="p-2 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors z-10 bg-black/30 backdrop-blur-sm"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    isLocked ? (
                                        <Lock className="w-6 h-6 text-slate-600" />
                                    ) : (
                                        <div className="bg-indigo-600 p-2 rounded-full text-white shadow-lg shadow-indigo-600/20 group-hover:bg-indigo-500 group-hover:scale-110 transition-all">
                                            <PlayCircle className="w-6 h-6" />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
                {challenges.length === 0 && (
                    <div className="text-center p-12 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-slate-500">
                        No challenges added to this league yet.
                    </div>
                )}
            </div>
        </div>

    </div>
  );
};
