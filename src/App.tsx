import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Forum from './pages/Forum';
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

// Temporary placeholder pages
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-8">
      <div className="bg-white rounded-xl shadow-lg p-12 max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">{title}</h1>
        <p className="text-gray-600 text-lg">This page is under construction.</p>
        <p className="text-gray-500 text-sm mt-4">Coming soon...</p>
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
              <SidebarProvider>
                <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* TEMPORARY: Forum is public for development */}
                <Route
                  path="/forum"
                  element={
                    <MainLayout>
                      <Forum />
                    </MainLayout>
                  }
                />
                
                {/* Protected Routes */}
                <Route
                  path="/network"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <PlaceholderPage title="Network" />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/circles"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <PlaceholderPage title="Circles" />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/more"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <PlaceholderPage title="More" />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <PlaceholderPage title="Profile" />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <PlaceholderPage title="Settings" />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                {/* Default Route */}
                <Route path="/" element={<Navigate to="/forum" replace />} />
                
                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/forum" replace />} />
              </Routes>
              </SidebarProvider>
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
