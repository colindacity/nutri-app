# NutriTrack

A modern nutrition tracking app with AI-powered food logging, flexible weekly budgets, and CBT-informed coaching.

![NutriTrack Preview](docs/preview.png)

## Features

### Core Tracking
- **Weekly Budget System**: Track calories by week, not just day. Flexibility to go over on Saturday and balance on Sunday.
- **Plan-First Workflow**: Plan meals ahead, items auto-confirm at end of day
- **Dual Tracking**: See "eaten" vs "projected" (eaten + planned) totals simultaneously
- **Smart Macros**: Personalized protein/carbs/fat targets based on goals

### AI-Powered
- **Natural Language Entry**: "chipotle bowl chicken rice beans" → structured nutrition data
- **Photo Analysis**: Snap a photo, get calorie estimates (simulated in demo)
- **Fix-It Corrections**: "actually 8oz not 6oz" → updated entry

### Coaching & Support
- **Headspace-Style Character**: Friendly blob mascot with mood states
- **CBT-Informed Check-Ins**:
  - Progress check-ins with personalized feedback
  - Craving SOS with evidence-based coping strategies  
  - Guilt-busting after binges with compassionate support
- **Contextual Encouragement**: Character appears with relevant messages

### Gamification
- Coins for logging meals, hitting protein, maintaining streaks
- Achievement system (extensible)
- Streak tracking

## Tech Stack

- **React 18** with hooks
- **Vite** for fast development
- **Tailwind CSS** for styling
- **localStorage** for persistence (swap for your backend)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
nutritrack-app/
├── src/
│   ├── components/
│   │   ├── Character.jsx      # Headspace-style blob character
│   │   └── Onboarding.jsx     # Multi-step onboarding flow
│   ├── data/
│   │   └── constants.js       # App constants, sample data
│   ├── hooks/
│   │   └── useAppState.js     # Main state management hook
│   ├── utils/
│   │   ├── calculations.js    # TDEE, macros, progress scoring
│   │   ├── coachResponses.js  # CBT-informed response generation
│   │   └── storage.js         # localStorage utilities
│   ├── App.jsx                # Main app with all screens
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind + custom styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Key Design Decisions

### Why Weekly Budgets?
Daily calorie targets create unnecessary stress. Missing by 200 calories feels like failure. Weekly budgets (e.g., 14,000 cal/week) allow natural flexibility. Big dinner Friday? Lighter Saturday. Same outcome, less guilt.

### Why Body Composition?
Weight alone is misleading. Someone losing fat and gaining muscle might see the scale stay flat. Body fat % and muscle mass % show actual progress.

### Why Plan-First?
Logging after eating is reactive. Planning ahead:
- Reduces decision fatigue
- Creates accountability
- Allows "projected" view of the day
- Items auto-confirm at midnight (or tap to confirm)

### Why CBT-Informed Coaching?
Cravings and guilt around food often stem from thought patterns, not willpower. The coach uses evidence-based cognitive-behavioral techniques:
- Identifying craving types (physical vs emotional)
- Reframing "ruined everything" thinking
- Providing data-driven perspective
- Encouraging self-compassion

## Customization

### Swap Backend
Replace `src/utils/storage.js` with your backend API calls:

```javascript
// Instead of localStorage
export async function saveUser(user) {
  await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(user)
  });
}
```

### Add Real AI
Replace the simulated AI in `AddFoodModal` with real API calls:

```javascript
const handleAnalyze = async () => {
  const response = await fetch('/api/analyze-food', {
    method: 'POST',
    body: JSON.stringify({ text: input })
  });
  const result = await response.json();
  setResult(result);
};
```

See `docs/ai-spec.md` for full LLM integration spec.

### Customize Character
Edit `src/data/constants.js` to add moods:

```javascript
export const CHARACTER_MOODS = {
  // Add new mood
  celebratory: { 
    gradient: ['#FFD700', '#FFA500'], 
    eyeY: -2, 
    mouthCurve: 10,
    bounce: true 
  },
};
```

## Screens

### Home
- Week day selector
- Day/Week/Month toggle
- Calorie ring with Left/Eaten/Planned/Total modes
- Macro cards (protein, carbs, fat)
- Chronological food log

### Progress
- Net Progress Score (0-100)
- Calorie deficit tracking
- Protein hit rate
- Body composition cards
- Period summary

### Add Food Modal
- Text description or photo
- AI analysis with item breakdown
- "Fix with AI" corrections
- Plan for Later / Log as Eaten

### Coach Chat
- Quick action buttons
- Conversational interface
- Links to check-in flows

### Check-In Flows
- Progress: Weight/muscle feeling → personalized feedback
- Craving SOS: Type/intensity → coping strategies
- Guilt Support: What happened → compassionate reframe

## Onboarding Flow

1. **Welcome**: Character introduction
2. **Name**: Personalization
3. **Basics**: Sex (for BMR), age
4. **Measurements**: Height, weight, goal weight
5. **Activity Level**: Sedentary → Athlete
6. **Goal**: Lose fast → Build muscle
7. **Protein Priority**: Standard → High (for muscle building)
8. **Summary**: Calculated daily targets, weekly budget callout

## Calculation Details

### BMR (Mifflin-St Jeor)
```
Male: 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
Female: 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
```

### TDEE
```
TDEE = BMR × Activity Multiplier
- Sedentary: 1.2
- Light: 1.375
- Moderate: 1.55
- Active: 1.725
- Athlete: 1.9
```

### Calorie Target
```
Target = TDEE - Deficit
- Lose fast: -750 (~1.5 lbs/week)
- Lose: -500 (~1 lb/week)
- Slow: -250 (~0.5 lbs/week)
- Maintain: 0
- Gain slow: +250
- Gain: +500
```

### Protein Target
```
Grams = Weight(lbs) × Multiplier
- Standard: 0.8
- Active: 1.0
- Building: 1.2
```

## Future Enhancements

- [ ] Real LLM integration (GPT-4o, Claude)
- [ ] Photo analysis with vision models
- [ ] Barcode scanning
- [ ] Apple Health / Google Fit sync
- [ ] Social features (friends, challenges)
- [ ] Meal planning templates
- [ ] Recipe database
- [ ] Restaurant menu integration

## License

MIT

## Credits

- Character design inspired by [Headspace](https://headspace.com)
- UI patterns from [Cal AI](https://cal.ai)
- CBT techniques adapted from clinical literature
