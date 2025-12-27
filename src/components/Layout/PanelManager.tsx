import { createContext, useContext, useState, ReactNode } from 'react';

interface Panel {
  id: string;
  path: string;
  title: string;
}

interface PanelContextType {
  panels: Panel[];
  mainPanel: Panel | null;
  addPanel: (panel: Panel) => void;
  removePanel: (id: string) => void;
  clearPanels: () => void;
  changeMainPanel: (panel: Panel | null) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function usePanels() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanels must be used within PanelProvider');
  }
  return context;
}

interface PanelProviderProps {
  children: ReactNode;
}

export function PanelProvider({ children }: PanelProviderProps) {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [mainPanel, setMainPanel] = useState<Panel | null>(null);

  const addPanel = (panel: Panel) => {
    setPanels(prev => {
      // Check if panel already exists, if so replace it
      const existing = prev.findIndex(p => p.path === panel.path);
      if (existing !== -1) {
        return prev; // Don't add duplicate
      }
      // Limit to 1 additional panel (side-by-side only)
      if (prev.length >= 1) {
        return [panel]; // Replace existing panel
      }
      return [...prev, panel];
    });
  };

  const removePanel = (id: string) => {
    setPanels(prev => prev.filter(p => p.id !== id));
  };

  const clearPanels = () => {
    setPanels([]);
  };

  const changeMainPanel = (panel: Panel | null) => {
    setMainPanel(panel);
  };

  return (
    <PanelContext.Provider value={{ panels, mainPanel, addPanel, removePanel, clearPanels, changeMainPanel }}>
      {children}
    </PanelContext.Provider>
  );
}

interface PanelManagerProps {
  children: ReactNode;
}

export default function PanelManager({ children }: PanelManagerProps) {
  const { panels, mainPanel, removePanel, changeMainPanel } = usePanels();
  const [showMainPanelMenu, setShowMainPanelMenu] = useState(false);

  const panelOptions = [
    { title: 'Forum', path: '/forum' },
    { title: 'Network', path: '/network' },
    { title: 'Circles', path: '/circles' },
    { title: 'Messages', path: '/messages' },
    { title: 'Growth Hub', path: '/growthhub' },
  ];

  // If no panels, show single content without controls
  if (panels.length === 0) {
    return <div className="h-full w-full overflow-auto">{children}</div>;
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Panel Controls */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            Split View Active
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => removePanel(panels[0].id)}
            className="p-2 rounded hover:bg-red-100 text-red-600"
            title="Close Split View"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Panel Grid - Always side by side */}
      <div className="flex-1 grid grid-cols-2 gap-2 p-2 overflow-hidden">
        {/* Main Content Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              {mainPanel ? mainPanel.title : 'Main'}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowMainPanelMenu(!showMainPanelMenu)}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Change View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {showMainPanelMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => {
                      changeMainPanel(null);
                      setShowMainPanelMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Current Page
                  </button>
                  {panelOptions.map((option) => (
                    <button
                      key={option.path}
                      onClick={() => {
                        changeMainPanel({
                          id: `main-${option.path}-${Date.now()}`,
                          title: option.title,
                          path: option.path
                        });
                        setShowMainPanelMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {option.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {mainPanel ? (
              <iframe
                src={mainPanel.path}
                className="w-full h-full border-0"
                title={mainPanel.title}
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            ) : (
              <div className="w-full h-full overflow-auto">
                {children}
              </div>
            )}
          </div>
        </div>

        {/* Side Panel - Embedded iframe for isolation */}
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
          >
            <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{panel.title}</span>
              <button
                onClick={() => removePanel(panel.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={panel.path}
                className="w-full h-full border-0"
                title={panel.title}
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
