import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Progress } from './ui/Progress';
import { Search, Scan, Plus, Coffee, Sun, Moon, Apple } from 'lucide-react';
import { FoodEntry } from '../types';
import { mockFoodDatabase } from '../data/mockData';

interface FoodLogProps {
  entries: FoodEntry[];
  onAddEntry: (entry: Omit<FoodEntry, 'id'>) => void;
}

export function FoodLog({ entries, onAddEntry }: FoodLogProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const filteredFoods = useMemo(() => {
    return mockFoodDatabase.filter(food =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const mealEntries = useMemo(() => {
    return {
      breakfast: entries.filter(e => e.meal === 'breakfast'),
      lunch: entries.filter(e => e.meal === 'lunch'),
      dinner: entries.filter(e => e.meal === 'dinner'),
      snack: entries.filter(e => e.meal === 'snack')
    };
  }, [entries]);

  const totalCalories = entries.reduce((sum, entry) => sum + (entry.calories * entry.quantity), 0);
  const totalProtein = entries.reduce((sum, entry) => sum + (entry.protein * entry.quantity), 0);
  const totalCarbs = entries.reduce((sum, entry) => sum + (entry.carbs * entry.quantity), 0);
  const totalFat = entries.reduce((sum, entry) => sum + (entry.fat * entry.quantity), 0);

  const handleAddFood = () => {
    if (!selectedFood) return;

    const entry: Omit<FoodEntry, 'id'> = {
      name: selectedFood.name,
      brand: selectedFood.brand,
      calories: selectedFood.calories,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fat: selectedFood.fat,
      fiber: selectedFood.fiber,
      sugar: selectedFood.sugar,
      sodium: selectedFood.sodium,
      serving: selectedFood.serving,
      quantity,
      meal: selectedMeal,
      timestamp: new Date()
    };

    onAddEntry(entry);
    setIsAddModalOpen(false);
    setSelectedFood(null);
    setQuantity(1);
    setSearchQuery('');
  };

  const mealIcons = {
    breakfast: Coffee,
    lunch: Sun,
    dinner: Moon,
    snack: Apple
  };

  const simulateBarcodeScan = () => {
    // Simulate barcode scan by selecting a random food item
    const randomFood = mockFoodDatabase[Math.floor(Math.random() * mockFoodDatabase.length)];
    setSelectedFood(randomFood);
    setSearchQuery(randomFood.name);
  };

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Today's Nutrition</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-500">{Math.round(totalCalories)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{Math.round(totalProtein)}g</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{Math.round(totalCarbs)}g</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{Math.round(totalFat)}g</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => {
        const MealIcon = mealIcons[meal as keyof typeof mealIcons];
        const mealData = mealEntries[meal as keyof typeof mealEntries];
        const mealCalories = mealData.reduce((sum, entry) => sum + (entry.calories * entry.quantity), 0);

        return (
          <Card key={meal}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MealIcon className="text-emerald-500" size={20} />
                  <h3 className="font-semibold text-gray-900 dark:text-white capitalize">{meal}</h3>
                  <span className="text-sm text-gray-500">({Math.round(mealCalories)} cal)</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedMeal(meal as any);
                    setIsAddModalOpen(true);
                  }}
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {mealData.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No items logged yet</p>
              ) : (
                <div className="space-y-2">
                  {mealData.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{entry.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {entry.quantity} × {entry.serving}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {Math.round(entry.calories * entry.quantity)} cal
                        </div>
                        <div className="text-xs text-gray-500">
                          P: {Math.round(entry.protein * entry.quantity)}g | 
                          C: {Math.round(entry.carbs * entry.quantity)}g | 
                          F: {Math.round(entry.fat * entry.quantity)}g
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Add Food Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add Food to ${selectedMeal?.charAt(0).toUpperCase()}${selectedMeal?.slice(1)}`}
      >
        <div className="space-y-4">
          {/* Search and Barcode */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search foods..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={simulateBarcodeScan} className="px-3">
              <Scan size={20} />
            </Button>
          </div>

          {/* Food Search Results */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedFood?.id === food.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSelectedFood(food)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{food.name}</h4>
                    {food.brand && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{food.brand}</p>
                    )}
                    <p className="text-sm text-gray-500">{food.serving}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">{food.calories} cal</div>
                    <div className="text-xs text-gray-500">
                      P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quantity Selection */}
          {selectedFood && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Servings
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Nutrition Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Calories: {Math.round(selectedFood.calories * quantity)}</div>
                  <div>Protein: {Math.round(selectedFood.protein * quantity)}g</div>
                  <div>Carbs: {Math.round(selectedFood.carbs * quantity)}g</div>
                  <div>Fat: {Math.round(selectedFood.fat * quantity)}g</div>
                </div>
              </div>
              
              <Button onClick={handleAddFood} className="w-full">
                Add to {selectedMeal?.charAt(0).toUpperCase()}{selectedMeal?.slice(1)}
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}