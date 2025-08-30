import React, { useCallback, useRef, useState, memo } from 'react';
import { useDrag } from 'react-dnd';
import { BuilderComponent, useBuilderStore } from '@/stores/builderStore';
import { useDatabaseStore } from '@/stores/databaseStore';
import { ComponentActionExecutor } from './ComponentActionExecutor';
import { DeletionConfirmDialog } from './DeletionConfirmDialog';
import { InlineEditor } from './InlineEditor';
import { EnhancedComponentRenderer } from './EnhancedComponentRenderer';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Edit, GripVertical } from 'lucide-react';

interface CanvasComponentProps {
  component: BuilderComponent;
  isSelected: boolean;
}

export const CanvasComponent: React.FC<CanvasComponentProps> = memo(({ component, isSelected }) => {
  const { 
    selectComponent, 
    moveComponent, 
    resizeComponent, 
    deleteComponent, 
    updateComponent,
    duplicateComponent,
    snapToGrid 
  } = useBuilderStore();
  const { getBinding, removeBinding } = useDatabaseStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);

  const binding = getBinding(component.id);
  const hasBinding = !!binding;

  const [, drag] = useDrag(() => ({
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

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (component.type === 'text' || component.type === 'heading' || component.type === 'image') {
      setIsEditing(true);
    }
  }, [component.type]);

  const handleDelete = () => {
    if (hasBinding) {
      setShowDeleteDialog(true);
    } else {
      handleConfirmDelete();
    }
  };

  const handleConfirmDelete = () => {
    if (binding) {
      removeBinding(component.id);
    }
    deleteComponent(component.id);
  };

  const handleDuplicate = () => {
    duplicateComponent(component.id);
  };

  const handleInlineEdit = (property: string, value: string) => {
    updateComponent(component.id, {
      props: { ...component.props, [property]: value }
    });
    setIsEditing(false);
  };

  // Enhanced drag functionality with snap-to-grid
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    
    setIsDragging(true);
    const startX = e.clientX - component.x;
    const startY = e.clientY - component.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      const snapped = snapToGrid(newX, newY);
      moveComponent(component.id, snapped.x, snapped.y);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [component.id, component.x, component.y, moveComponent, snapToGrid]);

  // Enhanced resize functionality
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: component.width,
      startHeight: component.height,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;
      
      const deltaX = e.clientX - resizeStartRef.current.startX;
      const deltaY = e.clientY - resizeStartRef.current.startY;
      
      let newWidth = resizeStartRef.current.startWidth;
      let newHeight = resizeStartRef.current.startHeight;
      
      if (direction.includes('e')) newWidth += deltaX;
      if (direction.includes('w')) newWidth -= deltaX;
      if (direction.includes('s')) newHeight += deltaY;
      if (direction.includes('n')) newHeight -= deltaY;
      
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);
      
      resizeComponent(component.id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [component.id, component.width, component.height, resizeComponent]);

  return (
    <TooltipProvider>
      <div
        ref={(node) => {
          dragRef.current = node;
          drag(node);
        }}
        className={`
          absolute cursor-pointer transition-all duration-200 select-none
          ${isDragging ? 'z-50 scale-105 shadow-2xl' : ''}
          ${isSelected ? 'component-selected' : isHovered ? 'component-hover' : ''}
          ${hasBinding ? 'ring-1 ring-blue-400' : ''}
          ${isResizing ? 'select-none' : ''}
          animate-fade-in
        `}
        style={{
          left: component.x,
          top: component.y,
          width: component.width,
          height: component.height,
          zIndex: isSelected ? 20 : isDragging ? 50 : 1,
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ComponentActionExecutor 
          componentId={component.id}
          componentType={component.type}
        >
          <EnhancedComponentRenderer 
            component={component} 
            isEditing={!isEditing}
          />
        </ComponentActionExecutor>
        
        {/* Inline Editor */}
        {isEditing && (component.type === 'text' || component.type === 'heading') && (
          <InlineEditor
            componentId={component.id}
            type="text"
            value={component.props.text || ''}
            onSave={(value) => handleInlineEdit('text', value)}
            onCancel={() => setIsEditing(false)}
            multiline={component.type === 'text'}
          />
        )}
        
        {isEditing && component.type === 'image' && (
          <InlineEditor
            componentId={component.id}
            type="image"
            value={component.props.src || ''}
            onSave={(value) => handleInlineEdit('src', value)}
            onCancel={() => setIsEditing(false)}
          />
        )}
        
        {isSelected && !isEditing && (
          <div className="animate-fade-in">
            {/* Selection outline with enhanced visibility */}
            <div className="absolute inset-0 border-2 border-primary shadow-glow pointer-events-none rounded-sm" />
            
            {/* Enhanced resize handles */}
            <div 
              className="absolute -top-2 -left-2 w-3 h-3 bg-primary border-2 border-background cursor-nw-resize rounded-sm hover:scale-110 transition-transform shadow-elegant"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div 
              className="absolute -top-2 -right-2 w-3 h-3 bg-primary border-2 border-background cursor-ne-resize rounded-sm hover:scale-110 transition-transform shadow-elegant"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div 
              className="absolute -bottom-2 -left-2 w-3 h-3 bg-primary border-2 border-background cursor-sw-resize rounded-sm hover:scale-110 transition-transform shadow-elegant"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div 
              className="absolute -bottom-2 -right-2 w-3 h-3 bg-primary border-2 border-background cursor-se-resize rounded-sm hover:scale-110 transition-transform shadow-elegant"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
            
            {/* Drag handle */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 cursor-move">
              <GripVertical className="h-4 w-4 text-primary" />
            </div>
            
            {/* Action toolbar with enhanced buttons */}
            <div className="absolute -top-12 left-0 flex gap-1 animate-slide-in-right">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0 shadow-elegant hover-lift"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    disabled={!['text', 'heading', 'image'].includes(component.type)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit content</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0 shadow-elegant hover-lift"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate();
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate component</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 w-7 p-0 shadow-elegant hover-lift"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Delete component {hasBinding ? '(has database binding)' : ''}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
        
        {hasBinding && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-elegant animate-pulse-ring z-30">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p>Database connected</p>
                <p className="text-xs text-muted-foreground">
                  Action: {binding?.action || 'Unknown'}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
        
        <DeletionConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          componentType={component.type}
          componentId={component.id}
          hasBindings={hasBinding}
          bindingDetails={binding ? {
            tables: [binding.table || 'Unknown'],
            actions: [binding.action || 'Unknown']
          } : undefined}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </TooltipProvider>
  );
});

CanvasComponent.displayName = 'CanvasComponent';