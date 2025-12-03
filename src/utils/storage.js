// src/utils/storage.js

const STORAGE_KEYS = {
  USER: 'nutritrack_user',
  FOOD_LOG: 'nutritrack_food_log',
  HISTORY: 'nutritrack_history',
  COINS: 'nutritrack_coins',
  ACHIEVEMENTS: 'nutritrack_achievements',
  SAVED_MEALS: 'nutritrack_saved_meals',
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save failed:', e);
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default if not found
 * @returns {any} Stored data or default
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error('Storage load failed:', e);
    return defaultValue;
  }
}

/**
 * Save user profile
 * @param {object} user - User data
 */
export function saveUser(user) {
  saveToStorage(STORAGE_KEYS.USER, user);
}

/**
 * Load user profile
 * @returns {object|null} User data
 */
export function loadUser() {
  return loadFromStorage(STORAGE_KEYS.USER, null);
}

/**
 * Save today's food log
 * @param {string} dateKey - Date key (YYYY-MM-DD)
 * @param {array} foods - Food entries
 */
export function saveFoodLog(dateKey, foods) {
  const history = loadFromStorage(STORAGE_KEYS.HISTORY, {});
  history[dateKey] = foods;
  saveToStorage(STORAGE_KEYS.HISTORY, history);
}

/**
 * Load food log for a date
 * @param {string} dateKey - Date key (YYYY-MM-DD)
 * @returns {array} Food entries
 */
export function loadFoodLog(dateKey) {
  const history = loadFromStorage(STORAGE_KEYS.HISTORY, {});
  return history[dateKey] || [];
}

/**
 * Load all history
 * @returns {object} All food logs by date
 */
export function loadAllHistory() {
  return loadFromStorage(STORAGE_KEYS.HISTORY, {});
}

/**
 * Save coins
 * @param {number} coins - Coin count
 */
export function saveCoins(coins) {
  saveToStorage(STORAGE_KEYS.COINS, coins);
}

/**
 * Load coins
 * @returns {number} Coin count
 */
export function loadCoins() {
  return loadFromStorage(STORAGE_KEYS.COINS, 0);
}

/**
 * Save achievements
 * @param {array} achievements - Achievement IDs
 */
export function saveAchievements(achievements) {
  saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements);
}

/**
 * Load achievements
 * @returns {array} Achievement IDs
 */
export function loadAchievements() {
  return loadFromStorage(STORAGE_KEYS.ACHIEVEMENTS, []);
}

/**
 * Save saved meals
 * @param {array} meals - Saved meal objects
 */
export function saveSavedMeals(meals) {
  saveToStorage(STORAGE_KEYS.SAVED_MEALS, meals);
}

/**
 * Load saved meals
 * @returns {array} Saved meals
 */
export function loadSavedMeals() {
  return loadFromStorage(STORAGE_KEYS.SAVED_MEALS, []);
}

/**
 * Clear all app data
 */
export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Export all data as JSON
 * @returns {object} All app data
 */
export function exportAllData() {
  return {
    user: loadUser(),
    history: loadAllHistory(),
    coins: loadCoins(),
    achievements: loadAchievements(),
    savedMeals: loadSavedMeals(),
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Import data from JSON
 * @param {object} data - Exported data object
 */
export function importData(data) {
  if (data.user) saveUser(data.user);
  if (data.history) saveToStorage(STORAGE_KEYS.HISTORY, data.history);
  if (data.coins) saveCoins(data.coins);
  if (data.achievements) saveAchievements(data.achievements);
  if (data.savedMeals) saveSavedMeals(data.savedMeals);
}

export { STORAGE_KEYS };
