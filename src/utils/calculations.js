// src/utils/calculations.js

import { ACTIVITY_LEVELS, GOALS, PROTEIN_TARGETS } from '../data/constants.js';

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 * @param {number} weight - Weight in lbs
 * @param {number} height - Height in inches
 * @param {number} age - Age in years
 * @param {string} sex - 'male' or 'female'
 * @returns {number} BMR in calories
 */
export function calculateBMR(weight, height, age, sex) {
  const weightKg = weight * 0.453592;
  const heightCm = height * 2.54;
  
  if (sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

/**
 * Calculate Total Daily Energy Expenditure
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - Activity level key
 * @returns {number} TDEE in calories
 */
export function calculateTDEE(bmr, activityLevel) {
  const multiplier = ACTIVITY_LEVELS[activityLevel]?.multiplier || 1.55;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate daily calorie target based on goal
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} goal - Goal key (lose, maintain, gain, etc.)
 * @returns {number} Daily calorie target
 */
export function calculateCalorieTarget(tdee, goal) {
  const deficit = GOALS[goal]?.deficit || 0;
  return Math.round(tdee - deficit);
}

/**
 * Calculate macro targets
 * @param {number} calories - Daily calorie target
 * @param {number} weight - Weight in lbs
 * @param {string} proteinTarget - Protein target key
 * @returns {object} { protein, carbs, fat } in grams
 */
export function calculateMacros(calories, weight, proteinTarget) {
  const proteinMultiplier = PROTEIN_TARGETS[proteinTarget]?.multiplier || 1.0;
  
  // Protein: based on body weight
  const protein = Math.round(weight * proteinMultiplier);
  const proteinCalories = protein * 4;
  
  // Fat: 25-30% of calories
  const fatCalories = calories * 0.27;
  const fat = Math.round(fatCalories / 9);
  
  // Carbs: remaining calories
  const carbCalories = calories - proteinCalories - fatCalories;
  const carbs = Math.round(Math.max(0, carbCalories) / 4);
  
  return { protein, carbs, fat };
}

/**
 * Calculate all daily goals
 * @param {object} user - User profile object
 * @returns {object} { calories, protein, carbs, fat }
 */
export function calculateDailyGoals(user) {
  if (!user.weight || !user.height || !user.age || !user.sex) {
    // Default fallback
    return { calories: 2000, protein: 150, carbs: 200, fat: 67 };
  }
  
  const bmr = calculateBMR(user.weight, user.height, user.age, user.sex);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  const calories = calculateCalorieTarget(tdee, user.goal);
  const macros = calculateMacros(calories, user.weight, user.proteinTarget);
  
  return {
    calories,
    ...macros,
  };
}

/**
 * Calculate weekly goals from daily
 * @param {object} dailyGoals - { calories, protein, carbs, fat }
 * @returns {object} Weekly goals
 */
export function calculateWeeklyGoals(dailyGoals) {
  return {
    calories: dailyGoals.calories * 7,
    protein: dailyGoals.protein * 7,
    carbs: dailyGoals.carbs * 7,
    fat: dailyGoals.fat * 7,
  };
}

/**
 * Calculate monthly goals (30 days)
 * @param {object} dailyGoals - { calories, protein, carbs, fat }
 * @returns {object} Monthly goals
 */
export function calculateMonthlyGoals(dailyGoals) {
  return {
    calories: dailyGoals.calories * 30,
    protein: dailyGoals.protein * 30,
    carbs: dailyGoals.carbs * 30,
    fat: dailyGoals.fat * 30,
  };
}

/**
 * Calculate net progress score (0-100)
 * @param {object} data - { deficit, targetDeficit, proteinActual, proteinTarget }
 * @returns {number} Score 0-100
 */
export function calculateProgressScore(data) {
  const { deficit, targetDeficit, proteinActual, proteinTarget } = data;
  
  // Calorie score: up to 50 points
  // Full points if deficit >= target deficit
  const deficitRatio = Math.min(1, deficit / (targetDeficit || 1));
  const calorieScore = Math.round(deficitRatio * 50);
  
  // Protein score: up to 50 points
  // Full points if protein >= target
  const proteinRatio = Math.min(1, proteinActual / (proteinTarget || 1));
  const proteinScore = Math.round(proteinRatio * 50);
  
  return Math.min(100, calorieScore + proteinScore);
}

/**
 * Calculate projected fat loss from deficit
 * @param {number} deficit - Calorie deficit
 * @returns {number} Projected pounds of fat loss
 */
export function calculateProjectedFatLoss(deficit) {
  const caloriesPerPound = 3500;
  return Number((deficit / caloriesPerPound).toFixed(1));
}

/**
 * Sum macros from food log
 * @param {array} foods - Array of food entries
 * @param {boolean} confirmedOnly - Only count confirmed foods
 * @returns {object} { calories, protein, carbs, fat }
 */
export function sumMacros(foods, confirmedOnly = false) {
  const filtered = confirmedOnly ? foods.filter(f => f.confirmed) : foods;
  
  return filtered.reduce((acc, food) => ({
    calories: acc.calories + (food.calories || 0),
    protein: acc.protein + (food.protein || 0),
    carbs: acc.carbs + (food.carbs || 0),
    fat: acc.fat + (food.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

/**
 * Calculate remaining macros
 * @param {object} goals - Target macros
 * @param {object} eaten - Already eaten macros
 * @param {object} planned - Planned macros
 * @returns {object} Remaining macros
 */
export function calculateRemaining(goals, eaten, planned) {
  return {
    calories: goals.calories - eaten.calories - planned.calories,
    protein: goals.protein - eaten.protein - planned.protein,
    carbs: goals.carbs - eaten.carbs - planned.carbs,
    fat: goals.fat - eaten.fat - planned.fat,
  };
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return num.toLocaleString();
}

/**
 * Get day of week index (0 = Sunday)
 * @param {Date} date - Date object
 * @returns {number} Day index
 */
export function getDayIndex(date = new Date()) {
  return date.getDay();
}

/**
 * Get week start date (Sunday)
 * @param {Date} date - Reference date
 * @returns {Date} Start of week
 */
export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Generate date key for storage (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} Date key
 */
export function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0];
}

/**
 * Calculate streak from log history
 * @param {object} history - Object keyed by date with food logs
 * @returns {number} Current streak in days
 */
export function calculateStreak(history) {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateKey = getDateKey(checkDate);
    
    if (history[dateKey] && history[dateKey].length > 0) {
      streak++;
    } else if (i > 0) {
      // Allow today to be empty, but break on previous empty days
      break;
    }
  }
  
  return streak;
}

/**
 * Check if protein goal was hit for a day
 * @param {array} foods - Day's food log
 * @param {number} target - Protein target
 * @returns {boolean} Whether goal was hit
 */
export function didHitProtein(foods, target) {
  const total = sumMacros(foods, true);
  return total.protein >= target;
}

/**
 * Check if stayed under calorie budget
 * @param {array} foods - Day's food log
 * @param {number} budget - Calorie budget
 * @returns {boolean} Whether under budget
 */
export function didStayUnderBudget(foods, budget) {
  const total = sumMacros(foods, true);
  return total.calories <= budget;
}
