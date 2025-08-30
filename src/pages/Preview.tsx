import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, ExternalLink, Smartphone, Monitor, Tablet, Upload, Download, AlertTriangle, CheckCircle, Globe, Zap, ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useBuilderStore } from "@/stores/builderStore";
import { PreviewComponent } from "@/components/builder/PreviewComponent";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const devices = [
  { name: "Desktop", icon: Monitor, width: "100%" },
  { name: "Tablet", icon: Tablet, width: "768px" },
  { name: "Mobile", icon: Smartphone, width: "375px" }
];

export default function Preview() {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [deploymentPlatform, setDeploymentPlatform] = useState<'vercel' | 'netlify'>('vercel');
  const { components, currentProjectId } = useBuilderStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkProjectHealth = () => {
    const warnings = [];
    const unboundComponents = components.filter(comp => 
      comp.type === 'form' && !comp.props.databaseBinding
    );
    
    if (unboundComponents.length > 0) {
      warnings.push(`${unboundComponents.length} form(s) not connected to database`);
    }
    
    if (components.length === 0) {
      warnings.push('No components on canvas');
    }
    
    return warnings;
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const projectData = {
        components,
        metadata: {
          name: `Project ${currentProjectId || 'preview'}`,
          createdAt: new Date().toISOString(),
          componentCount: components.length
        }
      };

      const functionName = deploymentPlatform === 'vercel' ? 'deploy-to-vercel' : 'deploy-to-netlify';
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { projectData }
      });

      if (error) throw error;

      setDeploymentUrl(data.url);
      toast({
        title: "Deployed Successfully!",
        description: `Your app is live on ${deploymentPlatform}`,
      });
    } catch (error) {
      console.error('Deployment failed:', error);
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleExportJSON = () => {
    const projectData = {
      components,
      metadata: {
        exportedAt: new Date().toISOString(),
        componentCount: components.length
      }
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated App</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root">
    ${components.map(comp => `<div class="absolute" style="left: ${comp.x}px; top: ${comp.y}px; width: ${comp.width}px; height: ${comp.height}px;">${renderComponentHTML(comp)}</div>`).join('\n')}
  </div>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderComponentHTML = (comp: any) => {
    switch (comp.type) {
      case 'text':
        return `<p style="color: ${comp.props.color || '#000'}; font-size: ${comp.props.fontSize || 16}px;">${comp.props.text || 'Text'}</p>`;
      case 'button':
        return `<button style="background-color: ${comp.props.backgroundColor || '#3b82f6'}; color: white; padding: 8px 16px; border-radius: 4px; border: none;">${comp.props.text || 'Button'}</button>`;
      case 'image':
        return `<img src="${comp.props.src || '/placeholder.svg'}" alt="${comp.props.alt || 'Image'}" style="width: 100%; height: 100%; object-fit: cover;" />`;
      default:
        return `<div>${comp.type}</div>`;
    }
  };

  const warnings = checkProjectHealth();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/builder')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Builder
            </Button>
            <div className="border-l border-border pl-4">
              <h1 className="text-xl font-semibold">Preview</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {warnings.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
              </Badge>
            )}
            
            {/* Preview Mode Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <selectedDevice.icon className="h-4 w-4" />
                  {selectedDevice.name}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {devices.map((device) => (
                  <DropdownMenuItem 
                    key={device.name}
                    onClick={() => setSelectedDevice(device)}
                    className="flex items-center gap-2"
                  >
                    <device.icon className="h-4 w-4" />
                    {device.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Deployment Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Deploy
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={() => {
                    setDeploymentPlatform('vercel');
                    handleDeploy();
                  }}
                  disabled={isDeploying}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Deploy to Vercel
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setDeploymentPlatform('netlify');
                    handleDeploy();
                  }}
                  disabled={isDeploying}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Deploy to Netlify
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={handleExportJSON}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export JSON
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleExportHTML}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export HTML
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-muted/30 p-8 flex items-center justify-center">
        <div 
          className="bg-background border border-border rounded-lg shadow-elegant transition-all duration-300"
          style={{ 
            width: selectedDevice.width,
            height: selectedDevice.name === "Mobile" ? "667px" : "80vh",
            maxWidth: "100%"
          }}
        >
          {/* Live Preview Content */}
          <div className="h-full relative overflow-hidden">
            {components.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <Card className="w-80 border-border">
                  <CardContent className="p-12 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Live Preview</h3>
                      <p className="text-muted-foreground">
                        Your website will appear here as you build it. Start by adding components in the Builder.
                      </p>
                    </div>
                    <Button variant="outline">
                      Go to Builder
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="w-full h-full relative bg-white">
                {components.map((component) => (
                  <PreviewComponent
                    key={component.id}
                    component={component}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Footer */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Viewport: {selectedDevice.name}</span>
            <span>•</span>
            <span>{components.length} component{components.length !== 1 ? 's' : ''}</span>
            {deploymentUrl && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Live Site
                  </a>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {warnings.length > 0 && (
              <div className="flex items-center gap-1 text-amber-500">
                <AlertTriangle className="h-3 w-3" />
                <span>{warnings.join(', ')}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span>Auto-refresh:</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>On</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DndProvider>
  );
}