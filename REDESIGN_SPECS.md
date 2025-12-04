# NutriTrack iOS-First Redesign Specifications

## Platform Strategy
- **Primary**: Native iOS app using React Native
- **Secondary**: Mobile-responsive web (narrow viewport optimized)
- **Design**: iOS-first with native patterns and gestures

## Simplified Day Screen (Main View)

### Above the Fold Content
1. **Compact Header**
   - Day/Week toggle
   - Date selector (iOS-style)
   - Settings gear

2. **Primary Metrics Card** (Prominent, ~30% of screen)
   - Large calorie ring with number in center
   - Protein bar below with g amount
   - "Swipe for more →" hint text
   - States: Eaten / Planned / Remaining

3. **Meal List** (Starts immediately below metrics)
   - Compact food items (50px height max)
   - Quick actions on swipe
   - Grouped by meal time
   - Shows 5-6 items without scrolling

### Swipeable Extended Metrics
- Swipe right on metrics card reveals:
  - Carbs bar
  - Fats bar
  - Fiber
  - Sugar
  - Sodium
  - Micronutrients grid

### Bottom Tab Bar (iOS Standard)
- Today (home)
- Add (center button, elevated)
- Progress
- Coach
- Profile

## Key UI Changes

### Simplified Metrics
- **Default View**: Calories + Protein only
- **Advanced**: Hidden behind swipe gesture
- **Rationale**: Most users track cals/protein primarily

### Compact Food Log
- Single line items
- Meal time badges (B/L/D/S)
- Calories on right
- Swipe left: Delete
- Swipe right: Edit/Move to tomorrow

### iOS Native Patterns
- Bottom sheet for food entry
- Haptic feedback on actions
- Pull-to-refresh for sync
- Swipe gestures throughout
- iOS date/time pickers
- Native keyboard with done button

## Mobile Web Version
- Max width: 428px (iPhone 14 Pro Max)
- Viewport locked to prevent zoom
- Touch-optimized targets (44px min)
- Bottom safe area for iPhone notch
- PWA capable with home screen icon

## Technical Architecture

### React Native Setup
```
nutri-app-rn/
├── ios/              (iOS specific code)
├── android/          (future)
├── src/
│   ├── screens/      (page components)
│   ├── components/   (reusable UI)
│   ├── navigation/   (React Navigation)
│   ├── store/        (Redux/Zustand)
│   ├── services/     (API, storage)
│   └── utils/
└── web/              (mobile web build)
```

### Dependencies
- React Native 0.72+
- React Navigation 6
- React Native Gesture Handler
- React Native Reanimated
- AsyncStorage
- React Native SVG (for charts)

## Implementation Priority

### Phase 1: Core iOS App
1. React Native project setup
2. Simplified day screen
3. Food entry bottom sheet
4. Basic navigation

### Phase 2: Enhanced Features
1. Swipeable macro details
2. Progress charts
3. Coach integration
4. Haptic feedback

### Phase 3: Web Version
1. Expo Web or separate build
2. Mobile-optimized CSS
3. PWA manifest
4. Touch gestures

## Design Principles
1. **Thumb-reachable**: Key actions in bottom 60% of screen
2. **Information density**: More meals visible without scrolling
3. **Progressive disclosure**: Advanced features behind gestures
4. **Native feel**: iOS UI conventions and animations
5. **Fast interactions**: Optimistic updates, minimal loading states