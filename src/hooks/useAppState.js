// src/hooks/useAppState.js

import { useState, useEffect, useCallback } from 'react';
import { 
  saveUser, 
  loadUser, 
  saveFoodLog, 
  loadFoodLog, 
  loadAllHistory,
  saveCoins,
  loadCoins,
} from '../utils/storage.js';
import { 
  calculateDailyGoals, 
  calculateWeeklyGoals,
  calculateMonthlyGoals,
  sumMacros,
  getDateKey,
  calculateStreak,
  didHitProtein,
  didStayUnderBudget,
} from '../utils/calculations.js';
import { COIN_REWARDS, DEFAULT_USER } from '../data/constants.js';

export function useAppState() {
  // User state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Food log state
  const [foodLog, setFoodLog] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Coins and gamification
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Character state
  const [character, setCharacter] = useState({
    show: false,
    mood: 'calm',
    message: '',
    coins: 0,
  });
  
  // Initialize from storage
  useEffect(() => {
    const storedUser = loadUser();
    if (storedUser && storedUser.onboardingComplete) {
      setUser(storedUser);
    }
    
    const storedCoins = loadCoins();
    setCoins(storedCoins);
    
    const history = loadAllHistory();
    setStreak(calculateStreak(history));
    
    setLoading(false);
  }, []);
  
  // Load food log when date changes
  useEffect(() => {
    const dateKey = getDateKey(currentDate);
    const log = loadFoodLog(dateKey);
    setFoodLog(log);
  }, [currentDate]);
  
  // Calculate goals
  const dailyGoals = user ? calculateDailyGoals(user) : { calories: 2000, protein: 150, carbs: 200, fat: 67 };
  const weeklyGoals = calculateWeeklyGoals(dailyGoals);
  const monthlyGoals = calculateMonthlyGoals(dailyGoals);
  
  // Calculate eaten vs planned
  const eatenMacros = sumMacros(foodLog, true);
  const plannedMacros = sumMacros(foodLog.filter(f => !f.confirmed), false);
  const projectedMacros = sumMacros(foodLog, false);
  
  // Save user
  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      saveUser(updated);
      return updated;
    });
  }, []);
  
  // Complete onboarding
  const completeOnboarding = useCallback((newUser) => {
    saveUser(newUser);
    setUser(newUser);
    
    // Award first login coins
    const newCoins = coins + COIN_REWARDS.firstLog;
    setCoins(newCoins);
    saveCoins(newCoins);
    
    showCharacter('excited', 'Welcome! Let\'s do this!', COIN_REWARDS.firstLog);
  }, [coins]);
  
  // Add food to log
  const addFood = useCallback((food, asPlanned = false) => {
    const newFood = {
      ...food,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confirmed: !asPlanned,
      loggedAt: new Date().toISOString(),
    };
    
    setFoodLog(prev => {
      const updated = [...prev, newFood];
      const dateKey = getDateKey(currentDate);
      saveFoodLog(dateKey, updated);
      return updated;
    });
    
    // Award coins
    if (!asPlanned) {
      const newCoins = coins + COIN_REWARDS.logMeal;
      setCoins(newCoins);
      saveCoins(newCoins);
      showCharacter('happy', 'Logged!', COIN_REWARDS.logMeal);
    } else {
      showCharacter('calm', 'Planned!', 0);
    }
    
    return newFood;
  }, [coins, currentDate]);
  
  // Confirm planned food
  const confirmFood = useCallback((foodId) => {
    setFoodLog(prev => {
      const updated = prev.map(f => 
        f.id === foodId ? { ...f, confirmed: true, confirmedAt: new Date().toISOString() } : f
      );
      const dateKey = getDateKey(currentDate);
      saveFoodLog(dateKey, updated);
      return updated;
    });
    
    const newCoins = coins + COIN_REWARDS.confirmPlanned;
    setCoins(newCoins);
    saveCoins(newCoins);
    showCharacter('happy', 'Nice!', COIN_REWARDS.confirmPlanned);
  }, [coins, currentDate]);
  
  // Remove food from log
  const removeFood = useCallback((foodId) => {
    setFoodLog(prev => {
      const updated = prev.filter(f => f.id !== foodId);
      const dateKey = getDateKey(currentDate);
      saveFoodLog(dateKey, updated);
      return updated;
    });
  }, [currentDate]);
  
  // Update food in log
  const updateFood = useCallback((foodId, updates) => {
    setFoodLog(prev => {
      const updated = prev.map(f => 
        f.id === foodId ? { ...f, ...updates } : f
      );
      const dateKey = getDateKey(currentDate);
      saveFoodLog(dateKey, updated);
      return updated;
    });
  }, [currentDate]);
  
  // Show character with message
  const showCharacter = useCallback((mood, message, coinsAwarded = 0) => {
    setCharacter({
      show: true,
      mood,
      message,
      coins: coinsAwarded,
    });
    
    // Auto-hide after delay
    setTimeout(() => {
      setCharacter(prev => ({ ...prev, show: false }));
    }, 2500);
  }, []);
  
  // Award coins (for check-ins, etc.)
  const awardCoins = useCallback((amount, mood = 'happy', message = '') => {
    const newCoins = coins + amount;
    setCoins(newCoins);
    saveCoins(newCoins);
    
    if (message) {
      showCharacter(mood, message, amount);
    }
    
    return newCoins;
  }, [coins, showCharacter]);
  
  // Get stats for a date range
  const getStats = useCallback((startDate, endDate) => {
    const history = loadAllHistory();
    let totalCalories = 0;
    let totalProtein = 0;
    let proteinHitDays = 0;
    let daysTracked = 0;
    
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateKey = getDateKey(current);
      const dayLog = history[dateKey] || [];
      
      if (dayLog.length > 0) {
        const dayMacros = sumMacros(dayLog, true);
        totalCalories += dayMacros.calories;
        totalProtein += dayMacros.protein;
        daysTracked++;
        
        if (didHitProtein(dayLog, dailyGoals.protein)) {
          proteinHitDays++;
        }
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    const targetCalories = dailyGoals.calories * daysTracked;
    const deficit = targetCalories - totalCalories;
    
    return {
      totalCalories,
      totalProtein,
      proteinHitDays,
      daysTracked,
      targetCalories,
      deficit,
      proteinTarget: dailyGoals.protein * daysTracked,
    };
  }, [dailyGoals]);
  
  // Navigate dates
  const goToDate = useCallback((date) => {
    setCurrentDate(date);
  }, []);
  
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);
  
  return {
    // State
    user,
    loading,
    foodLog,
    currentDate,
    coins,
    streak,
    character,
    
    // Goals
    dailyGoals,
    weeklyGoals,
    monthlyGoals,
    
    // Calculated values
    eatenMacros,
    plannedMacros,
    projectedMacros,
    
    // Actions
    updateUser,
    completeOnboarding,
    addFood,
    confirmFood,
    removeFood,
    updateFood,
    showCharacter,
    awardCoins,
    getStats,
    goToDate,
    goToToday,
  };
}
