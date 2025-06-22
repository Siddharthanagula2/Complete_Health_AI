import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Bot, Send, Mic, MicOff, Lightbulb, TrendingUp, Heart, Target, Plus, Volume2, VolumeX, Settings } from 'lucide-react';
import { ChatMessage, AIInsight, User, DailyStats } from '../types';
import { elevenLabsService, VOICE_IDS } from '../services/elevenLabsService';
import { speechRecognitionService } from '../services/speechRecognitionService';

interface AIHealthCoachProps {
  user: User;
  todayStats: DailyStats;
}

export function AIHealthCoach({ user, todayStats }: AIHealthCoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: `Hello ${user.name}! I'm your AI Health Coach. I've analyzed your recent progress and I'm here to help you achieve your health goals. How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        'Analyze my nutrition trends',
        'Suggest today\'s workout',
        'Help me meal plan',
        'Review my progress'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_IDS.rachel);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'recommendation',
      title: 'Protein Intake Optimization',
      message: 'You\'re consistently hitting your protein goals! Consider timing your protein intake around workouts for better recovery.',
      priority: 'medium',
      category: 'nutrition',
      timestamp: new Date(),
      actionable: true,
      action: 'View protein timing guide'
    },
    {
      id: '2',
      type: 'prediction',
      title: 'Weight Goal Forecast',
      message: 'Based on your current progress, you\'re on track to reach your weight goal in approximately 8 weeks.',
      priority: 'high',
      category: 'health',
      timestamp: new Date(),
      actionable: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Hydration Alert',
      message: 'Your water intake has been below target for 3 consecutive days. This may affect your energy levels.',
      priority: 'medium',
      category: 'health',
      timestamp: new Date(),
      actionable: true,
      action: 'Set hydration reminders'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('nutrition') || lowerMessage.includes('food') || lowerMessage.includes('diet')) {
      return `Based on your recent nutrition data, you're doing well with protein intake (averaging ${Math.round(todayStats.protein)}g daily). I notice you could benefit from increasing your fiber intake. Try adding more vegetables to your meals, especially leafy greens and legumes.`;
    }
    
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise') || lowerMessage.includes('fitness')) {
      return `Great question! Looking at your exercise patterns, you've been consistent with ${todayStats.exercise} minutes today. For optimal results, I recommend alternating between cardio and strength training. Would you like me to suggest a specific workout for today?`;
    }
    
    if (lowerMessage.includes('weight') || lowerMessage.includes('progress')) {
      const weightDiff = user.weight - user.goals.weight;
      return `You're currently ${Math.abs(weightDiff).toFixed(1)}kg ${weightDiff > 0 ? 'above' : 'below'} your target weight. Your progress has been steady, and based on your current calorie deficit, you should reach your goal in about 6-8 weeks if you maintain this pace.`;
    }
    
    if (lowerMessage.includes('meal plan') || lowerMessage.includes('planning')) {
      return `I'd be happy to help with meal planning! Based on your goals of ${user.goals.calories} calories daily, I suggest focusing on lean proteins, complex carbs, and healthy fats. Would you like specific meal suggestions for tomorrow?`;
    }
    
    if (lowerMessage.includes('water') || lowerMessage.includes('hydration')) {
      return `Your hydration goal is ${user.goals.water} glasses daily. I notice you're at ${todayStats.water} glasses today. Try setting reminders every 2 hours, and remember that your needs increase with exercise and warm weather.`;
    }
    
    return `I understand you're asking about "${userMessage}". While I'm continuously learning, I can help you with nutrition analysis, workout planning, progress tracking, and health insights. What specific aspect of your health journey would you like to focus on?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response
    const responseText = generateAIResponse(inputMessage);
    
    // Simulate AI response delay
    setTimeout(async () => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: responseText,
        timestamp: new Date(),
        suggestions: [
          'Tell me more',
          'Show me data',
          'Create a plan',
          'Set reminders'
        ]
      };
      
      setMessages(prev => [...prev, aiResponse]);

      // Speak the AI response if voice is enabled
      if (voiceEnabled && !isSpeaking) {
        await speakMessage(responseText);
      }
    }, 1000);

    setInputMessage('');
  };

  const speakMessage = async (text: string) => {
    if (!voiceEnabled || isSpeaking) return;

    try {
      setIsSpeaking(true);
      await elevenLabsService.speakText(text, selectedVoice);
    } catch (error) {
      console.error('Error speaking message:', error);
      // Fallback to browser's speech synthesis if ElevenLabs fails
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!speechRecognitionService.isSupported()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      speechRecognitionService.stopListening();
      setIsListening(false);
      return;
    }

    try {
      setIsListening(true);
      setIsProcessingVoice(true);
      
      const transcript = await speechRecognitionService.startListening();
      setInputMessage(transcript);
      setIsProcessingVoice(false);
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsProcessingVoice(false);
    } finally {
      setIsListening(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleQuickAction = () => {
    // Quick action functionality - could open a menu or perform a common action
    console.log('Quick action clicked');
  };

  const stopSpeaking = () => {
    setIsSpeaking(false);
    // Stop ElevenLabs audio (if possible) or browser speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return <Target className="text-emerald-500" size={16} />;
      case 'fitness': return <TrendingUp className="text-blue-500" size={16} />;
      case 'health': return <Heart className="text-red-500" size={16} />;
      default: return <Lightbulb className="text-yellow-500" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="text-blue-500" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Health Coach</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={voiceEnabled ? 'primary' : 'ghost'}
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>
              {isSpeaking && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={stopSpeaking}
                  title="Stop speaking"
                >
                  Stop
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {voiceEnabled && (
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voice Selection
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value={VOICE_IDS.rachel}>Rachel (Calm & Soothing)</option>
                  <option value={VOICE_IDS.adam}>Adam (Professional & Clear)</option>
                  <option value={VOICE_IDS.bella}>Bella (Friendly & Encouraging)</option>
                  <option value={VOICE_IDS.antoni}>Antoni (Warm & Supportive)</option>
                </select>
              </div>
              <Button
                size="sm"
                onClick={() => speakMessage('Hello! This is how I sound. I\'m here to help you with your health journey.')}
                disabled={isSpeaking}
              >
                Test Voice
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lightbulb className="text-yellow-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Health Insights</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getCategoryIcon(insight.category)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{insight.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{insight.message}</p>
                      {insight.actionable && insight.action && (
                        <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto text-xs">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </span>
                    {voiceEnabled && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => speakMessage(insight.message)}
                        disabled={isSpeaking}
                        title="Listen to insight"
                      >
                        <Volume2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="text-blue-500" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Chat with AI Coach</h3>
            </div>
            {(isListening || isProcessingVoice) && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>{isProcessingVoice ? 'Processing...' : 'Listening...'}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border'
                }`}>
                  <div className="flex items-start justify-between">
                    <p className="text-sm flex-1">{message.message}</p>
                    {message.type === 'ai' && voiceEnabled && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => speakMessage(message.message)}
                        disabled={isSpeaking}
                        className="ml-2 p-1 h-auto"
                        title="Listen to message"
                      >
                        <Volume2 size={12} />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {message.type === 'ai' && message.suggestions && (
                    <div className="mt-3 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar with Proper Flexbox Layout */}
          <div className="flex items-center space-x-3">
            {/* Quick Action Button - Far Left */}
            <Button
              onClick={handleQuickAction}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 p-2 w-10 h-10"
              title="Quick actions"
            >
              <Plus size={20} />
            </Button>

            {/* Text Input - Center (takes available space) */}
            <div className="flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about your health, nutrition, or fitness..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isListening || isProcessingVoice}
              />
            </div>

            {/* Voice Input Button */}
            <Button
              onClick={handleVoiceInput}
              variant={isListening ? 'danger' : 'ghost'}
              size="sm"
              className="flex-shrink-0 p-2 w-10 h-10"
              title={isListening ? 'Stop listening' : 'Voice input'}
              disabled={isProcessingVoice || !speechRecognitionService.isSupported()}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>

            {/* Send Button - Far Right */}
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              className="flex-shrink-0 p-2 w-10 h-10"
              title="Send message"
              disabled={isListening || isProcessingVoice}
            >
              <Send size={20} />
            </Button>
          </div>

          {/* Voice Status */}
          {!speechRecognitionService.isSupported() && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Voice input not supported in this browser
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}