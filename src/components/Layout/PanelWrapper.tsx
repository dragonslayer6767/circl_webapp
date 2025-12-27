import { ReactNode } from 'react';

interface PanelWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component that provides a view-only context for panel content
 * Panels display content for reference but don't support navigation
 */
export default function PanelWrapper({ children }: PanelWrapperProps) {
  return (
    <div 
      className="h-full w-full"
      style={{ pointerEvents: 'none' }}
    >
      <div style={{ pointerEvents: 'auto', cursor: 'default' }}>
        {children}
      </div>
    </div>
  );
}
