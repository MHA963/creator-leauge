
import React, { useState } from 'react';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import { initiateTikTokAuth } from '../services/tiktokService';

export const OnboardingView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    initiateTikTokAuth();
    // The function above redirects the window, so we just wait.
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden">
            
            {/* Decorational Background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-pink-500"></div>

            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-800 shadow-xl">
                {/* TikTok Logo SVG */}
                <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
                     <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Account</h2>
            <p className="text-slate-400 mb-8">Link your TikTok profile to verify your stats and join the Creator League.</p>

            <button
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full py-4 bg-white hover:bg-slate-200 text-black rounded-xl font-bold text-lg transition-all flex items-center justify-center shadow-lg disabled:opacity-70"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Redirecting...
                    </>
                ) : (
                    <>
                        <LinkIcon className="w-5 h-5 mr-2" /> Connect with TikTok
                    </>
                )}
            </button>
            
            <p className="mt-6 text-xs text-slate-600">
                Secure authentication via TikTok
            </p>
        </div>
    </div>
  );
};
