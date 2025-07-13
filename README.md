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

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.local` file in the root directory with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

You can find these values in your Firebase Console > Project Settings > General > Your apps.

### For Production (Vercel)

Add these same environment variables in your Vercel project settings.

## 🎮 Gamification Elements

### XP System
- Complete missions to earn XP
- Level up every 100 XP
- Bonus XP for streaks and achievements

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request



## 🙏 Acknowledgments

- Inspired by gamification principles
- Built with modern web technologies
- Designed for student productivity
- CodeSpark Hackathon
- Siddhant for Inspo

---

**Level up your studies with StudyQuest! 🎮📚✨** 
