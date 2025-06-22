import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { Droplets, Plus, Minus } from 'lucide-react';
import { WaterEntry } from '../types';

interface WaterTrackerProps {
  entries: WaterEntry[];
  onAddEntry: (entry: Omit<WaterEntry, 'id'>) => void;
  goal: number;
}

export function WaterTracker({ entries, onAddEntry, goal }: WaterTrackerProps) {
  const [customAmount, setCustomAmount] = useState(250);
  
  const todayEntries = entries.filter(entry => {
    const today = new Date().toDateString();
    return entry.timestamp.toDateString() === today;
  });
  
  const totalToday = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const glassesToday = Math.round(totalToday / 250); // Assuming 250ml per glass
  
  const quickAmounts = [250, 350, 500, 750]; // ml
  
  const addWater = (amount: number) => {
    onAddEntry({
      amount,
      timestamp: new Date()
    });
  };

  return (
    <div className="space-y-6">
      {/* Water Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Daily Water Goal</h3>
            <Droplets className="text-blue-500" size={24} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-blue-500 mb-2">
              {glassesToday} / {goal}
            </div>
            <div className="text-gray-600 dark:text-gray-400">glasses</div>
          </div>
          
          <Progress 
            value={glassesToday} 
            max={goal} 
            color="blue" 
            className="mb-4"
          />
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalToday}ml consumed today
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {Math.max(0, (goal * 250) - totalToday)}ml remaining
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Buttons */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Quick Add</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                onClick={() => addWater(amount)}
                variant="secondary"
                className="flex items-center justify-center space-x-2"
              >
                <Droplets size={16} />
                <span>{amount}ml</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Amount */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Custom Amount</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCustomAmount(Math.max(50, customAmount - 50))}
            >
              <Minus size={16} />
            </Button>
            
            <div className="flex-1 text-center">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
                className="w-full text-center text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white"
                min="0"
                step="50"
              />
              <div className="text-sm text-gray-500">ml</div>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCustomAmount(customAmount + 50)}
            >
              <Plus size={16} />
            </Button>
          </div>
          
          <Button
            onClick={() => addWater(customAmount)}
            className="w-full mt-4"
          >
            <Droplets size={16} className="mr-2" />
            Add {customAmount}ml
          </Button>
        </CardContent>
      </Card>

      {/* Today's Intake History */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Today's Intake</h3>
        </CardHeader>
        <CardContent>
          {todayEntries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No water logged today. Start hydrating!
            </p>
          ) : (
            <div className="space-y-2">
              {todayEntries.reverse().map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Droplets className="text-blue-500" size={16} />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {entry.amount}ml
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}