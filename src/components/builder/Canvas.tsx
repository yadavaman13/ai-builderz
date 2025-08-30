import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilderStore } from '@/stores/builderStore';
import { ComponentTemplate } from './ComponentLibrary';
import { CanvasComponent } from './CanvasComponent';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const { components, addComponent, selectComponent, selectedComponentId } = useBuilderStore();

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

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
    <div className="flex-1 flex flex-col bg-background">
      {/* Device Toggle Bar */}
      <div className="border-b border-border p-3 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant={deviceType === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceType('desktop')}
              className="h-8 px-3"
            >
              <Monitor className="h-4 w-4 mr-2" />
              Desktop
            </Button>
            <Button
              variant={deviceType === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceType('tablet')}
              className="h-8 px-3"
            >
              <Tablet className="h-4 w-4 mr-2" />
              Tablet
            </Button>
            <Button
              variant={deviceType === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceType('mobile')}
              className="h-8 px-3"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {deviceType === 'desktop' ? 'Responsive' : deviceSizes[deviceType].width}
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 relative bg-muted/20 overflow-auto">
        <div className="w-full h-full flex items-center justify-center p-4">
          <div
            ref={combinedRef}
            className={`relative bg-background shadow-elegant rounded-lg overflow-hidden transition-all duration-300 ${
              isOver ? 'ring-2 ring-primary/30' : ''
            }`}
            style={{
              width: deviceSizes[deviceType].width,
              height: deviceSizes[deviceType].height,
              minHeight: deviceType === 'desktop' ? 'calc(100vh - 200px)' : deviceSizes[deviceType].height,
              backgroundImage: `
                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
            onClick={handleCanvasClick}
          >
            {components.map((component) => (
              <CanvasComponent
                key={component.id}
                component={component}
                isSelected={component.id === selectedComponentId}
              />
            ))}
            
            {isOver && (
              <div className="absolute inset-0 pointer-events-none bg-primary/5 border-2 border-dashed border-primary rounded-lg animate-fade-in" />
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
                    💡 Tip: Use the device toggle to preview different screen sizes
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};