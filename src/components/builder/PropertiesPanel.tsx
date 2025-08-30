import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { useBuilderStore } from '@/stores/builderStore';

export const PropertiesPanel: React.FC = () => {
  const { 
    selectedComponentId, 
    updateComponent, 
    deleteComponent, 
    getSelectedComponent 
  } = useBuilderStore();

  const selectedComponent = getSelectedComponent();

  if (!selectedComponent) {
    return (
      <Card className="w-80 border-border">
        <CardHeader>
          <CardTitle className="text-lg">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>Select a component to edit its properties</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    updateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        [key]: value,
      },
    });
  };

  const handlePositionChange = (key: 'x' | 'y', value: number) => {
    updateComponent(selectedComponent.id, {
      [key]: value,
    });
  };

  const handleSizeChange = (key: 'width' | 'height', value: number) => {
    updateComponent(selectedComponent.id, {
      [key]: value,
    });
  };

  const handleDelete = () => {
    deleteComponent(selectedComponent.id);
  };

  return (
    <Card className="w-80 border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Properties</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground capitalize">
          {selectedComponent.type} Component
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {/* Position & Size */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Position & Size</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    value={selectedComponent.x}
                    onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    value={selectedComponent.y}
                    onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={selectedComponent.width}
                    onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={selectedComponent.height}
                    onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Text Properties */}
            {(selectedComponent.type === 'button' || 
              selectedComponent.type === 'text' || 
              selectedComponent.type === 'input') && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Text</h3>
                {selectedComponent.type !== 'input' ? (
                  <div>
                    <Label className="text-xs">Text</Label>
                    <Input
                      value={selectedComponent.props.text || ''}
                      onChange={(e) => handlePropertyChange('text', e.target.value)}
                      className="h-8"
                    />
                  </div>
                ) : (
                  <div>
                    <Label className="text-xs">Placeholder</Label>
                    <Input
                      value={selectedComponent.props.placeholder || ''}
                      onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                      className="h-8"
                    />
                  </div>
                )}
                <div>
                  <Label className="text-xs">Font Size</Label>
                  <Input
                    type="number"
                    value={selectedComponent.props.fontSize || 16}
                    onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value) || 16)}
                    className="h-8"
                  />
                </div>
              </div>
            )}

            {selectedComponent.type === 'image' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Image</h3>
                <div>
                  <Label className="text-xs">Source URL</Label>
                  <Input
                    value={selectedComponent.props.src || ''}
                    onChange={(e) => handlePropertyChange('src', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Alt Text</Label>
                  <Input
                    value={selectedComponent.props.alt || ''}
                    onChange={(e) => handlePropertyChange('alt', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            )}

            {selectedComponent.type === 'grid' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Grid</h3>
                <div>
                  <Label className="text-xs">Columns</Label>
                  <Input
                    type="number"
                    min="1"
                    max="6"
                    value={selectedComponent.props.columns || 2}
                    onChange={(e) => handlePropertyChange('columns', parseInt(e.target.value) || 2)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Gap</Label>
                  <Input
                    type="number"
                    value={selectedComponent.props.gap || 16}
                    onChange={(e) => handlePropertyChange('gap', parseInt(e.target.value) || 16)}
                    className="h-8"
                  />
                </div>
              </div>
            )}

            <Separator />

            {/* Style Properties */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Style</h3>
              <div>
                <Label className="text-xs">Text Color</Label>
                <Input
                  type="color"
                  value={selectedComponent.props.color || '#000000'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Background Color</Label>
                <Input
                  type="color"
                  value={selectedComponent.props.backgroundColor || '#ffffff'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Padding</Label>
                <Input
                  type="number"
                  value={selectedComponent.props.padding || 0}
                  onChange={(e) => handlePropertyChange('padding', parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Border Radius</Label>
                <Input
                  type="number"
                  value={selectedComponent.props.borderRadius || 0}
                  onChange={(e) => handlePropertyChange('borderRadius', parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Border Width</Label>
                <Input
                  type="number"
                  value={selectedComponent.props.borderWidth || 0}
                  onChange={(e) => handlePropertyChange('borderWidth', parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              {selectedComponent.props.borderWidth > 0 && (
                <div>
                  <Label className="text-xs">Border Color</Label>
                  <Input
                    type="color"
                    value={selectedComponent.props.borderColor || '#000000'}
                    onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
                    className="h-8"
                  />
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};