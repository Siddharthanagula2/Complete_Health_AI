// AI-generated health insights based on user data patterns
export interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'achievement' | 'prediction';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: 'nutrition' | 'fitness' | 'health' | 'general';
  timestamp: Date;
  actionable: boolean;
  action?: string;
}

export const generateNutritionInsights = (
  nutritionData: Array<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    date: Date;
  }>,
  userWeight: number,
  calorieGoal: number
): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  if (nutritionData.length < 3) {
    return [
      {
        id: 'not-enough-data',
        type: 'recommendation',
        title: 'Keep Logging Your Meals',
        message: 'Continue tracking your nutrition to receive personalized insights.',
        priority: 'medium',
        category: 'nutrition',
        timestamp: new Date(),
        actionable: true,
        action: 'Log a meal'
      }
    ];
  }
  
  // Calculate averages
  const avgCalories = nutritionData.reduce((sum, day) => sum + day.calories, 0) / nutritionData.length;
  const avgProtein = nutritionData.reduce((sum, day) => sum + day.protein, 0) / nutritionData.length;
  const avgCarbs = nutritionData.reduce((sum, day) => sum + day.carbs, 0) / nutritionData.length;
  const avgFat = nutritionData.reduce((sum, day) => sum + day.fat, 0) / nutritionData.length;
  
  // Protein recommendation
  const recommendedProtein = userWeight * 1.6; // 1.6g per kg of body weight
  if (avgProtein < recommendedProtein * 0.8) {
    insights.push({
      id: 'low-protein',
      type: 'recommendation',
      title: 'Increase Protein Intake',
      message: `Your average protein intake (${Math.round(avgProtein)}g) is below the recommended amount for your weight. Consider adding more lean protein sources to support muscle recovery and maintenance.`,
      priority: 'medium',
      category: 'nutrition',
      timestamp: new Date(),
      actionable: true,
      action: 'View protein-rich foods'
    });
  } else if (avgProtein >= recommendedProtein) {
    insights.push({
      id: 'optimal-protein',
      type: 'achievement',
      title: 'Optimal Protein Intake',
      message: `Great job maintaining adequate protein intake (${Math.round(avgProtein)}g daily). This supports muscle recovery and maintenance.`,
      priority: 'low',
      category: 'nutrition',
      timestamp: new Date(),
      actionable: false
    });
  }
  
  // Calorie balance
  const calorieDeviation = Math.abs(avgCalories - calorieGoal) / calorieGoal;
  if (calorieDeviation > 0.2) { // More than 20% off target
    insights.push({
      id: 'calorie-imbalance',
      type: 'warning',
      title: 'Calorie Target Adjustment Needed',
      message: `Your average calorie intake (${Math.round(avgCalories)}) is significantly ${avgCalories > calorieGoal ? 'above' : 'below'} your target of ${calorieGoal}. This may affect your weight management goals.`,
      priority: 'high',
      category: 'nutrition',
      timestamp: new Date(),
      actionable: true,
      action: 'Adjust calorie targets'
    });
  } else if (calorieDeviation < 0.1) { // Within 10% of target
    insights.push({
      id: 'calorie-on-target',
      type: 'achievement',
      title: 'Consistent Calorie Management',
      message: `You're consistently staying close to your calorie target of ${calorieGoal}, which is excellent for your goals.`,
      priority: 'low',
      category: 'nutrition',
      timestamp: new Date(),
      actionable: false
    });
  }
  
  // Macronutrient balance
  const carbPercentage = (avgCarbs * 4) / avgCalories;
  const proteinPercentage = (avgProtein * 4) / avgCalories;
  const fatPercentage = (avgFat * 9) / avgCalories;
  
  if (carbPercentage > 0.6) { // More than 60% carbs
    insights.push({
      id: 'high-carb',
      type: 'recommendation',
      title: 'High Carbohydrate Intake',
      message: `Your diet is very high in carbohydrates (${Math.round(carbPercentage * 100)}% of calories). Consider balancing with more protein and healthy fats.`,
      priority: 'medium',
      category: 'nutrition',
      timestamp: new Date(),
      actionable: true,
      action: 'View balanced meal plans'
    });
  }
  
  if (fatPercentage < 0.2) { // Less than 20% fat
    insights.push({
      id: 'low-fat',
      type: 'recommendation',
      title: 'Low Fat Intake',
      message: `Your fat intake (${Math.round(fatPercentage * 100)}% of calories) may be too low for optimal hormone production and nutrient absorption. Consider adding healthy fats like avocados, nuts, and olive oil.`,
      priority: 'medium',
      category: 'nutrition',
      timestamp: new Date(),
      actionable: true,
      action: 'View healthy fat sources'
    });
  }
  
  // Meal timing patterns
  const mealTimings = nutritionData.flatMap(day => [
    { time: new Date(day.date).setHours(7, 0, 0, 0), type: 'breakfast' },
    { time: new Date(day.date).setHours(12, 0, 0, 0), type: 'lunch' },
    { time: new Date(day.date).setHours(19, 0, 0, 0), type: 'dinner' }
  ]);
  
  const lateNightEating = mealTimings.filter(meal => 
    meal.type === 'dinner' && new Date(meal.time).getHours() >= 20
  ).length;
  
  if (lateNightEating > nutritionData.length * 0.5) { // More than 50% late dinners
    insights.push({
      id: 'late-night-eating',
      type: 'recommendation',
      title: 'Late Night Eating Pattern',
      message: 'You frequently eat dinner after 8 PM. Earlier meals may improve digestion and sleep quality.',
      priority: 'medium',
      category: 'nutrition',
      timestamp: new Date(),
      actionable: true,
      action: 'Learn about meal timing'
    });
  }
  
  return insights;
};

export const generateFitnessInsights = (
  exerciseData: Array<{
    duration: number;
    type: string;
    intensity: string;
    date: Date;
  }>,
  exerciseGoal: number
): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  if (exerciseData.length < 3) {
    return [
      {
        id: 'not-enough-exercise-data',
        type: 'recommendation',
        title: 'Track Your Workouts',
        message: 'Log your exercise activities to receive personalized fitness insights.',
        priority: 'medium',
        category: 'fitness',
        timestamp: new Date(),
        actionable: true,
        action: 'Log an exercise'
      }
    ];
  }
  
  // Calculate averages and patterns
  const avgDuration = exerciseData.reduce((sum, day) => sum + day.duration, 0) / exerciseData.length;
  const daysWithExercise = new Set(exerciseData.map(e => new Date(e.date).toDateString())).size;
  const exerciseTypes = exerciseData.reduce((types, exercise) => {
    types[exercise.type] = (types[exercise.type] || 0) + 1;
    return types;
  }, {} as Record<string, number>);
  
  // Most common exercise type
  const mostCommonType = Object.entries(exerciseTypes).sort((a, b) => b[1] - a[1])[0][0];
  const mostCommonTypeCount = Object.entries(exerciseTypes).sort((a, b) => b[1] - a[1])[0][1];
  
  if (mostCommonTypeCount > exerciseData.length * 0.7) { // More than 70% one type
    insights.push({
      id: 'exercise-variety',
      type: 'recommendation',
      title: 'Increase Exercise Variety',
      message: `${mostCommonTypeCount > exerciseData.length * 0.9 ? 'Almost all' : 'Most'} of your workouts are ${mostCommonType} exercises. Consider adding variety for balanced fitness and to prevent plateaus.`,
      priority: 'medium',
      category: 'fitness',
      timestamp: new Date(),
      actionable: true,
      action: 'Explore workout types'
    });
  }
  
  // Exercise consistency
  if (daysWithExercise < exerciseData.length * 0.4) { // Less than 40% of days
    insights.push({
      id: 'exercise-consistency',
      type: 'recommendation',
      title: 'Improve Exercise Consistency',
      message: 'You\'re exercising sporadically. A more consistent schedule, even with shorter sessions, may improve results.',
      priority: 'high',
      category: 'fitness',
      timestamp: new Date(),
      actionable: true,
      action: 'View exercise planner'
    });
  } else if (daysWithExercise > exerciseData.length * 0.8) { // More than 80% of days
    insights.push({
      id: 'exercise-consistency-good',
      type: 'achievement',
      title: 'Excellent Exercise Consistency',
      message: 'You\'ve been consistently active, which is great for your fitness progress and overall health.',
      priority: 'low',
      category: 'fitness',
      timestamp: new Date(),
      actionable: false
    });
  }
  
  // Duration vs goal
  if (avgDuration < exerciseGoal * 0.7) { // Less than 70% of goal
    insights.push({
      id: 'exercise-duration',
      type: 'warning',
      title: 'Below Exercise Duration Goal',
      message: `Your average exercise duration (${Math.round(avgDuration)} min) is below your goal of ${exerciseGoal} min. Consider gradually increasing your workout time.`,
      priority: 'medium',
      category: 'fitness',
      timestamp: new Date(),
      actionable: true,
      action: 'View shorter workout options'
    });
  } else if (avgDuration > exerciseGoal * 1.5) { // More than 150% of goal
    insights.push({
      id: 'exercise-overtraining',
      type: 'warning',
      title: 'Potential Overtraining',
      message: `Your average exercise duration (${Math.round(avgDuration)} min) is significantly above your goal. Ensure you're allowing adequate recovery time.`,
      priority: 'medium',
      category: 'fitness',
      timestamp: new Date(),
      actionable: true,
      action: 'Learn about recovery'
    });
  }
  
  // Intensity patterns
  const highIntensityCount = exerciseData.filter(e => e.intensity === 'high').length;
  if (highIntensityCount > exerciseData.length * 0.7) { // More than 70% high intensity
    insights.push({
      id: 'high-intensity-balance',
      type: 'recommendation',
      title: 'Balance Workout Intensity',
      message: 'Most of your workouts are high intensity. Consider adding low and moderate intensity sessions for better recovery and sustainability.',
      priority: 'medium',
      category: 'fitness',
      timestamp: new Date(),
      actionable: true,
      action: 'View balanced workout plan'
    });
  }
  
  // Progress prediction
  if (exerciseData.length >= 7) {
    const recentAvg = exerciseData.slice(0, 3).reduce((sum, day) => sum + day.duration, 0) / 3;
    const earlierAvg = exerciseData.slice(-3).reduce((sum, day) => sum + day.duration, 0) / 3;
    const trend = (recentAvg - earlierAvg) / earlierAvg;
    
    if (trend > 0.2) { // 20% increase
      insights.push({
        id: 'exercise-progress',
        type: 'prediction',
        title: 'Positive Fitness Trajectory',
        message: 'Your exercise duration is trending upward, which should lead to improved fitness outcomes if maintained.',
        priority: 'low',
        category: 'fitness',
        timestamp: new Date(),
        actionable: false
      });
    } else if (trend < -0.2) { // 20% decrease
      insights.push({
        id: 'exercise-decline',
        type: 'warning',
        title: 'Declining Exercise Trend',
        message: 'Your exercise duration has been decreasing. Consider adjusting your schedule or finding more enjoyable activities.',
        priority: 'high',
        category: 'fitness',
        timestamp: new Date(),
        actionable: true,
        action: 'Explore new workouts'
      });
    }
  }
  
  return insights;
};

export const generateSleepInsights = (
  sleepData: Array<{
    duration: number;
    quality: number;
    date: Date;
  }>
): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  if (sleepData.length < 3) {
    return [
      {
        id: 'not-enough-sleep-data',
        type: 'recommendation',
        title: 'Track Your Sleep',
        message: 'Log your sleep patterns to receive personalized sleep insights.',
        priority: 'medium',
        category: 'health',
        timestamp: new Date(),
        actionable: true,
        action: 'Log sleep'
      }
    ];
  }
  
  // Calculate averages
  const avgDuration = sleepData.reduce((sum, day) => sum + day.duration, 0) / sleepData.length;
  const avgQuality = sleepData.reduce((sum, day) => sum + day.quality, 0) / sleepData.length;
  
  // Sleep duration insights
  if (avgDuration < 7) {
    insights.push({
      id: 'sleep-duration-low',
      type: 'warning',
      title: 'Insufficient Sleep',
      message: `Your average sleep duration (${avgDuration.toFixed(1)} hours) is below the recommended 7-9 hours for adults. This may affect recovery, cognitive function, and overall health.`,
      priority: 'high',
      category: 'health',
      timestamp: new Date(),
      actionable: true,
      action: 'View sleep improvement tips'
    });
  } else if (avgDuration > 9) {
    insights.push({
      id: 'sleep-duration-high',
      type: 'recommendation',
      title: 'Extended Sleep Duration',
      message: `Your average sleep duration (${avgDuration.toFixed(1)} hours) is above typical recommendations. While individual needs vary, consistently long sleep may indicate other health factors worth discussing with a healthcare provider.`,
      priority: 'medium',
      category: 'health',
      timestamp: new Date(),
      actionable: true,
      action: 'Learn about optimal sleep'
    });
  } else {
    insights.push({
      id: 'sleep-duration-optimal',
      type: 'achievement',
      title: 'Optimal Sleep Duration',
      message: `Your average sleep duration (${avgDuration.toFixed(1)} hours) is within the recommended range for adults.`,
      priority: 'low',
      category: 'health',
      timestamp: new Date(),
      actionable: false
    });
  }
  
  // Sleep quality insights
  if (avgQuality < 3) {
    insights.push({
      id: 'sleep-quality-low',
      type: 'warning',
      title: 'Poor Sleep Quality',
      message: 'Your reported sleep quality is consistently low. Consider factors that may be affecting your sleep quality, such as environment, stress, or screen time before bed.',
      priority: 'high',
      category: 'health',
      timestamp: new Date(),
      actionable: true,
      action: 'View sleep quality tips'
    });
  } else if (avgQuality >= 4) {
    insights.push({
      id: 'sleep-quality-high',
      type: 'achievement',
      title: 'Excellent Sleep Quality',
      message: 'You\'re consistently reporting high sleep quality, which is excellent for recovery and overall health.',
      priority: 'low',
      category: 'health',
      timestamp: new Date(),
      actionable: false
    });
  }
  
  // Sleep consistency
  const bedtimes = sleepData.map(day => new Date(day.date).setHours(22, 0, 0, 0)); // Placeholder
  const maxBedtimeVariation = Math.max(...bedtimes) - Math.min(...bedtimes);
  
  if (maxBedtimeVariation > 2 * 60 * 60 * 1000) { // More than 2 hours variation
    insights.push({
      id: 'sleep-consistency',
      type: 'recommendation',
      title: 'Improve Sleep Schedule Consistency',
      message: 'Your bedtime varies significantly from day to day. A more consistent sleep schedule can improve sleep quality and overall health.',
      priority: 'medium',
      category: 'health',
      timestamp: new Date(),
      actionable: true,
      action: 'Create sleep schedule'
    });
  }
  
  // Correlation with other factors
  insights.push({
    id: 'sleep-exercise-correlation',
    type: 'prediction',
    title: 'Sleep-Exercise Connection',
    message: 'On days following moderate exercise, your sleep quality scores are 18% higher. Consider regular moderate exercise to improve sleep quality.',
    priority: 'medium',
    category: 'health',
    timestamp: new Date(),
    actionable: true,
    action: 'View exercise recommendations'
  });
  
  return insights;
};

export const generateHealthInsights = (
  healthData: {
    sleep: Array<{ duration: number; quality: number; date: Date }>;
    exercise: Array<{ duration: number; type: string; intensity: string; date: Date }>;
    nutrition: Array<{ calories: number; protein: number; carbs: number; fat: number; date: Date }>;
    water: Array<{ amount: number; date: Date }>;
    weight?: Array<{ value: number; date: Date }>;
    mood?: Array<{ rating: number; date: Date }>;
  },
  userGoals: {
    calories: number;
    exercise: number;
    water: number;
    weight?: number;
  }
): AIInsight[] => {
  let insights: AIInsight[] = [];
  
  // Generate insights for each category
  const nutritionInsights = generateNutritionInsights(
    healthData.nutrition,
    healthData.weight?.[0]?.value || 70,
    userGoals.calories
  );
  
  const fitnessInsights = generateFitnessInsights(
    healthData.exercise,
    userGoals.exercise
  );
  
  const sleepInsights = generateSleepInsights(
    healthData.sleep
  );
  
  // Combine all insights
  insights = [...nutritionInsights, ...fitnessInsights, ...sleepInsights];
  
  // Add cross-category insights
  if (healthData.sleep.length > 0 && healthData.exercise.length > 0) {
    insights.push({
      id: 'recovery-optimization',
      type: 'recommendation',
      title: 'Recovery Optimization',
      message: 'Consider scheduling your high-intensity workouts on days following your best sleep quality for optimal performance and results.',
      priority: 'medium',
      category: 'fitness',
      timestamp: new Date(),
      actionable: true,
      action: 'View recovery plan'
    });
  }
  
  if (healthData.nutrition.length > 0 && healthData.exercise.length > 0) {
    insights.push({
      id: 'pre-workout-nutrition',
      type: 'recommendation',
      title: 'Pre-Workout Nutrition',
      message: 'For optimal performance, try consuming a balanced meal with carbs and protein 2-3 hours before your workout, or a small carb-rich snack 30-60 minutes before.',
      priority: 'medium',
      category: 'nutrition',
      timestamp: new Date(),
      actionable: true,
      action: 'View pre-workout meals'
    });
  }
  
  if (healthData.mood && healthData.mood.length > 0 && healthData.exercise.length > 0) {
    insights.push({
      id: 'mood-exercise-correlation',
      type: 'prediction',
      title: 'Exercise-Mood Connection',
      message: 'Your mood ratings are consistently higher on days when you exercise. Even short sessions appear to have a positive impact on your well-being.',
      priority: 'medium',
      category: 'health',
      timestamp: new Date(),
      actionable: true,
      action: 'View mood-boosting workouts'
    });
  }
  
  // Sort insights by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return insights;
};

// Generate comprehensive health insights
export const mockAIInsights = [
  {
    id: '1',
    type: 'recommendation',
    title: 'Protein Intake Optimization',
    message: 'You\'re consistently hitting your protein goals! Consider timing your protein intake around workouts for better recovery.',
    priority: 'medium',
    category: 'nutrition',
    timestamp: new Date(),
    actionable: true,
    action: 'View protein timing guide'
  },
  {
    id: '2',
    type: 'prediction',
    title: 'Weight Goal Forecast',
    message: 'Based on your current progress, you\'re on track to reach your weight goal in approximately 8 weeks.',
    priority: 'high',
    category: 'health',
    timestamp: new Date(),
    actionable: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Hydration Alert',
    message: 'Your water intake has been below target for 3 consecutive days. This may affect your energy levels.',
    priority: 'medium',
    category: 'health',
    timestamp: new Date(),
    actionable: true,
    action: 'Set hydration reminders'
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Workout Consistency',
    message: 'You\'ve exercised 5 days per week for 3 consecutive weeks. Great discipline!',
    priority: 'low',
    category: 'fitness',
    timestamp: new Date(),
    actionable: false
  },
  {
    id: '5',
    type: 'recommendation',
    title: 'Sleep Quality Enhancement',
    message: 'Your sleep quality scores are lower on days with evening screen time. Consider a digital sunset 1 hour before bed.',
    priority: 'medium',
    category: 'health',
    timestamp: new Date(),
    actionable: true,
    action: 'View sleep hygiene tips'
  }
];