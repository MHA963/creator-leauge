
import React from 'react';
import { User, Submission, Rating } from '../types';
import { calculatePlayerScore } from '../services/scoring';
import { Trophy, Medal, Crown } from 'lucide-react';

interface LeaderboardViewProps {
  users: User[];
  submissions: Submission[];
  ratings: Rating[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ users, submissions, ratings }) => {
  
  // Calculate scores and sort
  const leaderboardData = users
    .filter(u => u.role !== 'leader') // Exclude admin
    .map(user => ({
      user,
      stats: calculatePlayerScore(user.id, submissions, ratings)
    }))
    .sort((a, b) => b.stats.totalScore - a.stats.totalScore);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-2">Hall of Fame</h1>
        <p className="text-slate-400">Monthly Ranking • Top Creators</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 mb-12 h-64">
         {/* 2nd Place */}
         {leaderboardData[1] && (
             <div className="flex flex-col items-center w-1/3 transform transition-transform hover:scale-105 duration-300 group">
                 <img src={leaderboardData[1].user.avatar} className="w-20 h-20 rounded-full border-4 border-slate-400 bg-slate-800 mb-4 shadow-lg group-hover:shadow-slate-400/50 transition-shadow" />
                 <div className="w-full bg-slate-800 h-32 rounded-t-2xl flex flex-col items-center justify-center border-t-4 border-slate-600 relative shadow-2xl group-hover:bg-slate-700 transition-colors">
                     <div className="text-4xl font-black text-slate-500/20 absolute bottom-2">2</div>
                     <div className="font-bold text-white">{leaderboardData[1].user.username}</div>
                     <div className="text-sm text-slate-400">{leaderboardData[1].stats.totalScore} pts</div>
                 </div>
             </div>
         )}
         
         {/* 1st Place */}
         {leaderboardData[0] && (
             <div className="flex flex-col items-center w-1/3 -mt-8 z-10 transform transition-transform hover:scale-110 duration-300 group">
                 <Crown className="text-yellow-400 w-12 h-12 mb-2 animate-bounce" />
                 <img src={leaderboardData[0].user.avatar} className="w-24 h-24 rounded-full border-4 border-yellow-400 bg-yellow-900 mb-4 shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-400/50 transition-shadow" />
                 <div className="w-full bg-gradient-to-b from-yellow-500/20 to-slate-900 h-48 rounded-t-2xl flex flex-col items-center justify-center border-t-4 border-yellow-500 relative shadow-2xl shadow-yellow-500/10 group-hover:from-yellow-500/30 transition-colors">
                     <div className="text-6xl font-black text-yellow-500/10 absolute bottom-2">1</div>
                     <div className="font-bold text-xl text-white">{leaderboardData[0].user.username}</div>
                     <div className="text-yellow-400 font-bold text-lg">{leaderboardData[0].stats.totalScore} pts</div>
                 </div>
             </div>
         )}

         {/* 3rd Place */}
         {leaderboardData[2] && (
             <div className="flex flex-col items-center w-1/3 transform transition-transform hover:scale-105 duration-300 group">
                 <img src={leaderboardData[2].user.avatar} className="w-20 h-20 rounded-full border-4 border-orange-700 bg-slate-800 mb-4 shadow-lg group-hover:shadow-orange-700/50 transition-shadow" />
                 <div className="w-full bg-slate-800 h-24 rounded-t-2xl flex flex-col items-center justify-center border-t-4 border-orange-800 relative shadow-2xl group-hover:bg-slate-700 transition-colors">
                     <div className="text-4xl font-black text-orange-900/50 absolute bottom-2">3</div>
                     <div className="font-bold text-white">{leaderboardData[2].user.username}</div>
                     <div className="text-sm text-slate-400">{leaderboardData[2].stats.totalScore} pts</div>
                 </div>
             </div>
         )}
      </div>

      {/* List View */}
      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          {leaderboardData.map((item, index) => (
              <div 
                key={item.user.id} 
                className="flex items-center p-4 border-b border-slate-800 hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-default group relative overflow-hidden"
              >
                  {/* Hover Highlight Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/0 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className={`w-12 font-bold text-center transition-colors text-xl ${index < 3 ? 'text-yellow-500' : 'text-slate-500 group-hover:text-white'}`}>#{index + 1}</div>
                  <div className="flex items-center gap-4 flex-1 relative z-10">
                      <img src={item.user.avatar} className="w-10 h-10 rounded-lg bg-slate-950 group-hover:ring-2 ring-indigo-500 transition-all" />
                      <div>
                          <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{item.user.username}</div>
                          <div className="text-xs text-slate-500">{item.stats.submissionCount} Missions • {item.stats.avgRating} Avg</div>
                      </div>
                  </div>
                  <div className="text-right relative z-10">
                      <div className="font-bold text-indigo-400 text-lg group-hover:scale-110 transition-transform origin-right shadow-indigo-500/50 drop-shadow-sm">{item.stats.totalScore}</div>
                      <div className="text-[10px] text-slate-600 uppercase font-bold group-hover:text-slate-400">Points</div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};
