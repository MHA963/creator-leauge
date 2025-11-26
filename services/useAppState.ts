import { useState } from 'react';
import { User, Competition, Challenge, Submission, Rating, MOCK_USERS, MOCK_COMPETITIONS, MOCK_CHALLENGES, MOCK_SUBMISSIONS, MOCK_RATINGS } from '../types';

export type ViewType = 'home' | 'competition' | 'challenge' | 'leaderboard' | 'profile' | 'admin-users';

interface AppState {
  currentUser: User | null;
  view: ViewType;
  selectedCompetitionId: string | null;
  selectedChallengeId: string | null;
  users: User[];
  competitions: Competition[];
  challenges: Challenge[];
  submissions: Submission[];
  ratings: Rating[];
}

export const useAppState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewType>('home');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [competitions, setCompetitions] = useState<Competition[]>(MOCK_COMPETITIONS);
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [ratings, setRatings] = useState<Rating[]>(MOCK_RATINGS);

  const state: AppState = {
    currentUser,
    view,
    selectedCompetitionId,
    selectedChallengeId,
    users,
    competitions,
    challenges,
    submissions,
    ratings
  };

  return {
    state,
    setCurrentUser,
    setView,
    setSelectedCompetitionId,
    setSelectedChallengeId,
    setUsers,
    setCompetitions,
    setChallenges,
    setSubmissions,
    setRatings
  };
};
