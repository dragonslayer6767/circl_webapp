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
import Network from './pages/Network';
import Messages from './pages/Messages';
import ChatView from './pages/ChatView';
import GrowthHub from './pages/GrowthHub';
import Settings from './pages/Settings';
import BecomeMentor from './pages/settings/BecomeMentor';
import ChangePassword from './pages/settings/ChangePassword';
import BlockedUsers from './pages/settings/BlockedUsers';
import DeleteAccount from './pages/settings/DeleteAccount';
import SuggestFeature from './pages/settings/SuggestFeature';
import ReportProblem from './pages/settings/ReportProblem';
import TermsOfService from './pages/settings/TermsOfService';
import PrivacyPolicy from './pages/settings/PrivacyPolicy';
import Tutorial from './pages/settings/Tutorial';
import ContactSupport from './pages/settings/ContactSupport';
import Profile from './pages/Profile';
import BusinessProfile from './pages/BusinessProfile';
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
                
                {/* TEMPORARY: Forum, Network, and Messages are public for development */}
                <Route
                  path="/forum"
                  element={
                    <MainLayout>
                      <Forum />
                    </MainLayout>
                  }
                />
                
                <Route
                  path="/network"
                  element={
                    <MainLayout>
                      <Network />
                    </MainLayout>
                  }
                />

                <Route
                  path="/messages"
                  element={
                    <MainLayout>
                      <Messages />
                    </MainLayout>
                  }
                />

                <Route
                  path="/growth"
                  element={
                    <MainLayout>
                      <GrowthHub />
                    </MainLayout>
                  }
                />

                <Route
                  path="/chat/:userId"
                  element={<ChatView />}
                />

                {/* TEMPORARY: Settings and sub-routes are public for development */}
                <Route
                  path="/settings"
                  element={
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  }
                />

                <Route
                  path="/settings/become-mentor"
                  element={
                    <MainLayout>
                      <BecomeMentor />
                    </MainLayout>
                  }
                />

                <Route
                  path="/settings/change-password"
                  element={
                    <MainLayout>
                      <ChangePassword />
                    </MainLayout>
                  }
                />

                <Route
                  path="/settings/blocked-users"
                  element={
                    <MainLayout>
                      <BlockedUsers />
                    </MainLayout>
                  }
                />

                <Route
                  path="/settings/delete-account"
                  element={
                    <MainLayout>
                      <DeleteAccount />
                    </MainLayout>
                  }
                />

                <Route
                  path="/settings/suggest-feature"
                  element={
                    <MainLayout>
                      <SuggestFeature />
                    </MainLayout>
                  }
                />

                <Route
                  path="/settings/report-problem"
                  element={
                    <MainLayout>
                      <ReportProblem />
                    </MainLayout>
                  }
                />

                <Route
                  path="/settings/terms"
                  element={
                    <MainLayout>
                      <TermsOfService />
                    </MainLayout>
                  }
                />

                <Route
                  path="/settings/privacy"
                  element={
                    <MainLayout>
                      <PrivacyPolicy />
                    </MainLayout>
                  }
                />

                <Route
                  path="/settings/tutorial"
                  element={
                    <MainLayout>
                      <Tutorial />
                    </MainLayout>
                  }
                />

                <Route
                  path="/settings/contact-support"
                  element={
                    <MainLayout>
                      <ContactSupport />
                    </MainLayout>
                  }
                />
                
                {/* Protected Routes */}
                
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
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  }
                />

                <Route
                  path="/profile/business"
                  element={
                    <MainLayout>
                      <BusinessProfile />
                    </MainLayout>
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
