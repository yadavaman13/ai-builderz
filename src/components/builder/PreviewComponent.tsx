import React, { memo } from 'react';
import { BuilderComponent } from '@/stores/builderStore';
import { EnhancedComponentRenderer } from './EnhancedComponentRenderer';

interface PreviewComponentProps {
  component: BuilderComponent;
}

export const PreviewComponent: React.FC<PreviewComponentProps> = memo(({ component }) => {
  return (
    <div
      className="absolute"
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
      }}
    >
      <EnhancedComponentRenderer 
        component={component} 
        isEditing={true} // Enable interactions for preview
      />
    </div>
  );
});

PreviewComponent.displayName = 'PreviewComponent';