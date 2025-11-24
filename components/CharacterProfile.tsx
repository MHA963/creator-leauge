
import React, { useState } from 'react';
import { User, Submission, Rating, Competition, Challenge } from '../types';
import { calculatePlayerScore } from '../services/scoring';
import { Trophy, Star, Video, Map, Crown, ScrollText, Edit2, X, Check } from 'lucide-react';

interface CharacterProfileProps {
  user: User;
  submissions: Submission[];
  ratings: Rating[];
  competitions?: Competition[];
  challenges?: Challenge[];
  onUpdateAvatar?: (url: string) => void;
}

// Generate 10 varied avatar options using different seeds and background colors
const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Max&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Lily&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo&backgroundColor=d1d4f9',
];

export const CharacterProfile: React.FC<CharacterProfileProps> = ({ 
    user, 
    submissions, 
    ratings,
    competitions = [],
    challenges = [],
    onUpdateAvatar
}) => {
  
  const isLeader = user.role === 'leader';
  const stats = calculatePlayerScore(user.id, submissions, ratings);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  const handleAvatarSelect = (url: string) => {
      if (onUpdateAvatar) {
          onUpdateAvatar(url);
          setIsEditingAvatar(false);
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300 relative">
       
       {/* Avatar Selection Modal */}
       {isEditingAvatar && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
               <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
                   <button 
                    onClick={() => setIsEditingAvatar(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                   >
                       <X className="w-6 h-6" />
                   </button>
                   
                   <h3 className="text-xl font-bold text-white mb-1">Choose your Avatar</h3>
                   <p className="text-slate-400 text-sm mb-6">Select a new look for your character.</p>
                   
                   <div className="grid grid-cols-5 gap-4">
                       {AVATAR_OPTIONS.map((url, idx) => (
                           <button
                            key={idx}
                            onClick={() => handleAvatarSelect(url)}
                            className={`relative group rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${user.avatar === url ? 'border-indigo-500 ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900' : 'border-slate-700 hover:border-slate-400'}`}
                           >
                               <img src={url} alt="Avatar Option" className="w-full h-full bg-slate-800" />
                               {user.avatar === url && (
                                   <div className="absolute inset-0 bg-indigo-500/40 flex items-center justify-center">
                                       <Check className="w-5 h-5 text-white drop-shadow-md" />
                                   </div>
                               )}
                           </button>
                       ))}
                   </div>
               </div>
           </div>
       )}

       {/* Character Card */}
       <div className="bg-slate-900 rounded-3xl border-4 border-slate-800 overflow-hidden relative shadow-2xl">
           {/* Background */}
           <div className={`h-48 bg-gradient-to-r ${isLeader ? 'from-red-900 to-slate-800' : 'from-indigo-600 to-blue-500'}`}></div>
           
           <div className="px-8 pb-8">
               <div className="flex flex-col md:flex-row items-start md:items-end -mt-20 mb-6 gap-6">
                   <div className="relative group">
                       <div className="rounded-3xl p-2 bg-slate-900 relative z-10">
                            <img src={user.avatar} alt="Char" className={`w-40 h-40 rounded-2xl bg-slate-800 border-4 ${isLeader ? 'border-red-500' : 'border-white'}`} />
                       </div>
                       {/* Edit Overlay */}
                       {onUpdateAvatar && (
                           <button 
                            onClick={() => setIsEditingAvatar(true)}
                            className="absolute bottom-4 right-4 z-20 bg-slate-900 text-white p-2 rounded-full border border-slate-700 shadow-lg hover:bg-indigo-600 hover:border-indigo-500 transition-all hover:scale-110 group-hover:opacity-100"
                           >
                               <Edit2 className="w-5 h-5" />
                           </button>
                       )}
                   </div>
                   
                   <div className="flex-1 mb-2">
                       <h1 className="text-4xl font-black text-white">{user.username}</h1>
                       <p className={`${isLeader ? 'text-red-400' : 'text-indigo-400'} font-bold flex items-center gap-2 uppercase tracking-wider text-sm mt-1`}>
                           {isLeader ? <Crown className="w-4 h-4"/> : null}
                           {isLeader ? 'Guild Master • Administrator' : `Challenger • Lvl ${user.level}`}
                       </p>
                   </div>
               </div>

               {/* Stats Grid - Conditional Render */}
               {isLeader ? (
                   <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                            <div className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-1">
                                <Map className="w-4 h-4" /> Competitions Hosted
                            </div>
                            <div className="text-4xl font-black text-white">{competitions.length}</div>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                            <div className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-1">
                                <ScrollText className="w-4 h-4" /> Challenges Issued
                            </div>
                            <div className="text-4xl font-black text-white">{challenges.length}</div>
                        </div>
                   </div>
               ) : (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                           <div className="text-slate-500 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                               <Trophy className="w-3 h-3" /> Total Score
                           </div>
                           <div className="text-2xl font-black text-yellow-400">{stats.totalScore}</div>
                       </div>
                       <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                           <div className="text-slate-500 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                               <Star className="w-3 h-3" /> Avg Rating
                           </div>
                           <div className="text-2xl font-black text-white">{stats.avgRating}</div>
                       </div>
                       <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                           <div className="text-slate-500 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                               <Video className="w-3 h-3" /> Submissions
                           </div>
                           <div className="text-2xl font-black text-white">{stats.submissionCount}</div>
                       </div>
                       <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                           <div className="text-slate-500 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                               <Star className="w-3 h-3 text-yellow-500" /> 5-Stars
                           </div>
                           <div className="text-2xl font-black text-white">{stats.favouriteCount}</div>
                       </div>
                   </div>
               )}
           </div>
       </div>

       {/* Adventure Log / History */}
       <div>
           <h3 className="text-xl font-bold text-white mb-4">
               {isLeader ? 'Hosted Competitions Log' : 'Adventure Log'}
           </h3>
           
           {isLeader ? (
               <div className="space-y-4">
                   {competitions.map(comp => (
                       <div key={comp.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-600 transition-colors">
                           <div>
                               <div className="text-white font-bold text-lg">{comp.title}</div>
                               <div className="text-slate-500 text-sm">{comp.start_date} - {comp.end_date}</div>
                           </div>
                           <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${comp.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                               {comp.status}
                           </div>
                       </div>
                   ))}
               </div>
           ) : (
               <div className="space-y-4">
                   {submissions.filter(s => s.user_id === user.id).map(sub => (
                       <div key={sub.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                           <div>
                               <div className="text-xs text-slate-500 mb-1">{new Date(sub.submitted_at).toLocaleDateString()}</div>
                               <div className="text-white font-medium">{sub.note || "No description"}</div>
                               <a href={sub.link} target="_blank" className="text-indigo-400 text-sm hover:underline">{sub.link}</a>
                           </div>
                           <div className="bg-slate-950 px-3 py-1 rounded-lg text-sm font-bold text-slate-400">
                               Challenge Entry
                           </div>
                       </div>
                   ))}
                   {submissions.filter(s => s.user_id === user.id).length === 0 && (
                       <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                           No challenges completed yet.
                       </div>
                   )}
               </div>
           )}
       </div>

    </div>
  );
};
