// Comprehensive meal plans with nutritional information
import { nutritionDatabase } from './nutritionDatabase';

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  prepTime: number;
  recipe?: string;
  imageUrl?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  targetCalories: number;
  macroRatio: {
    protein: number; // percentage
    carbs: number; // percentage
    fat: number; // percentage
  };
  dietaryPreferences: string[];
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
  };
}

export const mealPlans: MealPlan[] = [
  // Balanced Nutrition Plan
  {
    id: 'balanced-nutrition',
    name: 'Balanced Nutrition Plan',
    description: 'A well-rounded meal plan with balanced macronutrients for general health and wellness.',
    targetCalories: 2000,
    macroRatio: {
      protein: 25, // 25% of calories from protein
      carbs: 50, // 50% of calories from carbs
      fat: 25 // 25% of calories from fat
    },
    dietaryPreferences: ['balanced', 'omnivore'],
    meals: {
      breakfast: [
        {
          name: 'Greek Yogurt Parfait',
          calories: 320,
          protein: 20,
          carbs: 35,
          fat: 8,
          ingredients: ['Greek yogurt', 'Berries', 'Granola', 'Honey'],
          prepTime: 5,
          imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Avocado Toast with Egg',
          calories: 350,
          protein: 15,
          carbs: 30,
          fat: 18,
          ingredients: ['Whole grain bread', 'Avocado', 'Egg', 'Cherry tomatoes', 'Microgreens'],
          prepTime: 10,
          imageUrl: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Oatmeal with Fruit and Nuts',
          calories: 310,
          protein: 10,
          carbs: 45,
          fat: 10,
          ingredients: ['Oats', 'Milk', 'Banana', 'Berries', 'Almonds', 'Cinnamon'],
          prepTime: 8,
          imageUrl: 'https://images.pexels.com/photos/4397920/pexels-photo-4397920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      lunch: [
        {
          name: 'Quinoa Bowl with Grilled Chicken',
          calories: 450,
          protein: 35,
          carbs: 45,
          fat: 12,
          ingredients: ['Quinoa', 'Grilled chicken breast', 'Avocado', 'Mixed vegetables', 'Olive oil dressing'],
          prepTime: 20,
          imageUrl: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Mediterranean Salad with Tuna',
          calories: 420,
          protein: 30,
          carbs: 30,
          fat: 18,
          ingredients: ['Mixed greens', 'Tuna', 'Cherry tomatoes', 'Cucumber', 'Olives', 'Feta cheese', 'Olive oil', 'Lemon juice'],
          prepTime: 15,
          imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Turkey and Vegetable Wrap',
          calories: 380,
          protein: 25,
          carbs: 40,
          fat: 12,
          ingredients: ['Whole grain wrap', 'Turkey breast', 'Hummus', 'Bell peppers', 'Spinach', 'Cucumber'],
          prepTime: 10,
          imageUrl: 'https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      dinner: [
        {
          name: 'Baked Salmon with Roasted Vegetables',
          calories: 520,
          protein: 40,
          carbs: 25,
          fat: 28,
          ingredients: ['Salmon fillet', 'Broccoli', 'Sweet potato', 'Olive oil', 'Lemon', 'Herbs'],
          prepTime: 25,
          imageUrl: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Stir-Fried Tofu with Brown Rice',
          calories: 480,
          protein: 25,
          carbs: 60,
          fat: 15,
          ingredients: ['Tofu', 'Brown rice', 'Bell peppers', 'Broccoli', 'Carrots', 'Soy sauce', 'Ginger', 'Garlic'],
          prepTime: 30,
          imageUrl: 'https://images.pexels.com/photos/5848496/pexels-photo-5848496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Lean Beef Stir Fry',
          calories: 490,
          protein: 35,
          carbs: 40,
          fat: 20,
          ingredients: ['Lean beef strips', 'Brown rice', 'Mixed vegetables', 'Garlic', 'Ginger', 'Low-sodium soy sauce'],
          prepTime: 25,
          imageUrl: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      snacks: [
        {
          name: 'Apple with Almond Butter',
          calories: 190,
          protein: 6,
          carbs: 20,
          fat: 12,
          ingredients: ['Apple', 'Almond butter'],
          prepTime: 2,
          imageUrl: 'https://images.pexels.com/photos/5945559/pexels-photo-5945559.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Greek Yogurt with Berries',
          calories: 150,
          protein: 15,
          carbs: 15,
          fat: 3,
          ingredients: ['Greek yogurt', 'Mixed berries', 'Honey'],
          prepTime: 3,
          imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Hummus with Vegetable Sticks',
          calories: 160,
          protein: 5,
          carbs: 15,
          fat: 10,
          ingredients: ['Hummus', 'Carrot sticks', 'Cucumber sticks', 'Bell pepper strips'],
          prepTime: 5,
          imageUrl: 'https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ]
    }
  },
  
  // High Protein Plan
  {
    id: 'high-protein',
    name: 'High Protein Plan',
    description: 'Protein-focused meal plan designed for muscle building and recovery.',
    targetCalories: 2200,
    macroRatio: {
      protein: 40, // 40% of calories from protein
      carbs: 30, // 30% of calories from carbs
      fat: 30 // 30% of calories from fat
    },
    dietaryPreferences: ['high-protein', 'fitness', 'muscle-building'],
    meals: {
      breakfast: [
        {
          name: 'Protein Oatmeal',
          calories: 380,
          protein: 30,
          carbs: 40,
          fat: 10,
          ingredients: ['Oats', 'Protein powder', 'Milk', 'Banana', 'Peanut butter'],
          prepTime: 8,
          imageUrl: 'https://images.pexels.com/photos/4397920/pexels-photo-4397920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Egg White Scramble',
          calories: 350,
          protein: 35,
          carbs: 20,
          fat: 15,
          ingredients: ['Egg whites', 'Spinach', 'Bell peppers', 'Turkey bacon', 'Whole grain toast'],
          prepTime: 15,
          imageUrl: 'https://images.pexels.com/photos/6294248/pexels-photo-6294248.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      lunch: [
        {
          name: 'Grilled Chicken Salad',
          calories: 450,
          protein: 40,
          carbs: 25,
          fat: 20,
          ingredients: ['Grilled chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Avocado', 'Olive oil dressing'],
          prepTime: 20,
          imageUrl: 'https://images.pexels.com/photos/5718071/pexels-photo-5718071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Tuna Protein Bowl',
          calories: 480,
          protein: 45,
          carbs: 30,
          fat: 18,
          ingredients: ['Tuna', 'Quinoa', 'Edamame', 'Bell peppers', 'Cucumber', 'Light mayo'],
          prepTime: 15,
          imageUrl: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      dinner: [
        {
          name: 'Lean Steak with Sweet Potato',
          calories: 520,
          protein: 45,
          carbs: 30,
          fat: 22,
          ingredients: ['Lean beef steak', 'Sweet potato', 'Broccoli', 'Olive oil', 'Herbs'],
          prepTime: 25,
          imageUrl: 'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Baked Cod with Quinoa',
          calories: 480,
          protein: 42,
          carbs: 35,
          fat: 15,
          ingredients: ['Cod fillet', 'Quinoa', 'Asparagus', 'Lemon', 'Olive oil', 'Herbs'],
          prepTime: 30,
          imageUrl: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      snacks: [
        {
          name: 'Protein Shake',
          calories: 180,
          protein: 25,
          carbs: 10,
          fat: 3,
          ingredients: ['Protein powder', 'Almond milk', 'Ice'],
          prepTime: 3,
          imageUrl: 'https://images.pexels.com/photos/3735207/pexels-photo-3735207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Cottage Cheese with Berries',
          calories: 160,
          protein: 20,
          carbs: 12,
          fat: 5,
          ingredients: ['Cottage cheese', 'Mixed berries', 'Cinnamon'],
          prepTime: 2,
          imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ]
    }
  },
  
  // Low Carb Plan
  {
    id: 'low-carb',
    name: 'Low Carb Plan',
    description: 'Reduced carbohydrate meal plan focused on protein and healthy fats.',
    targetCalories: 1800,
    macroRatio: {
      protein: 30, // 30% of calories from protein
      carbs: 20, // 20% of calories from carbs
      fat: 50 // 50% of calories from fat
    },
    dietaryPreferences: ['low-carb', 'keto-friendly'],
    meals: {
      breakfast: [
        {
          name: 'Avocado and Egg Bowl',
          calories: 350,
          protein: 18,
          carbs: 10,
          fat: 28,
          ingredients: ['Eggs', 'Avocado', 'Spinach', 'Cherry tomatoes', 'Olive oil'],
          prepTime: 12,
          imageUrl: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Chia Almond Pudding',
          calories: 320,
          protein: 12,
          carbs: 15,
          fat: 25,
          ingredients: ['Chia seeds', 'Almond milk', 'Almonds', 'Berries', 'Cinnamon'],
          prepTime: 10,
          imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      lunch: [
        {
          name: 'Cobb Salad',
          calories: 450,
          protein: 30,
          carbs: 12,
          fat: 32,
          ingredients: ['Romaine lettuce', 'Grilled chicken', 'Bacon', 'Hard-boiled egg', 'Avocado', 'Blue cheese', 'Olive oil'],
          prepTime: 20,
          imageUrl: 'https://images.pexels.com/photos/5718071/pexels-photo-5718071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Zucchini Noodles with Pesto and Chicken',
          calories: 420,
          protein: 35,
          carbs: 10,
          fat: 28,
          ingredients: ['Zucchini', 'Grilled chicken', 'Pesto', 'Cherry tomatoes', 'Parmesan cheese'],
          prepTime: 25,
          imageUrl: 'https://images.pexels.com/photos/1435896/pexels-photo-1435896.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      dinner: [
        {
          name: 'Baked Salmon with Asparagus',
          calories: 480,
          protein: 40,
          carbs: 8,
          fat: 32,
          ingredients: ['Salmon fillet', 'Asparagus', 'Lemon', 'Olive oil', 'Garlic', 'Herbs'],
          prepTime: 25,
          imageUrl: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Cauliflower Fried Rice with Shrimp',
          calories: 420,
          protein: 35,
          carbs: 15,
          fat: 25,
          ingredients: ['Cauliflower rice', 'Shrimp', 'Eggs', 'Bell peppers', 'Onion', 'Garlic', 'Soy sauce', 'Sesame oil'],
          prepTime: 30,
          imageUrl: 'https://images.pexels.com/photos/5848496/pexels-photo-5848496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      snacks: [
        {
          name: 'Cheese and Nuts',
          calories: 200,
          protein: 10,
          carbs: 5,
          fat: 16,
          ingredients: ['Cheese cubes', 'Mixed nuts'],
          prepTime: 1,
          imageUrl: 'https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Celery with Almond Butter',
          calories: 150,
          protein: 5,
          carbs: 8,
          fat: 12,
          ingredients: ['Celery sticks', 'Almond butter'],
          prepTime: 3,
          imageUrl: 'https://images.pexels.com/photos/5945559/pexels-photo-5945559.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ]
    }
  },
  
  // Plant-Based Plan
  {
    id: 'plant-based',
    name: 'Plant-Based Plan',
    description: 'Nutrient-rich vegan meal plan with complete protein sources.',
    targetCalories: 1900,
    macroRatio: {
      protein: 20, // 20% of calories from protein
      carbs: 55, // 55% of calories from carbs
      fat: 25 // 25% of calories from fat
    },
    dietaryPreferences: ['vegan', 'plant-based', 'vegetarian'],
    meals: {
      breakfast: [
        {
          name: 'Tofu Scramble with Vegetables',
          calories: 320,
          protein: 18,
          carbs: 25,
          fat: 16,
          ingredients: ['Tofu', 'Nutritional yeast', 'Bell peppers', 'Spinach', 'Onion', 'Turmeric', 'Whole grain toast'],
          prepTime: 15,
          imageUrl: 'https://images.pexels.com/photos/6294248/pexels-photo-6294248.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Overnight Oats with Chia',
          calories: 340,
          protein: 12,
          carbs: 50,
          fat: 10,
          ingredients: ['Oats', 'Chia seeds', 'Plant milk', 'Banana', 'Berries', 'Maple syrup'],
          prepTime: 10,
          imageUrl: 'https://images.pexels.com/photos/4397920/pexels-photo-4397920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      lunch: [
        {
          name: 'Chickpea and Vegetable Buddha Bowl',
          calories: 420,
          protein: 15,
          carbs: 60,
          fat: 14,
          ingredients: ['Chickpeas', 'Quinoa', 'Roasted sweet potato', 'Avocado', 'Kale', 'Tahini dressing'],
          prepTime: 25,
          imageUrl: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Lentil Soup with Whole Grain Bread',
          calories: 380,
          protein: 18,
          carbs: 55,
          fat: 8,
          ingredients: ['Lentils', 'Carrots', 'Celery', 'Onion', 'Tomatoes', 'Vegetable broth', 'Whole grain bread'],
          prepTime: 30,
          imageUrl: 'https://images.pexels.com/photos/5419336/pexels-photo-5419336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      dinner: [
        {
          name: 'Tempeh Stir-Fry with Brown Rice',
          calories: 450,
          protein: 22,
          carbs: 55,
          fat: 16,
          ingredients: ['Tempeh', 'Brown rice', 'Broccoli', 'Carrots', 'Snow peas', 'Garlic', 'Ginger', 'Soy sauce'],
          prepTime: 30,
          imageUrl: 'https://images.pexels.com/photos/5848496/pexels-photo-5848496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Stuffed Bell Peppers with Quinoa',
          calories: 420,
          protein: 16,
          carbs: 50,
          fat: 18,
          ingredients: ['Bell peppers', 'Quinoa', 'Black beans', 'Corn', 'Tomatoes', 'Onion', 'Avocado', 'Cilantro'],
          prepTime: 40,
          imageUrl: 'https://images.pexels.com/photos/5737247/pexels-photo-5737247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      snacks: [
        {
          name: 'Hummus with Vegetable Sticks',
          calories: 160,
          protein: 5,
          carbs: 15,
          fat: 10,
          ingredients: ['Hummus', 'Carrot sticks', 'Cucumber sticks', 'Bell pepper strips'],
          prepTime: 5,
          imageUrl: 'https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          name: 'Trail Mix',
          calories: 180,
          protein: 6,
          carbs: 15,
          fat: 12,
          ingredients: ['Almonds', 'Walnuts', 'Dried cranberries', 'Pumpkin seeds', 'Dark chocolate chips'],
          prepTime: 2,
          imageUrl: 'https://images.pexels.com/photos/6419720/pexels-photo-6419720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ]
    }
  }
];

// Meal plan generation functions
export function generateMealPlan(
  targetCalories: number,
  preferences: string[] = [],
  restrictions: string[] = []
): MealPlan {
  // Find the closest meal plan to the target calories
  const closestPlan = mealPlans.reduce((closest, plan) => {
    return Math.abs(plan.targetCalories - targetCalories) < Math.abs(closest.targetCalories - targetCalories)
      ? plan
      : closest;
  }, mealPlans[0]);
  
  // Create a copy of the plan
  const customPlan: MealPlan = JSON.parse(JSON.stringify(closestPlan));
  
  // Adjust the plan name and description
  customPlan.id = `custom-${Date.now()}`;
  customPlan.name = 'Custom Meal Plan';
  customPlan.description = `Personalized meal plan targeting ${targetCalories} calories`;
  customPlan.targetCalories = targetCalories;
  
  // Apply dietary preferences
  if (preferences.includes('high-protein')) {
    customPlan.macroRatio.protein = Math.min(40, customPlan.macroRatio.protein + 10);
    customPlan.macroRatio.carbs = Math.max(20, customPlan.macroRatio.carbs - 10);
    customPlan.dietaryPreferences.push('high-protein');
  }
  
  if (preferences.includes('low-carb')) {
    customPlan.macroRatio.carbs = Math.max(20, customPlan.macroRatio.carbs - 15);
    customPlan.macroRatio.fat = Math.min(50, customPlan.macroRatio.fat + 15);
    customPlan.dietaryPreferences.push('low-carb');
  }
  
  if (preferences.includes('vegetarian') && !customPlan.dietaryPreferences.includes('vegetarian')) {
    customPlan.dietaryPreferences.push('vegetarian');
    // Would replace meat meals with vegetarian options in a full implementation
  }
  
  // Scale meals to match target calories
  const scaleFactor = targetCalories / closestPlan.targetCalories;
  
  Object.keys(customPlan.meals).forEach(mealTime => {
    const meals = customPlan.meals[mealTime as keyof typeof customPlan.meals];
    meals.forEach(meal => {
      meal.calories = Math.round(meal.calories * scaleFactor);
      meal.protein = Math.round(meal.protein * scaleFactor);
      meal.carbs = Math.round(meal.carbs * scaleFactor);
      meal.fat = Math.round(meal.fat * scaleFactor);
    });
  });
  
  return customPlan;
}

export function getMealPlanById(id: string): MealPlan | undefined {
  return mealPlans.find(plan => plan.id === id);
}

export function getMealsByDietaryPreference(preference: string): MealPlan[] {
  return mealPlans.filter(plan => 
    plan.dietaryPreferences.includes(preference)
  );
}

export function getMealsByCalorieRange(min: number, max: number): MealPlan[] {
  return mealPlans.filter(plan => 
    plan.targetCalories >= min && plan.targetCalories <= max
  );
}

// Meal recommendation functions
export function recommendBreakfastOptions(
  calorieTarget: number,
  preferences: string[] = []
): Meal[] {
  let options: Meal[] = [];
  
  mealPlans.forEach(plan => {
    // Check if plan matches preferences
    const matchesPreferences = preferences.length === 0 || 
      preferences.some(pref => plan.dietaryPreferences.includes(pref));
    
    if (matchesPreferences) {
      options = [...options, ...plan.meals.breakfast];
    }
  });
  
  // Filter by calorie range (within 20% of target)
  const targetMin = calorieTarget * 0.8;
  const targetMax = calorieTarget * 1.2;
  
  return options
    .filter(meal => meal.calories >= targetMin && meal.calories <= targetMax)
    .sort((a, b) => Math.abs(a.calories - calorieTarget) - Math.abs(b.calories - calorieTarget));
}

export function calculateDailyNutrients(
  breakfast: Meal,
  lunch: Meal,
  dinner: Meal,
  snacks: Meal[] = []
): {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
} {
  let totalCalories = breakfast.calories + lunch.calories + dinner.calories;
  let totalProtein = breakfast.protein + lunch.protein + dinner.protein;
  let totalCarbs = breakfast.carbs + lunch.carbs + dinner.carbs;
  let totalFat = breakfast.fat + lunch.fat + dinner.fat;
  
  snacks.forEach(snack => {
    totalCalories += snack.calories;
    totalProtein += snack.protein;
    totalCarbs += snack.carbs;
    totalFat += snack.fat;
  });
  
  return {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat
  };
}