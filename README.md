# ARKA-ED - Medical Education Platform

ARKA-ED is a comprehensive medical education platform focused on teaching imaging appropriateness through interactive cases, assessments, and specialty tracks.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (for version control)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd arka-eddemov1.0
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install all required dependencies including:
   - Next.js 14
   - React 18
   - TypeScript
   - Tailwind CSS
   - Framer Motion
   - Supabase (client & SSR)
   - Zustand
   - React Hook Form
   - Zod
   - Radix UI components
   - And many more...

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
arka-eddemov1.0/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── onboarding/
│   │   ├── (dashboard)/              # Dashboard route group
│   │   │   ├── cases/
│   │   │   ├── progress/
│   │   │   ├── assessments/
│   │   │   ├── specialty/
│   │   │   └── achievements/
│   │   ├── (marketing)/              # Marketing route group
│   │   │   └── pricing/
│   │   ├── admin/                    # Admin routes
│   │   ├── api/                      # API routes
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   ├── cases/                    # Case-related components
│   │   ├── assessments/              # Assessment components
│   │   ├── progress/                 # Progress tracking components
│   │   ├── specialty/                # Specialty track components
│   │   ├── layout/                   # Layout components
│   │   ├── marketing/                # Marketing components
│   │   ├── auth/                     # Authentication components
│   │   ├── admin/                    # Admin components
│   │   └── animations/               # Animation components
│   ├── lib/
│   │   ├── supabase/                 # Supabase client configurations
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── validations.ts
│   │   └── calculations.ts
│   ├── types/                        # TypeScript type definitions
│   ├── data/                         # Static data files
│   ├── stores/                       # Zustand state management
│   └── providers/                    # React context providers
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── eslint.config.mjs
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Key Features

### Authentication
- User login and registration
- Password recovery
- Social authentication (Google, Microsoft)
- Role-based access control (RBAC)

### Cases
- Interactive clinical case studies
- ACR appropriateness rating system
- Radiation and cost indicators
- Learning mode with hints
- Clinical pearls

### Assessments
- Quiz builder interface
- Timed assessments
- Progress tracking
- Results breakdown

### Progress Tracking
- Statistics dashboard
- Competency radar charts
- Streak calendar
- Achievement badges
- Activity feed

### Specialty Tracks
- Specialized learning paths
- Module-based curriculum
- Progress tracking per track

### Admin Panel
- Case management
- User management
- Analytics dashboard

## 🎨 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod
- **Database:** Supabase
- **Charts:** Recharts
- **Icons:** Lucide React

## 📝 Component Overview

### UI Components
- Button, Card, Input, Badge
- Modal, Tabs, Progress, Select
- Checkbox, Switch, Tooltip
- Skeleton, Toast, Dropdown Menu
- Empty State, Error State, Loading State

### Case Components
- CaseCard, CaseGrid, CaseFilters
- CaseViewer, ClinicalVignette
- PatientCard, OrderingInterface
- ImagingOptionCard, FeedbackPanel
- ACRRatingBadge, ACRRatingScale
- RadiationIndicator, CostDisplay
- LearningModeToggle, HintSystem
- ClinicalPearl

### Assessment Components
- AssessmentCard
- QuizTimer, QuizProgress
- QuizBuilder, ResultsBreakdown

### Progress Components
- StatsCard, ProgressChart
- CompetencyRadar, CategoryBar
- StreakCalendar, ActivityFeed
- AchievementBadge

### Layout Components
- Navbar, Footer
- DashboardSidebar, DashboardHeader
- DashboardShell, AdminSidebar
- MobileNav

### Marketing Components
- Hero, FeatureCard, StatsBar
- ProcessFlow, TestimonialCard
- PricingCard, CTASection
- ComparisonTable

## 🔐 Authentication Setup

The application uses Supabase for authentication. To set up:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the Supabase dashboard
3. Add them to your `.env.local` file
4. Configure authentication providers in Supabase dashboard if using social auth

## 🗄️ Database Schema

The application expects a Supabase database with the following tables:

- `users` - User accounts and profiles
- `cases` - Clinical case studies
- `assessments` - Assessment definitions
- `assessment_results` - User assessment results
- `user_progress` - User progress tracking
- `achievements` - Achievement definitions and unlocks

## 🧪 Development Guidelines

1. **TypeScript:** All files should be properly typed
2. **Component Structure:** Use functional components with TypeScript interfaces
3. **Styling:** Use Tailwind CSS utility classes
4. **State Management:** Use Zustand stores for global state
5. **Forms:** Use React Hook Form with Zod validation
6. **API Routes:** Use Next.js API routes in `app/api/`

## 📦 Dependencies

All dependencies are listed in `package.json`. Key dependencies include:

- `next@14.2.0`
- `react@18.3.0`
- `typescript@5`
- `tailwindcss@3.4.0`
- `@supabase/supabase-js@2.39.0`
- `zustand@5.0.9`
- `framer-motion@11.0.0`
- `react-hook-form@7.49.0`
- `zod@3.22.0`

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill the process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Module not found:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors:**
   ```bash
   # Restart TypeScript server in your IDE
   # Or run type check
   npx tsc --noEmit
   ```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

## 🤝 Contributing

This is a placeholder project structure. When contributing:

1. Follow TypeScript best practices
2. Write clean, maintainable code
3. Add proper error handling
4. Include TypeScript interfaces for all components
5. Use proper naming conventions

## 📄 License

[Add your license here]

## 👥 Authors

ARKA-ED Development Team

---

**Note:** This is a starter template. You'll need to implement the actual business logic for each component and connect to your Supabase database.