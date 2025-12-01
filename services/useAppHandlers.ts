import { User, Competition, Challenge, Submission, Rating } from '../types';
import { ViewType } from './useAppState';

interface HandlersProps {
  currentUser: User | null;
  selectedCompetitionId: string | null;
  activeCompetition: Competition | undefined;
  activeChallenge: Challenge | undefined;
  setCurrentUser: (user: User | null) => void;
  setView: (view: ViewType) => void;
  setSelectedCompetitionId: (id: string | null) => void;
  setSelectedChallengeId: (id: string | null) => void;
  setUsers: (fn: (prev: User[]) => User[]) => void;
  setCompetitions: (fn: (prev: Competition[]) => Competition[]) => void;
  setChallenges: (fn: (prev: Challenge[]) => Challenge[]) => void;
  setSubmissions: (fn: (prev: Submission[]) => Submission[]) => void;
  setRatings: (fn: (prev: Rating[]) => Rating[]) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const createAppHandlers = (props: HandlersProps) => {
  const {
    currentUser,
    selectedCompetitionId,
    activeCompetition,
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
  } = props;

  const handleLogin = (username: string, pass: string, users: User[]) => {
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

  const handleNavigate = (page: ViewType, competitionId?: string, challengeId?: string) => {
    setView(page);
    if (competitionId) setSelectedCompetitionId(competitionId);
    if (challengeId) setSelectedChallengeId(challengeId);
    setIsMobileMenuOpen(false);
  };

  // Competition Handlers
  const handleCreateCompetition = (newComp: Competition) => {
    setCompetitions(prev => [newComp, ...prev]);
  };

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
  };

  const handleEditChallenge = (updatedChal: Challenge) => {
    setChallenges(prev => prev.map(c => c.id === updatedChal.id ? updatedChal : c));
  };

  const handleDeleteChallenge = (id: string) => {
    if (window.confirm("Are you sure you want to delete this challenge?")) {
      setChallenges(prev => prev.filter(c => c.id !== id));
      if (selectedCompetitionId) {
        handleNavigate('competition', selectedCompetitionId);
      } else {
        handleNavigate('home');
      }
    }
  };

  // Submission Handlers
  const handleSubmitEntry = (link: string, note: string, activeChallenge: Challenge) => {
    if (!currentUser) return;
    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      challenge_id: activeChallenge.id,
      user_id: currentUser.id,
      link,
      note,
      submitted_at: new Date().toISOString(),
      platform: link.includes('youtube') ? 'youtube' : 'tiktok'
    };
    setSubmissions(prev => [...prev, newSub]);
  };

  // Rating Handlers
  const handleRateEntry = (submissionId: string, score: number) => {
    if (!currentUser) return;

    const existingIdx = (ratings: Rating[]) => ratings.findIndex(r => r.submission_id === submissionId && r.rated_by_user_id === currentUser.id);

    setRatings(prev => {
      const idx = existingIdx(prev);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], score };
        return updated;
      } else {
        return [...prev, {
          id: `rate-${Date.now()}`,
          submission_id: submissionId,
          rated_by_user_id: currentUser.id,
          score
        }];
      }
    });
  };

  // Avatar Handler
  const handleUpdateAvatar = (newAvatar: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, avatar: newAvatar });
    }
  };

  // User Management Handlers
  const handleCreateUser = (username: string, password: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      password,
      role: 'player',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}&backgroundColor=${['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'][Math.floor(Math.random() * 5)]}`,
      level: 1,
      xp: 0
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This will remove all their submissions and ratings.")) {
      // Delete user
      setUsers(prev => prev.filter(u => u.id !== userId));
      
      // Delete all submissions by this user
      setSubmissions(prev => prev.filter(s => s.user_id !== userId));
      
      // Delete all ratings made by this user
      setRatings(prev => prev.filter(r => r.rated_by_user_id !== userId));
    }
  };

  const handleEditUser = (userId: string, newUsername: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, username: newUsername } : u));
  };

  return {
    handleLogin,
    handleLogout,
    handleNavigate,
    handleCreateCompetition,
    handleEditCompetition,
    handleDeleteCompetition,
    handleCreateChallenge,
    handleEditChallenge,
    handleDeleteChallenge,
    handleSubmitEntry,
    handleRateEntry,
    handleUpdateAvatar,
    handleCreateUser,
    handleDeleteUser,
    handleEditUser
  };
};
