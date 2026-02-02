# Muse — AI Coaching App

A minimalist AI coaching app built for the **RevenueCat Shipyard: Creator Contest** (Simon @ BetterCreating brief).

## 🎯 Concept

Muse brings personalized coaching to your pocket through beautifully designed AI coaches. Each coach has a distinct personality, expertise, and coaching style — from Stoic philosophy to productivity systems to creative guidance.

## ✨ Features

### Free Tier
- 5 curated AI coaches
- 15 messages per day
- Basic personal context (name + 3 values)
- Daily reflection prompts
- Save wisdom from conversations

### Pro Tier ($6.99/mo or $49.99/year)
- Unlimited messages
- Create custom coaches
- Share coaches with community
- Deep context engine (unlimited values, goals, life areas)
- Priority response times
- Export wisdom as PDF

## 🛠 Tech Stack

- **Framework:** React Native + Expo
- **Navigation:** React Navigation 7
- **State:** Zustand
- **Animations:** React Native Reanimated 4
- **Monetization:** RevenueCat
- **Typography:** SF Pro (iOS system font)

## 📁 Project Structure

```
muse-coach/
├── App.tsx                 # Main entry point
├── src/
│   ├── components/
│   │   └── ui/            # Core UI components
│   │       ├── Text.tsx   # Typography with variants
│   │       ├── Button.tsx # Animated buttons
│   │       ├── Card.tsx   # Card components
│   │       └── Avatar.tsx # Coach avatars
│   ├── data/
│   │   └── coaches.ts     # Coach definitions & prompts
│   ├── navigation/
│   │   ├── types.ts       # Navigation types
│   │   ├── RootNavigator.tsx
│   │   └── MainTabs.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CoachesScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── CoachDetailScreen.tsx
│   │   ├── WisdomScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── PaywallScreen.tsx
│   ├── services/
│   │   └── revenue-cat.ts # RevenueCat integration
│   ├── store/
│   │   └── useStore.ts    # Zustand global state
│   ├── theme/
│   │   ├── colors.ts      # Color palette (light/dark)
│   │   ├── typography.ts  # SF Pro type scale
│   │   ├── spacing.ts     # Spacing & shadows
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   └── types/
│       └── coach.ts       # TypeScript types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

```bash
cd muse-coach
npm install
```

### Development

```bash
# Start Expo dev server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

### RevenueCat Setup

1. Create a RevenueCat account at https://www.revenuecat.com
2. Create a new project and add your iOS/Android apps
3. Create products for monthly and annual subscriptions
4. Update API keys in `src/services/revenue-cat.ts`:

```typescript
const API_KEYS = {
  ios: 'YOUR_REVENUECAT_IOS_API_KEY',
  android: 'YOUR_REVENUECAT_ANDROID_API_KEY',
};
```

## 🎨 Design System

### Typography (SF Pro)

| Style | Size | Weight | Use Case |
|-------|------|--------|----------|
| largeTitle | 34pt | Bold | Screen titles |
| title1 | 28pt | Bold | Primary headings |
| title2 | 22pt | Bold | Secondary headings |
| headline | 17pt | Semibold | Emphasized body |
| body | 17pt | Regular | Primary reading |
| quote | 19pt | Italic | Coach wisdom |

### Colors

**Light Mode:**
- Background: `#FAF9F7` (warm cream)
- Surface: `#FFFFFF`
- Text: `#1C1C1E`

**Coach Accents:**
- Stoic: `#64748B` (slate blue)
- Productivity: `#F59E0B` (amber)
- Creative: `#8B5CF6` (violet)
- Wellness: `#22C55E` (green)
- Career: `#14B8A6` (teal)

## 📱 Screens

1. **Home** — Daily guidance, continue conversations, quick coach access
2. **Coaches** — Browse and discover all AI coaches
3. **Chat** — Conversation interface with streaming responses
4. **Coach Detail** — Full coach profile (modal)
5. **Wisdom** — Saved insights from conversations
6. **Profile** — User settings and context
7. **Paywall** — RevenueCat subscription flow

## 🔜 Roadmap

- [ ] OpenAI GPT-4o integration for real AI responses
- [ ] Custom coach creation UI
- [ ] Coach sharing & community
- [ ] Push notification reminders
- [ ] Onboarding flow
- [ ] Analytics & insights dashboard

## 📄 License

MIT

---

Built with 💜 for RevenueCat Shipyard 2026

