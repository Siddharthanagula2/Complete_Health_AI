export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  goals: {
    weight: number;
    calories: number;
    water: number;
    exercise: number;
  };
  streak: number;
  points: number;
  level: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  serving: string;
  quantity: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
}

export interface WaterEntry {
  id: string;
  amount: number;
  timestamp: Date;
}

export interface ExerciseEntry {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports';
  duration: number;
  calories: number;
  intensity: 'low' | 'moderate' | 'high';
  timestamp: Date;
}

export interface SleepEntry {
  id: string;
  date: Date;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number; // 1-5 scale
  notes?: string;
}

export interface MoodEntry {
  id: string;
  rating: number; // 1-10 scale
  factors?: string[];
  notes?: string;
  timestamp: Date;
}

export interface GPSWorkout {
  id: string;
  name: string;
  type: 'running' | 'cycling' | 'walking' | 'hiking';
  duration: number;
  distance: number;
  calories: number;
  avgPace: number;
  maxPace: number;
  elevationGain: number;
  heartRateAvg?: number;
  heartRateMax?: number;
  route: GPSPoint[];
  timestamp: Date;
}

export interface GPSPoint {
  latitude: number;
  longitude: number;
  elevation: number;
  timestamp: Date;
  heartRate?: number;
  pace?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  progress: number;
  target: number;
}

export interface DailyStats {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  exercise: number;
  steps: number;
  weight?: number;
  sleep?: number;
  mood?: number;
}

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

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  points: number;
  streak: number;
  isOnline: boolean;
  lastActive: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'group';
  category: 'steps' | 'calories' | 'water' | 'exercise' | 'streak';
  target: number;
  duration: number; // days
  startDate: Date;
  endDate: Date;
  participants: string[];
  rewards: {
    points: number;
    badge?: string;
  };
  isActive: boolean;
}

export interface MedicalRecord {
  id: string;
  type: 'lab_result' | 'medication' | 'appointment' | 'vital_sign';
  title: string;
  value?: number;
  unit?: string;
  normalRange?: {
    min: number;
    max: number;
  };
  notes?: string;
  provider?: string;
  timestamp: Date;
}

export interface HealthCorrelation {
  id: string;
  metric1: string;
  metric2: string;
  correlation: number; // -1 to 1
  strength: 'weak' | 'moderate' | 'strong';
  insight: string;
  recommendation?: string;
}

export interface HealthInsight {
  id: string;
  type: 'positive' | 'negative' | 'warning' | 'neutral';
  category: 'nutrition' | 'fitness' | 'wellness' | 'general';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  recommendation?: string;
  dataPoints?: string[];
  timestamp: Date;
}

export interface MealPlan {
  id: string;
  date: Date;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  prepTime: number;
}

export interface MedicationReminder {
  id: string;
  userId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}