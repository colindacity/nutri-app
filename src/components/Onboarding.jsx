// src/components/Onboarding.jsx

import React, { useState, useEffect } from 'react';
import Character from './Character.jsx';
import { ACTIVITY_LEVELS, GOALS, PROTEIN_TARGETS, DEFAULT_USER } from '../data/constants.js';
import { calculateDailyGoals, calculateBMR, calculateTDEE } from '../utils/calculations.js';

const ONBOARDING_STEPS = [
  'welcome',
  'name',
  'basics',
  'measurements',
  'activity',
  'goal',
  'protein',
  'summary',
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState({ ...DEFAULT_USER });
  const [animating, setAnimating] = useState(false);
  
  const currentStep = ONBOARDING_STEPS[step];
  
  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };
  
  const nextStep = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setAnimating(false);
      }, 300);
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      setAnimating(true);
      setTimeout(() => {
        setStep(s => s - 1);
        setAnimating(false);
      }, 300);
    }
  };
  
  const handleComplete = () => {
    const completeUser = {
      ...user,
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    };
    onComplete(completeUser);
  };
  
  // Calculate goals for summary
  const dailyGoals = calculateDailyGoals(user);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 flex flex-col">
      {/* Progress bar */}
      <div className="p-4">
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-400 to-amber-400 transition-all duration-500"
            style={{ width: `${((step + 1) / ONBOARDING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Content */}
      <div 
        className={`flex-1 flex flex-col p-6 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
      >
        {currentStep === 'welcome' && (
          <WelcomeStep onNext={nextStep} />
        )}
        
        {currentStep === 'name' && (
          <NameStep 
            value={user.name} 
            onChange={(name) => updateUser({ name })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 'basics' && (
          <BasicsStep
            age={user.age}
            sex={user.sex}
            onChange={(updates) => updateUser(updates)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 'measurements' && (
          <MeasurementsStep
            height={user.height}
            weight={user.weight}
            goalWeight={user.goalWeight}
            onChange={(updates) => updateUser(updates)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 'activity' && (
          <ActivityStep
            value={user.activityLevel}
            onChange={(activityLevel) => updateUser({ activityLevel })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 'goal' && (
          <GoalStep
            value={user.goal}
            onChange={(goal) => updateUser({ goal })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 'protein' && (
          <ProteinStep
            value={user.proteinTarget}
            weight={user.weight}
            onChange={(proteinTarget) => updateUser({ proteinTarget })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 'summary' && (
          <SummaryStep
            user={user}
            goals={dailyGoals}
            onComplete={handleComplete}
            onBack={prevStep}
          />
        )}
      </div>
    </div>
  );
}

// Individual step components

function WelcomeStep({ onNext }) {
  const [showText, setShowText] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setShowText(true), 500);
  }, []);
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="mb-8">
        <Character mood="welcome" size={140} />
      </div>
      
      <div className={`transition-all duration-700 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Hey there! 👋
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          I'm here to help you track nutrition
        </p>
        <p className="text-lg text-gray-600 mb-8">
          without the stress.
        </p>
        <p className="text-gray-500 mb-12">
          Let's set up your personalized plan.
        </p>
      </div>
      
      <button
        onClick={onNext}
        className="w-full max-w-xs bg-black text-white py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-95 transition-transform"
      >
        Let's do it
      </button>
    </div>
  );
}

function NameStep({ value, onChange, onNext, onBack }) {
  const canContinue = value && value.trim().length > 0;
  
  return (
    <div className="flex-1 flex flex-col">
      <button onClick={onBack} className="text-gray-500 self-start mb-4">
        ← Back
      </button>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <Character mood="happy" size={100} />
        
        <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
          What should I call you?
        </h2>
        <p className="text-gray-500 mb-8">
          Just your first name is fine.
        </p>
        
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your name"
          className="w-full max-w-xs text-center text-2xl py-4 border-b-2 border-gray-300 focus:border-black outline-none bg-transparent"
          autoFocus
        />
      </div>
      
      <button
        onClick={onNext}
        disabled={!canContinue}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
          canContinue 
            ? 'bg-black text-white shadow-lg active:scale-95' 
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function BasicsStep({ age, sex, onChange, onNext, onBack }) {
  const canContinue = age && sex;
  
  return (
    <div className="flex-1 flex flex-col">
      <button onClick={onBack} className="text-gray-500 self-start mb-4">
        ← Back
      </button>
      
      <div className="flex-1">
        <div className="flex justify-center mb-6">
          <Character mood="calm" size={80} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          A few basics
        </h2>
        <p className="text-gray-500 text-center mb-8">
          This helps me calculate your metabolism.
        </p>
        
        {/* Sex selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Biological sex
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => onChange({ sex: option.value })}
                className={`py-4 rounded-xl font-medium transition-all ${
                  sex === option.value
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Used for metabolic calculations only.
          </p>
        </div>
        
        {/* Age input */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Age
          </label>
          <input
            type="number"
            value={age || ''}
            onChange={(e) => onChange({ age: parseInt(e.target.value) || null })}
            placeholder="Your age"
            min="13"
            max="120"
            className="w-full py-4 px-4 text-lg border border-gray-200 rounded-xl focus:border-black outline-none bg-white"
          />
        </div>
      </div>
      
      <button
        onClick={onNext}
        disabled={!canContinue}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
          canContinue 
            ? 'bg-black text-white shadow-lg active:scale-95' 
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function MeasurementsStep({ height, weight, goalWeight, onChange, onNext, onBack }) {
  const [heightFeet, setHeightFeet] = useState(height ? Math.floor(height / 12) : '');
  const [heightInches, setHeightInches] = useState(height ? height % 12 : '');
  
  const updateHeight = (feet, inches) => {
    const totalInches = (parseInt(feet) || 0) * 12 + (parseInt(inches) || 0);
    if (totalInches > 0) {
      onChange({ height: totalInches });
    }
  };
  
  const canContinue = height && weight;
  
  return (
    <div className="flex-1 flex flex-col">
      <button onClick={onBack} className="text-gray-500 self-start mb-4">
        ← Back
      </button>
      
      <div className="flex-1">
        <div className="flex justify-center mb-6">
          <Character mood="thinking" size={80} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Let's talk numbers
        </h2>
        <p className="text-gray-500 text-center mb-8">
          I'll use these to calculate your daily targets.
        </p>
        
        {/* Height */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Height
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="number"
                value={heightFeet}
                onChange={(e) => {
                  setHeightFeet(e.target.value);
                  updateHeight(e.target.value, heightInches);
                }}
                placeholder="5"
                min="3"
                max="8"
                className="w-full py-4 px-4 text-lg border border-gray-200 rounded-xl focus:border-black outline-none bg-white"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">ft</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={heightInches}
                onChange={(e) => {
                  setHeightInches(e.target.value);
                  updateHeight(heightFeet, e.target.value);
                }}
                placeholder="10"
                min="0"
                max="11"
                className="w-full py-4 px-4 text-lg border border-gray-200 rounded-xl focus:border-black outline-none bg-white"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">in</span>
            </div>
          </div>
        </div>
        
        {/* Current weight */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Current weight
          </label>
          <div className="relative">
            <input
              type="number"
              value={weight || ''}
              onChange={(e) => onChange({ weight: parseInt(e.target.value) || null })}
              placeholder="180"
              min="50"
              max="700"
              className="w-full py-4 px-4 text-lg border border-gray-200 rounded-xl focus:border-black outline-none bg-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">lbs</span>
          </div>
        </div>
        
        {/* Goal weight (optional) */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Goal weight <span className="text-gray-400">(optional)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={goalWeight || ''}
              onChange={(e) => onChange({ goalWeight: parseInt(e.target.value) || null })}
              placeholder="165"
              min="50"
              max="700"
              className="w-full py-4 px-4 text-lg border border-gray-200 rounded-xl focus:border-black outline-none bg-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">lbs</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onNext}
        disabled={!canContinue}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
          canContinue 
            ? 'bg-black text-white shadow-lg active:scale-95' 
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function ActivityStep({ value, onChange, onNext, onBack }) {
  return (
    <div className="flex-1 flex flex-col">
      <button onClick={onBack} className="text-gray-500 self-start mb-4">
        ← Back
      </button>
      
      <div className="flex-1">
        <div className="flex justify-center mb-6">
          <Character mood="happy" size={80} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          How active are you?
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Be honest, I won't judge.
        </p>
        
        <div className="space-y-3">
          {Object.entries(ACTIVITY_LEVELS).map(([key, level]) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                value === key
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <div className="font-medium">{level.label}</div>
              <div className={`text-sm ${value === key ? 'text-gray-300' : 'text-gray-500'}`}>
                {level.description}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl font-semibold text-lg bg-black text-white shadow-lg active:scale-95 transition-transform"
      >
        Continue
      </button>
    </div>
  );
}

function GoalStep({ value, onChange, onNext, onBack }) {
  return (
    <div className="flex-1 flex flex-col">
      <button onClick={onBack} className="text-gray-500 self-start mb-4">
        ← Back
      </button>
      
      <div className="flex-1">
        <div className="flex justify-center mb-6">
          <Character mood="supportive" size={80} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          What's your main goal?
        </h2>
        <p className="text-gray-500 text-center mb-6">
          You can change this anytime.
        </p>
        
        <div className="space-y-3">
          {Object.entries(GOALS).map(([key, goal]) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                value === key
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{goal.label}</span>
                <span className={`text-sm ${value === key ? 'text-gray-300' : 'text-gray-500'}`}>
                  {goal.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl font-semibold text-lg bg-black text-white shadow-lg active:scale-95 transition-transform"
      >
        Continue
      </button>
    </div>
  );
}

function ProteinStep({ value, weight, onChange, onNext, onBack }) {
  const getProteinGrams = (key) => {
    const multiplier = PROTEIN_TARGETS[key]?.multiplier || 1.0;
    return Math.round((weight || 150) * multiplier);
  };
  
  return (
    <div className="flex-1 flex flex-col">
      <button onClick={onBack} className="text-gray-500 self-start mb-4">
        ← Back
      </button>
      
      <div className="flex-1">
        <div className="flex justify-center mb-6">
          <Character mood="thinking" size={80} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Protein priority
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Higher protein helps preserve muscle while losing fat.
        </p>
        
        <div className="space-y-3">
          {Object.entries(PROTEIN_TARGETS).map(([key, target]) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                value === key
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{target.label}</div>
                  <div className={`text-sm ${value === key ? 'text-gray-300' : 'text-gray-500'}`}>
                    {target.description}
                  </div>
                </div>
                <div className={`text-lg font-bold ${value === key ? 'text-white' : 'text-gray-900'}`}>
                  {getProteinGrams(key)}g
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl font-semibold text-lg bg-black text-white shadow-lg active:scale-95 transition-transform"
      >
        Continue
      </button>
    </div>
  );
}

function SummaryStep({ user, goals, onComplete, onBack }) {
  const [showGoals, setShowGoals] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setShowGoals(true), 500);
  }, []);
  
  return (
    <div className="flex-1 flex flex-col">
      <button onClick={onBack} className="text-gray-500 self-start mb-4">
        ← Back
      </button>
      
      <div className="flex-1">
        <div className="flex justify-center mb-6">
          <Character mood="excited" size={100} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          You're all set, {user.name}!
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Here's your personalized daily plan:
        </p>
        
        <div className={`transition-all duration-700 ${showGoals ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Calorie card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-1">
                {goals.calories.toLocaleString()}
              </div>
              <div className="text-gray-500">calories per day</div>
            </div>
          </div>
          
          {/* Macro cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-red-500">{goals.protein}g</div>
              <div className="text-sm text-gray-500">Protein</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-green-500">{goals.carbs}g</div>
              <div className="text-sm text-gray-500">Carbs</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-blue-500">{goals.fat}g</div>
              <div className="text-sm text-gray-500">Fat</div>
            </div>
          </div>
          
          {/* Weekly budget callout */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <div className="font-medium text-amber-900">Weekly budget: {(goals.calories * 7).toLocaleString()} cal</div>
                <div className="text-sm text-amber-700">
                  You can flex between days. Go over on Saturday, eat lighter on Sunday. Your weekly total is what matters.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={onComplete}
        className="w-full py-4 rounded-2xl font-semibold text-lg bg-black text-white shadow-lg active:scale-95 transition-transform"
      >
        Start tracking
      </button>
    </div>
  );
}
