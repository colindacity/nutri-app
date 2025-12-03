// src/App.jsx

import React, { useState, useEffect } from 'react';
import { useAppState } from './hooks/useAppState.js';
import Onboarding from './components/Onboarding.jsx';
import Character, { CharacterWithMessage, CharacterAvatar } from './components/Character.jsx';
import { SAMPLE_FOODS, CHECK_IN_FLOWS, COIN_REWARDS } from './data/constants.js';
import { getProgressResponse, getCravingResponse, getGuiltResponse } from './utils/coachResponses.js';

// Icons (inline SVG for simplicity)
const Icons = {
  Home: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Chart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Chat: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Camera: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  X: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
};

export default function App() {
  const state = useAppState();
  const [activeTab, setActiveTab] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(null);
  
  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Character mood="calm" size={80} />
      </div>
    );
  }
  
  // Onboarding
  if (!state.user || !state.user.onboardingComplete) {
    return <Onboarding onComplete={state.completeOnboarding} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div>
          <div className="font-semibold text-gray-900">{state.user.name}</div>
          <div className="text-sm text-gray-500">{state.streak} day streak 🔥</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
            <span className="text-amber-500">🪙</span>
            <span className="font-medium text-amber-700">{state.coins}</span>
          </div>
          <button 
            onClick={() => setShowCoachModal(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md"
          >
            <Icons.Chat />
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="p-4">
        {activeTab === 'home' && (
          <HomeScreen 
            state={state}
            onAddFood={() => setShowAddModal(true)}
          />
        )}
        {activeTab === 'progress' && (
          <ProgressScreen 
            state={state}
            onCheckIn={() => setShowCheckIn('progress')}
          />
        )}
      </main>
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-around items-center">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center p-2 ${activeTab === 'home' ? 'text-black' : 'text-gray-400'}`}
        >
          <Icons.Home />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 -mt-6 bg-black rounded-full flex items-center justify-center shadow-lg text-white"
        >
          <Icons.Plus />
        </button>
        
        <button 
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center p-2 ${activeTab === 'progress' ? 'text-black' : 'text-gray-400'}`}
        >
          <Icons.Chart />
          <span className="text-xs mt-1">Progress</span>
        </button>
      </nav>
      
      {/* Floating SOS button */}
      <button
        onClick={() => setShowCheckIn('craving')}
        className="fixed bottom-24 right-4 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        <Icons.Heart />
      </button>
      
      {/* Character popup */}
      {state.character.show && (
        <CharacterWithMessage
          mood={state.character.mood}
          message={state.character.message}
          coins={state.character.coins}
          onDismiss={() => state.showCharacter('calm', '', 0)}
        />
      )}
      
      {/* Modals */}
      {showAddModal && (
        <AddFoodModal
          onClose={() => setShowAddModal(false)}
          onAdd={(food, asPlanned) => {
            state.addFood(food, asPlanned);
            setShowAddModal(false);
          }}
        />
      )}
      
      {showCoachModal && (
        <CoachModal
          state={state}
          onClose={() => setShowCoachModal(false)}
          onStartCheckIn={(type) => {
            setShowCoachModal(false);
            setShowCheckIn(type);
          }}
        />
      )}
      
      {showCheckIn && (
        <CheckInModal
          type={showCheckIn}
          state={state}
          onClose={() => setShowCheckIn(null)}
        />
      )}
    </div>
  );
}

// Home Screen
function HomeScreen({ state, onAddFood }) {
  const [viewMode, setViewMode] = useState('left'); // left, eaten, planned, total
  const [timeframe, setTimeframe] = useState('day'); // day, week, month
  
  const goals = timeframe === 'day' 
    ? state.dailyGoals 
    : timeframe === 'week' 
      ? state.weeklyGoals 
      : state.monthlyGoals;
  
  const getDisplayValue = () => {
    switch (viewMode) {
      case 'left':
        return goals.calories - state.projectedMacros.calories;
      case 'eaten':
        return state.eatenMacros.calories;
      case 'planned':
        return state.plannedMacros.calories;
      case 'total':
        return state.projectedMacros.calories;
      default:
        return goals.calories - state.projectedMacros.calories;
    }
  };
  
  const getDisplayLabel = () => {
    switch (viewMode) {
      case 'left': return 'left';
      case 'eaten': return 'eaten';
      case 'planned': return 'planned';
      case 'total': return 'projected';
      default: return 'left';
    }
  };
  
  const displayValue = getDisplayValue();
  const progress = Math.min(100, (state.projectedMacros.calories / goals.calories) * 100);
  
  // Week days for selector
  const weekDays = [];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }
  
  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };
  
  const isSelected = (date) => {
    return date.toDateString() === state.currentDate.toDateString();
  };
  
  return (
    <div className="space-y-4">
      {/* Week day selector */}
      <div className="flex justify-between bg-white rounded-2xl p-3 shadow-sm">
        {weekDays.map((day, i) => (
          <button
            key={i}
            onClick={() => state.goToDate(day)}
            className={`w-10 h-10 rounded-full flex flex-col items-center justify-center text-sm ${
              isSelected(day)
                ? 'bg-black text-white'
                : isToday(day)
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500'
            }`}
          >
            <span className="text-xs">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
            <span className="font-medium">{day.getDate()}</span>
          </button>
        ))}
      </div>
      
      {/* Timeframe toggle */}
      <div className="flex gap-2">
        {['day', 'week', 'month'].map(tf => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              timeframe === tf
                ? 'bg-black text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Main calorie card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Calories</h2>
          <span className="text-sm text-gray-500">Goal: {goals.calories.toLocaleString()}</span>
        </div>
        
        {/* Ring + number */}
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48">
            {/* Background ring */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="12"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke={displayValue < 0 ? '#ef4444' : '#22c55e'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${progress * 5.53} 553`}
                className="transition-all duration-500"
              />
            </svg>
            {/* Center number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${displayValue < 0 ? 'text-red-500' : 'text-gray-900'}`}>
                {displayValue < 0 ? '' : ''}{Math.abs(displayValue).toLocaleString()}
              </span>
              <span className="text-gray-500">{getDisplayLabel()}</span>
            </div>
          </div>
        </div>
        
        {/* View mode toggle */}
        <div className="flex gap-2 justify-center">
          {['left', 'eaten', 'planned', 'total'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                viewMode === mode
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Quick stats */}
        <div className="flex justify-around mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{state.eatenMacros.calories}</div>
            <div className="text-xs text-gray-500">Eaten</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-amber-500">{state.plannedMacros.calories}</div>
            <div className="text-xs text-gray-500">Planned</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {Math.max(0, goals.calories - state.projectedMacros.calories)}
            </div>
            <div className="text-xs text-gray-500">Remaining</div>
          </div>
        </div>
      </div>
      
      {/* Macro cards */}
      <div className="grid grid-cols-3 gap-3">
        <MacroCard 
          label="Protein" 
          emoji="🍖"
          current={state.projectedMacros.protein}
          goal={goals.protein}
          color="#ef4444"
        />
        <MacroCard 
          label="Carbs" 
          emoji="🌾"
          current={state.projectedMacros.carbs}
          goal={goals.carbs}
          color="#22c55e"
        />
        <MacroCard 
          label="Fat" 
          emoji="🫒"
          current={state.projectedMacros.fat}
          goal={goals.fat}
          color="#3b82f6"
        />
      </div>
      
      {/* Food log */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Today's Log</h3>
          <button 
            onClick={onAddFood}
            className="text-sm text-blue-500 font-medium"
          >
            + Add
          </button>
        </div>
        
        {state.foodLog.length === 0 ? (
          <div className="p-8 text-center">
            <Character mood="calm" size={60} />
            <p className="text-gray-500 mt-4">No food logged yet</p>
            <button 
              onClick={onAddFood}
              className="mt-4 px-6 py-2 bg-black text-white rounded-full text-sm font-medium"
            >
              Log your first meal
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {state.foodLog.map(food => (
              <FoodLogItem 
                key={food.id}
                food={food}
                onConfirm={() => state.confirmFood(food.id)}
                onRemove={() => state.removeFood(food.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MacroCard({ label, emoji, current, goal, color }) {
  const progress = Math.min(100, (current / goal) * 100);
  
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <div className="flex items-center gap-1 mb-2">
        <span>{emoji}</span>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="relative w-12 h-12 mx-auto mb-2">
        <svg className="w-full h-full -rotate-90">
          <circle cx="24" cy="24" r="20" fill="none" stroke="#f3f4f6" strokeWidth="4" />
          <circle 
            cx="24" 
            cy="24" 
            r="20" 
            fill="none" 
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${progress * 1.26} 126`}
          />
        </svg>
      </div>
      <div className="text-center">
        <span className="font-semibold text-gray-900">{current}</span>
        <span className="text-gray-400 text-sm">/{goal}g</span>
      </div>
    </div>
  );
}

function FoodLogItem({ food, onConfirm, onRemove }) {
  return (
    <div className={`p-4 flex items-center gap-3 ${!food.confirmed ? 'bg-amber-50' : ''}`}>
      {/* Confirm button for planned items */}
      {!food.confirmed ? (
        <button 
          onClick={onConfirm}
          className="w-6 h-6 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-400 hover:bg-amber-100"
        >
          <Icons.Check />
        </button>
      ) : (
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
          <Icons.Check />
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className={`font-medium ${!food.confirmed ? 'text-amber-700' : 'text-gray-900'}`}>
              {food.name}
            </div>
            <div className="text-sm text-gray-500">
              {food.time} {!food.confirmed && '• Planned'}
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-900">{food.calories}</div>
            <div className="text-xs text-gray-500">
              P:{food.protein} C:{food.carbs} F:{food.fat}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Food Modal
function AddFoodModal({ onClose, onAdd }) {
  const [mode, setMode] = useState('text'); // text or photo
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  
  const handleAnalyze = () => {
    if (!input.trim()) return;
    
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      // Find a matching sample food or create a generic one
      const matchingSample = SAMPLE_FOODS.find(f => 
        input.toLowerCase().includes(f.name.toLowerCase().split(' ')[0])
      );
      
      if (matchingSample) {
        setResult(matchingSample);
      } else {
        // Generate a reasonable estimate
        setResult({
          name: input.charAt(0).toUpperCase() + input.slice(1),
          calories: Math.round(300 + Math.random() * 400),
          protein: Math.round(15 + Math.random() * 25),
          carbs: Math.round(20 + Math.random() * 40),
          fat: Math.round(10 + Math.random() * 20),
          items: [{ name: input, calories: 350, protein: 20, carbs: 30, fat: 15 }],
        });
      }
      
      setAnalyzing(false);
    }, 1500);
  };
  
  const handleAdd = (asPlanned) => {
    if (result) {
      onAdd(result, asPlanned);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-auto animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Add Food</h2>
          <button onClick={onClose} className="p-2">
            <Icons.X />
          </button>
        </div>
        
        {/* Mode toggle */}
        <div className="flex gap-2 p-4">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              mode === 'text' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Describe
          </button>
          <button
            onClick={() => setMode('photo')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'photo' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Icons.Camera /> Photo
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {!result && !analyzing && (
            <>
              {mode === 'text' ? (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. chipotle bowl with chicken, rice, beans, and guac"
                  className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:border-black outline-none"
                  autoFocus
                />
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                  <Icons.Camera />
                  <p className="text-gray-500 mt-2">Tap to take a photo</p>
                </div>
              )}
              
              <button
                onClick={handleAnalyze}
                disabled={!input.trim()}
                className={`w-full mt-4 py-4 rounded-xl font-semibold transition-all ${
                  input.trim()
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                Analyze with AI
              </button>
              
              {/* Quick add samples */}
              <div className="mt-6">
                <div className="text-sm text-gray-500 mb-3">Quick add</div>
                <div className="space-y-2">
                  {SAMPLE_FOODS.slice(0, 3).map(food => (
                    <button
                      key={food.id}
                      onClick={() => onAdd(food, false)}
                      className="w-full p-3 bg-gray-50 rounded-xl text-left flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-900">{food.name}</span>
                      <span className="text-gray-500">{food.calories} cal</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {analyzing && (
            <div className="py-12 text-center">
              <Character mood="thinking" size={100} />
              <p className="text-gray-600 mt-4">Analyzing...</p>
            </div>
          )}
          
          {result && !analyzing && (
            <div className="space-y-4">
              {/* Result card */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">{result.name}</h3>
                
                {/* Macros */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{result.calories}</div>
                    <div className="text-xs text-gray-500">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{result.protein}g</div>
                    <div className="text-xs text-gray-500">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{result.carbs}g</div>
                    <div className="text-xs text-gray-500">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{result.fat}g</div>
                    <div className="text-xs text-gray-500">Fat</div>
                  </div>
                </div>
                
                {/* Item breakdown */}
                {result.items && result.items.length > 1 && (
                  <div className="border-t border-gray-200 pt-3">
                    <div className="text-sm text-gray-500 mb-2">Breakdown</div>
                    {result.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm py-1">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-500">{item.calories} cal</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Fix it button */}
              <button
                onClick={() => {
                  setResult(null);
                  setInput('');
                }}
                className="w-full py-3 border border-gray-300 rounded-xl text-gray-600"
              >
                Fix with AI
              </button>
              
              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAdd(true)}
                  className="py-4 rounded-xl font-semibold bg-amber-100 text-amber-700"
                >
                  Plan for Later
                </button>
                <button
                  onClick={() => handleAdd(false)}
                  className="py-4 rounded-xl font-semibold bg-black text-white"
                >
                  Log as Eaten
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Progress Screen
function ProgressScreen({ state, onCheckIn }) {
  const [timeframe, setTimeframe] = useState('7days');
  
  // Calculate stats for different timeframes
  const getTimeframeStats = () => {
    const today = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case '30days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case '90days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
    }
    
    return state.getStats(startDate, today);
  };
  
  const stats = getTimeframeStats();
  const projectedFatLoss = (stats.deficit / 3500).toFixed(1);
  const proteinHitRate = stats.daysTracked > 0 
    ? Math.round((stats.proteinHitDays / stats.daysTracked) * 100) 
    : 0;
  
  // Calculate net progress score
  const deficitScore = Math.min(50, (stats.deficit / (stats.targetCalories * 0.15)) * 50);
  const proteinScore = (proteinHitRate / 100) * 50;
  const netScore = Math.round(Math.max(0, deficitScore + proteinScore));
  
  return (
    <div className="space-y-4">
      {/* Timeframe selector */}
      <div className="flex gap-2">
        {[
          { key: '7days', label: '7 Days' },
          { key: '30days', label: '30 Days' },
          { key: '90days', label: '90 Days' },
        ].map(tf => (
          <button
            key={tf.key}
            onClick={() => setTimeframe(tf.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              timeframe === tf.key
                ? 'bg-black text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
      
      {/* Net Progress Score */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-purple-200 text-sm">Net Progress Score</div>
            <div className="text-5xl font-bold">{netScore}</div>
          </div>
          <div className="text-right text-sm">
            <div className="text-purple-200">Projected fat loss</div>
            <div className="text-2xl font-bold">{projectedFatLoss} lbs</div>
          </div>
        </div>
        
        {/* Score breakdown bars */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm text-purple-200 mb-1">
              <span>Calorie deficit</span>
              <span>{stats.deficit.toLocaleString()} cal</span>
            </div>
            <div className="h-2 bg-purple-400/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, deficitScore * 2)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-purple-200 mb-1">
              <span>Protein days hit</span>
              <span>{stats.proteinHitDays}/{stats.daysTracked}</span>
            </div>
            <div className="h-2 bg-purple-400/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${proteinHitRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Check-in prompt */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <CharacterAvatar mood="supportive" size={50} />
          <div className="flex-1">
            <div className="font-medium text-gray-900">How are you feeling?</div>
            <div className="text-sm text-gray-500">Quick check-in on your progress</div>
          </div>
          <button
            onClick={onCheckIn}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
          >
            Check in
          </button>
        </div>
      </div>
      
      {/* Body composition cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Weight</div>
          <div className="text-2xl font-bold text-gray-900">{state.user.weight || '--'}</div>
          <div className="text-xs text-gray-400">lbs</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Body Fat</div>
          <div className="text-2xl font-bold text-gray-900">{state.user.bodyFat || '--'}</div>
          <div className="text-xs text-gray-400">%</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Goal</div>
          <div className="text-2xl font-bold text-green-500">{state.user.goalWeight || '--'}</div>
          <div className="text-xs text-gray-400">lbs</div>
        </div>
      </div>
      
      {/* Period summary */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Period Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Target calories</span>
            <span className="font-medium">{stats.targetCalories.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Actual calories</span>
            <span className="font-medium">{stats.totalCalories.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Net deficit</span>
            <span className={`font-medium ${stats.deficit > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.deficit > 0 ? '-' : '+'}{Math.abs(stats.deficit).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Protein target hit</span>
            <span className="font-medium">{stats.proteinHitDays} of {stats.daysTracked} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Days tracked</span>
            <span className="font-medium">{stats.daysTracked}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Coach Chat Modal
function CoachModal({ state, onClose, onStartCheckIn }) {
  const [messages, setMessages] = useState([
    { role: 'coach', text: `Hey ${state.user.name}! What can I help you with today?` }
  ]);
  const [input, setInput] = useState('');
  
  const quickActions = [
    { label: 'Check in on progress', action: () => onStartCheckIn('progress') },
    { label: 'Craving SOS', action: () => onStartCheckIn('craving') },
    { label: 'Feeling guilty', action: () => onStartCheckIn('guilt') },
  ];
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl h-[85vh] flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <CharacterAvatar mood="supportive" size={40} />
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Coach</div>
            <div className="text-xs text-gray-500">Always here for you</div>
          </div>
          <button onClick={onClose} className="p-2">
            <Icons.X />
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div 
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Quick actions */}
          {messages.length === 1 && (
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  className="w-full p-3 bg-purple-50 text-purple-700 rounded-xl text-left font-medium"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full outline-none"
            />
            <button 
              className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white"
              onClick={() => {
                if (input.trim()) {
                  setMessages(prev => [...prev, { role: 'user', text: input }]);
                  setInput('');
                  // Simulate coach response
                  setTimeout(() => {
                    setMessages(prev => [...prev, { 
                      role: 'coach', 
                      text: "I'm here to help! Try one of the quick actions above, or tell me more about what's on your mind."
                    }]);
                  }, 1000);
                }
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Check-In Modal
function CheckInModal({ type, state, onClose }) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showResponse, setShowResponse] = useState(false);
  
  const flow = CHECK_IN_FLOWS[type];
  const currentStep = flow.steps[step];
  const isLastStep = step >= flow.steps.length - 1;
  
  const handleSelect = (value) => {
    const newResponses = [...responses, value];
    setResponses(newResponses);
    
    if (isLastStep) {
      // Show personalized response
      setTimeout(() => setShowResponse(true), 300);
    } else {
      setStep(s => s + 1);
    }
  };
  
  const getPersonalizedResponse = () => {
    const stats = {
      deficit: 2500,
      proteinHitDays: 5,
      totalDays: 7,
      streak: state.streak,
      weekDeficit: 2500,
    };
    
    switch (type) {
      case 'progress':
        return getProgressResponse(responses, stats);
      case 'craving':
        return getCravingResponse(responses);
      case 'guilt':
        return getGuiltResponse(responses, stats);
      default:
        return { message: 'Thanks for checking in!', tip: '', mood: 'supportive' };
    }
  };
  
  const handleComplete = () => {
    state.awardCoins(COIN_REWARDS.completeCheckIn, 'proud', 'Great check-in!');
    onClose();
  };
  
  const response = showResponse ? getPersonalizedResponse() : null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-auto animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">{flow.title}</h2>
          <button onClick={onClose} className="p-2">
            <Icons.X />
          </button>
        </div>
        
        <div className="p-6">
          {!showResponse ? (
            <>
              {/* Character */}
              <div className="flex justify-center mb-6">
                <Character mood={flow.characterMood} size={80} />
              </div>
              
              {/* Question */}
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
                {currentStep.question}
              </h3>
              
              {/* Options */}
              <div className="space-y-3">
                {currentStep.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(option.value)}
                    className="w-full p-4 bg-gray-50 rounded-xl text-left font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
              
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-6">
                {flow.steps.map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 rounded-full ${i <= step ? 'bg-purple-500' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Personalized response */}
              <div className="flex justify-center mb-6">
                <Character mood={response.mood} size={100} />
              </div>
              
              <div className="bg-purple-50 rounded-2xl p-5 mb-4">
                <p className="text-gray-800 leading-relaxed">{response.message}</p>
              </div>
              
              {response.tip && (
                <div className="bg-amber-50 rounded-2xl p-5 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <p className="text-amber-900">{response.tip}</p>
                  </div>
                </div>
              )}
              
              {response.extra && (
                <div className="bg-blue-50 rounded-2xl p-5 mb-4">
                  <p className="text-blue-900 text-sm">{response.extra}</p>
                </div>
              )}
              
              <button
                onClick={handleComplete}
                className="w-full py-4 bg-black text-white rounded-xl font-semibold"
              >
                Thanks, I needed that
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
