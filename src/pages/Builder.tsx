import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Download, Eye, Save, Undo, Redo, Trash2 } from "lucide-react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ComponentLibrary } from '@/components/builder/ComponentLibrary';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { useBuilderStore } from '@/stores/builderStore';
import { useToast } from "@/hooks/use-toast";

export default function Builder() {
  const { components, clearCanvas } = useBuilderStore();
  const { toast } = useToast();

  const handleSave = async () => {
    // TODO: Implement save to Supabase
    toast({
      title: "Saved",
      description: "Your design has been saved successfully.",
    });
  };

  const handlePreview = () => {
    // TODO: Navigate to preview with current state
    toast({
      title: "Preview",
      description: "Opening preview in a new tab...",
    });
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast({
      title: "Export",
      description: "Exporting your design...",
    });
  };

  const handleClear = () => {
    clearCanvas();
    toast({
      title: "Canvas Cleared",
      description: "All components have been removed from the canvas.",
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col">
        {/* Header Toolbar */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">Visual Builder</h1>
              <div className="text-sm text-muted-foreground">
                {components.length} component{components.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Component Library Sidebar */}
          <div className="border-r border-border">
            <ComponentLibrary />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            <Canvas />
          </div>

          {/* Properties Panel */}
          <div className="border-l border-border">
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}