import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationProvider, useNotification } from './context/NotificationContext';

// Create a client for React Query
const queryClient = new QueryClient();

function AppContent() {
  const [count, setCount] = useState(0);
  const { addNotification } = useNotification();

  const handleClick = () => {
    setCount((count) => count + 1);
    addNotification(`Count increased to ${count + 1}!`, 'success');
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Circl Admin Dashboard</h1>
      <div className="card">
        <button onClick={handleClick}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
