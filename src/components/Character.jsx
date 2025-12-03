// src/components/Character.jsx

import React from 'react';
import { CHARACTER_MOODS } from '../data/constants.js';

/**
 * Headspace-inspired blob character with mood states
 * @param {string} mood - Mood key (calm, happy, excited, thinking, supportive, proud, welcome)
 * @param {number} size - Size in pixels (default 80)
 * @param {boolean} showShadow - Show drop shadow
 */
export default function Character({ mood = 'calm', size = 80, showShadow = true }) {
  const moodConfig = CHARACTER_MOODS[mood] || CHARACTER_MOODS.calm;
  const { gradient, eyeY, mouthCurve, bounce, tilt } = moodConfig;
  
  const uniqueId = `char-${mood}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Animation classes
  const animationClass = bounce 
    ? 'animate-bounce' 
    : tilt 
      ? 'animate-pulse' 
      : '';
  
  return (
    <div 
      className={`inline-block ${animationClass}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        width={size} 
        height={size}
        style={{ 
          filter: showShadow ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' : 'none',
        }}
      >
        <defs>
          {/* Main gradient */}
          <linearGradient id={`${uniqueId}-main`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
          
          {/* Inner shadow gradient */}
          <radialGradient id={`${uniqueId}-shadow`} cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          
          {/* Highlight gradient */}
          <radialGradient id={`${uniqueId}-highlight`} cx="30%" cy="20%" r="40%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        
        {/* Main body - organic blob shape */}
        <ellipse 
          cx="50" 
          cy="52" 
          rx="42" 
          ry="40" 
          fill={`url(#${uniqueId}-main)`}
        />
        
        {/* Inner shadow for depth */}
        <ellipse 
          cx="50" 
          cy="60" 
          rx="38" 
          ry="32" 
          fill={`url(#${uniqueId}-shadow)`}
        />
        
        {/* Highlight for dimension */}
        <ellipse 
          cx="38" 
          cy="35" 
          rx="20" 
          ry="15" 
          fill={`url(#${uniqueId}-highlight)`}
        />
        
        {/* Left eye */}
        <ellipse 
          cx="38" 
          cy={48 + eyeY} 
          rx="5" 
          ry="6" 
          fill="#2D3748"
        />
        {/* Left eye highlight */}
        <circle 
          cx="36" 
          cy={45 + eyeY} 
          r="2" 
          fill="white"
        />
        
        {/* Right eye */}
        <ellipse 
          cx="62" 
          cy={48 + eyeY} 
          rx="5" 
          ry="6" 
          fill="#2D3748"
        />
        {/* Right eye highlight */}
        <circle 
          cx="60" 
          cy={45 + eyeY} 
          r="2" 
          fill="white"
        />
        
        {/* Blush - left */}
        <ellipse 
          cx="28" 
          cy="58" 
          rx="6" 
          ry="4" 
          fill="#FFB6C1"
          opacity="0.5"
        />
        
        {/* Blush - right */}
        <ellipse 
          cx="72" 
          cy="58" 
          rx="6" 
          ry="4" 
          fill="#FFB6C1"
          opacity="0.5"
        />
        
        {/* Mouth - curved path based on mood */}
        <path 
          d={`M 42 65 Q 50 ${65 + mouthCurve} 58 65`}
          fill="none"
          stroke="#2D3748"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Character with speech bubble overlay
 */
export function CharacterWithMessage({ 
  mood, 
  message, 
  coins, 
  onDismiss,
  size = 100,
}) {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      onClick={onDismiss}
    >
      <div className="flex flex-col items-center pointer-events-auto animate-fadeIn">
        {/* Speech bubble */}
        {message && (
          <div className="bg-white rounded-2xl px-4 py-2 shadow-lg mb-2 max-w-xs text-center">
            <p className="text-gray-800 font-medium">
              {message}
              {coins > 0 && (
                <span className="ml-2 text-amber-500">+{coins} 🪙</span>
              )}
            </p>
            {/* Bubble tail */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
          </div>
        )}
        
        {/* Character */}
        <Character mood={mood} size={size} />
      </div>
    </div>
  );
}

/**
 * Small inline character for headers/buttons
 */
export function CharacterAvatar({ mood = 'calm', size = 40 }) {
  return (
    <div className="rounded-full overflow-hidden bg-gray-100 p-1">
      <Character mood={mood} size={size} showShadow={false} />
    </div>
  );
}
