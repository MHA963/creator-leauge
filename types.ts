
export type Role = 'leader' | 'player';

export interface User {
  id: string;
  username: string;
  password?: string; // For demo login
  avatar: string; // Dicebear adventurer URL
  role: Role;
  level: number;
  xp: number;
}

export type CompetitionStatus = "active" | "upcoming" | "completed";
export type ChallengeStatus = "active" | "locked" | "completed" | "rating" | "upcoming";

export interface Competition {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: CompetitionStatus;
  theme_color: string; // CSS class or hex
  prize_pool: string;
  background_image?: string; // URL for custom background
}

export interface Challenge {
  id: string;
  competition_id: string;
  title: string;
  description: string;
  criteria: string[]; // Judging criteria
  week_number: number; // Week 1, 2, 3, 4 inside the competition
  status: ChallengeStatus;
  rules: string[];
  start_date?: string;
  end_date?: string;
  max_submissions?: number;
  background_image?: string; // URL for custom background
}

export interface Submission {
  id: string;
  challenge_id: string;
  user_id: string;
  link: string; // YouTube, TikTok, Drive, etc.
  note: string;
  submitted_at: string;
  platform: 'tiktok' | 'youtube' | 'instagram' | 'other';
}

export interface Rating {
  id: string;
  submission_id: string;
  rated_by_user_id: string;
  score: number; // 1-5
}

// Mock Data
export const MOCK_USERS: User[] = [
  { 
    id: '3mmo', 
    username: '3mmo', 
    password: '123',
    role: 'leader',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=3mmo&backgroundColor=b6e3f4',
    level: 99,
    xp: 99999
  },
  { 
    id: 'u1', 
    username: 'ShadowBlade', 
    password: '123',
    role: 'player',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ShadowBlade&backgroundColor=c0aede',
    level: 5,
    xp: 1200
  },
  { 
    id: 'u2', 
    username: 'PixelQueen', 
    password: '123',
    role: 'player',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PixelQueen&backgroundColor=ffdfbf',
    level: 7,
    xp: 2400
  },
  { 
    id: 'u3', 
    username: 'GlitchMage', 
    password: '123',
    role: 'player',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=GlitchMage&backgroundColor=ffd5dc',
    level: 3,
    xp: 450
  },
  { 
    id: 'u4', 
    username: 'NeonNinja', 
    password: '123',
    role: 'player',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=NeonNinja&backgroundColor=d1d4f9',
    level: 4,
    xp: 890
  },
];

export const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'comp-nov',
    title: 'November Neon Nights',
    description: 'A month dedicated to high-contrast editing and cyberpunk aesthetics.',
    start_date: '2023-11-01',
    end_date: '2023-11-30',
    status: 'active',
    theme_color: 'from-pink-600 to-purple-600',
    prize_pool: '$100 Steam Card + Golden Badge',
    background_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'comp-dec',
    title: 'December Frost',
    description: 'Winter themed storytelling and sound design.',
    start_date: '2023-12-01',
    end_date: '2023-12-31',
    status: 'upcoming',
    theme_color: 'from-cyan-600 to-blue-600',
    prize_pool: 'Rode Microphone',
    background_image: 'https://images.unsplash.com/photo-1519669556878-63bd78aac24f?auto=format&fit=crop&w=800&q=80'
  }
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    competition_id: 'comp-nov',
    week_number: 1,
    title: 'The 10-Second Story',
    description: 'Tell a complete story (beginning, middle, end) in exactly 10 seconds.',
    criteria: ['Clear Narrative', 'Pacing', 'Creativity'],
    status: 'rating',
    rules: ['Must be exactly 10 seconds', 'No copyrighted music', 'Keep it PG'],
    max_submissions: 1,
    background_image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c2',
    competition_id: 'comp-nov',
    week_number: 2,
    title: 'Sound Design Master',
    description: 'Create a video where the sound effects are the main character.',
    criteria: ['Audio Quality', 'Sync', 'Atmosphere'],
    status: 'active',
    rules: ['Original audio preferred', 'Visuals can be simple'],
    max_submissions: 3,
    background_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c3',
    competition_id: 'comp-nov',
    week_number: 3,
    title: 'Color Grade Audit',
    description: 'Take a dull clip and make it pop using only color grading.',
    criteria: ['Mood', 'Consistency', 'Technical Skill'],
    status: 'locked',
    rules: ['Before/After required'],
    max_submissions: 1,
    background_image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=600&q=80'
  }
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 's1',
    challenge_id: 'c1',
    user_id: 'u1',
    link: 'https://www.tiktok.com/@ta3.allam/video/7572668184931732738?is_from_webapp=1&sender_device=pc&web_id=7549923454033774102',
    note: 'Trying a horror vibe!',
    submitted_at: '2023-11-02T10:00:00Z',
    platform: 'tiktok'
  },
  {
    id: 's2',
    challenge_id: 'c1',
    user_id: 'u2',
    link: 'https://www.tiktok.com/@ta3.allam/video/7572668184931732738?is_from_webapp=1&sender_device=pc&web_id=7549923454033774102',
    note: 'My cat is the actor.',
    submitted_at: '2023-11-03T14:00:00Z',
    platform: 'tiktok'
  }
];

export const MOCK_RATINGS: Rating[] = [
  { id: 'r1', submission_id: 's1', rated_by_user_id: 'u2', score: 4 },
  { id: 'r2', submission_id: 's1', rated_by_user_id: 'u3', score: 5 },
  { id: 'r3', submission_id: 's2', rated_by_user_id: 'u1', score: 5 },
];