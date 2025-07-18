import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Dashboard } from './Dashboard';
import { FoodLog } from './FoodLog';
import { WaterTracker } from './WaterTracker';
import { ExerciseLog } from './ExerciseLog';
import { Progress } from './Progress';
import { Profile } from './Profile';
import { AIHealthCoach } from './AIHealthCoach';
import { GPSWorkoutTracker } from './GPSWorkoutTracker';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { SocialCommunity } from './SocialCommunity';
import { MedicalProfessionalTools } from './MedicalProfessionalTools';
import { NutritionPlanner } from './NutritionPlanner';
import { SleepTracker } from './SleepTracker';
import { MoodTracker } from './MoodTracker';
import { HealthInsights } from './HealthInsights';
import { Achievements } from './Achievements';
import { FamilyDashboard } from './FamilyDashboard';
import { ProviderPortal } from './ProviderPortal';
import { MedicalRecords } from './MedicalRecords';
import { Settings } from './Settings';
import { Integrations } from './Integrations';
import { MedicationReminders } from './MedicationReminders';
import { LoadingScreen } from './LoadingScreen';
import { 
  Home, 
  Utensils, 
  Droplets, 
  Dumbbell, 
  TrendingUp, 
  User, 
  Plus,
  Menu,
  X,
  Bot,
  MapPin,
  BarChart3,
  Users,
  Stethoscope,
  Calendar,
  Moon,
  Heart,
  Lightbulb,
  Trophy,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Wifi,
  Pill
} from 'lucide-react';
import { 
  User as UserType, 
  FoodEntry, 
  WaterEntry, 
  ExerciseEntry,
  GPSWorkout,
  DailyStats,
  Achievement,
  SleepEntry,
  MoodEntry
} from '../types';
import { 
  mockUser, 
  mockFoodEntries,
  mockExerciseEntries,
  mockWaterEntries,
  mockSleepEntries,
  mockMoodEntries,
  mockDailyStats, 
  mockAchievements 
} from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseHealthService } from '../services/supabaseHealthService';

type ActiveTab = 'dashboard' | 'food' | 'water' | 'exercise' | 'progress' | 'profile' | 'ai-coach' | 'gps-workout' | 'analytics' | 'social' | 'medical' | 'nutrition-planner' | 'sleep' | 'mood' | 'insights' | 'achievements' | 'family' | 'provider-portal' | 'medical-records' | 'settings' | 'integrations' | 'medications';

function MainApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth();
  
  // Get active tab from URL
  const getActiveTabFromPath = (pathname: string): ActiveTab => {
    const path = pathname.replace('/', '');
    return (path as ActiveTab) || 'dashboard';
  };
  
  const [activeTab, setActiveTab] = useState<ActiveTab>(getActiveTabFromPath(location.pathname));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading your health data...');
  
  // User data - merge auth user with mock data
  const [user, setUser] = useLocalStorage<UserType>('health-user', {
    ...mockUser,
    name: authUser?.fullName || mockUser.name,
    email: authUser?.email || mockUser.email
  });
  const [foodEntries, setFoodEntries] = useLocalStorage<FoodEntry[]>('health-food-entries', mockFoodEntries);
  const [waterEntries, setWaterEntries] = useLocalStorage<WaterEntry[]>('health-water-entries', mockWaterEntries);
  const [exerciseEntries, setExerciseEntries] = useLocalStorage<ExerciseEntry[]>('health-exercise-entries', mockExerciseEntries);
  const [gpsWorkouts, setGpsWorkouts] = useLocalStorage<GPSWorkout[]>('health-gps-workouts', []);
  const [sleepEntries, setSleepEntries] = useLocalStorage<SleepEntry[]>('health-sleep-entries', mockSleepEntries);
  const [moodEntries, setMoodEntries] = useLocalStorage<MoodEntry[]>('health-mood-entries', mockMoodEntries);
  const [dailyStats, setDailyStats] = useLocalStorage<DailyStats[]>('health-daily-stats', mockDailyStats);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('health-achievements', mockAchievements);

  // Update active tab when URL changes
  useEffect(() => {
    const newTab = getActiveTabFromPath(location.pathname);
    setActiveTab(newTab);
  }, [location.pathname]);

  // Update user data when auth user changes
  useEffect(() => {
    if (authUser) {
      setUser(prev => ({
        ...prev,
        name: authUser.fullName,
        email: authUser.email
      }));
    }
  }, [authUser, setUser]);

  // Load data from Supabase on initial load
  useEffect(() => {
    const loadUserData = async () => {
      if (!authUser) {
        setIsDataLoading(false);
        return;
      }
      
      setIsDataLoading(true);
      
      try {
        // Simulate loading sequence with different messages
        setLoadingMessage('Connecting to your health data...');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setLoadingMessage('Retrieving your nutrition information...');
        await new Promise(resolve => setTimeout(resolve, 700));
        // Load food entries
        const foodResult = await SupabaseHealthService.getFoodEntries();
        if (foodResult.success && foodResult.data.length > 0) {
          const entries = foodResult.data.map(item => item.data_value);
          setFoodEntries(entries);
        }
        
        setLoadingMessage('Syncing your fitness activities...');
        await new Promise(resolve => setTimeout(resolve, 600));
        // Load exercise entries
        const exerciseResult = await SupabaseHealthService.getExerciseEntries();
        if (exerciseResult.success && exerciseResult.data.length > 0) {
          const entries = exerciseResult.data.map(item => item.data_value);
          setExerciseEntries(entries);
        }
        
        setLoadingMessage('Processing your health metrics...');
        await new Promise(resolve => setTimeout(resolve, 500));
        // Load water entries
        const waterResult = await SupabaseHealthService.getWaterEntries();
        if (waterResult.success && waterResult.data.length > 0) {
          const entries = waterResult.data.map(item => item.data_value);
          setWaterEntries(entries);
        }
        
        // Load sleep entries
        const sleepResult = await SupabaseHealthService.getSleepEntries();
        if (sleepResult.success && sleepResult.data.length > 0) {
          const entries = sleepResult.data.map(item => item.data_value);
          setSleepEntries(entries);
        }
        
        // Load mood entries
        const moodResult = await SupabaseHealthService.getMoodEntries();
        if (moodResult.success && moodResult.data.length > 0) {
          const entries = moodResult.data.map(item => item.data_value);
          setMoodEntries(entries);
        }
        
        setLoadingMessage('Generating personalized insights...');
        await new Promise(resolve => setTimeout(resolve, 800));
        
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    loadUserData();
  }, [authUser, setFoodEntries, setExerciseEntries, setWaterEntries, setSleepEntries, setMoodEntries]);

  // Calculate today's stats
  const today = new Date().toDateString();
  const todayFoodEntries = foodEntries.filter(entry => 
    new Date(entry.timestamp).toDateString() === today
  );
  const todayWaterEntries = waterEntries.filter(entry => 
    new Date(entry.timestamp).toDateString() === today
  );
  const todayExerciseEntries = exerciseEntries.filter(entry => 
    new Date(entry.timestamp).toDateString() === today
  );
  const todaySleepEntries = sleepEntries.filter(entry => 
    new Date(entry.date).toDateString() === today
  );
  const todayMoodEntries = moodEntries.filter(entry => 
    new Date(entry.timestamp).toDateString() === today
  );

  const todayStats: DailyStats = {
    date: today,
    calories: todayFoodEntries.reduce((sum, entry) => sum + (entry.calories * entry.quantity), 0),
    protein: todayFoodEntries.reduce((sum, entry) => sum + (entry.protein * entry.quantity), 0),
    carbs: todayFoodEntries.reduce((sum, entry) => sum + (entry.carbs * entry.quantity), 0),
    fat: todayFoodEntries.reduce((sum, entry) => sum + (entry.fat * entry.quantity), 0),
    water: Math.round(todayWaterEntries.reduce((sum, entry) => sum + entry.amount, 0) / 250),
    exercise: todayExerciseEntries.reduce((sum, entry) => sum + entry.duration, 0),
    steps: 8500, // Mock data - will be replaced with real API
    weight: user.weight,
    sleep: todaySleepEntries.length > 0 ? todaySleepEntries[0].duration : 0,
    mood: todayMoodEntries.length > 0 ? todayMoodEntries[0].rating : 5
  };

  const addFoodEntry = async (entry: Omit<FoodEntry, 'id'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(entry.timestamp)
    };
    
    // Save to local storage
    setFoodEntries(prev => [...prev, newEntry]);
    
    // Save to Supabase
    try {
      await SupabaseHealthService.saveFoodEntry(newEntry);
    } catch (error) {
      console.error('Error saving food entry:', error);
    }
    
    // Award points for logging food
    setUser(prev => ({ ...prev, points: prev.points + 10 }));
  };

  const addWaterEntry = async (entry: Omit<WaterEntry, 'id'>) => {
    const newEntry: WaterEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(entry.timestamp)
    };
    
    // Save to local storage
    setWaterEntries(prev => [...prev, newEntry]);
    
    // Save to Supabase
    try {
      await SupabaseHealthService.saveWaterEntry(newEntry);
    } catch (error) {
      console.error('Error saving water entry:', error);
    }
    
    // Award points for hydration
    setUser(prev => ({ ...prev, points: prev.points + 5 }));
  };

  const addExerciseEntry = async (entry: Omit<ExerciseEntry, 'id'>) => {
    const newEntry: ExerciseEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(entry.timestamp)
    };
    
    // Save to local storage
    setExerciseEntries(prev => [...prev, newEntry]);
    
    // Save to Supabase
    try {
      await SupabaseHealthService.saveExerciseEntry(newEntry);
    } catch (error) {
      console.error('Error saving exercise entry:', error);
    }
    
    // Award points for exercise
    setUser(prev => ({ ...prev, points: prev.points + Math.round(entry.duration / 2) }));
  };

  const addGPSWorkout = async (workout: Omit<GPSWorkout, 'id'>) => {
    const newWorkout: GPSWorkout = {
      ...workout,
      id: Date.now().toString()
    };
    
    // Save to local storage
    setGpsWorkouts(prev => [...prev, newWorkout]);
    
    // Save to Supabase
    try {
      await SupabaseHealthService.saveHealthData('gps_workout', newWorkout);
    } catch (error) {
      console.error('Error saving GPS workout:', error);
    }
    
    // Award points for GPS workout
    setUser(prev => ({ ...prev, points: prev.points + Math.round(workout.duration / 2) + 50 }));
  };

  const addSleepEntry = async (entry: Omit<SleepEntry, 'id'>) => {
    const newEntry: SleepEntry = {
      ...entry,
      id: Date.now().toString()
    };
    
    // Save to local storage
    setSleepEntries(prev => [...prev, newEntry]);
    
    // Save to Supabase
    try {
      await SupabaseHealthService.saveSleepEntry(newEntry);
    } catch (error) {
      console.error('Error saving sleep entry:', error);
    }
    
    // Award points for sleep tracking
    setUser(prev => ({ ...prev, points: prev.points + 15 }));
  };

  const addMoodEntry = async (entry: Omit<MoodEntry, 'id'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString()
    };
    
    // Save to local storage
    setMoodEntries(prev => [...prev, newEntry]);
    
    // Save to Supabase
    try {
      await SupabaseHealthService.saveMoodEntry(newEntry);
    } catch (error) {
      console.error('Error saving mood entry:', error);
    }
    
    // Award points for mood tracking
    setUser(prev => ({ ...prev, points: prev.points + 5 }));
  };

  const updateUser = (updates: Partial<UserType>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const handleTabChange = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    navigate(`/${tabId}`);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'food', label: 'Food', icon: Utensils },
    { id: 'water', label: 'Water', icon: Droplets },
    { id: 'exercise', label: 'Exercise', icon: Dumbbell },
    { id: 'gps-workout', label: 'GPS Workout', icon: MapPin },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'mood', label: 'Mood', icon: Heart },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'nutrition-planner', label: 'Meal Planner', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'insights', label: 'AI Insights', icon: Lightbulb },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'ai-coach', label: 'AI Coach', icon: Bot },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'provider-portal', label: 'Provider Tools', icon: Stethoscope },
    { id: 'medical-records', label: 'Medical Records', icon: FileText },
    { id: 'medical', label: 'Medical', icon: Stethoscope },
    { id: 'integrations', label: 'Integrations', icon: Wifi },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard user={user} todayStats={todayStats} />;
        case 'food':
          return <FoodLog entries={foodEntries} onAddEntry={addFoodEntry} />;
        case 'water':
          return <WaterTracker entries={waterEntries} onAddEntry={addWaterEntry} goal={user.goals.water} />;
        case 'exercise':
          return <ExerciseLog entries={exerciseEntries} onAddEntry={addExerciseEntry} goal={user.goals.exercise} />;
        case 'gps-workout':
          return <GPSWorkoutTracker onWorkoutComplete={addGPSWorkout} />;
        case 'sleep':
          return <SleepTracker entries={sleepEntries} onAddEntry={addSleepEntry} goal={8} />;
        case 'mood':
          return <MoodTracker entries={moodEntries} onAddEntry={addMoodEntry} />;
        case 'medications':
          return <MedicationReminders />;
        case 'nutrition-planner':
          return <NutritionPlanner user={user} />;
        case 'progress':
          return <Progress stats={[todayStats, ...dailyStats]} achievements={achievements} userGoals={user.goals} />;
        case 'analytics':
          return <AdvancedAnalytics stats={[todayStats, ...dailyStats]} user={user} />;
        case 'insights':
          return <HealthInsights />;
        case 'achievements':
          return <Achievements />;
        case 'ai-coach':
          return <AIHealthCoach user={user} todayStats={todayStats} />;
        case 'family':
          return <FamilyDashboard />;
        case 'social':
          return <SocialCommunity user={user} />;
        case 'provider-portal':
          return <ProviderPortal />;
        case 'medical-records':
          return <MedicalRecords />;
        case 'medical':
          return <MedicalProfessionalTools user={user} stats={[todayStats, ...dailyStats]} />;
        case 'integrations':
          return <Integrations />;
        case 'settings':
          return <Settings user={user} onUpdateUser={updateUser} />;
        case 'profile':
          return <Profile user={user} onUpdateUser={updateUser} />;
        default:
          return <Dashboard user={user} todayStats={todayStats} />;
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Please try refreshing the page or selecting a different tab.
            </p>
            <button
              onClick={() => handleTabChange('dashboard')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }
  };

  // Show loading state while data is being loaded
  if (isDataLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CH</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Complete Health</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out flex flex-col`}>
          
          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center space-x-3 p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">CH</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Complete Health</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI-Powered Wellness</p>
            </div>
          </div>

          {/* Navigation - Scrollable with custom scrollbar */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as ActiveTab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info & Logout - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="text-white" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Level {user.level} • {user.points} points
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors duration-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="p-4 lg:p-6 max-w-7xl mx-auto">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Quick Action Button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-30 hover:scale-105"
        onClick={() => handleTabChange('food')}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}

export default MainApp;