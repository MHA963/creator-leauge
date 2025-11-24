
import React, { useState } from 'react';
import { Competition, User, Challenge } from '../types';
import { Zap, Trophy, ArrowRight, Plus, Crown, ShieldCheck, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

interface HomeViewProps {
  user: User;
  competitions: Competition[];
  activeChallenges: Challenge[];
  onSelectCompetition: (id: string) => void;
  onCreateCompetition?: (comp: Competition) => void;
  onEditCompetition?: (comp: Competition) => void;
  onDeleteCompetition?: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  user, 
  competitions, 
  activeChallenges, 
  onSelectCompetition,
  onCreateCompetition,
  onEditCompetition,
  onDeleteCompetition
}) => {
  
  const isAdmin = user.role === 'leader';
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Competition>>({
      title: '',
      description: '',
      prize_pool: '',
      start_date: '',
      end_date: '',
      status: 'upcoming',
      theme_color: 'from-indigo-600 to-purple-600',
      background_image: ''
  });

  const handleOpenCreate = () => {
      setEditingId(null);
      setFormData({
          title: '',
          description: '',
          prize_pool: '',
          start_date: '',
          end_date: '',
          status: 'upcoming',
          theme_color: 'from-indigo-600 to-purple-600',
          background_image: ''
      });
      setShowModal(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, comp: Competition) => {
      e.stopPropagation();
      setEditingId(comp.id);
      setFormData({
          ...comp
      });
      setShowModal(true);
  };

  const handleSave = () => {
      if (editingId && onEditCompetition) {
          onEditCompetition({
              ...formData,
              id: editingId,
          } as Competition);
      } else if (onCreateCompetition) {
          onCreateCompetition({
              id: `comp-${Date.now()}`,
              title: formData.title || 'New Competition',
              description: formData.description || '',
              status: formData.status || 'upcoming',
              start_date: formData.start_date || '',
              end_date: formData.end_date || '',
              theme_color: formData.theme_color || 'from-indigo-600 to-purple-600',
              prize_pool: formData.prize_pool || '',
              background_image: formData.background_image || ''
          } as Competition);
      }
      setShowModal(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (onDeleteCompetition) onDeleteCompetition(id);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Fun Welcome Banner */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 rounded-3xl shadow-2xl overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-2">
                <div className="inline-block px-3 py-1 bg-black/30 backdrop-blur-md rounded-full text-xs font-bold text-yellow-400 border border-yellow-400/30 mb-2">
                    <Zap className="w-3 h-3 inline mr-1 fill-current" /> DAILY STREAK: 5 DAYS
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-md">
                    Hey, {user.username}! 👋
                </h1>
                <p className="text-indigo-100 text-lg font-medium max-w-md">
                    {isAdmin ? 'Ready to manage the guild today?' : 'Your creative journey is leveling up. Check your new missions!'}
                </p>
                
                {/* XP Bar for Fun */}
                {!isAdmin && (
                    <div className="mt-4 max-w-xs mx-auto md:mx-0">
                        <div className="flex justify-between text-xs font-bold text-indigo-200 mb-1">
                            <span>Lvl {user.level}</span>
                            <span>Lvl {user.level + 1}</span>
                        </div>
                        <div className="h-3 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-[70%] relative">
                                 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-50"></div>
                            </div>
                        </div>
                        <div className="text-right text-[10px] text-indigo-300 mt-1">{user.xp} / {(user.level + 1) * 500} XP</div>
                    </div>
                )}
            </div>

            <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="relative w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl transform group-hover:scale-105 transition-transform duration-300 bg-slate-900 object-cover" 
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black font-black text-xs w-8 h-8 flex items-center justify-center rounded-full border-4 border-purple-600 z-20">
                    {user.level}
                </div>
            </div>
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
          <div className="flex justify-end">
               <button 
                onClick={handleOpenCreate}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
               >
                   <Plus className="w-5 h-5 mr-2" /> Create New Competition
               </button>
          </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full max-w-2xl animate-in fade-in zoom-in duration-200 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white mb-4">{editingId ? 'Edit Competition' : 'Launch New Competition'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-400 uppercase font-bold">Title</label>
                        <input 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-indigo-500 outline-none"
                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Status</label>
                        <select 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-indigo-500 outline-none"
                            value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Prize Pool</label>
                        <input 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-indigo-500 outline-none"
                            value={formData.prize_pool} onChange={e => setFormData({...formData, prize_pool: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Start Date</label>
                        <input 
                            type="date"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-indigo-500 outline-none"
                            value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">End Date</label>
                        <input 
                            type="date"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-indigo-500 outline-none"
                            value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-400 uppercase font-bold">Description</label>
                        <textarea 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-indigo-500 outline-none"
                            rows={3}
                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-2">
                             <ImageIcon className="w-3 h-3" /> Background Image URL
                        </label>
                        <input 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-indigo-500 outline-none placeholder-slate-600"
                            placeholder="https://images.unsplash.com/..."
                            value={formData.background_image} onChange={e => setFormData({...formData, background_image: e.target.value})}
                        />
                        {formData.background_image && (
                             <div className="mt-2 h-20 w-full rounded-lg overflow-hidden relative border border-slate-700">
                                 <img src={formData.background_image} alt="Preview" className="w-full h-full object-cover opacity-50" />
                                 <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold shadow-black">Preview</div>
                             </div>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-400 uppercase font-bold">Theme (CSS Gradient)</label>
                        <input 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-indigo-500 outline-none"
                            placeholder="from-indigo-600 to-purple-600"
                            value={formData.theme_color} onChange={e => setFormData({...formData, theme_color: e.target.value})}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 border-t border-slate-700 pt-4">
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white px-4 py-2 font-medium">Cancel</button>
                    <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-green-600/20">
                        {editingId ? 'Save Changes' : 'Launch Competition'}
                    </button>
                </div>
            </div>
          </div>
      )}

      {/* Competitions Grid */}
      <div>
          <div className="flex items-center gap-2 mb-6">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Monthly Leagues</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {competitions.map((comp, idx) => (
                 <div 
                    key={comp.id} 
                    className="relative group cursor-pointer transition-all hover:transform hover:scale-[1.02] overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 hover:border-indigo-500/50 h-full"
                    onClick={() => onSelectCompetition(comp.id)}
                 >
                    {/* Background Image with 40% Opacity */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={comp.background_image || (idx % 2 === 0 
                                ? "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80" 
                                : "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"
                            )}
                            alt="Background" 
                            className="w-full h-full object-cover opacity-40 grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" 
                        />
                        {/* Gradient Overlay to ensure text pop */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${comp.theme_color} opacity-30 mix-blend-overlay`}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/50"></div>
                    </div>

                    <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-lg ${comp.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-800/60 text-slate-400 border-slate-700'}`}>
                                    {comp.status}
                                </span>
                                
                                {/* Admin Actions */}
                                {isAdmin && (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => handleOpenEdit(e, comp)}
                                            className="p-2 text-blue-400 hover:bg-blue-900/50 rounded-lg transition-colors bg-black/50 backdrop-blur-md"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDelete(e, comp.id)}
                                            className="p-2 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors bg-black/50 backdrop-blur-md"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                
                                {!isAdmin && (
                                    <span className="text-xs text-slate-300 font-mono bg-black/40 backdrop-blur-sm px-2 py-1 rounded border border-white/5">{comp.start_date} — {comp.end_date}</span>
                                )}
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{comp.title}</h3>
                            <p className="text-slate-200 text-sm leading-relaxed drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] font-medium">{comp.description}</p>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                            <div className="text-sm font-bold text-yellow-400 flex items-center gap-2 drop-shadow-md">
                                <Trophy className="w-4 h-4" />
                                {comp.prize_pool}
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full group-hover:bg-indigo-500 transition-colors border border-white/10">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                 </div>
             ))}
          </div>
      </div>

    </div>
  );
};
