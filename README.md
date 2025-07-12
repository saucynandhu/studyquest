# StudyQuest 🎮📚

A gamified study web app that transforms learning into an epic adventure! Complete missions, earn XP, unlock achievements, and use power-ups to level up your academic journey.

## ✨ Features

### 🎯 Core Features
- **Mission System**: Create and complete study tasks with XP rewards
- **XP & Leveling**: Progress through levels with experience points
- **Power-ups**: Special abilities like Focus Shield, XP Boost, and Time Freeze
- **Achievements**: Unlockable badges for milestones
- **Streak System**: Daily login rewards and streak tracking
- **Real-time Dashboard**: Track progress, stats, and active missions

### 🎨 UI/UX
- **Retro RPG Theme**: Futuristic Jarvis-like interface
- **Glass Morphism**: Modern glass effects and blur backgrounds
- **Responsive Design**: Works seamlessly on web and mobile
- **Animations**: Smooth transitions and gamified effects
- **Audio Feedback**: Sound effects for interactions

### 📱 PWA Features
- **Progressive Web App**: Install as mobile app
- **Offline Support**: Works without internet
- **Push Notifications**: Mission reminders and achievements
- **App-like Experience**: Full-screen mode and splash screen

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Zustand for global state
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth, Firestore)
- **Icons**: Lucide React
- **PWA**: Service Worker, Manifest

## 🎮 Gamification Elements

### XP System
- Complete missions to earn XP
- Level up every 100 XP
- Bonus XP for streaks and achievements

### Power-ups
- **Focus Shield**: Blocks notifications for 25 minutes (Pomodoro)
- **XP Boost**: Double XP for next 3 missions
- **Time Freeze**: Extend deadline by 24 hours

### Achievements
- First Steps: Complete your first mission
- Week Warrior: Maintain a 7-day streak
- Scholar: Reach level 10
- Knowledge Seeker: Earn 1000 XP

## 📋 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/studyquest.git
cd studyquest
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Add your Firebase config to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Creating Missions
1. Click "New Mission" on the dashboard
2. Fill in mission details:
   - Title and subject
   - Duration and deadline
   - XP value
3. Submit to create your quest

### Using Power-ups
1. Navigate to Power-ups section
2. Select an available power-up
3. Click "Activate" to use it
4. Wait for cooldown to use again

### Tracking Progress
- View XP bar and level on dashboard
- Check streak counter
- Monitor active power-ups
- Browse achievements

## 🏗️ Project Structure

```
studyquest/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configs
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
├── package.json
└── README.md
```

## 🎨 Customization

### Themes
- Modify colors in `tailwind.config.js`
- Update CSS variables in `globals.css`
- Customize animations and effects

### Power-ups
- Add new power-ups in `gameStore.ts`
- Implement effects in components
- Update UI for new abilities

### Achievements
- Define new achievements in `gameStore.ts`
- Add unlock conditions
- Create achievement UI components

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms
- Netlify
- Firebase Hosting
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Inspired by gamification principles
- Built with modern web technologies
- Designed for student productivity

---

**Level up your studies with StudyQuest! 🎮📚✨** 