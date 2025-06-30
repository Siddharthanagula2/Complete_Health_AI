// Comprehensive workout plans for different fitness goals
import { exerciseDatabase, ExerciseData } from './exerciseDatabase';

export interface WorkoutExercise {
  exercise: ExerciseData;
  sets?: number;
  reps?: number;
  duration?: number; // minutes
  distance?: number; // km
  rest?: number; // seconds
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  goal: 'Strength' | 'Hypertrophy' | 'Endurance' | 'Weight Loss' | 'General Fitness';
  duration: number; // weeks
  frequency: number; // days per week
  workouts: {
    [key: string]: { // e.g., "Day 1", "Day 2", etc.
      name: string;
      focus: string;
      exercises: WorkoutExercise[];
      duration: number; // minutes
      calories: number; // estimated calories burned
    }
  };
  equipment: string[];
  notes?: string;
}

export const workoutPlans: WorkoutPlan[] = [
  // Beginner Strength Training Plan
  {
    id: 'beginner-strength',
    name: 'Beginner Strength Foundations',
    description: 'A progressive strength training program for beginners focusing on fundamental movement patterns and proper form.',
    level: 'Beginner',
    goal: 'Strength',
    duration: 8, // 8 weeks
    frequency: 3, // 3 days per week
    workouts: {
      'Day 1': {
        name: 'Full Body Basics A',
        focus: 'Push and Legs',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'squats') || exerciseDatabase[0],
            sets: 3,
            reps: 10,
            rest: 90,
            notes: 'Focus on form, keep knees behind toes'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'push-ups') || exerciseDatabase[0],
            sets: 3,
            reps: 8,
            rest: 60,
            notes: 'Modify on knees if needed'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'deadlifts') || exerciseDatabase[0],
            sets: 3,
            reps: 8,
            rest: 120,
            notes: 'Start with light weight to learn form'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'stretching-general') || exerciseDatabase[0],
            duration: 10,
            notes: 'Focus on legs and chest'
          }
        ],
        duration: 45,
        calories: 300
      },
      'Day 2': {
        name: 'Full Body Basics B',
        focus: 'Pull and Core',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 10,
            notes: 'Warm-up'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 10,
            rest: 90,
            notes: 'Dumbbell rows'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'squats') || exerciseDatabase[0],
            sets: 3,
            reps: 12,
            rest: 60,
            notes: 'Bodyweight only'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'stretching-general') || exerciseDatabase[0],
            duration: 10,
            notes: 'Focus on back and core'
          }
        ],
        duration: 45,
        calories: 280
      },
      'Day 3': {
        name: 'Full Body Basics C',
        focus: 'Functional Movement',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 10,
            notes: 'Warm-up'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 10,
            rest: 90,
            notes: 'Shoulder press'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'deadlifts') || exerciseDatabase[0],
            sets: 3,
            reps: 8,
            rest: 120,
            notes: 'Focus on hip hinge movement'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'stretching-general') || exerciseDatabase[0],
            duration: 10,
            notes: 'Full body stretching'
          }
        ],
        duration: 45,
        calories: 320
      }
    },
    equipment: ['Dumbbells', 'Bench', 'Exercise mat'],
    notes: 'Rest at least one day between workouts. Focus on form before increasing weight. Aim to progressively increase weight by 5% every 2 weeks if form is good.'
  },
  
  // Intermediate Hypertrophy Plan
  {
    id: 'intermediate-hypertrophy',
    name: 'Muscle Building Split',
    description: 'A 4-day split routine designed to maximize muscle growth through targeted volume and progressive overload.',
    level: 'Intermediate',
    goal: 'Hypertrophy',
    duration: 12, // 12 weeks
    frequency: 4, // 4 days per week
    workouts: {
      'Day 1': {
        name: 'Chest and Triceps',
        focus: 'Push',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 4,
            reps: 8,
            rest: 90,
            notes: 'Bench press'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 10,
            rest: 60,
            notes: 'Incline dumbbell press'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 12,
            rest: 60,
            notes: 'Cable flyes'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 12,
            rest: 60,
            notes: 'Tricep pushdowns'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 10,
            rest: 60,
            notes: 'Overhead tricep extensions'
          }
        ],
        duration: 60,
        calories: 450
      },
      'Day 2': {
        name: 'Back and Biceps',
        focus: 'Pull',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 4,
            reps: 8,
            rest: 90,
            notes: 'Barbell rows'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 10,
            rest: 60,
            notes: 'Pull-ups or lat pulldowns'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 12,
            rest: 60,
            notes: 'Seated cable rows'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 12,
            rest: 60,
            notes: 'Barbell curls'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 12,
            rest: 60,
            notes: 'Hammer curls'
          }
        ],
        duration: 60,
        calories: 470
      },
      'Day 3': {
        name: 'Legs',
        focus: 'Lower Body',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'squats') || exerciseDatabase[0],
            sets: 4,
            reps: 8,
            rest: 120,
            notes: 'Barbell squats'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'deadlifts') || exerciseDatabase[0],
            sets: 3,
            reps: 8,
            rest: 120,
            notes: 'Romanian deadlifts'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 12,
            rest: 90,
            notes: 'Leg press'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 15,
            rest: 60,
            notes: 'Leg extensions'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 15,
            rest: 60,
            notes: 'Leg curls'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 15,
            rest: 60,
            notes: 'Standing calf raises'
          }
        ],
        duration: 70,
        calories: 520
      },
      'Day 4': {
        name: 'Shoulders and Core',
        focus: 'Upper Body and Core',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 4,
            reps: 8,
            rest: 90,
            notes: 'Overhead press'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 12,
            rest: 60,
            notes: 'Lateral raises'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 12,
            rest: 60,
            notes: 'Face pulls'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 15,
            rest: 60,
            notes: 'Plank variations'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 15,
            rest: 60,
            notes: 'Cable crunches'
          }
        ],
        duration: 60,
        calories: 400
      }
    },
    equipment: ['Barbell', 'Dumbbells', 'Cable machine', 'Bench', 'Squat rack'],
    notes: 'Follow a push/pull/legs/shoulders split with at least 48 hours rest between training the same muscle group. Focus on progressive overload by increasing weight or reps each week. Ensure adequate protein intake (1.6-2.2g per kg of bodyweight).'
  },
  
  // Weight Loss Plan
  {
    id: 'weight-loss',
    name: 'Fat Loss Accelerator',
    description: 'High-intensity interval training combined with strength circuits for maximum calorie burn and metabolic boost.',
    level: 'Intermediate',
    goal: 'Weight Loss',
    duration: 8, // 8 weeks
    frequency: 4, // 4 days per week
    workouts: {
      'Day 1': {
        name: 'HIIT Cardio',
        focus: 'Cardiovascular and Fat Burning',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Warm-up'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'hiit-general') || exerciseDatabase[0],
            sets: 8,
            duration: 1, // 1 minute high intensity
            rest: 90, // 1.5 minute rest
            notes: 'Sprint intervals (30 sec sprint, 90 sec walk)'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'burpees') || exerciseDatabase[0],
            sets: 3,
            reps: 10,
            rest: 60,
            notes: 'Full body movement'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'jumping-rope') || exerciseDatabase[0],
            sets: 3,
            duration: 2,
            rest: 60,
            notes: 'Moderate pace'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'stretching-general') || exerciseDatabase[0],
            duration: 5,
            notes: 'Cool down'
          }
        ],
        duration: 45,
        calories: 450
      },
      'Day 2': {
        name: 'Full Body Circuit',
        focus: 'Strength and Metabolic Conditioning',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Warm-up'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'squats') || exerciseDatabase[0],
            sets: 3,
            reps: 15,
            rest: 30,
            notes: 'Bodyweight or light weight'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'push-ups') || exerciseDatabase[0],
            sets: 3,
            reps: 12,
            rest: 30,
            notes: 'Modify as needed'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 15,
            rest: 30,
            notes: 'Dumbbell rows'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 15,
            rest: 30,
            notes: 'Lunges'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'weight-lifting-general') || exerciseDatabase[0],
            sets: 3,
            reps: 15,
            rest: 30,
            notes: 'Plank'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'stretching-general') || exerciseDatabase[0],
            duration: 5,
            notes: 'Cool down'
          }
        ],
        duration: 50,
        calories: 400
      },
      'Day 3': {
        name: 'Tabata Intervals',
        focus: 'High Intensity Metabolic Boost',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Warm-up'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'hiit-general') || exerciseDatabase[0],
            sets: 8,
            duration: 0.33, // 20 seconds work
            rest: 10, // 10 seconds rest
            notes: 'Jumping jacks (20 sec on, 10 sec off)'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'hiit-general') || exerciseDatabase[0],
            sets: 8,
            duration: 0.33, // 20 seconds work
            rest: 10, // 10 seconds rest
            notes: 'Mountain climbers (20 sec on, 10 sec off)'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'hiit-general') || exerciseDatabase[0],
            sets: 8,
            duration: 0.33, // 20 seconds work
            rest: 10, // 10 seconds rest
            notes: 'Squat jumps (20 sec on, 10 sec off)'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'hiit-general') || exerciseDatabase[0],
            sets: 8,
            duration: 0.33, // 20 seconds work
            rest: 10, // 10 seconds rest
            notes: 'Push-ups (20 sec on, 10 sec off)'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'stretching-general') || exerciseDatabase[0],
            duration: 5,
            notes: 'Cool down'
          }
        ],
        duration: 40,
        calories: 500
      },
      'Day 4': {
        name: 'Active Recovery',
        focus: 'Low Intensity Steady State',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 30,
            notes: 'Brisk walking'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'yoga-hatha') || exerciseDatabase[0],
            duration: 20,
            notes: 'Gentle yoga flow'
          }
        ],
        duration: 50,
        calories: 250
      }
    },
    equipment: ['Dumbbells', 'Jump rope', 'Exercise mat'],
    notes: 'This plan combines high-intensity intervals with strength training for maximum calorie burn and metabolic boost. Pair with a moderate calorie deficit (300-500 calories below maintenance) for sustainable fat loss. Stay hydrated and ensure adequate protein intake to preserve muscle mass.'
  },
  
  // Endurance Plan
  {
    id: 'endurance-training',
    name: 'Endurance Builder',
    description: 'Progressive cardiovascular training plan to improve stamina, endurance, and aerobic capacity.',
    level: 'Intermediate',
    goal: 'Endurance',
    duration: 12, // 12 weeks
    frequency: 4, // 4 days per week
    workouts: {
      'Day 1': {
        name: 'Long Slow Distance',
        focus: 'Aerobic Base Building',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Warm-up'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'running-6mph') || exerciseDatabase[0],
            duration: 40,
            notes: 'Steady pace at 60-70% max heart rate'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Cool down'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'stretching-general') || exerciseDatabase[0],
            duration: 10,
            notes: 'Focus on legs'
          }
        ],
        duration: 60,
        calories: 550
      },
      'Day 2': {
        name: 'Interval Training',
        focus: 'Lactate Threshold',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Warm-up'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'running-6mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Easy pace'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'running-8mph') || exerciseDatabase[0],
            sets: 6,
            duration: 3,
            rest: 90,
            notes: '3 min at 80-85% max heart rate, 90 sec recovery'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Cool down'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'stretching-general') || exerciseDatabase[0],
            duration: 10,
            notes: 'Full body stretching'
          }
        ],
        duration: 50,
        calories: 600
      },
      'Day 3': {
        name: 'Cross Training',
        focus: 'Active Recovery',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'cycling-moderate') || exerciseDatabase[0],
            duration: 30,
            notes: 'Moderate pace'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'swimming-moderate') || exerciseDatabase[0],
            duration: 20,
            notes: 'Easy pace'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'stretching-general') || exerciseDatabase[0],
            duration: 10,
            notes: 'Full body stretching'
          }
        ],
        duration: 60,
        calories: 450
      },
      'Day 4': {
        name: 'Tempo Run',
        focus: 'Sustained Effort',
        exercises: [
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Warm-up'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'running-6mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Easy pace'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'running-8mph') || exerciseDatabase[0],
            duration: 20,
            notes: 'Comfortably hard pace (75-80% max heart rate)'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'running-6mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Easy pace'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'walking-3mph') || exerciseDatabase[0],
            duration: 5,
            notes: 'Cool down'
          },
          {
            exercise: exerciseDatabase.find(e => e.id === 'stretching-general') || exerciseDatabase[0],
            duration: 10,
            notes: 'Focus on legs'
          }
        ],
        duration: 50,
        calories: 580
      }
    },
    equipment: ['Running shoes', 'Heart rate monitor (optional)', 'Swimming gear (optional)'],
    notes: 'This plan follows a progressive overload approach to endurance training. Each week, increase the duration of your long run by 5-10% and the intensity of your intervals gradually. Listen to your body and take extra rest days if needed. Stay hydrated and fuel properly before and after workouts.'
  }
];

// Workout plan functions
export function getWorkoutPlanById(id: string): WorkoutPlan | undefined {
  return workoutPlans.find(plan => plan.id === id);
}

export function getWorkoutPlansByGoal(goal: WorkoutPlan['goal']): WorkoutPlan[] {
  return workoutPlans.filter(plan => plan.goal === goal);
}

export function getWorkoutPlansByLevel(level: WorkoutPlan['level']): WorkoutPlan[] {
  return workoutPlans.filter(plan => plan.level === level);
}

export function generateCustomWorkoutPlan(
  goal: WorkoutPlan['goal'],
  level: WorkoutPlan['level'],
  frequency: number,
  availableEquipment: string[] = []
): WorkoutPlan {
  // Find a suitable base plan
  const basePlans = workoutPlans.filter(plan => 
    plan.goal === goal && 
    plan.level === level
  );
  
  if (basePlans.length === 0) {
    // Fallback to any plan matching the goal
    const fallbackPlans = workoutPlans.filter(plan => plan.goal === goal);
    if (fallbackPlans.length === 0) {
      // Ultimate fallback to first plan
      return JSON.parse(JSON.stringify(workoutPlans[0]));
    }
    return JSON.parse(JSON.stringify(fallbackPlans[0]));
  }
  
  // Select a base plan
  const basePlan = JSON.parse(JSON.stringify(basePlans[0])) as WorkoutPlan;
  
  // Customize the plan
  const customPlan: WorkoutPlan = {
    ...basePlan,
    id: `custom-${Date.now()}`,
    name: `Custom ${goal} Plan`,
    description: `Personalized ${level.toLowerCase()} ${goal.toLowerCase()} plan with ${frequency} workouts per week`,
    frequency: frequency
  };
  
  // Adjust workouts based on frequency
  if (frequency !== basePlan.frequency) {
    const workoutKeys = Object.keys(basePlan.workouts);
    const newWorkouts: WorkoutPlan['workouts'] = {};
    
    // Keep only the number of workouts needed
    for (let i = 0; i < Math.min(frequency, workoutKeys.length); i++) {
      newWorkouts[`Day ${i + 1}`] = basePlan.workouts[workoutKeys[i]];
    }
    
    // If we need more workouts than the base plan has
    if (frequency > workoutKeys.length) {
      for (let i = workoutKeys.length; i < frequency; i++) {
        // Duplicate a workout with slight modifications
        const sourceWorkout = basePlan.workouts[workoutKeys[i % workoutKeys.length]];
        newWorkouts[`Day ${i + 1}`] = {
          ...sourceWorkout,
          name: `${sourceWorkout.name} (Variation)`,
          exercises: sourceWorkout.exercises.map(ex => ({
            ...ex,
            sets: ex.sets ? Math.max(1, ex.sets - 1) : undefined,
            reps: ex.reps ? ex.reps + 2 : undefined
          }))
        };
      }
    }
    
    customPlan.workouts = newWorkouts;
  }
  
  // Adjust exercises based on available equipment
  if (availableEquipment.length > 0) {
    Object.keys(customPlan.workouts).forEach(day => {
      const workout = customPlan.workouts[day];
      
      workout.exercises = workout.exercises.map(ex => {
        // If exercise requires equipment we don't have, replace it
        const exerciseEquipment = ex.exercise.equipment || [];
        const needsUnavailableEquipment = exerciseEquipment.some(eq => 
          eq && !availableEquipment.includes(eq)
        );
        
        if (needsUnavailableEquipment) {
          // Find a replacement exercise with similar muscle groups
          const muscleGroups = ex.exercise.muscleGroups;
          const replacementExercise = exerciseDatabase.find(e => 
            e.muscleGroups.some(m => muscleGroups.includes(m)) &&
            (!e.equipment || e.equipment.every(eq => availableEquipment.includes(eq)))
          );
          
          if (replacementExercise) {
            return {
              ...ex,
              exercise: replacementExercise,
              notes: `Substitution for ${ex.exercise.name}`
            };
          }
        }
        
        return ex;
      });
    });
    
    customPlan.equipment = availableEquipment;
  }
  
  return customPlan;
}

// Calculate estimated calories burned for a workout
export function calculateWorkoutCalories(
  workout: WorkoutPlan['workouts'][string],
  weightKg: number
): number {
  let totalCalories = 0;
  
  workout.exercises.forEach(ex => {
    const exercise = ex.exercise;
    let durationHours = 0;
    
    if (ex.duration) {
      durationHours = ex.duration / 60; // Convert minutes to hours
    } else if (ex.sets && ex.rest) {
      // Estimate duration based on sets, reps and rest time
      const setDuration = ex.reps ? (ex.reps * 3) : 30; // seconds per set
      const totalSetTime = (setDuration * ex.sets) / 60; // hours
      const totalRestTime = (ex.rest * (ex.sets - 1)) / 3600; // hours
      durationHours = totalSetTime + totalRestTime;
    }
    
    // Calories = MET × weight (kg) × time (hours)
    const calories = exercise.met * weightKg * durationHours;
    totalCalories += calories;
  });
  
  return Math.round(totalCalories);
}

// Generate a weekly workout schedule
export function generateWeeklySchedule(
  plan: WorkoutPlan
): Array<{ day: string; workout: string | null }> {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workoutDays = Object.keys(plan.workouts);
  const schedule: Array<{ day: string; workout: string | null }> = [];
  
  // Distribute workouts evenly throughout the week
  let workoutIndex = 0;
  
  // Simple distribution algorithm
  if (plan.frequency <= 3) {
    // For lower frequencies, spread workouts out
    const gap = Math.floor(7 / plan.frequency);
    let currentDay = 0;
    
    for (let i = 0; i < plan.frequency; i++) {
      daysOfWeek.forEach((day, index) => {
        if (index === currentDay && workoutIndex < workoutDays.length) {
          schedule.push({ day, workout: workoutDays[workoutIndex] });
          workoutIndex++;
        } else {
          schedule.push({ day, workout: null });
        }
      });
      currentDay += gap;
    }
  } else {
    // For higher frequencies, try to include rest days
    daysOfWeek.forEach((day, index) => {
      if (index === 3 || index === 6) { // Wednesday and Sunday as rest days
        schedule.push({ day, workout: null });
      } else if (workoutIndex < workoutDays.length) {
        schedule.push({ day, workout: workoutDays[workoutIndex] });
        workoutIndex++;
      } else {
        schedule.push({ day, workout: null });
      }
    });
  }
  
  return schedule;
}