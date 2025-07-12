import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { LoadingScreen } from './components/LoadingScreen';

// Lazy load components to reduce initial bundle size
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const MainApp = React.lazy(() => import('./components/MainApp'));

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Temporary placeholder pages for missing auth pages */}
              <Route path="/login" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Login Page</h1><p>Login functionality coming soon</p></div></div>} />
              <Route path="/signup" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Signup Page</h1><p>Signup functionality coming soon</p></div></div>} />
              <Route path="/forgot-password" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Forgot Password</h1><p>Password recovery coming soon</p></div></div>} />
              <Route path="/reset-password" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Reset Password</h1><p>Password reset coming soon</p></div></div>} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/food" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/water" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/exercise" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/sleep" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/mood" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/nutrition-planner" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/gps-workout" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/progress" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/insights" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/ai-coach" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/social" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/medical" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/achievements" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/family" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/provider-portal" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/medical-records" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/integrations" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              
              {/* Catch all - redirect to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;