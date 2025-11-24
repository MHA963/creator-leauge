
import React, { useState } from 'react';
import { User, Submission, Rating, Challenge } from '../types';
import { Card } from './ui/Card';
import { Star, Save } from 'lucide-react';

interface RatingViewProps {
  currentUser: User;
  challenge: Challenge;
  submissions: Submission[];
  existingRatings: Rating[];
  users: User[];
  onSubmitRating: (rating: Omit<Rating, 'id'>) => void;
}

export const RatingView: React.FC<RatingViewProps> = ({
  currentUser,
  challenge,
  submissions,
  existingRatings,
  users,
  onSubmitRating
}) => {
  // Filter submissions to rate (exclude own)
  const submissionsToRate = submissions.filter(s => s.user_id !== currentUser.id);

  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(
    submissionsToRate.length > 0 ? submissionsToRate[0].id : null
  );

  const [scores, setScores] = useState({
    creativity: 3,
    editing: 3,
    story: 3
  });

  if (submissionsToRate.length === 0) {
    return (
      <div className="text-center p-12 text-slate-400">
        <p>No submissions to rate yet! Wait for others to upload.</p>
      </div>
    );
  }

  const activeSubmission = submissionsToRate.find(s => s.id === activeSubmissionId);
  const activeUser = users.find(u => u.id === activeSubmission?.user_id);
  const hasRated = existingRatings.some(r => r.submission_id === activeSubmissionId && r.rated_by_user_id === currentUser.id);

  const handleScoreChange = (category: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = () => {
    if (!activeSubmission) return;
    onSubmitRating({
      submission_id: activeSubmission.id,
      rated_by_user_id: currentUser.id,
      score: Math.round((scores.creativity + scores.editing + scores.story) / 3)
    });
    // Reset scores or move to next
    setScores({ creativity: 3, editing: 3, story: 3 });
  };

  const renderStars = (category: keyof typeof scores) => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !hasRated && handleScoreChange(category, star)}
            disabled={hasRated}
            className={`p-1 transition-all ${star <= scores[category] ? 'text-yellow-400 scale-110' : 'text-slate-700 hover:text-yellow-400/50'}`}
          >
            <Star className="w-8 h-8 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar: List of videos to rate */}
      <div className="lg:col-span-1 space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">To Rate</h3>
        {submissionsToRate.map(sub => {
           const user = users.find(u => u.id === sub.user_id);
           const isRated = existingRatings.some(r => r.submission_id === sub.id && r.rated_by_user_id === currentUser.id);
           return (
             <button
              key={sub.id}
              onClick={() => setActiveSubmissionId(sub.id)}
              className={`w-full p-3 rounded-lg flex items-center space-x-3 transition-all ${activeSubmissionId === sub.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'}`}
             >
               <img src={user?.avatar} alt={user?.username} className="w-8 h-8 rounded-full" />
               <span className="font-medium flex-1 text-left">{user?.username}</span>
               {isRated && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Done</span>}
             </button>
           )
        })}
      </div>

      {/* Main Rating Area */}
      <div className="lg:col-span-2">
        {activeSubmission && activeUser ? (
          <Card className="h-full relative">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{activeUser.username}'s Entry</h2>
                  <p className="text-slate-400 text-sm mt-1">"{activeSubmission.note}"</p>
                </div>
                <a 
                  href={activeSubmission.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-slate-900 text-white text-xs px-4 py-2 rounded-full flex items-center transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  Watch on TikTok
                </a>
              </div>

              {/* Placeholder for Video Content - since we can't embed TikTok easily without SDK */}
              <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                <p className="text-slate-500">Video Preview Placeholder</p>
              </div>

              {/* Rating Controls */}
              {hasRated ? (
                <div className="bg-slate-800/50 p-6 rounded-xl text-center border border-green-500/30">
                    <h3 className="text-green-400 font-bold text-lg">Rating Submitted!</h3>
                    <p className="text-slate-400">You can change this until the deadline closes.</p>
                </div>
              ) : (
                <div className="space-y-6 bg-slate-800/30 p-6 rounded-xl border border-slate-700">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Creativity</label>
                    {renderStars('creativity')}
                    <p className="text-xs text-slate-500 mt-1">Originality of the idea and execution.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Editing Quality</label>
                    {renderStars('editing')}
                    <p className="text-xs text-slate-500 mt-1">Smoothness, transitions, and technical skill.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Story/Flow</label>
                    {renderStars('story')}
                    <p className="text-xs text-slate-500 mt-1">Does the video have a clear beginning, middle, and end?</p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Submit Score
                  </button>
                </div>
              )}
            </div>
          </Card>
        ) : (
             <div className="h-full flex items-center justify-center text-slate-500">Select a video to rate</div>
        )}
      </div>
    </div>
  );
};
