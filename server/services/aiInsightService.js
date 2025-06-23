const firestoreService = require('./firestoreService');

class AIInsightService {
  async generateInsights(userId) {
    try {
      console.log('Generating insights for user:', userId);
      
      // Get user data and recent health data
      const [user, healthData] = await Promise.all([
        firestoreService.getUserById(userId),
        firestoreService.getRecentHealthData(userId, 7)
      ]);

      if (!user) {
        throw new Error('User not found');
      }

      const insights = [];

      // Generate nutrition insights
      const nutritionInsights = this.generateNutritionInsights(healthData.food, user);
      insights.push(...nutritionInsights);

      // Generate hydration insights
      const hydrationInsights = this.generateHydrationInsights(healthData.water, user);
      insights.push(...hydrationInsights);

      // Generate exercise insights
      const exerciseInsights = this.generateExerciseInsights(healthData.exercise, user);
      insights.push(...exerciseInsights);

      // Generate sleep insights
      const sleepInsights = this.generateSleepInsights(healthData.sleep);
      insights.push(...sleepInsights);

      // Generate mood insights
      const moodInsights = this.generateMoodInsights(healthData.mood);
      insights.push(...moodInsights);

      // Generate predictive insights
      const predictiveInsights = this.generatePredictiveInsights(healthData, user);
      insights.push(...predictiveInsights);

      console.log(`Generated ${insights.length} insights for user ${userId}`);
      return insights;

    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }

  generateNutritionInsights(foodEntries, user) {
    const insights = [];

    if (foodEntries.length === 0) {
      insights.push({
        id: `nutrition-no-data-${Date.now()}`,
        type: 'recommendation',
        category: 'nutrition',
        title: 'Start Tracking Your Nutrition',
        description: 'Begin logging your meals to receive personalized nutrition insights and recommendations.',
        priority: 'medium',
        actionable: true,
        recommendation: 'Log your next meal to get started with nutrition tracking.',
        timestamp: new Date()
      });
      return insights;
    }

    // Calculate average daily protein intake
    const totalProtein = foodEntries.reduce((sum, entry) => sum + (entry.protein * entry.quantity), 0);
    const avgDailyProtein = totalProtein / 7;
    const proteinPerKg = avgDailyProtein / (user.weight || 70);

    if (proteinPerKg >= 1.6) {
      insights.push({
        id: `nutrition-protein-excellent-${Date.now()}`,
        type: 'positive',
        category: 'nutrition',
        title: 'Excellent Protein Intake',
        description: `Your protein intake is outstanding at ${proteinPerKg.toFixed(1)}g per kg body weight. This supports muscle maintenance and recovery.`,
        priority: 'low',
        actionable: false,
        dataPoints: [`Daily average: ${Math.round(avgDailyProtein)}g`, `Per kg body weight: ${proteinPerKg.toFixed(1)}g/kg`],
        timestamp: new Date()
      });
    } else if (proteinPerKg < 1.0) {
      insights.push({
        id: `nutrition-protein-low-${Date.now()}`,
        type: 'warning',
        category: 'nutrition',
        title: 'Low Protein Intake Detected',
        description: `Your protein intake is below recommended levels at ${proteinPerKg.toFixed(1)}g per kg body weight.`,
        priority: 'medium',
        actionable: true,
        recommendation: 'Consider adding lean proteins like chicken, fish, eggs, or plant-based options to your meals.',
        dataPoints: [`Daily average: ${Math.round(avgDailyProtein)}g`, `Recommended: ${Math.round((user.weight || 70) * 1.2)}g+`],
        timestamp: new Date()
      });
    }

    // Check calorie consistency
    const dailyCalories = this.groupByDay(foodEntries, 'timestamp').map(day => 
      day.reduce((sum, entry) => sum + (entry.calories * entry.quantity), 0)
    );

    if (dailyCalories.length >= 3) {
      const avgCalories = dailyCalories.reduce((a, b) => a + b, 0) / dailyCalories.length;
      const variance = dailyCalories.reduce((sum, cal) => sum + Math.pow(cal - avgCalories, 2), 0) / dailyCalories.length;
      const standardDeviation = Math.sqrt(variance);

      if (standardDeviation < 200) {
        insights.push({
          id: `nutrition-consistency-good-${Date.now()}`,
          type: 'positive',
          category: 'nutrition',
          title: 'Consistent Calorie Intake',
          description: 'Your calorie intake has been very consistent, which helps maintain steady energy levels and supports your goals.',
          priority: 'low',
          actionable: false,
          dataPoints: [`Average: ${Math.round(avgCalories)} calories`, `Consistency: Excellent`],
          timestamp: new Date()
        });
      }
    }

    return insights;
  }

  generateHydrationInsights(waterEntries, user) {
    const insights = [];

    if (waterEntries.length === 0) {
      insights.push({
        id: `hydration-no-data-${Date.now()}`,
        type: 'recommendation',
        category: 'wellness',
        title: 'Start Tracking Your Hydration',
        description: 'Begin logging your water intake to ensure you stay properly hydrated throughout the day.',
        priority: 'medium',
        actionable: true,
        recommendation: 'Log your next glass of water to start tracking your hydration.',
        timestamp: new Date()
      });
      return insights;
    }

    // Group water entries by day and calculate daily totals
    const dailyWater = this.groupByDay(waterEntries, 'timestamp').map(day => 
      day.reduce((sum, entry) => sum + entry.amount, 0)
    );

    const avgDailyWater = dailyWater.reduce((a, b) => a + b, 0) / dailyWater.length;
    const avgGlasses = Math.round(avgDailyWater / 250); // Assuming 250ml per glass
    const goalGlasses = user.goals?.water || 8;

    // Check for consecutive days below goal
    const recentDays = dailyWater.slice(-3);
    const consecutiveLowDays = recentDays.filter(water => (water / 250) < goalGlasses * 0.8).length;

    if (consecutiveLowDays >= 3) {
      insights.push({
        id: `hydration-warning-${Date.now()}`,
        type: 'warning',
        category: 'wellness',
        title: 'Hydration Below Target',
        description: `Your water intake has been below target for ${consecutiveLowDays} consecutive days. This may affect your energy levels and overall health.`,
        priority: 'high',
        actionable: true,
        recommendation: 'Set hourly reminders to drink water and keep a water bottle visible throughout the day.',
        dataPoints: [`Average: ${avgGlasses} glasses`, `Goal: ${goalGlasses} glasses`, `Achievement: ${Math.round((avgGlasses / goalGlasses) * 100)}%`],
        timestamp: new Date()
      });
    } else if (avgGlasses >= goalGlasses) {
      insights.push({
        id: `hydration-excellent-${Date.now()}`,
        type: 'positive',
        category: 'wellness',
        title: 'Excellent Hydration',
        description: `You're consistently meeting your hydration goals with an average of ${avgGlasses} glasses per day.`,
        priority: 'low',
        actionable: false,
        dataPoints: [`Average: ${avgGlasses} glasses`, `Goal achievement: ${Math.round((avgGlasses / goalGlasses) * 100)}%`],
        timestamp: new Date()
      });
    }

    return insights;
  }

  generateExerciseInsights(exerciseEntries, user) {
    const insights = [];

    if (exerciseEntries.length === 0) {
      insights.push({
        id: `exercise-no-data-${Date.now()}`,
        type: 'recommendation',
        category: 'fitness',
        title: 'Start Your Fitness Journey',
        description: 'Begin tracking your workouts to monitor your progress and receive personalized fitness insights.',
        priority: 'medium',
        actionable: true,
        recommendation: 'Log your next workout or physical activity to get started.',
        timestamp: new Date()
      });
      return insights;
    }

    // Calculate total exercise time and frequency
    const totalMinutes = exerciseEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const avgDailyMinutes = totalMinutes / 7;
    const exerciseDays = new Set(exerciseEntries.map(entry => 
      new Date(entry.timestamp.seconds * 1000).toDateString()
    )).size;

    const goalMinutes = user.goals?.exercise || 45;

    if (avgDailyMinutes >= goalMinutes) {
      insights.push({
        id: `exercise-excellent-${Date.now()}`,
        type: 'positive',
        category: 'fitness',
        title: 'Outstanding Exercise Consistency',
        description: `You're exceeding your exercise goals with an average of ${Math.round(avgDailyMinutes)} minutes per day across ${exerciseDays} days.`,
        priority: 'low',
        actionable: false,
        dataPoints: [`Weekly total: ${totalMinutes} minutes`, `Active days: ${exerciseDays}/7`, `Goal achievement: ${Math.round((avgDailyMinutes / goalMinutes) * 100)}%`],
        timestamp: new Date()
      });
    } else if (exerciseDays >= 3) {
      insights.push({
        id: `exercise-good-frequency-${Date.now()}`,
        type: 'positive',
        category: 'fitness',
        title: 'Good Exercise Frequency',
        description: `You've been active on ${exerciseDays} days this week. Consider increasing duration to reach your daily goal.`,
        priority: 'medium',
        actionable: true,
        recommendation: `Try to add ${Math.round(goalMinutes - avgDailyMinutes)} more minutes to your daily routine.`,
        dataPoints: [`Active days: ${exerciseDays}/7`, `Average duration: ${Math.round(avgDailyMinutes)} min`],
        timestamp: new Date()
      });
    }

    // Analyze exercise variety
    const exerciseTypes = new Set(exerciseEntries.map(entry => entry.type));
    if (exerciseTypes.size >= 3) {
      insights.push({
        id: `exercise-variety-${Date.now()}`,
        type: 'positive',
        category: 'fitness',
        title: 'Great Exercise Variety',
        description: `You're incorporating ${exerciseTypes.size} different types of exercise, which is excellent for overall fitness.`,
        priority: 'low',
        actionable: false,
        dataPoints: [`Exercise types: ${Array.from(exerciseTypes).join(', ')}`],
        timestamp: new Date()
      });
    }

    return insights;
  }

  generateSleepInsights(sleepEntries) {
    const insights = [];

    if (sleepEntries.length === 0) {
      insights.push({
        id: `sleep-no-data-${Date.now()}`,
        type: 'recommendation',
        category: 'wellness',
        title: 'Track Your Sleep Quality',
        description: 'Start logging your sleep to understand your rest patterns and improve your recovery.',
        priority: 'medium',
        actionable: true,
        recommendation: 'Log your sleep duration and quality for tonight.',
        timestamp: new Date()
      });
      return insights;
    }

    const avgDuration = sleepEntries.reduce((sum, entry) => sum + entry.duration, 0) / sleepEntries.length;
    const avgQuality = sleepEntries.reduce((sum, entry) => sum + entry.quality, 0) / sleepEntries.length;

    if (avgDuration >= 7 && avgDuration <= 9) {
      insights.push({
        id: `sleep-duration-good-${Date.now()}`,
        type: 'positive',
        category: 'wellness',
        title: 'Optimal Sleep Duration',
        description: `Your average sleep duration of ${avgDuration.toFixed(1)} hours is within the recommended range for adults.`,
        priority: 'low',
        actionable: false,
        dataPoints: [`Average duration: ${avgDuration.toFixed(1)} hours`, `Average quality: ${avgQuality.toFixed(1)}/5`],
        timestamp: new Date()
      });
    } else if (avgDuration < 7) {
      insights.push({
        id: `sleep-duration-low-${Date.now()}`,
        type: 'warning',
        category: 'wellness',
        title: 'Insufficient Sleep Duration',
        description: `Your average sleep of ${avgDuration.toFixed(1)} hours is below the recommended 7-9 hours for adults.`,
        priority: 'high',
        actionable: true,
        recommendation: 'Try to establish a consistent bedtime routine and aim for 7-9 hours of sleep nightly.',
        dataPoints: [`Current average: ${avgDuration.toFixed(1)} hours`, `Recommended: 7-9 hours`],
        timestamp: new Date()
      });
    }

    if (avgQuality >= 4) {
      insights.push({
        id: `sleep-quality-good-${Date.now()}`,
        type: 'positive',
        category: 'wellness',
        title: 'High Sleep Quality',
        description: `Your sleep quality rating of ${avgQuality.toFixed(1)}/5 indicates you're getting restorative rest.`,
        priority: 'low',
        actionable: false,
        timestamp: new Date()
      });
    }

    return insights;
  }

  generateMoodInsights(moodEntries) {
    const insights = [];

    if (moodEntries.length === 0) {
      insights.push({
        id: `mood-no-data-${Date.now()}`,
        type: 'recommendation',
        category: 'wellness',
        title: 'Track Your Mood',
        description: 'Start logging your daily mood to identify patterns and factors that affect your well-being.',
        priority: 'medium',
        actionable: true,
        recommendation: 'Log your current mood and any factors influencing it.',
        timestamp: new Date()
      });
      return insights;
    }

    const avgMood = moodEntries.reduce((sum, entry) => sum + entry.rating, 0) / moodEntries.length;
    const recentMoods = moodEntries.slice(0, 3).map(entry => entry.rating);
    const moodTrend = recentMoods.length >= 2 ? 
      (recentMoods[0] - recentMoods[recentMoods.length - 1]) / (recentMoods.length - 1) : 0;

    if (avgMood >= 7) {
      insights.push({
        id: `mood-positive-${Date.now()}`,
        type: 'positive',
        category: 'wellness',
        title: 'Positive Mood Trend',
        description: `Your average mood rating of ${avgMood.toFixed(1)}/10 indicates you're feeling good overall.`,
        priority: 'low',
        actionable: false,
        dataPoints: [`Average mood: ${avgMood.toFixed(1)}/10`, `Recent entries: ${moodEntries.length}`],
        timestamp: new Date()
      });
    } else if (avgMood < 5) {
      insights.push({
        id: `mood-concern-${Date.now()}`,
        type: 'warning',
        category: 'wellness',
        title: 'Mood Monitoring',
        description: `Your recent mood ratings suggest you might be experiencing some challenges. Consider what factors might be affecting your well-being.`,
        priority: 'medium',
        actionable: true,
        recommendation: 'Consider talking to a healthcare provider if low mood persists, and focus on activities that typically improve your mood.',
        dataPoints: [`Average mood: ${avgMood.toFixed(1)}/10`],
        timestamp: new Date()
      });
    }

    if (moodTrend > 0.5) {
      insights.push({
        id: `mood-improving-${Date.now()}`,
        type: 'positive',
        category: 'wellness',
        title: 'Improving Mood Trend',
        description: 'Your mood has been trending upward recently, which is a great sign!',
        priority: 'low',
        actionable: false,
        timestamp: new Date()
      });
    }

    return insights;
  }

  generatePredictiveInsights(healthData, user) {
    const insights = [];

    // Weight goal prediction based on calorie trends
    if (healthData.food.length >= 5 && user.goals?.weight && user.weight) {
      const dailyCalories = this.groupByDay(healthData.food, 'timestamp').map(day => 
        day.reduce((sum, entry) => sum + (entry.calories * entry.quantity), 0)
      );

      const avgDailyCalories = dailyCalories.reduce((a, b) => a + b, 0) / dailyCalories.length;
      const goalCalories = user.goals.calories || 2000;
      const dailyDeficit = goalCalories - avgDailyCalories;
      
      if (Math.abs(dailyDeficit) > 100) {
        const weightChangePerWeek = (dailyDeficit * 7) / 3500; // 3500 calories = 1 pound
        const weightDifference = user.weight - user.goals.weight;
        const weeksToGoal = weightDifference / weightChangePerWeek;

        if (weeksToGoal > 0 && weeksToGoal < 52) {
          insights.push({
            id: `prediction-weight-goal-${Date.now()}`,
            type: 'prediction',
            category: 'health',
            title: 'Weight Goal Forecast',
            description: `Based on your current calorie intake trend, you're projected to reach your weight goal in approximately ${Math.round(weeksToGoal)} weeks.`,
            priority: 'medium',
            actionable: true,
            recommendation: 'Continue your current approach for steady progress toward your goal.',
            dataPoints: [
              `Current weight: ${user.weight}kg`,
              `Goal weight: ${user.goals.weight}kg`,
              `Average daily calories: ${Math.round(avgDailyCalories)}`,
              `Projected timeline: ${Math.round(weeksToGoal)} weeks`
            ],
            timestamp: new Date()
          });
        }
      }
    }

    // Exercise consistency prediction
    if (healthData.exercise.length >= 3) {
      const exerciseDays = new Set(healthData.exercise.map(entry => 
        new Date(entry.timestamp.seconds * 1000).toDateString()
      )).size;

      const consistencyRate = exerciseDays / 7;
      
      if (consistencyRate >= 0.6) {
        insights.push({
          id: `prediction-exercise-consistency-${Date.now()}`,
          type: 'prediction',
          category: 'fitness',
          title: 'Exercise Consistency Forecast',
          description: `With your current exercise frequency of ${exerciseDays} days per week, you're building a strong foundation for long-term fitness success.`,
          priority: 'medium',
          actionable: false,
          dataPoints: [`Weekly consistency: ${Math.round(consistencyRate * 100)}%`, `Active days: ${exerciseDays}/7`],
          timestamp: new Date()
        });
      }
    }

    return insights;
  }

  // Helper method to group entries by day
  groupByDay(entries, dateField) {
    const groups = {};
    
    entries.forEach(entry => {
      const date = entry[dateField];
      const dateObj = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
      const dayKey = dateObj.toDateString();
      
      if (!groups[dayKey]) {
        groups[dayKey] = [];
      }
      groups[dayKey].push(entry);
    });
    
    return Object.values(groups);
  }
}

module.exports = new AIInsightService();