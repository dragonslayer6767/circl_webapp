import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

// Temporary placeholder for Forum page
function ForumPlaceholder() {
  const { user, logout } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">Welcome to Circl!</h1>
        <p className="text-lg mb-2">Hello, {user?.fullname || user?.email}!</p>
        <p className="text-gray-600 mb-6">You are now logged in.</p>
        <p className="text-sm text-gray-500 mb-6">Forum page coming soon...</p>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <NotificationProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route
                  path="/forum"
                  element={
                    <ProtectedRoute>
                      <ForumPlaceholder />
                    </ProtectedRoute>
                  }
                />
                
                {/* Default Route */}
                <Route path="/" element={<Navigate to="/forum" replace />} />
                
                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/forum" replace />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
