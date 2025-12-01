import React, { useState } from 'react';
import { MOCK_CHALLENGES, MOCK_USERS, MOCK_SUBMISSIONS, MOCK_RATINGS, MOCK_COMPETITIONS, User, Submission, Rating, Challenge, Competition } from './types';
import { LoginView } from './components/LoginView';
import { Layout, ViewRouter } from './components/layout';
import { Footer } from './components/Footer';
import { useResponsive } from './services/useResponsive';
import { createAppHandlers } from './services/useAppHandlers';

const App: React.FC = () => {
  // --- Responsive Detection ---
  const { isMobile } = useResponsive();

  // --- State Management ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'competition' | 'challenge' | 'leaderboard' | 'profile' | 'admin-users' | 'super-admin'>('home');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Data State ---
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [competitions, setCompetitions] = useState<Competition[]>(MOCK_COMPETITIONS);
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [ratings, setRatings] = useState<Rating[]>(MOCK_RATINGS);

  // --- Computed Helpers ---
  const activeCompetition = competitions.find(c => c.id === selectedCompetitionId);
  const activeChallenge = challenges.find(c => c.id === selectedChallengeId);

  // --- Event Handlers ---
  const handlers = createAppHandlers({
    currentUser,
    selectedCompetitionId,
    activeCompetition,
    activeChallenge,
    setCurrentUser,
    setView,
    setSelectedCompetitionId,
    setSelectedChallengeId,
    setUsers,
    setCompetitions,
    setChallenges,
    setSubmissions,
    setRatings,
    setIsMobileMenuOpen
  });

  // --- Auth Handler (separate from app handlers) ---
  const handleLogin = (username: string, pass: string) => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
      // Update lastLogin
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      // Update in users list
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      setCurrentUser(updatedUser);
      // Route to appropriate view based on role
      if (updatedUser.role === 'super-admin') {
        setView('super-admin');
      } else {
        setView('home');
      }
    } else {
      alert('User not found!');
    }
  };

  // --- New Game Handler ---
  const handleNewGame = (username: string, password: string, gameName: string) => {
    // Create a unique game ID
    const gameId = `game-${Date.now()}`;
    
    // Create fresh game with only the admin user
    const adminUser: User = {
      id: `user-${Date.now()}`,
      username,
      password,
      role: 'leader',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}&backgroundColor=b6e3f4`,
      level: 1,
      xp: 0,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      gameId,
      gameName
    };

    // Reset all data - fresh game
    setUsers([adminUser]);
    setCompetitions([]);
    setChallenges([]);
    setSubmissions([]);
    setRatings([]);
    
    // Login as the admin
    setCurrentUser(adminUser);
    setView('home');
  };

  // --- Render ---
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} onNewGame={handleNewGame} error="" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white selection:bg-pink-500 selection:text-white overflow-x-hidden">
      <Layout
        currentUser={currentUser}
        currentView={view}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onNavigate={handlers.handleNavigate}
        onLogout={handlers.handleLogout}
        isMobile={isMobile}
      >
        <ViewRouter
          currentView={view}
          currentUser={currentUser}
          selectedCompetitionId={selectedCompetitionId}
          selectedChallengeId={selectedChallengeId}
          competitions={competitions}
          challenges={challenges}
          users={users}
          submissions={submissions}
          ratings={ratings}
          onNavigate={handlers.handleNavigate}
          onCreateCompetition={handlers.handleCreateCompetition}
          onEditCompetition={handlers.handleEditCompetition}
          onDeleteCompetition={handlers.handleDeleteCompetition}
          onCreateChallenge={handlers.handleCreateChallenge}
          onEditChallenge={handlers.handleEditChallenge}
          onDeleteChallenge={handlers.handleDeleteChallenge}
          onSubmitEntry={handlers.handleSubmitEntry}
          onRateEntry={handlers.handleRateEntry}
          onUpdateAvatar={handlers.handleUpdateAvatar}
          onCreateUser={handlers.handleCreateUser}
          onDeleteUser={handlers.handleDeleteUser}
          onEditUser={handlers.handleEditUser}
        />
      </Layout>
      <Footer />
    </div>
  );
};

export default App;
