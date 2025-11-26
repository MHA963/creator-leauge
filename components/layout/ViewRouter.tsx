import React from 'react';
import { User, Competition, Challenge, Submission, Rating } from '../../types';
import { ViewType } from '../../services/useAppState';
import { HomeView } from '../HomeView';
import { CompetitionDetail } from '../CompetitionDetail';
import { ChallengePage } from '../ChallengePage';
import { LeaderboardView } from '../LeaderboardView';
import { CharacterProfile } from '../CharacterProfile';
import { AdminUserManagement } from '../AdminUserManagement';

interface ViewRouterProps {
  currentView: ViewType;
  currentUser: User | null;
  selectedCompetitionId: string | null;
  selectedChallengeId: string | null;
  competitions: Competition[];
  challenges: Challenge[];
  users: User[];
  submissions: Submission[];
  ratings: Rating[];
  onNavigate: (view: ViewType, competitionId?: string, challengeId?: string) => void;
  onCreateCompetition: (comp: Competition) => void;
  onEditCompetition: (comp: Competition) => void;
  onDeleteCompetition: (id: string) => void;
  onCreateChallenge: (chal: Challenge) => void;
  onEditChallenge: (chal: Challenge) => void;
  onDeleteChallenge: (id: string) => void;
  onSubmitEntry: (link: string, note: string, challenge: Challenge) => void;
  onRateEntry: (submissionId: string, score: number) => void;
  onUpdateAvatar: (avatar: string) => void;
  onCreateUser: (username: string, password: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser: (userId: string, newUsername: string) => void;
}

export const ViewRouter: React.FC<ViewRouterProps> = ({
  currentView,
  currentUser,
  selectedCompetitionId,
  selectedChallengeId,
  competitions,
  challenges,
  users,
  submissions,
  ratings,
  onNavigate,
  onCreateCompetition,
  onEditCompetition,
  onDeleteCompetition,
  onCreateChallenge,
  onEditChallenge,
  onDeleteChallenge,
  onSubmitEntry,
  onRateEntry,
  onUpdateAvatar,
  onCreateUser,
  onDeleteUser,
  onEditUser
}) => {
  const activeCompetition = competitions.find(c => c.id === selectedCompetitionId);
  const activeChallenge = challenges.find(c => c.id === selectedChallengeId);
  
  // Auto-select first active competition if on competition view without selection
  React.useEffect(() => {
    if (currentView === 'competition' && !activeCompetition && competitions.length > 0) {
      const activeComp = competitions.find(c => c.status === 'active');
      if (activeComp) {
        onNavigate('competition', activeComp.id);
      }
    }
  }, [currentView, activeCompetition, competitions, onNavigate]);

  switch (currentView) {
    case 'home':
      return (
        <HomeView
          user={currentUser!}
          competitions={competitions}
          activeChallenges={challenges.filter(c => c.status === 'active')}
          onSelectCompetition={(id) => onNavigate('competition', id)}
          onCreateCompetition={onCreateCompetition}
          onEditCompetition={onEditCompetition}
          onDeleteCompetition={onDeleteCompetition}
        />
      );

    case 'competition':
      if (!activeCompetition) {
        // Show a loading state while auto-selecting
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading competition...</p>
            </div>
          </div>
        );
      }
      return (
        <CompetitionDetail
          competition={activeCompetition}
          challenges={challenges.filter(c => c.competition_id === activeCompetition.id)}
          user={currentUser!}
          onSelectChallenge={(id) => onNavigate('challenge', selectedCompetitionId || '', id)}
          onAddChallenge={onCreateChallenge}
          onEditChallenge={onEditChallenge}
          onDeleteChallenge={onDeleteChallenge}
        />
      );

    case 'challenge':
      if (!activeChallenge) {
        // If no challenge selected, show home
        return (
          <HomeView 
            user={currentUser!} 
            competitions={competitions} 
            activeChallenges={challenges.filter(c => c.status === 'active')}
            onSelectCompetition={(id) => onNavigate('competition', id)} 
            onCreateCompetition={onCreateCompetition}
            onEditCompetition={onEditCompetition}
            onDeleteCompetition={onDeleteCompetition}
          />
        );
      }
      return (
        <ChallengePage
          challenge={activeChallenge}
          currentUser={currentUser!}
          submissions={submissions.filter(s => s.challenge_id === activeChallenge.id)}
          users={users}
          ratings={ratings}
          onSubmitEntry={(link, note) => onSubmitEntry(link, note, activeChallenge)}
          onRateEntry={onRateEntry}
          onBack={() => onNavigate('competition', activeChallenge.competition_id)}
        />
      );

    case 'leaderboard':
      return (
        <LeaderboardView
          users={users}
          submissions={submissions}
          ratings={ratings}
        />
      );

    case 'profile':
      return (
        <CharacterProfile
          user={currentUser!}
          submissions={submissions}
          ratings={ratings}
          competitions={competitions}
          challenges={challenges}
          onUpdateAvatar={onUpdateAvatar}
        />
      );

    case 'admin-users':
      return (
        <AdminUserManagement
          users={users}
          currentUser={currentUser!}
          onCreateUser={onCreateUser}
          onDeleteUser={onDeleteUser}
          onEditUser={onEditUser}
        />
      );

    default:
      return currentUser ? (
        <HomeView 
          user={currentUser} 
          competitions={competitions} 
          activeChallenges={challenges.filter(c => c.status === 'active')}
          onSelectCompetition={(id) => onNavigate('competition', id)} 
          onCreateCompetition={onCreateCompetition}
          onEditCompetition={onEditCompetition}
          onDeleteCompetition={onDeleteCompetition}
        />
      ) : null;
  }
};
