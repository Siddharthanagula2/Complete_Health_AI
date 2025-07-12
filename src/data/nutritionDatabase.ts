// Comprehensive nutrition database with real USDA and international food data
interface NutritionItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  barcode?: string;
  serving: {
    amount: number;
    unit: string;
    grams: number;
  };
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    cholesterol?: number;
    saturatedFat?: number;
    transFat?: number;
    potassium?: number;
    calcium?: number;
    iron?: number;
    vitaminC?: number;
    vitaminA?: number;
    vitaminD?: number;
    vitaminB12?: number;
    folate?: number;
    magnesium?: number;
    zinc?: number;
  };
  glycemicIndex?: number;
  allergens?: string[];
  tags?: string[];
}

export const nutritionDatabase: NutritionItem[] = [
  // FRUITS
  {
    id: 'apple-medium',
    name: 'Apple',
    category: 'Fruits',
    serving: { amount: 1, unit: 'medium', grams: 182 },
    nutrition: {
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      fiber: 4.4,
      sugar: 19,
      sodium: 2,
      potassium: 195,
      vitaminC: 8.4,
      calcium: 11
    },
    glycemicIndex: 36,
    tags: ['fresh', 'raw', 'natural']
  },
  {
    id: 'banana-medium',
    name: 'Banana',
    category: 'Fruits',
    serving: { amount: 1, unit: 'medium', grams: 118 },
    nutrition: {
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14,
      sodium: 1,
      potassium: 422,
      vitaminC: 10.3,
      vitaminB12: 0.1,
      magnesium: 32
    },
    glycemicIndex: 51,
    tags: ['fresh', 'raw', 'potassium-rich']
  },
  {
    id: 'orange-medium',
    name: 'Orange',
    category: 'Fruits',
    serving: { amount: 1, unit: 'medium', grams: 154 },
    nutrition: {
      calories: 62,
      protein: 1.2,
      carbs: 15.4,
      fat: 0.2,
      fiber: 3.1,
      sugar: 12.2,
      sodium: 0,
      potassium: 237,
      vitaminC: 70,
      calcium: 40,
      folate: 40
    },
    glycemicIndex: 45,
    tags: ['fresh', 'citrus', 'vitamin-c-rich']
  },
  {
    id: 'strawberries-cup',
    name: 'Strawberries',
    category: 'Fruits',
    serving: { amount: 1, unit: 'cup', grams: 152 },
    nutrition: {
      calories: 49,
      protein: 1,
      carbs: 11.7,
      fat: 0.5,
      fiber: 3,
      sugar: 7.4,
      sodium: 1,
      potassium: 233,
      vitaminC: 89.4,
      folate: 29.3
    },
    glycemicIndex: 40,
    tags: ['fresh', 'berries', 'antioxidant-rich']
  },
  {
    id: 'blueberries-cup',
    name: 'Blueberries',
    category: 'Fruits',
    serving: { amount: 1, unit: 'cup', grams: 148 },
    nutrition: {
      calories: 84,
      protein: 1.1,
      carbs: 21.5,
      fat: 0.5,
      fiber: 3.6,
      sugar: 15,
      sodium: 1,
      potassium: 114,
      vitaminC: 14.4,
      vitaminA: 80
    },
    glycemicIndex: 53,
    tags: ['fresh', 'berries', 'superfood', 'antioxidant-rich']
  },

  // VEGETABLES
  {
    id: 'broccoli-cup',
    name: 'Broccoli',
    category: 'Vegetables',
    serving: { amount: 1, unit: 'cup chopped', grams: 91 },
    nutrition: {
      calories: 25,
      protein: 3,
      carbs: 5,
      fat: 0.3,
      fiber: 2.3,
      sugar: 1.5,
      sodium: 33,
      potassium: 288,
      vitaminC: 81.2,
      vitaminA: 567,
      folate: 57,
      calcium: 43
    },
    glycemicIndex: 10,
    tags: ['cruciferous', 'vitamin-rich', 'low-calorie']
  },
  {
    id: 'spinach-cup',
    name: 'Spinach',
    category: 'Vegetables',
    serving: { amount: 1, unit: 'cup raw', grams: 30 },
    nutrition: {
      calories: 7,
      protein: 0.9,
      carbs: 1.1,
      fat: 0.1,
      fiber: 0.7,
      sugar: 0.1,
      sodium: 24,
      potassium: 167,
      vitaminA: 2813,
      vitaminC: 8.4,
      iron: 0.8,
      folate: 58.2
    },
    glycemicIndex: 15,
    tags: ['leafy-green', 'iron-rich', 'low-calorie']
  },
  {
    id: 'sweet-potato-medium',
    name: 'Sweet Potato',
    category: 'Vegetables',
    serving: { amount: 1, unit: 'medium baked', grams: 128 },
    nutrition: {
      calories: 112,
      protein: 2,
      carbs: 26,
      fat: 0.1,
      fiber: 3.9,
      sugar: 5.4,
      sodium: 6,
      potassium: 542,
      vitaminA: 21909,
      vitaminC: 22.3,
      calcium: 43
    },
    glycemicIndex: 70,
    tags: ['root-vegetable', 'vitamin-a-rich', 'complex-carbs']
  },
  {
    id: 'carrots-cup',
    name: 'Carrots',
    category: 'Vegetables',
    serving: { amount: 1, unit: 'cup chopped', grams: 128 },
    nutrition: {
      calories: 52,
      protein: 1.2,
      carbs: 12.3,
      fat: 0.3,
      fiber: 3.6,
      sugar: 6,
      sodium: 88,
      potassium: 410,
      vitaminA: 20381,
      vitaminC: 7.6
    },
    glycemicIndex: 47,
    tags: ['root-vegetable', 'beta-carotene-rich']
  },

  // PROTEINS
  {
    id: 'chicken-breast-100g',
    name: 'Chicken Breast',
    category: 'Proteins',
    serving: { amount: 100, unit: 'grams', grams: 100 },
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      cholesterol: 85,
      saturatedFat: 1,
      potassium: 256
    },
    tags: ['lean-protein', 'poultry', 'high-protein']
  },
  {
    id: 'salmon-100g',
    name: 'Atlantic Salmon',
    category: 'Proteins',
    serving: { amount: 100, unit: 'grams', grams: 100 },
    nutrition: {
      calories: 208,
      protein: 25.4,
      carbs: 0,
      fat: 12.4,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      cholesterol: 55,
      saturatedFat: 3.1,
      potassium: 363
    },
    tags: ['fish', 'omega-3-rich', 'high-protein']
  },
  {
    id: 'eggs-large',
    name: 'Eggs',
    category: 'Proteins',
    serving: { amount: 1, unit: 'large', grams: 50 },
    nutrition: {
      calories: 70,
      protein: 6,
      carbs: 0.6,
      fat: 5,
      fiber: 0,
      sugar: 0.6,
      sodium: 70,
      cholesterol: 186,
      saturatedFat: 1.6,
      vitaminD: 1.1,
      vitaminB12: 0.6
    },
    tags: ['complete-protein', 'vitamin-d-rich']
  },
  {
    id: 'greek-yogurt-cup',
    name: 'Greek Yogurt',
    brand: 'Plain, Non-fat',
    category: 'Dairy',
    serving: { amount: 1, unit: 'cup', grams: 245 },
    nutrition: {
      calories: 130,
      protein: 23,
      carbs: 9,
      fat: 0,
      fiber: 0,
      sugar: 9,
      sodium: 65,
      calcium: 230,
      vitaminB12: 1.3
    },
    tags: ['probiotic', 'high-protein', 'calcium-rich']
  },

  // GRAINS & STARCHES
  {
    id: 'brown-rice-cup',
    name: 'Brown Rice',
    category: 'Grains',
    serving: { amount: 1, unit: 'cup cooked', grams: 195 },
    nutrition: {
      calories: 216,
      protein: 5,
      carbs: 45,
      fat: 1.8,
      fiber: 3.5,
      sugar: 0.7,
      sodium: 10,
      potassium: 84,
      magnesium: 84
    },
    glycemicIndex: 68,
    tags: ['whole-grain', 'complex-carbs', 'gluten-free']
  },
  {
    id: 'quinoa-cup',
    name: 'Quinoa',
    category: 'Grains',
    serving: { amount: 1, unit: 'cup cooked', grams: 185 },
    nutrition: {
      calories: 222,
      protein: 8,
      carbs: 39,
      fat: 3.6,
      fiber: 5,
      sugar: 1.6,
      sodium: 13,
      potassium: 318,
      magnesium: 118,
      iron: 2.8
    },
    glycemicIndex: 53,
    tags: ['complete-protein', 'gluten-free', 'superfood']
  },
  {
    id: 'oats-cup',
    name: 'Oatmeal',
    category: 'Grains',
    serving: { amount: 1, unit: 'cup cooked', grams: 234 },
    nutrition: {
      calories: 147,
      protein: 5.9,
      carbs: 25,
      fat: 2.3,
      fiber: 4,
      sugar: 0.6,
      sodium: 9,
      potassium: 164,
      magnesium: 61
    },
    glycemicIndex: 55,
    tags: ['whole-grain', 'heart-healthy', 'fiber-rich']
  },

  // NUTS & SEEDS
  {
    id: 'almonds-28g',
    name: 'Almonds',
    category: 'Nuts & Seeds',
    serving: { amount: 28, unit: 'grams (23 nuts)', grams: 28 },
    nutrition: {
      calories: 164,
      protein: 6,
      carbs: 6,
      fat: 14,
      fiber: 3.5,
      sugar: 1.2,
      sodium: 1,
      potassium: 208,
      calcium: 76,
      magnesium: 76,
      vitaminE: 7.3
    },
    tags: ['healthy-fats', 'vitamin-e-rich', 'heart-healthy']
  },
  {
    id: 'walnuts-28g',
    name: 'Walnuts',
    category: 'Nuts & Seeds',
    serving: { amount: 28, unit: 'grams (14 halves)', grams: 28 },
    nutrition: {
      calories: 185,
      protein: 4.3,
      carbs: 3.9,
      fat: 18.5,
      fiber: 1.9,
      sugar: 0.7,
      sodium: 1,
      potassium: 125,
      magnesium: 45
    },
    tags: ['omega-3-rich', 'brain-healthy', 'antioxidant-rich']
  },
  {
    id: 'chia-seeds-28g',
    name: 'Chia Seeds',
    category: 'Nuts & Seeds',
    serving: { amount: 28, unit: 'grams (2 tbsp)', grams: 28 },
    nutrition: {
      calories: 138,
      protein: 4.7,
      carbs: 12,
      fat: 8.7,
      fiber: 9.8,
      sugar: 0,
      sodium: 5,
      potassium: 115,
      calcium: 179,
      magnesium: 95
    },
    tags: ['superfood', 'omega-3-rich', 'fiber-rich', 'calcium-rich']
  },

  // LEGUMES
  {
    id: 'black-beans-cup',
    name: 'Black Beans',
    category: 'Legumes',
    serving: { amount: 1, unit: 'cup cooked', grams: 172 },
    nutrition: {
      calories: 227,
      protein: 15.2,
      carbs: 40.8,
      fat: 0.9,
      fiber: 15,
      sugar: 0.6,
      sodium: 2,
      potassium: 611,
      folate: 256,
      iron: 3.6
    },
    glycemicIndex: 30,
    tags: ['high-fiber', 'plant-protein', 'folate-rich']
  },
  {
    id: 'lentils-cup',
    name: 'Lentils',
    category: 'Legumes',
    serving: { amount: 1, unit: 'cup cooked', grams: 198 },
    nutrition: {
      calories: 230,
      protein: 17.9,
      carbs: 39.9,
      fat: 0.8,
      fiber: 15.6,
      sugar: 3.6,
      sodium: 4,
      potassium: 731,
      folate: 358,
      iron: 6.6
    },
    glycemicIndex: 32,
    tags: ['high-protein', 'iron-rich', 'folate-rich']
  },

  // BEVERAGES
  {
    id: 'water-cup',
    name: 'Water',
    category: 'Beverages',
    serving: { amount: 1, unit: 'cup', grams: 240 },
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    tags: ['hydration', 'zero-calorie']
  },
  {
    id: 'green-tea-cup',
    name: 'Green Tea',
    category: 'Beverages',
    serving: { amount: 1, unit: 'cup', grams: 245 },
    nutrition: {
      calories: 2,
      protein: 0.5,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 2
    },
    tags: ['antioxidant-rich', 'caffeine', 'metabolism-boost']
  },

  // PROCESSED FOODS (for comparison)
  {
    id: 'white-bread-slice',
    name: 'White Bread',
    category: 'Processed Grains',
    serving: { amount: 1, unit: 'slice', grams: 28 },
    nutrition: {
      calories: 79,
      protein: 2.3,
      carbs: 14.6,
      fat: 1.1,
      fiber: 0.8,
      sugar: 1.4,
      sodium: 147
    },
    glycemicIndex: 75,
    tags: ['processed', 'refined-carbs']
  },
  {
    id: 'potato-chips-28g',
    name: 'Potato Chips',
    category: 'Snacks',
    serving: { amount: 28, unit: 'grams (about 15 chips)', grams: 28 },
    nutrition: {
      calories: 152,
      protein: 2,
      carbs: 15,
      fat: 10,
      fiber: 1.4,
      sugar: 0.1,
      sodium: 149,
      saturatedFat: 3.1,
      transFat: 0
    },
    tags: ['processed', 'high-sodium', 'snack-food']
  }
];

// Food categories for filtering
const foodCategories = [
  'Fruits',
  'Vegetables',
  'Proteins',
  'Dairy',
  'Grains',
  'Nuts & Seeds',
  'Legumes',
  'Beverages',
  'Processed Grains',
  'Snacks'
];

// Common allergens
const commonAllergens = [
  'Milk',
  'Eggs',
  'Fish',
  'Shellfish',
  'Tree Nuts',
  'Peanuts',
  'Wheat',
  'Soybeans',
  'Sesame'
];

// Dietary tags for filtering
const dietaryTags = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'keto-friendly',
  'paleo-friendly',
  'low-carb',
  'high-protein',
  'high-fiber',
  'heart-healthy',
  'superfood',
  'antioxidant-rich',
  'omega-3-rich',
  'probiotic'
];

// Nutrition search and filtering functions
function searchFoods(query: string): NutritionItem[] {
  const lowercaseQuery = query.toLowerCase();
  return nutritionDatabase.filter(item =>
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery) ||
    item.brand?.toLowerCase().includes(lowercaseQuery) ||
    item.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

function getFoodsByCategory(category: string): NutritionItem[] {
  return nutritionDatabase.filter(item => item.category === category);
}

function getFoodsByTag(tag: string): NutritionItem[] {
  return nutritionDatabase.filter(item => item.tags?.includes(tag));
}

function getFoodById(id: string): NutritionItem | undefined {
  return nutritionDatabase.find(item => item.id === id);
}

// Nutrition calculation helpers
function calculateNutritionForServing(
  food: NutritionItem,
  servingMultiplier: number
): NutritionItem['nutrition'] {
  const nutrition = { ...food.nutrition };
  
  Object.keys(nutrition).forEach(key => {
    const value = nutrition[key as keyof typeof nutrition];
    if (typeof value === 'number') {
      (nutrition as any)[key] = Math.round((value * servingMultiplier) * 10) / 10;
    }
  });
  
  return nutrition;
}

function getTotalNutrition(foods: Array<{ food: NutritionItem; servings: number }>): NutritionItem['nutrition'] {
  const total: NutritionItem['nutrition'] = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    cholesterol: 0,
    saturatedFat: 0,
    transFat: 0,
    potassium: 0,
    calcium: 0,
    iron: 0,
    vitaminC: 0,
    vitaminA: 0,
    vitaminD: 0,
    vitaminB12: 0,
    folate: 0,
    magnesium: 0,
    zinc: 0
  };

  foods.forEach(({ food, servings }) => {
    const nutrition = calculateNutritionForServing(food, servings);
    
    Object.keys(total).forEach(key => {
      const nutritionValue = nutrition[key as keyof typeof nutrition];
      const totalValue = total[key as keyof typeof total];
      
      if (typeof nutritionValue === 'number' && typeof totalValue === 'number') {
        (total as any)[key] = Math.round((totalValue + nutritionValue) * 10) / 10;
      }
    });
  });

  return total;
}