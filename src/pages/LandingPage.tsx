import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Menu, 
  X, 
  Camera, 
  Brain, 
  Trophy, 
  Shield, 
  Check, 
  ArrowRight,
  Smartphone,
  Activity,
  Moon,
  Target,
  Zap,
  Users,
  Award,
  Play,
  Instagram,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnnualPricing, setIsAnnualPricing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              <span className="text-xl lg:text-2xl font-bold text-gray-900">
                Complete Health Tracker
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                About Us
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link 
                to="/login"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/signup"
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-emerald-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-gray-700 hover:text-emerald-600 font-medium py-2"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left text-gray-700 hover:text-emerald-600 font-medium py-2"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left text-gray-700 hover:text-emerald-600 font-medium py-2"
              >
                About Us
              </button>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link 
                  to="/login"
                  className="block text-gray-700 hover:text-emerald-600 font-medium py-2"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup"
                  className="block bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
          <div className="absolute inset-0 bg-[var(--hero-pattern)] opacity-40"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                The Future of Your{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Health
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                Complete Health Tracker unifies your nutrition, fitness, sleep, and medical data, using powerful AI to deliver 
                predictive insights and personalized guidance for optimal health.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link 
                  to="/signup"
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Create Your Free Account</span>
                  <ArrowRight size={20} />
                </Link>
                <button className="flex items-center justify-center space-x-2 text-gray-700 hover:text-emerald-600 font-semibold transition-colors">
                  <Play size={20} />
                  <span>Watch Demo</span>
                </button>
              </div>

              <p className="text-sm text-gray-500">
                No credit card required. Core features are always free.
              </p>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="relative mx-auto w-80 h-96 lg:w-96 lg:h-[500px]">
                {/* Phone Frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl">
                  <div className="absolute inset-2 bg-black rounded-[2.5rem] overflow-hidden">
                    {/* Screen Content */}
                    <div className="h-full bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center mb-6 text-xs text-gray-600">
                        <span>9:41</span>
                        <div className="flex space-x-1">
                          <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                          <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                          <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                        </div>
                      </div>

                      {/* Dashboard Content */}
                      <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">Today's Health</h2>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <div className="flex items-center space-x-2 mb-2">
                              <Target className="text-emerald-500" size={16} />
                              <span className="text-xs font-medium text-gray-700">Calories</span>
                            </div>
                            <div className="text-lg font-bold text-emerald-600">1,847</div>
                            <div className="text-xs text-gray-500">of 2,000</div>
                          </div>
                          
                          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <div className="flex items-center space-x-2 mb-2">
                              <Activity className="text-blue-500" size={16} />
                              <span className="text-xs font-medium text-gray-700">Exercise</span>
                            </div>
                            <div className="text-lg font-bold text-blue-600">45</div>
                            <div className="text-xs text-gray-500">minutes</div>
                          </div>
                          
                          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <div className="flex items-center space-x-2 mb-2">
                              <Moon className="text-purple-500" size={16} />
                              <span className="text-xs font-medium text-gray-700">Sleep</span>
                            </div>
                            <div className="text-lg font-bold text-purple-600">8.2h</div>
                            <div className="text-xs text-gray-500">quality</div>
                          </div>
                          
                          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <div className="flex items-center space-x-2 mb-2">
                              <Zap className="text-orange-500" size={16} />
                              <span className="text-xs font-medium text-gray-700">Energy</span>
                            </div>
                            <div className="text-lg font-bold text-orange-600">92%</div>
                            <div className="text-xs text-gray-500">optimal</div>
                          </div>
                        </div>

                        {/* AI Insight */}
                        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30">
                          <div className="flex items-start space-x-3">
                            <Brain className="text-emerald-600 mt-1" size={16} />
                            <div>
                              <div className="text-xs font-semibold text-emerald-700 mb-1">AI Insight</div>
                              <div className="text-xs text-gray-700">Your protein intake is optimal for muscle recovery. Consider adding 200ml water before your workout.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Heart className="text-white" size={24} />
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Trophy className="text-white" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-8 font-medium">
            Works with all your favorite devices
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 opacity-60">
            {/* Device/Platform Logos */}
            <div className="flex items-center space-x-2">
              <Smartphone className="text-gray-400" size={24} />
              <span className="text-gray-600 font-medium">Apple Health</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="text-gray-400" size={24} />
              <span className="text-gray-600 font-medium">Google Fit</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="text-gray-400" size={24} />
              <span className="text-gray-600 font-medium">Fitbit</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="text-gray-400" size={24} />
              <span className="text-gray-600 font-medium">Garmin</span>
            </div>
            <div className="flex items-center space-x-2">
              <Moon className="text-gray-400" size={24} />
              <span className="text-gray-600 font-medium">Oura Ring</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="text-gray-400" size={24} />
              <span className="text-gray-600 font-medium">WHOOP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section 1 */}
      <section id="features" className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              The Complete Picture of Your Health
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track every aspect of your wellness with precision and ease
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Nutrition */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Camera className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nutrition Perfected</h3>
              <p className="text-gray-600 leading-relaxed">
                Log meals effortlessly with AI photo recognition, barcode scanning, or our database of over 5 million foods.
              </p>
            </div>

            {/* Fitness */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Activity className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Elite Fitness Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Track any workout with GPS, analyze your performance with heart rate zones and VO2 max estimates, and get form analysis.
              </p>
            </div>

            {/* Sleep */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Moon className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Optimized Sleep & Recovery</h3>
              <p className="text-gray-600 leading-relaxed">
                Go beyond basics with sleep stage analysis, readiness scores, and personalized guidance to improve recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Don't Just Track Data.{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Understand It.
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Our 24/7 AI Health Coach analyzes your patterns to provide predictive insights, early warnings, 
                and personalized recommendations for nutrition, exercise, and wellness.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Predictive Health Analytics</h4>
                    <p className="text-gray-300">Get early warnings for potential health issues before they become problems.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Nutritional Deficiency Alerts</h4>
                    <p className="text-gray-300">Receive personalized alerts when your nutrition patterns indicate potential deficiencies.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Injury Risk Assessment</h4>
                    <p className="text-gray-300">AI analyzes your training load and recovery to prevent overuse injuries.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Chat Visual */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Brain className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold">AI Health Coach</div>
                    <div className="text-sm text-gray-300">Online</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-sm">Based on your recent sleep patterns and workout intensity, I recommend reducing your training load by 20% this week to optimize recovery.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg p-3">
                    <p className="text-sm">Your protein intake has been consistently low. Consider adding a post-workout shake to meet your muscle recovery needs.</p>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-sm">Great job maintaining your hydration goals! Your energy levels should improve over the next few days.</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Ask me anything about your health..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm placeholder-gray-400"
                  />
                  <button className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg p-2">
                    <ArrowRight className="text-white" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Stay Motivated, Hit Your Goals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Achieve more with a system that rewards consistency and celebrates your progress
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Badges */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Award className="text-white" size={24} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Tiered Badges</h4>
              <p className="text-gray-600 text-sm">Earn achievements for milestones and consistency</p>
            </div>

            {/* Streaks */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Zap className="text-white" size={24} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Daily Streaks</h4>
              <p className="text-gray-600 text-sm">Build healthy habits for logging, workouts, and sleep</p>
            </div>

            {/* Community */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Users className="text-white" size={24} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Community Challenges</h4>
              <p className="text-gray-600 text-sm">Compete with friends or the community on leaderboards</p>
            </div>

            {/* Rewards */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Trophy className="text-white" size={24} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Points & Rewards</h4>
              <p className="text-gray-600 text-sm">Earn points for daily actions and unlock bonuses</p>
            </div>
          </div>

          {/* Visual Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 text-center border border-yellow-200">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-sm font-semibold text-gray-800">Week Warrior</div>
              <div className="text-xs text-gray-600">7-day streak</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-200">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm font-semibold text-gray-800">15 Day Streak</div>
              <div className="text-xs text-gray-600">Keep it up!</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200">
              <div className="text-2xl mb-2">💪</div>
              <div className="text-sm font-semibold text-gray-800">Fitness Pro</div>
              <div className="text-xs text-gray-600">50 workouts</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center border border-purple-200">
              <div className="text-2xl mb-2">🌟</div>
              <div className="text-sm font-semibold text-gray-800">1,250 Points</div>
              <div className="text-xs text-gray-600">Level 3</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Path to Optimal Health
            </h2>
            <p className="text-xl text-gray-600 mb-8">Start free, upgrade when you're ready</p>
            
            {/* Pricing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`font-medium ${!isAnnualPricing ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnualPricing(!isAnnualPricing)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnualPricing ? 'bg-emerald-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnualPricing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`font-medium ${isAnnualPricing ? 'text-gray-900' : 'text-gray-500'}`}>
                Annually
              </span>
              {isAnnualPricing && (
                <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-2 py-1 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                <p className="text-gray-600">Core Functionality (Always Free)</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Basic Food Logging</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Barcode Scanning</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Manual Water/Weight Logging</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Simple Exercise Logging</span>
                </li>
              </ul>
              
              <Link 
                to="/signup"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center block"
              >
                Sign Up for Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-emerald-500 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${isAnnualPricing ? '6.67' : '9.99'}
                  <span className="text-lg text-gray-600">/month</span>
                </div>
                {isAnnualPricing && (
                  <p className="text-sm text-gray-500">Billed annually at $79.99</p>
                )}
                <p className="text-gray-600 mt-2">AI-Powered Features</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Everything in Free</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">AI Food Photo Scanning</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">AI Meal Planning</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Predictive Health Analytics</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">AI Fitness Coaching</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Voice-to-Text Logging</span>
                </li>
              </ul>
              
              <Link 
                to="/signup"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 text-center block"
              >
                Start 7-Day Free Trial
              </Link>
            </div>

            {/* Premium+ Plan */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium+</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${isAnnualPricing ? '14.92' : '19.99'}
                  <span className="text-lg text-gray-600">/month</span>
                </div>
                {isAnnualPricing && (
                  <p className="text-sm text-gray-500">Billed annually at $179.99</p>
                )}
                <p className="text-gray-600 mt-2">Professional & Medical Integration</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Everything in Premium</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Healthcare Provider Dashboard</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Lab Result Integration</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Genetic Data Analysis</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Family Health Management</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Telehealth Consultations</span>
                </li>
              </ul>
              
              <Link 
                to="/signup"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center block"
              >
                Choose Premium+
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At Complete Health Tracker, we believe that everyone deserves access to intelligent, 
              personalized health insights. Our mission is to empower individuals on their wellness 
              journey by transforming complex health data into actionable guidance that fits seamlessly 
              into their daily lives.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Driven by Passion, Powered by Innovation
              </h3>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our passionate team of health enthusiasts, data scientists, and technology experts 
                work tirelessly to bridge the gap between cutting-edge health technology and 
                everyday wellness. We understand that true health transformation happens when 
                complex data becomes simple, actionable insights.
              </p>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                From our AI-powered nutrition analysis to predictive health analytics, every 
                feature is designed with one goal in mind: helping you make informed decisions 
                about your health with confidence and clarity.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Health-First Approach</h4>
                    <p className="text-gray-600">Every decision we make prioritizes your health outcomes and privacy above all else.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Science-Backed Innovation</h4>
                    <p className="text-gray-600">Our AI algorithms are built on peer-reviewed research and validated health science.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Community-Centered</h4>
                    <p className="text-gray-600">We believe in the power of community support and shared health journeys.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-100">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-white" size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h4>
                  <p className="text-gray-600">
                    A world where everyone has the tools and insights needed to live their healthiest life.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">10M+</div>
                    <div className="text-sm text-gray-600">Health Data Points</div>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-blue-600 mb-1">99.9%</div>
                    <div className="text-sm text-gray-600">Data Accuracy</div>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">AI Monitoring</div>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-orange-600 mb-1">HIPAA</div>
                    <div className="text-sm text-gray-600">Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl lg:text-2xl mb-8 opacity-90">
            Join thousands of users transforming their lives with the world's most intelligent health platform.
          </p>
          <Link 
            to="/signup"
            className="inline-flex items-center space-x-3 bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <span>Sign Up Free Today</span>
            <ArrowRight size={20} />
          </Link>
          <p className="text-sm opacity-75 mt-4">
            No credit card required • Start in under 60 seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Heart className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold">CHT</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering individuals to take control of their health through intelligent tracking and AI-powered insights.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Download App</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Expert Q&A</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Corporate Wellness</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © 2025 Complete Health Tracker. All rights reserved.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Founder: Siddhartha Nagula
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Medical Disclaimer</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}