
import React, { useState } from 'react';
import { MOCK_CHALLENGES, MOCK_USERS, MOCK_SUBMISSIONS, MOCK_RATINGS, MOCK_COMPETITIONS, User, Submission, Rating, Challenge, Competition } from './types';
import { LoginView } from './components/LoginView';
import { HomeView } from './components/HomeView';
import { CompetitionDetail } from './components/CompetitionDetail';
import { ChallengePage } from './components/ChallengePage';
import { LeaderboardView } from './components/LeaderboardView';
import { CharacterProfile } from './components/CharacterProfile';
import { AdminUserManagement } from './components/AdminUserManagement';
import { Footer } from './components/Footer';
import { Layout, Trophy, User as UserIcon, Swords, LogOut, Compass, Menu, X, Users } from 'lucide-react';

// Simple Layout Shell
const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all mb-2 font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const App: React.FC = () => {
  // --- State Management ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'competition' | 'challenge' | 'leaderboard' | 'profile' | 'admin-users'>('home');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  
  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data State
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [competitions, setCompetitions] = useState<Competition[]>(MOCK_COMPETITIONS);
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [ratings, setRatings] = useState<Rating[]>(MOCK_RATINGS);

  // Computed Helpers
  const activeCompetition = competitions.find(c => c.id === selectedCompetitionId);
  const activeChallenge = challenges.find(c => c.id === selectedChallengeId);
  const relevantChallenges = challenges.filter(c => c.competition_id === selectedCompetitionId);

  // --- Handlers ---

  const handleLogin = (username: string, pass: string) => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
        setCurrentUser(user);
        setView('home'); 
    } else {
        alert('User not found! Try "3mmo" (Leader) or "ShadowBlade" (Player)');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedCompetitionId(null);
    setSelectedChallengeId(null);
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (page: typeof view, competitionId?: string, challengeId?: string) => {
      setView(page);
      if (competitionId) setSelectedCompetitionId(competitionId);
      if (challengeId) setSelectedChallengeId(challengeId);
      // Close mobile menu on navigation
      setIsMobileMenuOpen(false);
  }

  // Competition Handlers
  const handleCreateCompetition = (newComp: Competition) => {
      setCompetitions(prev => [newComp, ...prev]);
  }

  const handleEditCompetition = (updatedComp: Competition) => {
      setCompetitions(prev => prev.map(c => c.id === updatedComp.id ? updatedComp : c));
  };

  const handleDeleteCompetition = (id: string) => {
      if (window.confirm("Are you sure you want to delete this competition? This will also delete all associated challenges.")) {
          setCompetitions(prev => prev.filter(c => c.id !== id));
          setChallenges(prev => prev.filter(c => c.competition_id !== id));
          if (selectedCompetitionId === id) {
              setSelectedCompetitionId(null);
              setView('home');
          }
      }
  };

  // Challenge Handlers
  const handleCreateChallenge = (newChal: Challenge) => {
      setChallenges(prev => [...prev, newChal]);
  }

  const handleEditChallenge = (updatedChal: Challenge) => {
      setChallenges(prev => prev.map(c => c.id === updatedChal.id ? updatedChal : c));
  };

  const handleDeleteChallenge = (id: string) => {
      if (window.confirm("Are you sure you want to delete this challenge?")) {
          setChallenges(prev => prev.filter(c => c.id !== id));
          if (selectedChallengeId === id) {
              setSelectedChallengeId(null);
              if (activeCompetition) handleNavigate('competition', activeCompetition.id);
              else handleNavigate('home');
          }
      }
  };

  const handleSubmitEntry = (link: string, note: string) => {
    if (!currentUser || !activeChallenge) return;
    const newSub: Submission = {
        id: `sub-${Date.now()}`,
        challenge_id: activeChallenge.id,
        user_id: currentUser.id,
        link: link,
        note: note,
        submitted_at: new Date().toISOString(),
        platform: link.includes('youtube') ? 'youtube' : 'tiktok'
    };
    setSubmissions(prev => [...prev, newSub]);
  };

  const handleRateEntry = (submissionId: string, score: number) => {
    if (!currentUser) return;
    
    const existingIdx = ratings.findIndex(r => r.submission_id === submissionId && r.rated_by_user_id === currentUser.id);
    if (existingIdx >= 0) {
        const updated = [...ratings];
        updated[existingIdx] = { ...updated[existingIdx], score };
        setRatings(updated);
    } else {
        const newRating: Rating = {
            id: `rate-${Date.now()}`,
            submission_id: submissionId,
            rated_by_user_id: currentUser.id,
            score
        };
        setRatings(prev => [...prev, newRating]);
    }
  };

  const handleUpdateAvatar = (newAvatar: string) => {
    if (currentUser) {
        setCurrentUser({ ...currentUser, avatar: newAvatar });
    }
  };

  // User Management Handlers
  const handleCreateUser = (username: string, password: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: username,
      password: password,
      role: 'player',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}&backgroundColor=${['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'][Math.floor(Math.random() * 5)]}`,
      level: 1,
      xp: 0
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleEditUser = (userId: string, newUsername: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, username: newUsername } : u));
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} error="" />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden">
      <div className="flex flex-col md:flex-row flex-1">
      
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-indigo-500 to-pink-500 p-1.5 rounded-lg shadow-lg">
                <Swords className="w-4 h-4 text-white" />
            </div>
            <span className="font-black tracking-tight uppercase italic text-white">Creator League</span>
        </div>
        <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Toggle Menu"
        >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay (Backdrop) */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Drawer on Mobile, Sticky on Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between 
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex
      `}>
        {/* Close Button (Mobile Only - Inside Drawer) */}
        <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white md:hidden"
            aria-label="Close Menu"
        >
            <X className="w-6 h-6" />
        </button>

        <div className="flex-1">
            <div className="flex items-center space-x-3 mb-10 text-white px-2 pt-2 md:pt-0">
                <div className="bg-gradient-to-br from-indigo-500 to-pink-500 p-2 rounded-xl shadow-lg">
                    <Swords className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-black tracking-tight uppercase italic">Creator<br/>League</h1>
            </div>
            
            <nav className="space-y-2">
                <SidebarItem 
                    icon={Layout} 
                    label="Home Base" 
                    active={view === 'home'} 
                    onClick={() => handleNavigate('home')} 
                />
                <SidebarItem 
                    icon={Compass} 
                    label="Current League" 
                    active={view === 'competition' || view === 'challenge'} 
                    onClick={() => {
                        const active = competitions.find(c => c.status === 'active');
                        if (active) handleNavigate('competition', active.id);
                        else handleNavigate('home');
                    }} 
                />
                <SidebarItem 
                    icon={Trophy} 
                    label="Leaderboard" 
                    active={view === 'leaderboard'} 
                    onClick={() => handleNavigate('leaderboard')} 
                />
                <SidebarItem 
                    icon={UserIcon} 
                    label={currentUser.role === 'leader' ? 'Admin Profile' : 'My Character'} 
                    active={view === 'profile'} 
                    onClick={() => handleNavigate('profile')} 
                />
                
                {currentUser.role === 'leader' && (
                    <SidebarItem 
                        icon={Users} 
                        label="Manage Players" 
                        active={view === 'admin-users'} 
                        onClick={() => handleNavigate('admin-users')} 
                    />
                )}
            </nav>
        </div>

        {/* User Profile / Logout */}
        <div className="border-t border-slate-800 pt-6">
            <div className="flex items-center justify-between space-x-3 bg-slate-900 p-3 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center space-x-3">
                    <img src={currentUser.avatar} className="w-10 h-10 rounded-lg bg-slate-800 object-cover" alt="Current" />
                    <div className="text-sm overflow-hidden">
                        <div className="text-white font-bold truncate">{currentUser.username}</div>
                        <div className="text-xs text-slate-500 capitalize">{currentUser.role}</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors p-2" aria-label="Log Out">
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto h-[calc(100vh-65px)] md:h-screen scroll-smooth">
        <div className="max-w-6xl mx-auto pb-20 md:pb-0">
            
            {view === 'home' && (
                <HomeView 
                    user={currentUser}
                    competitions={competitions}
                    activeChallenges={challenges.filter(c => c.status === 'active')}
                    onSelectCompetition={(id) => handleNavigate('competition', id)}
                    onCreateCompetition={handleCreateCompetition}
                    onEditCompetition={handleEditCompetition}
                    onDeleteCompetition={handleDeleteCompetition}
                />
            )}

            {view === 'competition' && activeCompetition && (
                <CompetitionDetail 
                    competition={activeCompetition}
                    challenges={relevantChallenges}
                    user={currentUser}
                    onSelectChallenge={(id) => handleNavigate('challenge', activeCompetition.id, id)}
                    onAddChallenge={handleCreateChallenge}
                    onEditChallenge={handleEditChallenge}
                    onDeleteChallenge={handleDeleteChallenge}
                />
            )}

            {view === 'challenge' && activeChallenge && (
                <ChallengePage 
                    challenge={activeChallenge}
                    currentUser={currentUser}
                    submissions={submissions.filter(s => s.challenge_id === activeChallenge.id)}
                    users={MOCK_USERS}
                    ratings={ratings}
                    onSubmitEntry={handleSubmitEntry}
                    onRateEntry={handleRateEntry}
                    onBack={() => handleNavigate('competition', activeChallenge.competition_id)}
                />
            )}

            {view === 'profile' && (
                <CharacterProfile 
                    user={currentUser} 
                    submissions={submissions} 
                    ratings={ratings}
                    competitions={competitions}
                    challenges={challenges}
                    onUpdateAvatar={handleUpdateAvatar}
                />
            )}

            {view === 'admin-users' && currentUser.role === 'leader' && (
                <AdminUserManagement 
                    users={users}
                    onCreateUser={handleCreateUser}
                    onDeleteUser={handleDeleteUser}
                    onEditUser={handleEditUser}
                />
            )}

            {view === 'leaderboard' && (
                <LeaderboardView 
                    users={users}
                    submissions={submissions}
                    ratings={ratings}
                />
            )}
        </div>
      </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
