import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Download, Eye, Save, Undo, Redo, Trash2, History, AlertTriangle, CheckCircle } from "lucide-react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ComponentLibrary } from '@/components/builder/ComponentLibrary';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { OnboardingFlow } from '@/components/builder/OnboardingFlow';
import { VersionHistory } from '@/components/builder/VersionHistory';
import { SchemaVisualizer } from '@/components/builder/SchemaVisualizer';
import { ExportDialog } from '@/components/builder/ExportDialog';
import { useBuilderStore } from '@/stores/builderStore';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Builder() {
  const { 
    components, 
    clearCanvas, 
    currentProjectId, 
    validateLayout, 
    canUndo, 
    canRedo,
    isLoading,
    undo, 
    redo,
    setLoading,
    selectedComponentId,
    selectComponent,
    getSelectedComponent
  } = useBuilderStore();
  
  const selectedComponent = getSelectedComponent();
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
    setLoading(true);
    try {
      const success = await manualSave();
      if (success) {
        toast({
          title: "Saved",
          description: "Your design has been saved successfully.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    undo();
    toast({
      title: "Undo",
      description: "Action undone successfully.",
    });
  };

  const handleRedo = () => {
    redo();
    toast({
      title: "Redo",
      description: "Action redone successfully.",
    });
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = {
        components,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project-export.json';
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exported",
        description: "Your project has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your project.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    const { errors, warnings } = validateLayout();
    
    if (errors.length > 0) {
      toast({
        title: "Cannot Clear",
        description: `Please fix ${errors.length} error(s) first.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
      clearCanvas();
      toast({
        title: "Canvas Cleared",
        description: "All components have been removed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col">
        {/* Header Toolbar */}
        <div className="border-b border-border p-4 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold">Visual Builder</h1>
                <div className="text-sm text-muted-foreground">
                  {currentProjectId ? `Project: ${currentProjectId}` : 'Untitled Project'} • {components.length} component{components.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleSave}
                disabled={isLoading}
                className="hover-lift"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>

              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  disabled={!canUndo || isLoading}
                  className="hover-lift"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRedo}
                  disabled={!canRedo || isLoading}
                  className="hover-lift"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate('/preview')}
                disabled={isLoading}
                className="hover-lift"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <ExportDialog />

              <Button
                variant="outline"
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className={showVersionHistory ? 'bg-accent' : ''}
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>

              <Button
                variant="outline"  
                onClick={() => setShowSchemaVisualizer(!showSchemaVisualizer)}
                className={showSchemaVisualizer ? 'bg-accent' : ''}
              >
                <Palette className="h-4 w-4 mr-2" />
                Schema
              </Button>

              <Button
                variant="destructive"
                onClick={handleClear}
                disabled={components.length === 0 || isLoading}
                className="hover-lift"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Area - Maximum Width */}
          <div className="flex-1 flex flex-col min-w-0">
            <Canvas />
          </div>

          {/* Right Sidebar - Components & Properties */}
          <div className="w-80 border-l border-sidebar-border bg-sidebar flex flex-col">
            {selectedComponentId ? (
              <>
                {/* Selected Component Info */}
                <div className="p-3 bg-sidebar-accent/20 border-b border-sidebar-border">
                  <div className="text-xs text-sidebar-foreground/70 mb-1">Selected Component</div>
                  <div className="text-sm font-medium text-sidebar-foreground">
                    {selectedComponent?.type || 'Unknown'} Component
                  </div>
                </div>
                
                {/* Selected Component Properties */}
                <div className="flex-1 min-h-0 relative">
                  <PropertiesPanel />
                  {/* Active Tab Indicator */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-2 py-1 bg-primary/10 border border-primary/30 rounded-md">
                      <span className="text-xs font-medium text-primary">Properties</span>
                    </div>
                  </div>
                </div>
                
                {/* Back to Components Button */}
                <div className="border-t border-sidebar-border p-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => selectComponent(null)}
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    ← Back to Components
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Component Library - Main Focus */}
                <div className="flex-1 min-h-0 relative">
                  <ComponentLibrary />
                  {/* Active Tab Indicator */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-2 py-1 bg-primary/10 border border-primary/30 rounded-md">
                      <span className="text-xs font-medium text-primary">Components</span>
                    </div>
                  </div>
                </div>
                
                {/* Component Library Info */}
                <div className="border-t border-sidebar-border p-3 bg-sidebar-accent/10">
                  <div className="text-xs text-sidebar-foreground/70 mb-2">Available Components</div>
                  <div className="text-xs text-sidebar-foreground/60">
                    Drag components to the canvas to start building
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Floating Panels */}
        {showVersionHistory && (
          <div className="fixed top-20 right-4 w-80 h-[calc(100vh-6rem)] bg-card border border-border rounded-lg shadow-2xl z-50 animate-slide-in-right">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h3 className="font-medium">Version History</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowVersionHistory(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <VersionHistory />
            </div>
          </div>
        )}

        {showSchemaVisualizer && (
          <div className="fixed top-20 right-4 w-96 h-[calc(100vh-6rem)] bg-card border border-border rounded-lg shadow-2xl z-50 animate-slide-in-right">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h3 className="font-medium">Database Schema</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSchemaVisualizer(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <SchemaVisualizer />
            </div>
          </div>
        )}
        
        {/* Onboarding Flow */}
        {showOnboarding && (
          <OnboardingFlow onComplete={handleCompleteOnboarding} />
        )}
      </div>
    </DndProvider>
  );
}