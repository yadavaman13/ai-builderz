import React, { useCallback, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilderStore } from '@/stores/builderStore';
import { ComponentTemplate } from './ComponentLibrary';
import { CanvasComponent } from './CanvasComponent';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { components, addComponent, selectComponent, selectedComponentId } = useBuilderStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: { template: ComponentTemplate }, monitor) => {
      if (!canvasRef.current) return;
      
      const clientOffset = monitor.getClientOffset();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      if (clientOffset && canvasRect) {
        const x = clientOffset.x - canvasRect.left;
        const y = clientOffset.y - canvasRect.top;
        
        addComponent({
          type: item.template.type,
          x: Math.max(0, x - item.template.defaultProps.width / 2),
          y: Math.max(0, y - item.template.defaultProps.height / 2),
          width: item.template.defaultProps.width,
          height: item.template.defaultProps.height,
          props: item.template.defaultProps.props,
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  }, [selectComponent]);

  // Combine refs
  const combinedRef = useCallback((node: HTMLDivElement) => {
    canvasRef.current = node;
    drop(node);
  }, [drop]);

  return (
    <div className="flex-1 relative bg-background">
      <div
        ref={combinedRef}
        className={`w-full h-full min-h-[600px] relative overflow-auto ${
          isOver ? 'bg-accent/10' : ''
        }`}
        onClick={handleCanvasClick}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      >
        {components.map((component) => (
          <CanvasComponent
            key={component.id}
            component={component}
            isSelected={component.id === selectedComponentId}
          />
        ))}
        
        {isOver && (
          <div className="absolute inset-0 pointer-events-none drop-zone-active rounded-lg animate-fade-in" />
        )}
        
        {components.length === 0 && !isOver && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground animate-fade-in">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-2 border-dashed border-white rounded" />
              </div>
              <div>
                <p className="text-lg font-medium mb-2">Drop components here</p>
                <p className="text-sm">Drag components from the sidebar to start building</p>
              </div>
              <div className="text-xs text-muted-foreground">
                💡 Tip: Select components to customize properties
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};