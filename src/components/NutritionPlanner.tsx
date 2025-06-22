import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { Calendar, ChefHat, Plus, Clock, Users, Utensils, Target } from 'lucide-react';
import { User, MealPlan } from '../types';

interface NutritionPlannerProps {
  user: User;
}

export function NutritionPlanner({ user }: NutritionPlannerProps) {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'planner' | 'recipes' | 'shopping'>('planner');

  // Mock meal plans
  const mealPlans: MealPlan[] = [
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
          name: 'Quinoa Buddha Bowl',
          calories: 450,
          protein: 18,
          carbs: 65,
          fat: 12,
          ingredients: ['Quinoa', 'Chickpeas', 'Avocado', 'Vegetables', 'Tahini'],
          prepTime: 20
        },
        dinner: {
          name: 'Grilled Salmon with Vegetables',
          calories: 520,
          protein: 35,
          carbs: 25,
          fat: 28,
          ingredients: ['Salmon fillet', 'Broccoli', 'Sweet potato', 'Olive oil'],
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
          }
        ]
      },
      totalCalories: 1480,
      totalProtein: 79,
      totalCarbs: 145,
      totalFat: 60
    }
  ];

  // Mock recipes
  const recipes = [
    {
      id: '1',
      name: 'Protein Smoothie Bowl',
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
        '1 cup berries',
        '1 scoop protein powder',
        '1/2 cup almond milk',
        '1 tbsp chia seeds',
        'Granola for topping'
      ],
      instructions: [
        'Blend banana, berries, protein powder, and almond milk',
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
    }
  ];

  const getDaysOfWeek = () => {
    const days = [];
    const startOfWeek = new Date(selectedDay);
    startOfWeek.setDate(selectedDay.getDate() - selectedDay.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const renderMealPlanner = () => (
    <div className="space-y-6">
      {/* Week Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Week of {selectedDay.toLocaleDateString()}</h4>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost">Previous</Button>
              <Button size="sm" variant="ghost">Next</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {getDaysOfWeek().map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  day.toDateString() === selectedDay.toDateString()
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {day.toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className="font-medium">{day.getDate()}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Meal Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Meal Plan - {selectedDay.toLocaleDateString()}
            </h3>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              Generate Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mealPlans.length > 0 ? (
            <div className="space-y-4">
              {/* Daily Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-500">{mealPlans[0].totalCalories}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{mealPlans[0].totalProtein}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{mealPlans[0].totalCarbs}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{mealPlans[0].totalFat}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Fat</div>
                </div>
              </div>

              {/* Meals */}
              {Object.entries(mealPlans[0].meals).map(([mealType, meal]) => {
                if (mealType === 'snacks') {
                  return (
                    <div key={mealType} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3 capitalize">Snacks</h4>
                      <div className="space-y-2">
                        {(meal as any[]).map((snack, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">{snack.name}</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {snack.calories} cal • {snack.protein}g protein
                              </p>
                            </div>
                            <Button size="sm" variant="ghost">View</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                const mealData = meal as any;
                return (
                  <div key={mealType} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white capitalize">{mealType}</h4>
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">{mealData.name}</h5>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">{mealData.calories} cal</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          P: {mealData.protein}g | C: {mealData.carbs}g | F: {mealData.fat}g
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{mealData.prepTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Utensils size={14} />
                        <span>{mealData.ingredients.length} ingredients</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">View Recipe</Button>
                      <Button size="sm" variant="ghost">Replace</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChefHat className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No meal plan for this day</p>
              <Button>Generate Meal Plan</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderRecipes = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recipe Collection</h3>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              Add Recipe
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{recipe.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{recipe.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Calories:</span>
                    <span className="font-medium ml-1">{recipe.calories}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Protein:</span>
                    <span className="font-medium ml-1">{recipe.protein}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Prep Time:</span>
                    <span className="font-medium ml-1">{recipe.prepTime} min</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Servings:</span>
                    <span className="font-medium ml-1">{recipe.servings}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost">View Recipe</Button>
                  <Button size="sm" variant="ghost">Add to Plan</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderShoppingList = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Shopping List</h3>
            <Button size="sm">Generate List</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Generate a shopping list based on your meal plans
            </p>
            <Button>Create Shopping List</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calendar className="text-emerald-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Nutrition Planner</h3>
          </div>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'planner', label: 'Meal Planner', icon: Calendar },
              { id: 'recipes', label: 'Recipes', icon: ChefHat },
              { id: 'shopping', label: 'Shopping List', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'planner' && renderMealPlanner()}
      {activeTab === 'recipes' && renderRecipes()}
      {activeTab === 'shopping' && renderShoppingList()}
    </div>
  );
}