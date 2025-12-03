// src/utils/coachResponses.js

/**
 * Generate personalized response for progress check-in
 * @param {array} responses - User's answers [weightFeeling, muscleFeeling]
 * @param {object} stats - User's actual stats { deficit, proteinHitDays, streak }
 * @returns {object} { message, tip, mood, extra? }
 */
export function getProgressResponse(responses, stats = {}) {
  const [weightFeeling, muscleFeeling] = responses;
  const { deficit = 0, proteinHitDays = 0, totalDays = 7, streak = 0 } = stats;
  
  const projectedLoss = (deficit / 3500).toFixed(1);
  
  if (weightFeeling === 'frustrated') {
    return {
      message: `I hear you. Weight loss isn't linear, and that's frustrating. But you've been consistent for ${streak} days. That matters more than the scale.`,
      tip: "Try focusing on non-scale wins this week: energy levels, how clothes fit, strength in workouts.",
      mood: 'supportive',
    };
  }
  
  if (weightFeeling === 'okay') {
    const encouragement = deficit > 0 
      ? `Your ${deficit.toLocaleString()} calorie deficit this week puts you on track for about ${projectedLoss} lbs of fat loss.`
      : "Patience is a skill you're building. Trust the process.";
    
    return {
      message: `Staying patient is hard but smart. ${encouragement}`,
      tip: muscleFeeling === 'neglected' 
        ? "Consider adding some resistance training to protect muscle while losing fat."
        : `Keep hitting protein - you're at ${proteinHitDays}/${totalDays} days this week.`,
      mood: 'calm',
    };
  }
  
  if (weightFeeling === 'good' || weightFeeling === 'great') {
    return {
      message: `That's what I like to hear! You're doing the work and it's showing. ${deficit > 0 ? `${projectedLoss} lbs projected fat loss this period.` : ''}`,
      tip: muscleFeeling === 'strong' 
        ? "You're in a great flow. Keep the consistency going!"
        : "Keep protein high to maximize muscle retention while you're in this groove.",
      mood: 'proud',
    };
  }
  
  return {
    message: "Thanks for checking in. Every day you show up matters.",
    tip: "Small consistent actions beat perfect sporadic ones.",
    mood: 'supportive',
  };
}

/**
 * Generate response for craving SOS
 * @param {array} responses - User's answers [cravingType, intensity]
 * @returns {object} { message, tip, mood }
 */
export function getCravingResponse(responses) {
  const [cravingType, intensity] = responses;
  
  const techniques = {
    sweet: {
      message: "Sweet cravings often signal low energy or blood sugar. Your body might actually need fuel.",
      tip: "Try a protein shake with cocoa powder, Greek yogurt with berries, or a small piece of dark chocolate. If you're genuinely hungry, eat a balanced meal instead.",
    },
    salty: {
      message: "Salty/crunchy cravings can mean stress, boredom, or actual sodium needs (especially if you've been sweating).",
      tip: "Pickles, seaweed snacks, or air-popped popcorn can hit that craving with minimal calories. If you're stressed, a short walk might help more than food.",
    },
    specific: {
      message: "When one specific food won't leave your mind, sometimes the healthiest thing is to have some. Restriction often makes cravings stronger.",
      tip: "Can you have a reasonable portion? Plan it, log it, enjoy it without guilt. A planned treat is not a failure - it's sustainable eating.",
    },
    emotional: {
      message: "This sounds like emotional hunger rather than physical hunger. That's okay - it's human. Let's pause and check in.",
      tip: "What's actually going on? Stress? Boredom? Loneliness? Tired? Try addressing the root cause. Call a friend, take a walk, or rest if you need it.",
    },
  };
  
  const response = techniques[cravingType] || techniques.emotional;
  
  // Add intensity-specific advice
  if (intensity === 'strong') {
    response.tip += "\n\nFor strong cravings: Set a 10-minute timer. Do something with your hands - walk, stretch, text someone. If you still want it after, have a portion and log it. No guilt.";
  }
  
  return {
    ...response,
    mood: 'calm',
  };
}

/**
 * Generate response for guilt/binge support
 * @param {array} responses - User's answers [whatHappened, howFeeling]
 * @param {object} stats - User's stats { weekDeficit }
 * @returns {object} { message, tip, mood, extra? }
 */
export function getGuiltResponse(responses, stats = {}) {
  const [whatHappened, howFeeling] = responses;
  const { weekDeficit = 0 } = stats;
  
  // Binge-specific response
  if (whatHappened === 'binge') {
    return {
      message: "First, thank you for being here instead of hiding. That takes courage. A binge doesn't define you or erase your progress.",
      tip: "Right now: drink water, go for a short walk if you can, be gentle with yourself. Tomorrow is a new day - not a day to restrict or punish, just a normal day. One meal doesn't change your trajectory.",
      mood: 'supportive',
      extra: "If binges are happening often, it might help to talk to a professional. This isn't about willpower - sometimes we need support untangling our relationship with food.",
    };
  }
  
  // Feels like ruined everything
  if (howFeeling === 'ruined') {
    const mathMessage = weekDeficit > 0
      ? `Let me show you the math: even a 2,000 calorie surplus is about half a pound. You've built a ${weekDeficit.toLocaleString()} calorie deficit this week. You're still ahead.`
      : "Let me put this in perspective: even a big meal doesn't undo weeks of work. Your body averages over time, not day by day.";
    
    return {
      message: `You haven't ruined anything. ${mathMessage}`,
      tip: "Don't compensate by skipping meals tomorrow - that often leads to another binge. Just return to your normal plan.",
      mood: 'calm',
    };
  }
  
  // Avoided logging
  if (whatHappened === 'avoided') {
    return {
      message: "The fact that you're here now means you're ready to face it. That's the hardest part. Logging isn't about judgment - it's just information.",
      tip: "Estimate what you had and log it. It doesn't have to be perfect. Then close the app and do something kind for yourself. Tomorrow is a fresh day.",
      mood: 'supportive',
    };
  }
  
  // General overate/off-plan
  return {
    message: "One meal, even a big one, is a tiny blip in your journey. What matters is the pattern over weeks and months. You're still on track.",
    tip: "Log what you ate, even if estimated. Then close the app and move on. No extra exercise, no skipping tomorrow's meals. Just normal.",
    mood: 'supportive',
  };
}

/**
 * Get encouraging message for various events
 * @param {string} event - Event type
 * @param {object} context - Additional context
 * @returns {object} { message, mood }
 */
export function getEncouragementMessage(event, context = {}) {
  const messages = {
    firstLog: {
      messages: [
        "First one logged! You're officially tracking.",
        "And so it begins! Great first log.",
        "Look at you go! First meal in the books.",
      ],
      mood: 'excited',
    },
    mealLogged: {
      messages: [
        "Logged!",
        "Got it!",
        "Nice!",
        "Tracked!",
      ],
      mood: 'happy',
    },
    proteinHit: {
      messages: [
        "Protein goal crushed!",
        "That's your protein for the day!",
        "Protein target: hit!",
      ],
      mood: 'proud',
    },
    underBudget: {
      messages: [
        "Under budget today!",
        "Finished strong!",
        "Day complete - well done!",
      ],
      mood: 'proud',
    },
    streakMilestone: {
      messages: [
        `${context.streak} days strong!`,
        `${context.streak} day streak!`,
        `On fire! ${context.streak} days!`,
      ],
      mood: 'excited',
    },
    planned: {
      messages: [
        "Planned!",
        "On the schedule!",
        "Ready when you are!",
      ],
      mood: 'calm',
    },
    welcomeBack: {
      messages: [
        "Welcome back!",
        "Good to see you!",
        "Ready for today?",
      ],
      mood: 'happy',
    },
  };
  
  const eventData = messages[event] || messages.mealLogged;
  const randomMessage = eventData.messages[Math.floor(Math.random() * eventData.messages.length)];
  
  return {
    message: randomMessage,
    mood: eventData.mood,
  };
}

/**
 * Generate contextual coach greeting based on time and stats
 * @param {object} stats - User stats
 * @returns {string} Greeting message
 */
export function getCoachGreeting(stats = {}) {
  const hour = new Date().getHours();
  const { streak = 0, todayCalories = 0, dailyGoal = 2000 } = stats;
  
  let timeGreeting;
  if (hour < 12) timeGreeting = "Good morning";
  else if (hour < 17) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";
  
  const greetings = [
    `${timeGreeting}! How can I help today?`,
    `${timeGreeting}! ${streak > 7 ? `${streak} days strong - impressive!` : "What's on your mind?"}`,
    `${timeGreeting}! ${todayCalories === 0 ? "Ready to plan your day?" : "How's the day going so far?"}`,
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
}
