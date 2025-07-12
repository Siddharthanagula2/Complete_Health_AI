// Comprehensive exercise database with real MET values and calorie calculations
interface ExerciseData {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  met: number; // Metabolic Equivalent of Task
  description: string;
  equipment?: string[];
  muscleGroups: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions?: string[];
  benefits?: string[];
  precautions?: string[];
  variations?: string[];
}

export const exerciseDatabase: ExerciseData[] = [
  // CARDIOVASCULAR EXERCISES
  {
    id: 'running-6mph',
    name: 'Running (6 mph)',
    category: 'Cardiovascular',
    subcategory: 'Running',
    met: 9.8,
    description: 'Moderate pace running, approximately 10-minute mile',
    equipment: ['Running shoes'],
    muscleGroups: ['Legs', 'Glutes', 'Core', 'Cardiovascular'],
    difficulty: 'Intermediate',
    instructions: [
      'Start with a 5-minute warm-up walk',
      'Maintain steady breathing rhythm',
      'Land on midfoot, not heel',
      'Keep arms relaxed at 90-degree angle',
      'Maintain upright posture'
    ],
    benefits: [
      'Improves cardiovascular health',
      'Burns calories efficiently',
      'Strengthens leg muscles',
      'Enhances mental health',
      'Builds endurance'
    ],
    precautions: [
      'Start gradually if new to running',
      'Wear proper running shoes',
      'Stay hydrated',
      'Listen to your body'
    ]
  },
  {
    id: 'running-8mph',
    name: 'Running (8 mph)',
    category: 'Cardiovascular',
    subcategory: 'Running',
    met: 13.5,
    description: 'Fast pace running, approximately 7.5-minute mile',
    equipment: ['Running shoes'],
    muscleGroups: ['Legs', 'Glutes', 'Core', 'Cardiovascular'],
    difficulty: 'Advanced',
    benefits: ['High calorie burn', 'Improved VO2 max', 'Enhanced speed'],
    precautions: ['Requires good fitness base', 'Higher injury risk']
  },
  {
    id: 'walking-3mph',
    name: 'Walking (3 mph)',
    category: 'Cardiovascular',
    subcategory: 'Walking',
    met: 3.5,
    description: 'Brisk walking pace',
    equipment: ['Comfortable shoes'],
    muscleGroups: ['Legs', 'Glutes', 'Cardiovascular'],
    difficulty: 'Beginner',
    benefits: ['Low impact', 'Accessible to all fitness levels', 'Joint-friendly'],
    precautions: ['Minimal risk']
  },
  {
    id: 'cycling-moderate',
    name: 'Cycling (12-14 mph)',
    category: 'Cardiovascular',
    subcategory: 'Cycling',
    met: 8.0,
    description: 'Moderate effort cycling on flat terrain',
    equipment: ['Bicycle', 'Helmet'],
    muscleGroups: ['Legs', 'Glutes', 'Core', 'Cardiovascular'],
    difficulty: 'Intermediate',
    benefits: ['Low impact on joints', 'Great for endurance', 'Environmentally friendly'],
    precautions: ['Wear helmet', 'Follow traffic rules', 'Check bike condition']
  },
  {
    id: 'swimming-moderate',
    name: 'Swimming (Moderate)',
    category: 'Cardiovascular',
    subcategory: 'Swimming',
    met: 8.3,
    description: 'Freestyle swimming at moderate pace',
    equipment: ['Swimsuit', 'Goggles'],
    muscleGroups: ['Full body', 'Cardiovascular'],
    difficulty: 'Intermediate',
    benefits: ['Full body workout', 'Zero impact', 'Builds endurance'],
    precautions: ['Know your swimming ability', 'Never swim alone']
  },
  {
    id: 'jumping-rope',
    name: 'Jumping Rope',
    category: 'Cardiovascular',
    subcategory: 'High Intensity',
    met: 12.3,
    description: 'Continuous jumping rope at moderate pace',
    equipment: ['Jump rope'],
    muscleGroups: ['Legs', 'Arms', 'Core', 'Cardiovascular'],
    difficulty: 'Intermediate',
    benefits: ['High calorie burn', 'Improves coordination', 'Portable exercise'],
    precautions: ['Start with short intervals', 'Use proper rope length']
  },

  // STRENGTH TRAINING
  {
    id: 'weight-lifting-general',
    name: 'Weight Lifting (General)',
    category: 'Strength Training',
    subcategory: 'Free Weights',
    met: 6.0,
    description: 'General weight lifting with moderate effort',
    equipment: ['Dumbbells', 'Barbells', 'Weight plates'],
    muscleGroups: ['Full body'],
    difficulty: 'Intermediate',
    instructions: [
      'Warm up with light cardio',
      'Focus on proper form over heavy weight',
      'Control both lifting and lowering phases',
      'Rest 1-3 minutes between sets',
      'Cool down with stretching'
    ],
    benefits: [
      'Builds muscle mass',
      'Increases bone density',
      'Boosts metabolism',
      'Improves functional strength'
    ],
    precautions: [
      'Learn proper form first',
      'Use spotter for heavy lifts',
      'Progress gradually'
    ]
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: 'Strength Training',
    subcategory: 'Bodyweight',
    met: 3.8,
    description: 'Standard push-ups using body weight',
    equipment: [],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    difficulty: 'Beginner',
    instructions: [
      'Start in plank position',
      'Lower body until chest nearly touches floor',
      'Push back up to starting position',
      'Keep body in straight line',
      'Breathe out on push up'
    ],
    variations: ['Knee push-ups', 'Incline push-ups', 'Diamond push-ups'],
    benefits: ['No equipment needed', 'Builds upper body strength', 'Improves core stability']
  },
  {
    id: 'squats',
    name: 'Squats',
    category: 'Strength Training',
    subcategory: 'Bodyweight',
    met: 5.0,
    description: 'Bodyweight squats',
    equipment: [],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower body as if sitting in chair',
      'Keep knees behind toes',
      'Lower until thighs parallel to floor',
      'Push through heels to return to start'
    ],
    variations: ['Jump squats', 'Goblet squats', 'Single-leg squats'],
    benefits: ['Strengthens lower body', 'Improves mobility', 'Functional movement']
  },
  {
    id: 'deadlifts',
    name: 'Deadlifts',
    category: 'Strength Training',
    subcategory: 'Free Weights',
    met: 6.0,
    description: 'Conventional deadlift with barbell',
    equipment: ['Barbell', 'Weight plates'],
    muscleGroups: ['Hamstrings', 'Glutes', 'Back', 'Core'],
    difficulty: 'Advanced',
    instructions: [
      'Stand with feet hip-width apart',
      'Grip bar with hands just outside legs',
      'Keep back straight and chest up',
      'Drive through heels to lift bar',
      'Extend hips and knees simultaneously'
    ],
    benefits: ['Builds posterior chain strength', 'Improves posture', 'Functional movement'],
    precautions: ['Master form with light weight', 'Keep bar close to body', 'Avoid rounding back']
  },

  // FLEXIBILITY & MOBILITY
  {
    id: 'yoga-hatha',
    name: 'Hatha Yoga',
    category: 'Flexibility',
    subcategory: 'Yoga',
    met: 2.5,
    description: 'Gentle yoga focusing on basic postures',
    equipment: ['Yoga mat'],
    muscleGroups: ['Full body', 'Core'],
    difficulty: 'Beginner',
    benefits: ['Improves flexibility', 'Reduces stress', 'Enhances balance'],
    precautions: ['Don\'t force poses', 'Listen to your body']
  },
  {
    id: 'yoga-vinyasa',
    name: 'Vinyasa Yoga',
    category: 'Flexibility',
    subcategory: 'Yoga',
    met: 3.0,
    description: 'Dynamic yoga with flowing movements',
    equipment: ['Yoga mat'],
    muscleGroups: ['Full body', 'Core'],
    difficulty: 'Intermediate',
    benefits: ['Builds strength and flexibility', 'Improves coordination', 'Stress relief']
  },
  {
    id: 'stretching-general',
    name: 'General Stretching',
    category: 'Flexibility',
    subcategory: 'Stretching',
    met: 2.3,
    description: 'Static stretching routine',
    equipment: [],
    muscleGroups: ['Full body'],
    difficulty: 'Beginner',
    benefits: ['Improves flexibility', 'Reduces muscle tension', 'Injury prevention'],
    precautions: ['Hold stretches 15-30 seconds', 'Don\'t bounce']
  },

  // HIGH INTENSITY INTERVAL TRAINING (HIIT)
  {
    id: 'hiit-general',
    name: 'HIIT Training',
    category: 'High Intensity',
    subcategory: 'HIIT',
    met: 8.0,
    description: 'High intensity interval training',
    equipment: [],
    muscleGroups: ['Full body', 'Cardiovascular'],
    difficulty: 'Advanced',
    benefits: ['High calorie burn', 'Improves VO2 max', 'Time efficient'],
    precautions: ['Requires good fitness base', 'Allow adequate recovery']
  },
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'High Intensity',
    subcategory: 'Bodyweight',
    met: 8.0,
    description: 'Full body explosive movement',
    equipment: [],
    muscleGroups: ['Full body', 'Cardiovascular'],
    difficulty: 'Advanced',
    instructions: [
      'Start standing',
      'Drop into squat position',
      'Jump feet back to plank',
      'Do push-up (optional)',
      'Jump feet back to squat',
      'Jump up with arms overhead'
    ],
    benefits: ['Full body workout', 'High calorie burn', 'Builds power'],
    precautions: ['High impact exercise', 'Start with modifications if needed']
  },

  // SPORTS
  {
    id: 'basketball-game',
    name: 'Basketball (Game)',
    category: 'Sports',
    subcategory: 'Team Sports',
    met: 8.0,
    description: 'Playing basketball game',
    equipment: ['Basketball', 'Court'],
    muscleGroups: ['Legs', 'Core', 'Arms', 'Cardiovascular'],
    difficulty: 'Intermediate',
    benefits: ['Improves agility', 'Builds teamwork', 'Great cardio workout']
  },
  {
    id: 'tennis-singles',
    name: 'Tennis (Singles)',
    category: 'Sports',
    subcategory: 'Racquet Sports',
    met: 8.0,
    description: 'Playing singles tennis',
    equipment: ['Tennis racquet', 'Tennis balls', 'Court'],
    muscleGroups: ['Full body', 'Cardiovascular'],
    difficulty: 'Intermediate',
    benefits: ['Improves hand-eye coordination', 'Great cardio', 'Builds agility']
  },
  {
    id: 'soccer-casual',
    name: 'Soccer (Casual)',
    category: 'Sports',
    subcategory: 'Team Sports',
    met: 7.0,
    description: 'Casual soccer game',
    equipment: ['Soccer ball', 'Field'],
    muscleGroups: ['Legs', 'Core', 'Cardiovascular'],
    difficulty: 'Intermediate',
    benefits: ['Builds endurance', 'Improves coordination', 'Team sport benefits']
  }
];

// Exercise categories
const exerciseCategories = [
  'Cardiovascular',
  'Strength Training',
  'Flexibility',
  'High Intensity',
  'Sports'
];

// Muscle groups
const muscleGroups = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Biceps',
  'Triceps',
  'Core',
  'Abs',
  'Legs',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Full body',
  'Cardiovascular'
];

// Equipment types
const equipmentTypes = [
  'None (Bodyweight)',
  'Dumbbells',
  'Barbells',
  'Resistance Bands',
  'Kettlebells',
  'Pull-up Bar',
  'Yoga Mat',
  'Cardio Machine',
  'Medicine Ball',
  'Stability Ball'
];

// Calorie calculation function
function calculateCaloriesBurned(
  exerciseId: string,
  durationMinutes: number,
  weightKg: number
): number {
  const exercise = exerciseDatabase.find(ex => ex.id === exerciseId);
  if (!exercise) return 0;
  
  // Calories = MET × weight (kg) × time (hours)
  const hours = durationMinutes / 60;
  const calories = exercise.met * weightKg * hours;
  
  return Math.round(calories);
}

// Search and filter functions
function searchExercises(query: string): ExerciseData[] {
  const lowercaseQuery = query.toLowerCase();
  return exerciseDatabase.filter(exercise =>
    exercise.name.toLowerCase().includes(lowercaseQuery) ||
    exercise.category.toLowerCase().includes(lowercaseQuery) ||
    exercise.subcategory?.toLowerCase().includes(lowercaseQuery) ||
    exercise.muscleGroups.some(muscle => muscle.toLowerCase().includes(lowercaseQuery))
  );
}

function getExercisesByCategory(category: string): ExerciseData[] {
  return exerciseDatabase.filter(exercise => exercise.category === category);
}

function getExercisesByMuscleGroup(muscleGroup: string): ExerciseData[] {
  return exerciseDatabase.filter(exercise => 
    exercise.muscleGroups.includes(muscleGroup)
  );
}

function getExercisesByDifficulty(difficulty: ExerciseData['difficulty']): ExerciseData[] {
  return exerciseDatabase.filter(exercise => exercise.difficulty === difficulty);
}

function getExercisesByEquipment(equipment: string): ExerciseData[] {
  if (equipment === 'None (Bodyweight)') {
    return exerciseDatabase.filter(exercise => 
      !exercise.equipment || exercise.equipment.length === 0
    );
  }
  
  return exerciseDatabase.filter(exercise => 
    exercise.equipment?.includes(equipment)
  );
}

function getExerciseById(id: string): ExerciseData | undefined {
  return exerciseDatabase.find(exercise => exercise.id === id);
}

// Workout plan generation
interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Array<{
    exercise: ExerciseData;
    sets?: number;
    reps?: number;
    duration?: number; // minutes
    rest?: number; // seconds
  }>;
  totalCalories: number;
}

function generateWorkoutPlan(
  type: 'strength' | 'cardio' | 'hiit' | 'flexibility',
  duration: number,
  difficulty: ExerciseData['difficulty'],
  userWeight: number
): WorkoutPlan {
  let exercises: ExerciseData[] = [];
  
  switch (type) {
    case 'strength':
      exercises = exerciseDatabase.filter(ex => 
        ex.category === 'Strength Training' && ex.difficulty === difficulty
      );
      break;
    case 'cardio':
      exercises = exerciseDatabase.filter(ex => 
        ex.category === 'Cardiovascular' && ex.difficulty === difficulty
      );
      break;
    case 'hiit':
      exercises = exerciseDatabase.filter(ex => 
        ex.category === 'High Intensity' && ex.difficulty === difficulty
      );
      break;
    case 'flexibility':
      exercises = exerciseDatabase.filter(ex => 
        ex.category === 'Flexibility' && ex.difficulty === difficulty
      );
      break;
  }
  
  // Select random exercises for the workout
  const selectedExercises = exercises
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(6, exercises.length));
  
  const workoutExercises = selectedExercises.map(exercise => ({
    exercise,
    sets: type === 'strength' ? 3 : undefined,
    reps: type === 'strength' ? 12 : undefined,
    duration: type !== 'strength' ? Math.floor(duration / selectedExercises.length) : 5,
    rest: type === 'strength' ? 60 : 30
  }));
  
  const totalCalories = workoutExercises.reduce((total, item) => {
    const exerciseDuration = item.duration || 5;
    return total + calculateCaloriesBurned(item.exercise.id, exerciseDuration, userWeight);
  }, 0);
  
  return {
    id: `workout-${Date.now()}`,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Workout`,
    description: `A ${difficulty.toLowerCase()} ${type} workout lasting ${duration} minutes`,
    duration,
    difficulty,
    exercises: workoutExercises,
    totalCalories
  };
}