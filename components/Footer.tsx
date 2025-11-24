import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-slate-300 font-semibold">Creator League</p>
            <p className="text-slate-500 text-sm">Made by <span className="font-bold text-indigo-400">MHA963</span></p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/MHA963" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/in/mha963" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/mha963_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition-colors"
              title="X (Twitter)"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          <div className="text-slate-500 text-sm text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Creator League. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
