import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Download, Eye, Save, Undo, Redo, Trash2 } from "lucide-react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ComponentLibrary } from '@/components/builder/ComponentLibrary';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { DatabaseBindingPanel } from '@/components/builder/DatabaseBindingPanel';
import { DeploymentPanel } from '@/components/builder/DeploymentPanel';
import { useBuilderStore } from '@/stores/builderStore';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Builder() {
  const { components, clearCanvas, currentProjectId } = useBuilderStore();
  const { manualSave } = useAutoSave('current-project'); // TODO: Get actual project ID
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    const success = await manualSave();
    if (success) {
      toast({
        title: "Saved",
        description: "Your design has been saved successfully.",
      });
    }
  };

  const handlePreview = () => {
    // Navigate to preview page
    navigate('/preview');
  };

  const handleExport = () => {
    // Generate project export
    const projectData = {
      components,
      metadata: {
        exportedAt: new Date().toISOString(),
        componentCount: components.length,
        projectId: currentProjectId
      }
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported",
      description: "Project exported successfully as JSON.",
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
          <div className="border-l border-border flex">
            <div className="flex-1">
              <PropertiesPanel />
            </div>
            <div className="border-l border-border w-80 flex flex-col">
              <div className="flex-1">
                <DatabaseBindingPanel />
              </div>
              <div className="border-t border-border">
                <DeploymentPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}