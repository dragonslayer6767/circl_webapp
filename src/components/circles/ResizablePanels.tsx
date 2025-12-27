import { useState, useRef, useEffect, ReactNode } from 'react';

interface Panel {
  id: string;
  content: ReactNode;
  title: string;
  minWidth?: number;
}

interface ResizablePanelsProps {
  panels: Panel[];
  onClose?: (panelId: string) => void;
}

export default function ResizablePanels({ panels, onClose }: ResizablePanelsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widths, setWidths] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [startX, setStartX] = useState<number>(0);
  const [startWidths, setStartWidths] = useState<number[]>([]);

  // Initialize widths evenly when panels change
  useEffect(() => {
    if (panels.length > 0 && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const equalWidth = containerWidth / panels.length;
      setWidths(new Array(panels.length).fill(equalWidth));
    }
  }, [panels.length]);

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(index);
    setStartX(e.clientX);
    setStartWidths([...widths]);
  };

  useEffect(() => {
    if (isDragging === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isDragging === null) return;

      const deltaX = e.clientX - startX;
      const minWidth = 250;

      setWidths(() => {
        const newWidths = [...startWidths];
        
        // Calculate new widths for the two adjacent panels
        const leftNewWidth = startWidths[isDragging] + deltaX;
        const rightNewWidth = startWidths[isDragging + 1] - deltaX;
        
        // Apply constraints
        if (leftNewWidth >= minWidth && rightNewWidth >= minWidth) {
          newWidths[isDragging] = leftNewWidth;
          newWidths[isDragging + 1] = rightNewWidth;
        } else if (leftNewWidth < minWidth) {
          newWidths[isDragging] = minWidth;
          newWidths[isDragging + 1] = startWidths[isDragging] + startWidths[isDragging + 1] - minWidth;
        } else if (rightNewWidth < minWidth) {
          newWidths[isDragging] = startWidths[isDragging] + startWidths[isDragging + 1] - minWidth;
          newWidths[isDragging + 1] = minWidth;
        }
        
        return newWidths;
      });
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, startWidths]);

  if (panels.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="flex h-full w-full"
      style={{ 
        cursor: isDragging !== null ? 'col-resize' : 'default',
        userSelect: isDragging !== null ? 'none' : 'auto'
      }}
    >
      {panels.map((panel, index) => (
        <div key={panel.id} style={{ display: 'flex' }}>
          {/* Panel Content */}
          <div
            className="h-full overflow-auto bg-white flex-shrink-0"
            style={{
              width: widths[index] ? `${widths[index]}px` : 'auto',
            }}
          >
            {/* Panel Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
              <h3 className="font-semibold text-gray-900 text-sm">{panel.title}</h3>
              {onClose && (
                <button
                  onClick={() => onClose(panel.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Close panel"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Panel Body */}
            <div className="p-4" style={{ backgroundColor: '#f5f5f5' }}>
              {panel.content}
            </div>
          </div>

          {/* Resize Handle */}
          {index < panels.length - 1 && (
            <div
              className="w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize relative group transition-colors flex-shrink-0"
              onMouseDown={handleMouseDown(index)}
              style={{ userSelect: 'none' }}
            >
              {/* Visual indicator on hover */}
              <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-1 h-12 bg-blue-500 rounded-full" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
