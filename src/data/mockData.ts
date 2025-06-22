import { User, FoodEntry, ExerciseEntry, Achievement, DailyStats } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Siddhartha Nagula',
  email: 'siddharthanagula3@gmail.com',
  age: 28,
  weight: 72, // Calculated from BMI 22 and height 181cm
  height: 181,
  goals: {
    weight: 70,
    calories: 1864,
    water: 8,
    exercise: 45
  },
  streak: 7,
  points: 1250,
  level: 3
};

export const mockFoodDatabase = [
  {
    id: '1',
    name: 'Banana',
    brand: 'Fresh',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    sugar: 14,
    sodium: 1,
    serving: '1 medium'
  },
  {
    id: '2',
    name: 'Greek Yogurt',
    brand: 'Chobani',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    fiber: 0,
    sugar: 4,
    sodium: 60,
    serving: '170g container'
  },
  {
    id: '3',
    name: 'Chicken Breast',
    brand: 'Fresh',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    serving: '100g'
  },
  {
    id: '4',
    name: 'Quinoa',
    brand: 'Organic',
    calories: 222,
    protein: 8,
    carbs: 39,
    fat: 3.6,
    fiber: 5,
    sugar: 0,
    sodium: 13,
    serving: '1 cup cooked'
  },
  {
    id: '5',
    name: 'Almonds',
    brand: 'Blue Diamond',
    calories: 162,
    protein: 6,
    carbs: 6,
    fat: 14,
    fiber: 3.5,
    sugar: 1,
    sodium: 1,
    serving: '28g (23 nuts)'
  },
  {
    id: '6',
    name: 'Brown Rice',
    brand: 'Organic',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    fiber: 3.5,
    sugar: 0.7,
    sodium: 10,
    serving: '1 cup cooked'
  },
  {
    id: '7',
    name: 'Salmon Fillet',
    brand: 'Fresh Atlantic',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    serving: '100g'
  },
  {
    id: '8',
    name: 'Avocado',
    brand: 'Fresh',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    fiber: 7,
    sugar: 0.7,
    sodium: 7,
    serving: '1/2 medium'
  },
  {
    id: '9',
    name: 'Sweet Potato',
    brand: 'Fresh',
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0.1,
    fiber: 3.9,
    sugar: 5.4,
    sodium: 6,
    serving: '1 medium baked'
  },
  {
    id: '10',
    name: 'Oats',
    brand: 'Quaker',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    sugar: 1,
    sodium: 0,
    serving: '1/2 cup dry'
  }
];

export const mockExercises = [
  { id: '1', name: 'Running', type: 'cardio', calories: 300, duration: 30 },
  { id: '2', name: 'Cycling', type: 'cardio', calories: 250, duration: 30 },
  { id: '3', name: 'Swimming', type: 'cardio', calories: 400, duration: 30 },
  { id: '4', name: 'Weight Lifting', type: 'strength', calories: 180, duration: 45 },
  { id: '5', name: 'Yoga', type: 'flexibility', calories: 120, duration: 60 },
  { id: '6', name: 'Push-ups', type: 'strength', calories: 50, duration: 10 },
  { id: '7', name: 'Plank', type: 'strength', calories: 25, duration: 5 },
  { id: '8', name: 'HIIT Training', type: 'cardio', calories: 350, duration: 25 },
  { id: '9', name: 'Pilates', type: 'flexibility', calories: 140, duration: 45 },
  { id: '10', name: 'Basketball', type: 'sports', calories: 280, duration: 30 }
];

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
  }
];

export const mockDailyStats: DailyStats[] = [
  {
    date: '2024-01-08',
    calories: 1750,
    protein: 120,
    carbs: 180,
    fat: 65,
    water: 8,
    exercise: 45,
    steps: 8500,
    weight: 72.2
  },
  {
    date: '2024-01-07',
    calories: 1820,
    protein: 115,
    carbs: 190,
    fat: 70,
    water: 7,
    exercise: 30,
    steps: 7200,
    weight: 72.0
  },
  {
    date: '2024-01-06',
    calories: 1900,
    protein: 130,
    carbs: 200,
    fat: 75,
    water: 6,
    exercise: 60,
    steps: 9100,
    weight: 72.1
  },
  {
    date: '2024-01-05',
    calories: 1680,
    protein: 105,
    carbs: 170,
    fat: 60,
    water: 8,
    exercise: 40,
    steps: 8000,
    weight: 72.3
  },
  {
    date: '2024-01-04',
    calories: 1850,
    protein: 125,
    carbs: 185,
    fat: 68,
    water: 7,
    exercise: 35,
    steps: 7800,
    weight: 72.0
  },
  {
    date: '2024-01-03',
    calories: 1780,
    protein: 110,
    carbs: 175,
    fat: 62,
    water: 9,
    exercise: 50,
    steps: 8900,
    weight: 71.8
  },
  {
    date: '2024-01-02',
    calories: 1920,
    protein: 135,
    carbs: 195,
    fat: 72,
    water: 8,
    exercise: 45,
    steps: 8200,
    weight: 72.2
  }
];