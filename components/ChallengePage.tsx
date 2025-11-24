
import React, { useState } from 'react';
import { Challenge, Submission, User, Rating } from '../types';
import { Send, ExternalLink, Star, Link as LinkIcon, Check, Eye, Play } from 'lucide-react';
import { Card } from './ui/Card';

interface ChallengePageProps {
  challenge: Challenge;
  currentUser: User;
  submissions: Submission[];
  users: User[];
  ratings: Rating[];
  onSubmitEntry: (link: string, note: string) => void;
  onRateEntry: (submissionId: string, score: number) => void;
  onBack: () => void;
}

export const ChallengePage: React.FC<ChallengePageProps> = ({
  challenge,
  currentUser,
  submissions,
  users,
  ratings,
  onSubmitEntry,
  onRateEntry,
  onBack
}) => {
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const isAdmin = currentUser.role === 'leader';

  // Determine user's submissions
  const mySubmissions = submissions.filter(s => s.user_id === currentUser.id && s.challenge_id === challenge.id);
  const maxSubmissions = challenge.max_submissions || 1;
  const canSubmit = mySubmissions.length < maxSubmissions;

  const handleSubmission = () => {
    if (!link) return;
    onSubmitEntry(link, note);
    setLink('');
    setNote('');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-right-8">
        
      {/* Confetti Effect (Simple CSS Overlay) */}
      {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
              <div className="text-6xl animate-bounce">🎉</div>
          </div>
      )}
      
      <button onClick={onBack} className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-1">
          &larr; Back to Competition
      </button>

      {/* 1. The Arena Header */}
      <div className="text-center space-y-2">
         <h2 className="text-sm font-bold text-pink-500 uppercase tracking-widest">The Arena • Week {challenge.week_number}</h2>
         <h1 className="text-3xl font-black text-white">{challenge.title}</h1>
         <p className="text-slate-400 max-w-xl mx-auto">{challenge.description}</p>
         {!isAdmin && (
             <div className="text-xs font-mono text-slate-500 bg-slate-900 inline-block px-3 py-1 rounded-full mt-2">
                 Submissions Allowed: {maxSubmissions}
             </div>
         )}
      </div>

      {/* 2. Submission Area (Hidden for Admin) */}
      {!isAdmin && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* List Existing Submissions */}
            {mySubmissions.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-slate-400 text-sm font-bold uppercase flex justify-between">
                        <span>Your Submissions</span>
                        <span className="text-slate-500">{mySubmissions.length}/{maxSubmissions}</span>
                    </h3>
                    {mySubmissions.map((sub, idx) => (
                        <div key={sub.id} className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-500 text-black p-2 rounded-full text-xs font-bold w-8 h-8 flex items-center justify-center">
                                    #{idx + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Entry Submitted</h3>
                                    <p className="text-slate-400 text-sm">{sub.note}</p>
                                    <a href={sub.link} target="_blank" className="text-green-400 text-xs hover:underline mt-1 inline-block">
                                        {sub.link}
                                    </a>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <div className="text-2xl font-black text-white">
                                    {ratings.filter(r => r.submission_id === sub.id).length}
                                </div>
                                <div className="text-xs text-slate-500 uppercase font-bold">Ratings</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Submission Form */}
            {canSubmit ? (
                <Card className="border-2 border-indigo-500/20 bg-slate-900/50">
                    <div className="space-y-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Send className="w-4 h-4 text-indigo-400"/> 
                            {mySubmissions.length > 0 ? 'Submit Another Entry' : 'Submit Your Evidence'}
                        </h3>
                        <div>
                            <input 
                                type="text" 
                                placeholder="Paste your link (TikTok, YouTube, Drive)..." 
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={link}
                                onChange={e => setLink(e.target.value)}
                            />
                        </div>
                        <div>
                            <input 
                                type="text" 
                                placeholder="Add a quick note or caption..." 
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={handleSubmission}
                            disabled={!link}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                        >
                            Submit to Arena
                        </button>
                    </div>
                </Card>
            ) : (
                <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h3 className="text-white font-bold">All Entries Submitted</h3>
                    <p className="text-slate-500 text-sm">You have reached the maximum number of submissions for this challenge.</p>
                </div>
            )}
          </div>
      )}

      {/* Admin View Banner */}
      {isAdmin && (
          <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-center gap-3 text-slate-300">
              <Eye className="w-5 h-5" />
              <span className="font-bold">Admin View Only: You cannot submit or rate entries.</span>
          </div>
      )}

      {/* 3. Peer Rating Feed */}
      <div>
         <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
             <h3 className="font-bold text-xl text-white">Community Submissions</h3>
             <span className="text-sm text-slate-500">{submissions.length} Entries</span>
         </div>
         
         {submissions.length === 0 ? (
             <div className="text-center py-12 text-slate-500 italic">
                 Be the first to submit an entry!
             </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map(sub => {
                    const user = users.find(u => u.id === sub.user_id);
                    const isMe = sub.user_id === currentUser.id;
                    const myRating = ratings.find(r => r.submission_id === sub.id && r.rated_by_user_id === currentUser.id);
                    
                    return (
                        <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all group shadow-lg">
                            <div className="p-4 flex items-center gap-3 border-b border-slate-800 bg-slate-950/30">
                                <img src={user?.avatar} alt={user?.username} className="w-10 h-10 rounded-lg bg-slate-800" />
                                <div>
                                    <h4 className="font-bold text-white text-sm">{user?.username}</h4>
                                    <span className="text-xs text-slate-500 capitalize">{user?.role} • Lvl {user?.level}</span>
                                </div>
                            </div>
                            
                            {/* Video Preview Card - Static Thumbnail Look */}
                            <div className="aspect-[9/16] relative bg-slate-950 overflow-hidden group-hover:shadow-inner">
                                {/* Mock Thumbnail - using a generic high quality neon image to fit theme, since we can't scrape the real one on client side easily */}
                                <img 
                                    src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44c?q=80&w=600&auto=format&fit=crop" 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                                    alt="Video Thumbnail"
                                />
                                
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80"></div>

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 group-hover:bg-indigo-600/80 group-hover:border-indigo-400 transition-all duration-300">
                                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                                    </div>
                                </div>

                                {/* Interaction Layer */}
                                <a 
                                    href={sub.link} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="absolute inset-0 z-10 flex flex-col justify-end p-6"
                                >
                                    <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="inline-flex items-center gap-2 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-black/80">
                                            <ExternalLink className="w-3 h-3" /> Watch on TikTok
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div className="p-4 space-y-3 border-t border-slate-800 relative bg-slate-900">
                                 {sub.note && (
                                    <p className="text-sm text-slate-300 italic line-clamp-2">"{sub.note}"</p>
                                 )}
                            </div>

                            <div className="bg-slate-950/50 p-4 border-t border-slate-800">
                                {isMe ? (
                                    <div className="text-center text-xs text-slate-500 font-bold uppercase py-2">
                                        Your Entry
                                    </div>
                                ) : isAdmin ? (
                                    <div className="text-center text-xs text-slate-600 font-bold uppercase py-2 flex justify-center gap-1">
                                         {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} className="w-4 h-4 text-slate-700" />
                                         ))}
                                    </div>
                                ) : myRating ? (
                                    <div className="text-center py-1">
                                        <div className="flex justify-center gap-2 mb-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star 
                                                    key={star} 
                                                    className={`w-6 h-6 fill-current ${myRating.score >= star ? 'text-yellow-400' : 'text-slate-800'}`} 
                                                />
                                            ))}
                                        </div>
                                        <div className="text-[10px] text-green-500 font-bold uppercase tracking-wider flex justify-center items-center gap-1">
                                            <Check className="w-3 h-3" /> Rated
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onClick={() => onRateEntry(sub.id, star)}
                                                className="p-1 transition-transform hover:scale-110 text-slate-700 hover:text-yellow-400"
                                            >
                                                <Star className="w-6 h-6 fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
         )}
      </div>
    </div>
  );
};
