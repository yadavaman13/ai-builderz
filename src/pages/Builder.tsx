import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Download, Eye, Save, Undo, Redo, Trash2, History, AlertTriangle, CheckCircle } from "lucide-react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ComponentLibrary } from '@/components/builder/ComponentLibrary';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { DatabaseBindingPanel } from '@/components/builder/DatabaseBindingPanel';
import { DeploymentPanel } from '@/components/builder/DeploymentPanel';
import { OnboardingFlow } from '@/components/builder/OnboardingFlow';
import { VersionHistory } from '@/components/builder/VersionHistory';
import { SchemaVisualizer } from '@/components/builder/SchemaVisualizer';
import { useBuilderStore } from '@/stores/builderStore';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Builder() {
  const { components, clearCanvas, currentProjectId, validateLayout, canUndo, undo } = useBuilderStore();
  const { manualSave } = useAutoSave('current-project'); // TODO: Get actual project ID
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showSchemaVisualizer, setShowSchemaVisualizer] = useState(false);

  // Check if user is new (no components and no previous projects)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && components.length === 0) {
      setShowOnboarding(true);
    }
  }, [components.length]);

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
    // Validate layout before preview
    const { errors, warnings } = validateLayout();
    
    if (errors.length > 0) {
      toast({
        title: "Cannot Preview",
        description: `${errors.length} error(s) found. Please fix them first.`,
        variant: "destructive",
      });
      return;
    }
    
    if (warnings.length > 0) {
      toast({
        title: "Layout Warnings",
        description: `${warnings.length} warning(s) found. Preview may not be optimal.`,
      });
    }
    
    navigate('/preview');
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
      toast({
        title: "Undone",
        description: "Reverted to previous state.",
      });
    }
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo last action"
              >
                <Undo className="h-4 w-4 mr-2" />
                Undo
              </Button>
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className={showVersionHistory ? 'bg-accent' : ''}
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSchemaVisualizer(!showSchemaVisualizer)}
                className={showSchemaVisualizer ? 'bg-accent' : ''}
              >
                <Eye className="h-4 w-4 mr-2" />
                Schema
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

          {/* Right Panels */}
          <div className="border-l border-border flex">
            <div className="flex-1">
              <PropertiesPanel />
            </div>
            <div className="border-l border-border w-80 flex flex-col">
              {/* Version History Panel (collapsible) */}
              {showVersionHistory && (
                <div className="border-b border-border">
                  <VersionHistory />
                </div>
              )}
              
              {/* Schema Visualizer Panel (collapsible) */}
              {showSchemaVisualizer && (
                <div className="border-b border-border">
                  <SchemaVisualizer />
                </div>
              )}
              
              {/* Database Binding Panel */}
              <div className="flex-1">
                <DatabaseBindingPanel />
              </div>
              
              {/* Deployment Panel */}
              <div className="border-t border-border">
                <DeploymentPanel />
              </div>
            </div>
          </div>
        </div>
        
        {/* Onboarding Flow */}
        {showOnboarding && (
          <OnboardingFlow onComplete={handleCompleteOnboarding} />
        )}
      </div>
    </DndProvider>
  );
}