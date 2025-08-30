import React, { useCallback, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { BuilderComponent, useBuilderStore } from '@/stores/builderStore';
import { useDatabaseStore } from '@/stores/databaseStore';
import { ComponentActionExecutor } from './ComponentActionExecutor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface CanvasComponentProps {
  component: BuilderComponent;
  isSelected: boolean;
}

const ComponentRenderer: React.FC<{ component: BuilderComponent }> = ({ component }) => {
  const { type, props } = component;

  const baseStyle: React.CSSProperties = {
    backgroundColor: props.backgroundColor,
    color: props.color,
    fontSize: props.fontSize,
    padding: props.padding,
    margin: props.margin,
    borderRadius: props.borderRadius,
    borderWidth: props.borderWidth,
    borderColor: props.borderColor,
    borderStyle: props.borderWidth ? 'solid' : 'none',
  };

  switch (type) {
    case 'button':
      return (
        <Button
          style={baseStyle}
          className="pointer-events-none"
        >
          {props.text || 'Button'}
        </Button>
      );

    case 'text':
      return (
        <div style={baseStyle} className="pointer-events-none">
          {props.text || 'Sample Text'}
        </div>
      );

    case 'input':
      return (
        <Input
          placeholder={props.placeholder || 'Enter text...'}
          style={baseStyle}
          className="pointer-events-none"
        />
      );

    case 'form':
      return (
        <div
          style={{
            ...baseStyle,
            border: `${props.borderWidth || 1}px solid ${props.borderColor || '#e5e7eb'}`,
          }}
          className="pointer-events-none flex flex-col gap-4"
        >
          <div className="text-sm font-medium">Form</div>
          <div className="space-y-2">
            <Input placeholder="Name" className="pointer-events-none" />
            <Input placeholder="Email" className="pointer-events-none" />
            <Button className="pointer-events-none">Submit</Button>
          </div>
        </div>
      );

    case 'card':
      return (
        <Card
          style={{
            ...baseStyle,
            border: `${props.borderWidth || 1}px solid ${props.borderColor || '#e5e7eb'}`,
          }}
          className="pointer-events-none"
        >
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-2">Card Title</div>
            <div className="text-xs text-muted-foreground">Card content goes here</div>
          </CardContent>
        </Card>
      );

    case 'navbar':
      return (
        <div
          style={baseStyle}
          className="pointer-events-none flex items-center justify-between"
        >
          <div className="font-medium">Brand</div>
          <div className="flex gap-4">
            <span>Home</span>
            <span>About</span>
            <span>Contact</span>
          </div>
        </div>
      );

    case 'table':
      return (
        <div
          style={{
            ...baseStyle,
            border: `${props.borderWidth || 1}px solid ${props.borderColor || '#e5e7eb'}`,
          }}
          className="pointer-events-none"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">John Doe</td>
                <td className="p-2">john@example.com</td>
                <td className="p-2">Admin</td>
              </tr>
              <tr>
                <td className="p-2">Jane Smith</td>
                <td className="p-2">jane@example.com</td>
                <td className="p-2">User</td>
              </tr>
            </tbody>
          </table>
        </div>
      );

    case 'image':
      return (
        <img
          src={props.src || 'https://via.placeholder.com/200x150'}
          alt={props.alt || 'Placeholder'}
          style={{
            ...baseStyle,
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
          className="pointer-events-none"
        />
      );

    case 'chart':
      return (
        <div
          style={{
            ...baseStyle,
            border: `${props.borderWidth || 1}px solid ${props.borderColor || '#e5e7eb'}`,
          }}
          className="pointer-events-none flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-lg font-medium mb-2">📊</div>
            <div className="text-sm text-muted-foreground">Chart Placeholder</div>
          </div>
        </div>
      );

    case 'grid':
      return (
        <div
          style={{
            ...baseStyle,
            border: `${props.borderWidth || 1}px solid ${props.borderColor || '#e5e7eb'}`,
            display: 'grid',
            gridTemplateColumns: `repeat(${props.columns || 2}, 1fr)`,
            gap: props.gap || 16,
          }}
          className="pointer-events-none"
        >
          {Array.from({ length: (props.columns || 2) * 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted/50 rounded p-4 flex items-center justify-center text-sm text-muted-foreground"
            >
              Grid Item {i + 1}
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div style={baseStyle} className="pointer-events-none">
          Unknown Component
        </div>
      );
  }
};

export const CanvasComponent: React.FC<CanvasComponentProps> = ({ component, isSelected }) => {
  const { selectComponent, moveComponent } = useBuilderStore();
  const { getBinding } = useDatabaseStore();
  const dragRef = useRef<HTMLDivElement>(null);

  const hasBinding = !!getBinding(component.id);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'canvas-component',
    item: { id: component.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id);
  }, [selectComponent, component.id]);

  // Handle drag end to update position
  const handleDragEnd = useCallback((e: any) => {
    if (!dragRef.current) return;
    const rect = dragRef.current.getBoundingClientRect();
    const parent = dragRef.current.parentElement?.getBoundingClientRect();
    if (parent) {
      moveComponent(component.id, rect.left - parent.left, rect.top - parent.top);
    }
  }, [moveComponent, component.id]);

  return (
    <div
      ref={(node) => {
        dragRef.current = node;
        drag(node);
      }}
      className={`absolute cursor-pointer ${isDragging ? 'opacity-50' : ''} ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      } ${hasBinding ? 'ring-1 ring-blue-400' : ''}`}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={handleClick}
      onDragEnd={handleDragEnd}
    >
      <ComponentActionExecutor 
        componentId={component.id}
        componentType={component.type}
      >
        <ComponentRenderer component={component} />
      </ComponentActionExecutor>
      
      {isSelected && (
        <>
          {/* Selection outline */}
          <div className="absolute inset-0 border-2 border-primary pointer-events-none" />
          
          {/* Resize handles */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary border border-background cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary border border-background cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary border border-background cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary border border-background cursor-se-resize" />
        </>
      )}
      
      {hasBinding && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
    </div>
  );
};