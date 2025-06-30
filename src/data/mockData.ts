import { User, FoodEntry, ExerciseEntry, Achievement, DailyStats } from '../types';
import { nutritionDatabase } from './nutritionDatabase';
import { exerciseDatabase } from './exerciseDatabase';

// User data with realistic health metrics
export const mockUser: User = {
  id: '1',
  name: 'Siddhartha Nagula',
  email: 'siddharthanagula@gmail.com',
  age: 28,
  weight: 72, // kg
  height: 181, // cm
  goals: {
    weight: 70, // target weight in kg
    calories: 1864, // daily calorie target
    water: 8, // glasses per day
    exercise: 45 // minutes per day
  },
  streak: 7, // days
  points: 1250,
  level: 3
};

// Generate realistic food entries
export const mockFoodEntries: FoodEntry[] = [
  // Today's breakfast
  {
    id: '1',
    name: 'Greek Yogurt',
    brand: 'Chobani',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    fiber: 0,
    sugar: 4,
    sodium: 60,
    serving: '170g container',
    quantity: 1,
    meal: 'breakfast',
    timestamp: new Date(new Date().setHours(8, 30, 0, 0))
  },
  {
    id: '2',
    name: 'Blueberries',
    calories: 84,
    protein: 1.1,
    carbs: 21.5,
    fat: 0.5,
    fiber: 3.6,
    sugar: 15,
    sodium: 1,
    serving: '1 cup',
    quantity: 1,
    meal: 'breakfast',
    timestamp: new Date(new Date().setHours(8, 30, 0, 0))
  },
  {
    id: '3',
    name: 'Granola',
    brand: 'Nature Valley',
    calories: 120,
    protein: 3,
    carbs: 24,
    fat: 3.5,
    fiber: 2,
    sugar: 6,
    sodium: 75,
    serving: '1/4 cup',
    quantity: 0.5,
    meal: 'breakfast',
    timestamp: new Date(new Date().setHours(8, 30, 0, 0))
  },
  
  // Today's lunch
  {
    id: '4',
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    serving: '100g',
    quantity: 1.5,
    meal: 'lunch',
    timestamp: new Date(new Date().setHours(13, 0, 0, 0))
  },
  {
    id: '5',
    name: 'Brown Rice',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    fiber: 3.5,
    sugar: 0.7,
    sodium: 10,
    serving: '1 cup cooked',
    quantity: 1,
    meal: 'lunch',
    timestamp: new Date(new Date().setHours(13, 0, 0, 0))
  },
  {
    id: '6',
    name: 'Broccoli',
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fat: 0.6,
    fiber: 5.1,
    sugar: 2.6,
    sodium: 33,
    serving: '1 cup',
    quantity: 1,
    meal: 'lunch',
    timestamp: new Date(new Date().setHours(13, 0, 0, 0))
  },
  
  // Yesterday's entries
  {
    id: '7',
    name: 'Oatmeal',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    sugar: 1,
    sodium: 0,
    serving: '1/2 cup dry',
    quantity: 1,
    meal: 'breakfast',
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(8, 0, 0, 0); return d; })()
  },
  {
    id: '8',
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    sugar: 14,
    sodium: 1,
    serving: '1 medium',
    quantity: 1,
    meal: 'breakfast',
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(8, 0, 0, 0); return d; })()
  },
  {
    id: '9',
    name: 'Turkey Sandwich',
    calories: 320,
    protein: 20,
    carbs: 35,
    fat: 9,
    fiber: 5,
    sugar: 3,
    sodium: 600,
    serving: '1 sandwich',
    quantity: 1,
    meal: 'lunch',
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(12, 30, 0, 0); return d; })()
  },
  {
    id: '10',
    name: 'Salmon Fillet',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    serving: '100g',
    quantity: 1.5,
    meal: 'dinner',
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(19, 0, 0, 0); return d; })()
  }
];

// Generate realistic exercise entries
export const mockExerciseEntries: ExerciseEntry[] = [
  // Today's exercise
  {
    id: '1',
    name: 'Running',
    type: 'cardio',
    duration: 30,
    calories: 320,
    intensity: 'moderate',
    timestamp: new Date(new Date().setHours(7, 0, 0, 0))
  },
  
  // Yesterday's exercise
  {
    id: '2',
    name: 'Weight Training',
    type: 'strength',
    duration: 45,
    calories: 220,
    intensity: 'high',
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(18, 0, 0, 0); return d; })()
  },
  
  // Two days ago
  {
    id: '3',
    name: 'Yoga',
    type: 'flexibility',
    duration: 60,
    calories: 180,
    intensity: 'low',
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 2); d.setHours(19, 0, 0, 0); return d; })()
  },
  
  // Three days ago
  {
    id: '4',
    name: 'Cycling',
    type: 'cardio',
    duration: 40,
    calories: 350,
    intensity: 'moderate',
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 3); d.setHours(17, 30, 0, 0); return d; })()
  },
  
  // Four days ago
  {
    id: '5',
    name: 'HIIT Workout',
    type: 'cardio',
    duration: 25,
    calories: 300,
    intensity: 'high',
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 4); d.setHours(7, 0, 0, 0); return d; })()
  }
];

// Generate realistic water entries
export const mockWaterEntries = [
  // Today's entries
  { id: '1', amount: 250, timestamp: new Date(new Date().setHours(8, 15, 0, 0)) },
  { id: '2', amount: 250, timestamp: new Date(new Date().setHours(10, 30, 0, 0)) },
  { id: '3', amount: 500, timestamp: new Date(new Date().setHours(13, 0, 0, 0)) },
  { id: '4', amount: 250, timestamp: new Date(new Date().setHours(15, 45, 0, 0)) },
  { id: '5', amount: 250, timestamp: new Date(new Date().setHours(18, 0, 0, 0)) },
  
  // Yesterday's entries
  { id: '6', amount: 250, timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(7, 30, 0, 0); return d; })() },
  { id: '7', amount: 500, timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(12, 0, 0, 0); return d; })() },
  { id: '8', amount: 250, timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(16, 30, 0, 0); return d; })() },
  { id: '9', amount: 250, timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(19, 45, 0, 0); return d; })() }
];

// Generate realistic sleep entries
export const mockSleepEntries = [
  // Last night
  {
    id: '1',
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    bedtime: '22:30',
    wakeTime: '06:30',
    duration: 8,
    quality: 4,
    notes: 'Slept well, woke up once briefly'
  },
  
  // Two nights ago
  {
    id: '2',
    date: (() => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(0, 0, 0, 0); return d; })(),
    bedtime: '23:00',
    wakeTime: '07:00',
    duration: 8,
    quality: 3,
    notes: 'Took a while to fall asleep'
  },
  
  // Three nights ago
  {
    id: '3',
    date: (() => { const d = new Date(); d.setDate(d.getDate() - 2); d.setHours(0, 0, 0, 0); return d; })(),
    bedtime: '22:45',
    wakeTime: '06:45',
    duration: 8,
    quality: 5,
    notes: 'Great sleep, felt very refreshed'
  },
  
  // Four nights ago
  {
    id: '4',
    date: (() => { const d = new Date(); d.setDate(d.getDate() - 3); d.setHours(0, 0, 0, 0); return d; })(),
    bedtime: '23:30',
    wakeTime: '06:30',
    duration: 7,
    quality: 3,
    notes: 'Woke up a few times during the night'
  }
];

// Generate realistic mood entries
export const mockMoodEntries = [
  // Today
  {
    id: '1',
    rating: 8,
    factors: ['Exercise', 'Good sleep', 'Productive day'],
    timestamp: new Date(new Date().setHours(12, 0, 0, 0))
  },
  
  // Yesterday
  {
    id: '2',
    rating: 7,
    factors: ['Social', 'Work accomplishment'],
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(19, 0, 0, 0); return d; })()
  },
  
  // Two days ago
  {
    id: '3',
    rating: 5,
    factors: ['Stress', 'Poor sleep'],
    notes: 'Felt tired most of the day',
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 2); d.setHours(20, 0, 0, 0); return d; })()
  },
  
  // Three days ago
  {
    id: '4',
    rating: 9,
    factors: ['Exercise', 'Social', 'Good weather'],
    notes: 'Great day overall',
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 3); d.setHours(21, 0, 0, 0); return d; })()
  }
];

// Generate realistic achievements
export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Log your first meal',
    icon: '🥗',
    earned: true,
    earnedDate: new Date('2024-01-01'),
    progress: 1,
    target: 1
  },
  {
    id: '2',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water in a day',
    icon: '💧',
    earned: true,
    earnedDate: new Date('2024-01-02'),
    progress: 8,
    target: 8
  },
  {
    id: '3',
    title: 'Week Warrior',
    description: 'Maintain a 7-day logging streak',
    icon: '🔥',
    earned: true,
    earnedDate: new Date('2024-01-07'),
    progress: 7,
    target: 7
  },
  {
    id: '4',
    title: 'Calorie Champion',
    description: 'Stay within calorie goals for 5 days',
    icon: '🎯',
    earned: false,
    progress: 3,
    target: 5
  },
  {
    id: '5',
    title: 'Exercise Explorer',
    description: 'Try 10 different exercises',
    icon: '🏃‍♀️',
    earned: false,
    progress: 6,
    target: 10
  },
  {
    id: '6',
    title: 'Consistency King',
    description: 'Log food for 30 consecutive days',
    icon: '👑',
    earned: false,
    progress: 7,
    target: 30
  },
  {
    id: '7',
    title: 'Fitness Fanatic',
    description: 'Complete 45 minutes of exercise daily for a week',
    icon: '💪',
    earned: false,
    progress: 2,
    target: 7
  },
  {
    id: '8',
    title: 'Protein Pro',
    description: 'Meet your protein goal for 10 days',
    icon: '🥩',
    earned: false,
    progress: 5,
    target: 10
  },
  {
    id: '9',
    title: 'Early Bird',
    description: 'Log breakfast before 9 AM for 5 days',
    icon: '🌅',
    earned: true,
    earnedDate: new Date('2024-01-15'),
    progress: 5,
    target: 5
  },
  {
    id: '10',
    title: 'Sleep Master',
    description: 'Get 7+ hours of sleep for 7 consecutive days',
    icon: '😴',
    earned: false,
    progress: 4,
    target: 7
  }
];

// Generate realistic food database for search
export const mockFoodDatabase = nutritionDatabase.slice(0, 20).map((item, index) => ({
  id: (index + 1).toString(),
  name: item.name,
  brand: item.brand || undefined,
  calories: item.nutrition.calories,
  protein: item.nutrition.protein,
  carbs: item.nutrition.carbs,
  fat: item.nutrition.fat,
  fiber: item.nutrition.fiber || 0,
  sugar: item.nutrition.sugar || 0,
  sodium: item.nutrition.sodium || 0,
  serving: `${item.serving.amount} ${item.serving.unit}`
}));

// Generate realistic exercise database for search
export const mockExercises = exerciseDatabase.slice(0, 10).map((item, index) => ({
  id: (index + 1).toString(),
  name: item.name,
  type: item.category.toLowerCase() === 'cardiovascular' ? 'cardio' : 
        item.category.toLowerCase() === 'strength training' ? 'strength' :
        item.category.toLowerCase() === 'flexibility' ? 'flexibility' : 'sports',
  calories: Math.round(item.met * 70 * (30/60)), // Calories for 30 min for 70kg person
  duration: 30 // Default duration in minutes
}));

// Generate health correlations
export const mockHealthCorrelations = [
  {
    id: '1',
    metric1: 'Sleep Duration',
    metric2: 'Exercise Performance',
    correlation: 0.78,
    strength: 'strong',
    insight: 'Your exercise performance is significantly better when you get 7+ hours of sleep',
    recommendation: 'Prioritize 7-8 hours of sleep before workout days'
  },
  {
    id: '2',
    metric1: 'Water Intake',
    metric2: 'Energy Levels',
    correlation: 0.65,
    strength: 'moderate',
    insight: 'Higher water intake correlates with improved energy levels throughout the day',
    recommendation: 'Aim for 8+ glasses daily, especially before 3 PM'
  },
  {
    id: '3',
    metric1: 'Protein Intake',
    metric2: 'Muscle Recovery',
    correlation: 0.82,
    strength: 'strong',
    insight: 'Higher protein intake significantly improves muscle recovery after workouts',
    recommendation: 'Target 1.6-2.2g protein per kg body weight on training days'
  },
  {
    id: '4',
    metric1: 'Carbohydrate Timing',
    metric2: 'Workout Performance',
    correlation: 0.71,
    strength: 'strong',
    insight: 'Consuming carbs 1-2 hours before exercise improves performance',
    recommendation: 'Have a carb-rich meal or snack 90 minutes before intense workouts'
  },
  {
    id: '5',
    metric1: 'Stress Levels',
    metric2: 'Sleep Quality',
    correlation: -0.68,
    strength: 'moderate',
    insight: 'Higher stress levels correlate with poorer sleep quality',
    recommendation: 'Practice stress-reduction techniques before bedtime'
  }
];

// Generate health insights
export const mockHealthInsights = [
  {
    id: '1',
    type: 'positive',
    category: 'nutrition',
    title: 'Optimal Protein Intake',
    description: 'You\'ve consistently met your protein goals over the past week, which supports muscle recovery and maintenance.',
    impact: 'medium',
    actionable: true,
    recommendation: 'Continue your current protein intake pattern, focusing on lean sources throughout the day.',
    dataPoints: ['Avg. 1.8g/kg body weight', '25-30g per meal', '65% from complete sources'],
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d; })()
  },
  {
    id: '2',
    type: 'warning',
    category: 'hydration',
    title: 'Afternoon Hydration Gap',
    description: 'Your water intake consistently drops between 2-5 PM, which may contribute to the energy dip you\'ve reported in the afternoons.',
    impact: 'medium',
    actionable: true,
    recommendation: 'Set a reminder to drink 16oz of water at 2 PM and again at 4 PM.',
    dataPoints: ['Avg. 1.5 glasses between 2-5 PM', '3.2 glasses before 2 PM', '2.8 glasses after 5 PM'],
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 2); return d; })()
  },
  {
    id: '3',
    type: 'prediction',
    category: 'fitness',
    title: 'Workout Plateau Risk',
    description: 'Your strength gains have slowed over the past 2 weeks. Based on your current pattern, you may hit a plateau in the next 7-10 days.',
    impact: 'medium',
    actionable: true,
    recommendation: 'Consider implementing a deload week followed by a change in your training variables (sets, reps, or exercise selection).',
    dataPoints: ['2% strength increase (past 2 weeks)', '8% strength increase (previous 2 weeks)', 'Consistent workout frequency'],
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 3); return d; })()
  },
  {
    id: '4',
    type: 'positive',
    category: 'sleep',
    title: 'Improved Sleep Consistency',
    description: 'Your sleep schedule has become more consistent, with bedtime varying by less than 30 minutes over the past week.',
    impact: 'high',
    actionable: true,
    recommendation: 'Maintain this consistent sleep schedule, including on weekends, for optimal circadian rhythm benefits.',
    dataPoints: ['Avg. bedtime: 10:45 PM ±18 min', 'Avg. sleep duration: 7.8 hours', 'Improved sleep quality score'],
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 4); return d; })()
  },
  {
    id: '5',
    type: 'warning',
    category: 'nutrition',
    title: 'Vitamin D Deficiency Risk',
    description: 'Your dietary patterns show consistently low vitamin D intake, which may affect bone health and immune function.',
    impact: 'high',
    actionable: true,
    recommendation: 'Increase consumption of vitamin D-rich foods (fatty fish, egg yolks, fortified foods) or consider a supplement after consulting your healthcare provider.',
    dataPoints: ['Avg. 120 IU daily (recommended: 600-800 IU)', 'Limited sun exposure reported', 'Low intake of vitamin D-rich foods'],
    timestamp: (() => { const d = new Date(); d.setDate(d.getDate() - 5); return d; })()
  }
];

// Generate meal plans
export const mockMealPlans = [
  {
    id: '1',
    date: new Date(),
    meals: {
      breakfast: {
        name: 'Greek Yogurt Parfait',
        calories: 320,
        protein: 20,
        carbs: 35,
        fat: 8,
        ingredients: ['Greek yogurt', 'Berries', 'Granola', 'Honey'],
        prepTime: 5
      },
      lunch: {
        name: 'Quinoa Bowl with Grilled Chicken',
        calories: 450,
        protein: 35,
        carbs: 45,
        fat: 12,
        ingredients: ['Quinoa', 'Grilled chicken breast', 'Avocado', 'Mixed vegetables', 'Olive oil dressing'],
        prepTime: 20
      },
      dinner: {
        name: 'Baked Salmon with Roasted Vegetables',
        calories: 520,
        protein: 40,
        carbs: 25,
        fat: 28,
        ingredients: ['Salmon fillet', 'Broccoli', 'Sweet potato', 'Olive oil', 'Lemon', 'Herbs'],
        prepTime: 25
      },
      snacks: [
        {
          name: 'Apple with Almond Butter',
          calories: 190,
          protein: 6,
          carbs: 20,
          fat: 12,
          ingredients: ['Apple', 'Almond butter'],
          prepTime: 2
        },
        {
          name: 'Protein Shake',
          calories: 150,
          protein: 25,
          carbs: 5,
          fat: 2,
          ingredients: ['Protein powder', 'Almond milk', 'Ice'],
          prepTime: 3
        }
      ]
    },
    totalCalories: 1630,
    totalProtein: 126,
    totalCarbs: 130,
    totalFat: 62
  }
];

// Generate recipes
export const mockRecipes = [
  {
    id: '1',
    name: 'Protein-Packed Smoothie Bowl',
    category: 'breakfast',
    calories: 380,
    protein: 25,
    carbs: 45,
    fat: 10,
    prepTime: 10,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 banana',
      '1 cup mixed berries',
      '1 scoop protein powder',
      '1/2 cup almond milk',
      '1 tbsp chia seeds',
      'Granola for topping'
    ],
    instructions: [
      'Blend banana, berries, protein powder, and almond milk until smooth',
      'Pour into bowl',
      'Top with chia seeds and granola',
      'Serve immediately'
    ]
  },
  {
    id: '2',
    name: 'Mediterranean Chicken Bowl',
    category: 'lunch',
    calories: 520,
    protein: 40,
    carbs: 35,
    fat: 22,
    prepTime: 30,
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '2 chicken breasts',
      '1 cup quinoa',
      'Cherry tomatoes',
      'Cucumber',
      'Red onion',
      'Feta cheese',
      'Olive oil',
      'Lemon juice',
      'Herbs'
    ],
    instructions: [
      'Season and grill chicken breasts',
      'Cook quinoa according to package instructions',
      'Chop vegetables',
      'Assemble bowls with quinoa, chicken, and vegetables',
      'Drizzle with olive oil and lemon juice'
    ]
  },
  {
    id: '3',
    name: 'Baked Salmon with Sweet Potato',
    category: 'dinner',
    calories: 480,
    protein: 35,
    carbs: 30,
    fat: 25,
    prepTime: 35,
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '2 salmon fillets',
      '2 medium sweet potatoes',
      'Broccoli',
      'Olive oil',
      'Lemon',
      'Garlic',
      'Herbs and spices'
    ],
    instructions: [
      'Preheat oven to 400°F (200°C)',
      'Dice sweet potatoes and toss with olive oil',
      'Roast sweet potatoes for 15 minutes',
      'Season salmon and add to baking sheet',
      'Add broccoli and continue baking for 15 minutes',
      'Serve with lemon wedges'
    ]
  }
];

// Generate health data for charts and analytics
export function generateHealthData(days: number): DailyStats[] {
  const data: DailyStats[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Base values
    let calories = 1800 + Math.round(Math.random() * 200 - 100);
    let protein = 110 + Math.round(Math.random() * 30 - 15);
    let carbs = 180 + Math.round(Math.random() * 40 - 20);
    let fat = 65 + Math.round(Math.random() * 15 - 7);
    let water = 7 + Math.round(Math.random() * 3 - 1);
    let exercise = 40 + Math.round(Math.random() * 20 - 10);
    let steps = 8000 + Math.round(Math.random() * 2000 - 1000);
    let weight = 72 + (Math.random() * 0.6 - 0.3);
    let sleep = 7.5 + (Math.random() * 1 - 0.5);
    let mood = 7 + Math.round(Math.random() * 3 - 1);
    
    // Add some trends
    // Gradually decreasing weight
    weight = 72.5 - (i * 0.03) + (Math.random() * 0.4 - 0.2);
    
    // Increasing exercise trend
    if (i < days / 2) {
      exercise = 35 + Math.round(Math.random() * 15 - 5);
    } else {
      exercise = 45 + Math.round(Math.random() * 15 - 5);
    }
    
    // Weekend effect (higher calories, less exercise)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // weekend
      calories += 200;
      exercise -= 10;
      steps -= 1000;
    }
    
    data.push({
      date: date.toDateString(),
      calories,
      protein,
      carbs,
      fat,
      water,
      exercise,
      steps,
      weight: parseFloat(weight.toFixed(1)),
      sleep: parseFloat(sleep.toFixed(1)),
      mood
    });
  }
  
  return data;
}

// Generate extended daily stats with more data points
export const mockDailyStats: DailyStats[] = generateHealthData(30);

// Generate food database for search
export const mockFoods = nutritionDatabase.slice(0, 20).map(item => ({
  id: item.id,
  name: item.name,
  brand: item.brand,
  category: item.category,
  calories: item.nutrition.calories,
  protein: item.nutrition.protein,
  carbs: item.nutrition.carbs,
  fat: item.nutrition.fat,
  serving: `${item.serving.amount} ${item.serving.unit}`
}));