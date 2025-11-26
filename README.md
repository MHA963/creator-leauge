# Creator League 🎬🎮

A competitive platform where content creators submit, rate, and compete in challenges to climb the leaderboard and earn rewards.

## 📖 Introduction

**Creator League** is a gamified competition platform designed for content creators to showcase their talents, compete in themed challenges, and build their reputation within a community. Whether you're creating videos, animations, or any creative content, Creator League provides a structured competitive environment with clear rules, transparent scoring, and community-driven feedback.

The platform supports two types of users:
- **Players**: Submit entries, view ratings, climb leaderboards
- **Leaders**: Manage competitions, create challenges, oversee platform activity

## 🎯 Game Rules

### Competition Structure
1. **Competitions** are the top-level organizational unit (e.g., "Summer Video Challenge 2025")
2. Each competition contains multiple **Challenges** (e.g., "Best Cinematic Shot", "Most Creative Edit")
3. Challenges have specific themes, durations, and submission requirements

### Submission Rules
- Players can submit **one entry per challenge**
- Submissions include a link (YouTube/TikTok) and optional notes
- Submissions are locked after the challenge deadline
- Late submissions are not accepted

### Rating System
- **Leaders and Players** can rate submissions on a scale of 1-10
- Each user can rate each submission only once
- Ratings are transparent and visible to all users
- Average rating determines final score for leaderboard ranking

### Leaderboard Ranking
- **Points** = Average rating across all submissions
- **Rank** = Position based on total points
- **Level** = Milestone achievement (increases with consistent performance)
- **XP** = Total experience gained from submissions and ratings

## 👥 Roles & Actions

### Player Role
**Permissions:**
- View all active competitions
- Browse available challenges
- Submit entries to challenges
- View own submissions and ratings
- Rate other players' submissions
- View personal profile and stats
- Access leaderboard

**Actions:**
| Action | Description |
|--------|-------------|
| Browse | Explore competitions and challenges |
| Submit | Upload content link for a challenge |
| Rate | Give 1-10 score to other submissions |
| View Stats | Check personal score and XP |

### Leader Role (Admin)
**Permissions:**
- All player permissions
- Create new competitions
- Edit/delete competitions and challenges
- Create new challenges within competitions
- Manage player accounts (create, edit, delete)
- View all user data and submissions
- Moderation tools

**Actions:**
| Action | Description |
|--------|-------------|
| Create Competition | Set up new themed competition |
| Create Challenge | Add challenge to competition |
| Edit Content | Modify competition/challenge details |
| Manage Players | Create/delete/edit user accounts |
| Monitor | View all submissions and ratings |

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Vite** - Build tool & dev server

### Architecture
- **Component-Based** - Modular, reusable UI components
- **Hook-Based State** - Custom React hooks for logic
- **Service Layer** - Separated business logic
- **Responsive Design** - Mobile-first, tablet & desktop support

### Project Structure
```
src/
├── components/
│   ├── layout/              # Layout wrapper components
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Layout.tsx       # Main app layout
│   │   ├── ViewRouter.tsx   # View routing logic
│   │   └── MobileNavBar.tsx # Mobile navigation
│   ├── HomeView.tsx         # Competition listing
│   ├── CompetitionDetail.tsx # Competition page
│   ├── ChallengePage.tsx    # Challenge submission page
│   ├── CharacterProfile.tsx # User profile
│   ├── AdminUserManagement.tsx # Admin user CRUD
│   ├── LeaderboardView.tsx  # Rankings display
│   ├── LoginView.tsx        # Authentication
│   ├── Dashboard.tsx        # Admin dashboard
│   ├── RatingView.tsx       # Rating interface
│   ├── Footer.tsx           # App footer
│   └── ui/
│       └── Card.tsx         # Reusable card component
├── services/
│   ├── useResponsive.ts     # Mobile detection hook
│   ├── useAppState.ts       # Centralized state hook
│   ├── useAppHandlers.ts    # Event handlers factory
│   └── scoring.ts           # Score calculation logic
├── types.ts                 # TypeScript interfaces & mock data
├── App.tsx                  # Main app component
└── index.tsx                # Entry point
```

## 🔗 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                              │
│  (State Management, Authentication, Data Flow)             │
└──────┬──────────────────────────────────────────────────────┘
       │
       ├─► LoginView (Pre-auth)
       │
       └─► Layout
           │
           ├─► Sidebar (Navigation)
           │   ├─► SidebarItem (Home)
           │   ├─► SidebarItem (Competitions)
           │   ├─► SidebarItem (Challenges)
           │   ├─► SidebarItem (Leaderboard)
           │   ├─► SidebarItem (Profile)
           │   └─► SidebarItem (Manage Players) [Leader only]
           │
           ├─► MobileNavBar (Mobile-only)
           │
           └─► ViewRouter
               │
               ├─► HomeView
               │   └─► CompetitionCard
               │
               ├─► CompetitionDetail
               │   ├─► ChallengeList
               │   ├─► CompetitionForm [Leader]
               │   └─► ChallengeForm [Leader]
               │
               ├─► ChallengePage
               │   ├─► SubmissionForm
               │   ├─► SubmissionList
               │   └─► RatingView
               │
               ├─► LeaderboardView
               │   └─► PlayerRankings
               │
               ├─► CharacterProfile
               │   ├─► AvatarSelector
               │   └─► PlayerStats
               │
               ├─► AdminUserManagement [Leader only]
               │   ├─► UserCreationForm
               │   └─► UserList
               │
               └─► Dashboard [Leader only]
                   └─► ChallengeManagement
```

## 🗺️ Routing Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Routes                           │
└─────────────────────────────────────────────────────────────────┘

1. AUTHENTICATION
   ├─ Not Logged In
   │  └─► LoginView
   │       ├─ Valid credentials
   │       └─► View: 'home'
   │
   └─ Logged In
      └─► Layout (Sidebar + Content)

2. NAVIGATION FLOW (State-based routing)

   ┌──────────────┐
   │   HOME       │
   │              │
   │ - Browse     │
   │   Comps      │
   │ - View       │
   │   Active     │
   │   Challenges │
   └──────┬───────┘
          │ onSelectCompetition()
          ▼
   ┌──────────────────────┐
   │  COMPETITION DETAIL  │
   │                      │
   │ - View Challenges    │
   │ - Create Challenge   │
   │   [Leader]           │
   │ - Edit/Delete        │
   │   [Leader]           │
   └──────┬───────────────┘
          │ onSelectChallenge()
          ▼
   ┌──────────────────────┐
   │  CHALLENGE PAGE      │
   │                      │
   │ - Submit Entry       │
   │ - View Submissions   │
   │ - Rate Entries       │
   │ - View Details       │
   └──────┬───────────────┘
          │ onBack()
          └──► Back to Competition

3. SECONDARY ROUTES

   ┌─────────────────┐      ┌──────────────┐      ┌──────────────┐
   │   LEADERBOARD   │      │   PROFILE    │      │  ADMIN USERS │
   │                 │      │              │      │  [Leader]    │
   │ - Rankings      │      │ - Avatar     │      │              │
   │ - Stats         │      │ - Stats      │      │ - Create     │
   │ - Filters       │      │ - Submissions│      │ - Edit       │
   │                 │      │ - Ratings    │      │ - Delete     │
   └─────────────────┘      └──────────────┘      └──────────────┘
          ▲                         ▲                      ▲
          │                         │                      │
          └─────────────────────────┼──────────────────────┘
                                    │
                       onNavigate('view', id)
                       (Sidebar Navigation)

4. STATE VARIABLES

   View Types:
   ├─ 'home'        ──► HomeView
   ├─ 'competition' ──► CompetitionDetail
   ├─ 'challenge'   ──► ChallengePage
   ├─ 'leaderboard' ──► LeaderboardView
   ├─ 'profile'     ──► CharacterProfile
   └─ 'admin-users' ──► AdminUserManagement [Leader]

   Selection State:
   ├─ selectedCompetitionId ──► Filters challenges & competitions
   ├─ selectedChallengeId   ──► Filters submissions & ratings
   └─ currentUser           ──► Determines visibility & permissions

5. EVENT FLOW

   User Action                  Handler                    State Update
   ─────────────────────────────────────────────────────────────────
   Click "Competitions"    ──► handleNavigate()      ──► view='competition'
   Select Competition      ──► handleNavigate()      ──► selectedCompetitionId
   Select Challenge        ──► handleNavigate()      ──► selectedChallengeId
   Submit Entry           ──► handleSubmitEntry()    ──► submissions[]
   Rate Submission        ──► handleRateEntry()      ──► ratings[]
   Create Competition     ──► handleCreateComp()     ──► competitions[]
   Update Avatar          ──► handleUpdateAvatar()   ──► currentUser
   Logout                 ──► handleLogout()         ──► Reset all state
```

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Login Credentials
- **Leader Account**: Username: `admin` | Password: `123`
- **Player Account**: Username: `ShadowBlade` | Password: `123`

## 📱 Responsive Design

- **Mobile** (<768px): Drawer sidebar, optimized touch targets
- **Tablet** (768px-1024px): Side navigation, responsive grid
- **Desktop** (>1024px): Fixed sidebar, full-width layout

---

**Built with ❤️ & Gemini 3 for content creators**
