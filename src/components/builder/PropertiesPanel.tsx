import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useBuilderStore } from '@/stores/builderStore';
import { Trash2, Settings, Palette } from "lucide-react";
import { useState } from "react";

export const PropertiesPanel: React.FC = () => {
  const { getSelectedComponent, updateComponent, deleteComponent, selectedComponentId } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<'properties' | 'style'>('properties');
  
  const selectedComponent = getSelectedComponent();

  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col bg-sidebar border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Properties</h2>
          <p className="text-xs text-sidebar-foreground/70 mt-1">
            Select a component to edit properties
          </p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-sidebar-foreground/50">
            <Settings className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No component selected</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    updateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        [property]: value,
      },
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    updateComponent(selectedComponent.id, { [dimension]: value });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    updateComponent(selectedComponent.id, { [axis]: Math.max(0, value) });
  };

  const handleDelete = () => {
    if (selectedComponentId) {
      deleteComponent(selectedComponentId);
    }
  };

  return (
    <div className="h-full flex flex-col bg-sidebar border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Properties</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-sidebar-foreground/70 mb-3">
          {selectedComponent.type} component
        </div>
        
        {/* Tab Navigation */}
        <div className="flex rounded-lg bg-sidebar-accent/30 p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('properties')}
            className={`flex-1 h-8 text-xs ${
              activeTab === 'properties' 
                ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
            }`}
          >
            <Settings className="h-3 w-3 mr-1" />
            Properties
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('style')}
            className={`flex-1 h-8 text-xs ${
              activeTab === 'style' 
                ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
            }`}
          >
            <Palette className="h-3 w-3 mr-1" />
            Style
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {activeTab === 'properties' && (
            <>
              {/* Position & Size */}
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-sidebar-foreground">Position & Size</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="x" className="text-xs text-sidebar-foreground/70">X</Label>
                    <Input
                      id="x"
                      type="number"
                      value={selectedComponent.x}
                      onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                      className="h-8 text-xs bg-sidebar-accent/30 border-sidebar-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="y" className="text-xs text-sidebar-foreground/70">Y</Label>
                    <Input
                      id="y"
                      type="number"
                      value={selectedComponent.y}
                      onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                      className="h-8 text-xs bg-sidebar-accent/30 border-sidebar-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="width" className="text-xs text-sidebar-foreground/70">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      value={selectedComponent.width}
                      onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 1)}
                      className="h-8 text-xs bg-sidebar-accent/30 border-sidebar-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="height" className="text-xs text-sidebar-foreground/70">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      value={selectedComponent.height}
                      onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 1)}
                      className="h-8 text-xs bg-sidebar-accent/30 border-sidebar-border"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-sidebar-border" />

              {/* Component-specific Properties */}
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-sidebar-foreground">Content</Label>
                </div>
                
                {(selectedComponent.type === 'text' || selectedComponent.type === 'button' || selectedComponent.type === 'heading') && (
                  <div className="space-y-1">
                    <Label htmlFor="text" className="text-xs text-sidebar-foreground/70">Text</Label>
                    <Input
                      id="text"
                      value={selectedComponent.props.text || ''}
                      onChange={(e) => handlePropertyChange('text', e.target.value)}
                      placeholder="Enter text..."
                      className="h-8 text-xs bg-sidebar-accent/30 border-sidebar-border"
                    />
                  </div>
                )}

                {selectedComponent.type === 'input' && (
                  <div className="space-y-1">
                    <Label htmlFor="placeholder" className="text-xs text-sidebar-foreground/70">Placeholder</Label>
                    <Input
                      id="placeholder"
                      value={selectedComponent.props.placeholder || ''}
                      onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                      className="h-8 text-xs bg-sidebar-accent/30 border-sidebar-border"
                    />
                  </div>
                )}

                {selectedComponent.type === 'image' && (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="src" className="text-xs text-sidebar-foreground/70">Image URL</Label>
                      <Input
                        id="src"
                        value={selectedComponent.props.src || ''}
                        onChange={(e) => handlePropertyChange('src', e.target.value)}
                        placeholder="https://..."
                        className="h-8 text-xs bg-sidebar-accent/30 border-sidebar-border"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="alt" className="text-xs text-sidebar-foreground/70">Alt Text</Label>
                      <Input
                        id="alt"
                        value={selectedComponent.props.alt || ''}
                        onChange={(e) => handlePropertyChange('alt', e.target.value)}
                        className="h-8 text-xs bg-sidebar-accent/30 border-sidebar-border"
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {activeTab === 'style' && (
            <>
              {/* Colors */}
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-sidebar-foreground">Colors</Label>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="color" className="text-xs text-sidebar-foreground/70">Text Color</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border border-sidebar-border"
                        style={{ backgroundColor: selectedComponent.props.color || '#000000' }}
                      />
                      <Input
                        id="color"
                        type="text"
                        value={selectedComponent.props.color || ''}
                        onChange={(e) => handlePropertyChange('color', e.target.value)}
                        placeholder="#000000"
                        className="h-8 text-xs bg-sidebar-accent/30 border-sidebar-border"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="backgroundColor" className="text-xs text-sidebar-foreground/70">Background</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border border-sidebar-border"
                        style={{ backgroundColor: selectedComponent.props.backgroundColor || 'transparent' }}
                      />
                      <Input
                        id="backgroundColor"
                        type="text"
                        value={selectedComponent.props.backgroundColor || ''}
                        onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                        placeholder="transparent"
                        className="h-8 text-xs bg-sidebar-accent/30 border-sidebar-border"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-sidebar-border" />

              {/* Typography */}
              {(selectedComponent.type === 'text' || selectedComponent.type === 'button' || selectedComponent.type === 'heading') && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-sidebar-foreground">Typography</Label>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="fontSize" className="text-xs text-sidebar-foreground/70">
                        Font Size: {selectedComponent.props.fontSize || 16}px
                      </Label>
                      <Slider
                        value={[selectedComponent.props.fontSize || 16]}
                        onValueChange={(value) => handlePropertyChange('fontSize', value[0])}
                        max={72}
                        min={8}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="fontWeight" className="text-xs text-sidebar-foreground/70">Font Weight</Label>
                      <Input
                        id="fontWeight"
                        value={selectedComponent.props.fontWeight || 'normal'}
                        onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
                        placeholder="normal"
                        className="h-8 text-xs bg-sidebar-accent/30 border-sidebar-border"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Separator className="bg-sidebar-border" />

              {/* Spacing & Layout */}
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-sidebar-foreground">Spacing</Label>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="padding" className="text-xs text-sidebar-foreground/70">
                      Padding: {selectedComponent.props.padding || 0}px
                    </Label>
                    <Slider
                      value={[selectedComponent.props.padding || 0]}
                      onValueChange={(value) => handlePropertyChange('padding', value[0])}
                      max={50}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="margin" className="text-xs text-sidebar-foreground/70">
                      Margin: {selectedComponent.props.margin || 0}px
                    </Label>
                    <Slider
                      value={[selectedComponent.props.margin || 0]}
                      onValueChange={(value) => handlePropertyChange('margin', value[0])}
                      max={50}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="borderRadius" className="text-xs text-sidebar-foreground/70">
                      Border Radius: {selectedComponent.props.borderRadius || 0}px
                    </Label>
                    <Slider
                      value={[selectedComponent.props.borderRadius || 0]}
                      onValueChange={(value) => handlePropertyChange('borderRadius', value[0])}
                      max={50}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};