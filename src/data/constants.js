// src/data/constants.js

export const MACRO_COLORS = {
  protein: '#ef4444',
  carbs: '#22c55e',
  fat: '#3b82f6',
  calories: '#000000',
};

export const CHARACTER_MOODS = {
  calm: { gradient: ['#7DD3C0', '#4ECDC4'], eyeY: 0, mouthCurve: 4 },
  happy: { gradient: ['#FFD93D', '#F6B93B'], eyeY: -1, mouthCurve: 6 },
  excited: { gradient: ['#FF8A5B', '#FF6B6B'], eyeY: -2, mouthCurve: 8, bounce: true },
  thinking: { gradient: ['#A8D8EA', '#7EC8E3'], eyeY: -2, mouthCurve: 0, tilt: true },
  supportive: { gradient: ['#DDA0DD', '#DA70D6'], eyeY: 0, mouthCurve: 5 },
  proud: { gradient: ['#98D8AA', '#5CDB95'], eyeY: -1, mouthCurve: 7 },
  welcome: { gradient: ['#FF9A9E', '#FECFEF'], eyeY: -1, mouthCurve: 7 },
};

export const ACTIVITY_LEVELS = {
  sedentary: { label: 'Sedentary', description: 'Little to no exercise', multiplier: 1.2 },
  light: { label: 'Lightly Active', description: 'Light exercise 1-3 days/week', multiplier: 1.375 },
  moderate: { label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week', multiplier: 1.55 },
  active: { label: 'Very Active', description: 'Hard exercise 6-7 days/week', multiplier: 1.725 },
  athlete: { label: 'Athlete', description: 'Very hard exercise, physical job', multiplier: 1.9 },
};

export const GOALS = {
  lose_fast: { label: 'Lose weight faster', deficit: 750, description: '~1.5 lbs/week' },
  lose: { label: 'Lose weight', deficit: 500, description: '~1 lb/week' },
  lose_slow: { label: 'Lose weight slowly', deficit: 250, description: '~0.5 lbs/week' },
  maintain: { label: 'Maintain weight', deficit: 0, description: 'Stay where you are' },
  gain_slow: { label: 'Gain muscle slowly', deficit: -250, description: '~0.5 lbs/week' },
  gain: { label: 'Build muscle', deficit: -500, description: '~1 lb/week' },
};

export const PROTEIN_TARGETS = {
  low: { label: 'Standard', multiplier: 0.8, description: '0.8g per lb bodyweight' },
  moderate: { label: 'Active', multiplier: 1.0, description: '1g per lb bodyweight' },
  high: { label: 'Building muscle', multiplier: 1.2, description: '1.2g per lb bodyweight' },
};

export const DEFAULT_USER = {
  name: '',
  age: null,
  sex: null,
  height: null, // inches
  weight: null, // lbs
  goalWeight: null,
  bodyFat: null,
  activityLevel: 'moderate',
  goal: 'lose',
  proteinTarget: 'moderate',
  onboardingComplete: false,
};

export const COIN_REWARDS = {
  logMeal: 5,
  confirmPlanned: 5,
  hitProtein: 15,
  underBudget: 10,
  streakDay: 2, // multiplied by streak length
  completeCheckIn: 10,
  firstLog: 10,
  weekStreak: 50,
  monthStreak: 200,
};

export const SAMPLE_FOODS = [
  {
    id: 'sample_1',
    name: 'Eggs, Avocado, and Toast',
    calories: 450,
    protein: 20,
    carbs: 40,
    fat: 25,
    items: [
      { name: '3 eggs scrambled', calories: 210, protein: 18, carbs: 2, fat: 15 },
      { name: 'Half avocado', calories: 120, protein: 1, carbs: 6, fat: 11 },
      { name: 'Sourdough toast', calories: 120, protein: 4, carbs: 22, fat: 1 },
    ],
  },
  {
    id: 'sample_2',
    name: 'Chipotle Chicken Bowl',
    calories: 610,
    protein: 52,
    carbs: 55,
    fat: 23,
    items: [
      { name: 'Chicken', calories: 180, protein: 32, carbs: 0, fat: 7 },
      { name: 'White rice', calories: 210, protein: 4, carbs: 40, fat: 4 },
      { name: 'Black beans', calories: 130, protein: 8, carbs: 22, fat: 1 },
      { name: 'Fajita veggies', calories: 20, protein: 1, carbs: 4, fat: 0 },
      { name: 'Salsa', calories: 25, protein: 1, carbs: 5, fat: 0 },
      { name: 'Cheese', calories: 45, protein: 3, carbs: 0, fat: 4 },
    ],
  },
  {
    id: 'sample_3',
    name: 'Protein Shake',
    calories: 160,
    protein: 30,
    carbs: 5,
    fat: 2,
    items: [
      { name: 'Whey protein 1 scoop', calories: 120, protein: 24, carbs: 3, fat: 1 },
      { name: 'Almond milk 1 cup', calories: 40, protein: 1, carbs: 2, fat: 3 },
    ],
  },
  {
    id: 'sample_4',
    name: 'Salmon with Rice and Broccoli',
    calories: 729,
    protein: 58,
    carbs: 56,
    fat: 28,
    items: [
      { name: 'Salmon 8oz', calories: 468, protein: 50, carbs: 0, fat: 28 },
      { name: 'White rice 1 cup', calories: 206, protein: 4, carbs: 45, fat: 0 },
      { name: 'Steamed broccoli', calories: 55, protein: 4, carbs: 11, fat: 0 },
    ],
  },
  {
    id: 'sample_5',
    name: 'Greek Yogurt with Berries',
    calories: 180,
    protein: 18,
    carbs: 20,
    fat: 3,
    items: [
      { name: 'Greek yogurt 1 cup', calories: 130, protein: 17, carbs: 8, fat: 2 },
      { name: 'Mixed berries 1/2 cup', calories: 40, protein: 1, carbs: 10, fat: 0 },
      { name: 'Honey drizzle', calories: 10, protein: 0, carbs: 2, fat: 0 },
    ],
  },
];

export const CHECK_IN_FLOWS = {
  progress: {
    title: 'Progress Check-In',
    characterMood: 'supportive',
    steps: [
      {
        question: "How are you feeling about your weight progress this week?",
        options: [
          { text: "Frustrated, not moving fast enough", value: 'frustrated' },
          { text: "Okay, trying to stay patient", value: 'okay' },
          { text: "Good, seeing some changes", value: 'good' },
          { text: "Great, really motivated", value: 'great' },
        ],
      },
      {
        question: "And how about your muscle/strength goals?",
        options: [
          { text: "Haven't focused on it much", value: 'neglected' },
          { text: "Maintaining but not growing", value: 'maintaining' },
          { text: "Making slow progress", value: 'progress' },
          { text: "Feeling stronger", value: 'strong' },
        ],
      },
    ],
  },
  craving: {
    title: 'Craving SOS',
    characterMood: 'calm',
    steps: [
      {
        question: "What's pulling at you right now?",
        options: [
          { text: "Something sweet", value: 'sweet' },
          { text: "Something salty/crunchy", value: 'salty' },
          { text: "A specific food I can't stop thinking about", value: 'specific' },
          { text: "Just want to eat even though I'm not hungry", value: 'emotional' },
        ],
      },
      {
        question: "On a scale, how intense is this craving?",
        options: [
          { text: "Mild, just a thought", value: 'mild' },
          { text: "Moderate, hard to ignore", value: 'moderate' },
          { text: "Strong, feels urgent", value: 'strong' },
        ],
      },
    ],
  },
  guilt: {
    title: "Let's Talk",
    characterMood: 'supportive',
    steps: [
      {
        question: "What happened?",
        options: [
          { text: "Ate way more than planned", value: 'overate' },
          { text: "Ate something 'off plan'", value: 'offplan' },
          { text: "Binged and feel out of control", value: 'binge' },
          { text: "Skipped logging because I didn't want to see it", value: 'avoided' },
        ],
      },
      {
        question: "How are you feeling right now?",
        options: [
          { text: "Disappointed in myself", value: 'disappointed' },
          { text: "Like I ruined everything", value: 'ruined' },
          { text: "Physically uncomfortable", value: 'uncomfortable' },
          { text: "Numb, don't want to think about it", value: 'numb' },
        ],
      },
    ],
  },
};
