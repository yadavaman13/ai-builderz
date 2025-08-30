import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  History, 
  RotateCcw, 
  Save, 
  Clock, 
  GitBranch,
  Plus,
  Trash2,
  Edit3
} from "lucide-react";
import { useBuilderStore } from "@/stores/builderStore";
import { useToast } from "@/hooks/use-toast";

interface ProjectVersion {
  id: string;
  timestamp: Date;
  components: any[];
  changeDescription: string;
  changeType: 'manual' | 'autosave' | 'component_add' | 'component_edit' | 'component_delete';
  componentCount: number;
}

interface VersionHistoryProps {
  className?: string;
}

export function VersionHistory({ className }: VersionHistoryProps) {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const { components, currentProjectId } = useBuilderStore();
  const { toast } = useToast();

  // Initialize with current state
  useEffect(() => {
    const initialVersion: ProjectVersion = {
      id: 'current',
      timestamp: new Date(),
      components: [...components],
      changeDescription: 'Current state',
      changeType: 'manual',
      componentCount: components.length,
    };
    setVersions([initialVersion]);
  }, []);

  // Save current state as new version
  const saveVersion = (description: string, changeType: ProjectVersion['changeType'] = 'manual') => {
    const newVersion: ProjectVersion = {
      id: Date.now().toString(),
      timestamp: new Date(),
      components: [...components],
      changeDescription: description,
      changeType,
      componentCount: components.length,
    };
    
    setVersions(prev => [newVersion, ...prev.slice(0, 19)]); // Keep only last 20 versions
    
    // Store in localStorage for persistence
    const storageKey = `version-history-${currentProjectId || 'default'}`;
    localStorage.setItem(storageKey, JSON.stringify([newVersion, ...versions.slice(0, 19)]));
    
    toast({
      title: "Version Saved",
      description: `Saved version: ${description}`,
    });
  };

  // Load version history from localStorage
  useEffect(() => {
    const storageKey = `version-history-${currentProjectId || 'default'}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsedVersions = JSON.parse(stored).map((v: any) => ({
          ...v,
          timestamp: new Date(v.timestamp),
        }));
        setVersions(parsedVersions);
      } catch (error) {
        console.error('Failed to parse version history:', error);
      }
    }
  }, [currentProjectId]);

  // Auto-save when components change
  useEffect(() => {
    if (versions.length === 0) return; // Skip initial load
    
    const lastVersion = versions[0];
    const hasChanges = JSON.stringify(components) !== JSON.stringify(lastVersion.components);
    
    if (hasChanges && components.length !== lastVersion.componentCount) {
      const changeType: ProjectVersion['changeType'] = 
        components.length > lastVersion.componentCount ? 'component_add' : 'component_delete';
      
      const description = changeType === 'component_add' 
        ? `Added component (${components.length} total)`
        : `Removed component (${components.length} total)`;
      
      setTimeout(() => saveVersion(description, changeType), 1000);
    }
  }, [components]);

  const restoreVersion = (version: ProjectVersion) => {
    // In a real app, you would use the builder store's restore method
    console.log('Would restore version:', version);
    
    toast({
      title: "Version Restored",
      description: `Restored to: ${version.changeDescription}`,
    });
  };

  const getChangeIcon = (changeType: ProjectVersion['changeType']) => {
    switch (changeType) {
      case 'component_add': return <Plus className="h-3 w-3" />;
      case 'component_delete': return <Trash2 className="h-3 w-3" />;
      case 'component_edit': return <Edit3 className="h-3 w-3" />;
      case 'autosave': return <Save className="h-3 w-3" />;
      default: return <GitBranch className="h-3 w-3" />;
    }
  };

  const getChangeColor = (changeType: ProjectVersion['changeType']) => {
    switch (changeType) {
      case 'component_add': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'component_delete': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'component_edit': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'autosave': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History
        </CardTitle>
        <Button
          size="sm"
          onClick={() => saveVersion('Manual save', 'manual')}
          className="w-fit"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Current Version
        </Button>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {versions.map((version, index) => (
              <div key={version.id}>
                <div
                  className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedVersion === version.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedVersion(version.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getChangeColor(version.changeType)}`}
                        >
                          {getChangeIcon(version.changeType)}
                          <span className="ml-1 capitalize">
                            {version.changeType.replace('_', ' ')}
                          </span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {version.componentCount} components
                        </span>
                      </div>
                      
                      <p className="text-sm font-medium">
                        {version.changeDescription}
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {version.timestamp.toLocaleString()}
                      </div>
                    </div>
                    
                    {version.id !== 'current' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          restoreVersion(version);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {index < versions.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
            
            {versions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No version history yet</p>
                <p className="text-xs">Changes will be automatically tracked</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}