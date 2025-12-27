import { useState, useRef, useEffect, ReactNode } from 'react';
import React from 'react';

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

  // Initialize widths evenly when panels change or container is mounted
  useEffect(() => {
    const initializeWidths = () => {
      if (panels.length > 0 && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth > 0) {
          // Account for resize handles (1px each, panels.length - 1 handles)
          const resizeHandleWidth = 1;
          const totalResizeHandleWidth = (panels.length - 1) * resizeHandleWidth;
          const availableWidth = containerWidth - totalResizeHandleWidth;
          const equalWidth = availableWidth / panels.length;
          setWidths(new Array(panels.length).fill(equalWidth));
        }
      }
    };

    // Initialize immediately
    initializeWidths();

    // Add a small delay to ensure container is rendered
    const timeoutId = setTimeout(initializeWidths, 100);

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && widths.length === panels.length) {
        const containerWidth = containerRef.current.offsetWidth;
        const resizeHandleWidth = 1;
        const totalResizeHandleWidth = (panels.length - 1) * resizeHandleWidth;
        const availableWidth = containerWidth - totalResizeHandleWidth;
        const totalCurrentWidth = widths.reduce((a, b) => a + b, 0);
        if (totalCurrentWidth > 0) {
          // Scale proportionally
          const scale = availableWidth / totalCurrentWidth;
          setWidths(widths.map(w => w * scale));
        } else {
          // Reinitialize
          const equalWidth = availableWidth / panels.length;
          setWidths(new Array(panels.length).fill(equalWidth));
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
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
      const minWidth = 200; // Minimum panel width when resizing

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
      className="flex h-full w-full bg-gray-50"
      style={{ 
        cursor: isDragging !== null ? 'col-resize' : 'default',
        userSelect: isDragging !== null ? 'none' : 'auto',
        overflow: 'hidden'
      }}
    >
      {panels.map((panel, index) => (
        <React.Fragment key={panel.id}>
          {/* Panel Content */}
          <div
            className="h-full overflow-y-auto overflow-x-auto bg-white border-r border-gray-200"
            style={{
              width: widths[index] ? `${widths[index]}px` : `${100 / panels.length}%`,
              flexShrink: 0,
              flexGrow: 0,
            }}
          >
            {/* Panel Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{panel.title}</h3>
              {onClose && (
                <button
                  onClick={() => onClose(panel.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0"
                  title="Close panel"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Panel Body */}
            <div className="p-4 overflow-x-auto" style={{ backgroundColor: '#f5f5f5' }}>
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
        </React.Fragment>
      ))}
    </div>
  );
}
