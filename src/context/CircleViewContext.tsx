import { createContext, useContext, useState, ReactNode } from 'react';

interface CircleViewContextType {
  isPanelMode: boolean;
  setIsPanelMode: (value: boolean) => void;
}

const CircleViewContext = createContext<CircleViewContextType | undefined>(undefined);

export function CircleViewProvider({ children }: { children: ReactNode }) {
  const [isPanelMode, setIsPanelMode] = useState(false);

  return (
    <CircleViewContext.Provider value={{ isPanelMode, setIsPanelMode }}>
      {children}
    </CircleViewContext.Provider>
  );
}

export function useCircleView() {
  const context = useContext(CircleViewContext);
  if (context === undefined) {
    throw new Error('useCircleView must be used within a CircleViewProvider');
  }
  return context;
}
