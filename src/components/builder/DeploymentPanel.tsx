import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, ExternalLink, AlertTriangle, CheckCircle, Globe, Zap } from "lucide-react";
import { useState } from "react";
import { useBuilderStore } from "@/stores/builderStore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DeploymentPanelProps {
  className?: string;
}

export function DeploymentPanel({ className }: DeploymentPanelProps) {
  const [deploymentPlatform, setDeploymentPlatform] = useState<'vercel' | 'netlify'>('vercel');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentHistory, setDeploymentHistory] = useState<Array<{
    url: string;
    platform: string;
    deployedAt: string;
    status: 'success' | 'failed';
  }>>([]);
  
  const { components, currentProjectId } = useBuilderStore();
  const { toast } = useToast();

  const checkProjectReadiness = () => {
    const warnings = [];
    const errors = [];
    
    if (components.length === 0) {
      errors.push('No components on canvas');
    }
    
    const unboundForms = components.filter(comp => 
      comp.type === 'form' && !comp.props.databaseBinding
    );
    
    if (unboundForms.length > 0) {
      warnings.push(`${unboundForms.length} form(s) not connected to database`);
    }
    
    const missingContent = components.filter(comp => 
      (comp.type === 'text' && !comp.props.text) ||
      (comp.type === 'button' && !comp.props.text) ||
      (comp.type === 'image' && !comp.props.src)
    );
    
    if (missingContent.length > 0) {
      warnings.push(`${missingContent.length} component(s) missing content`);
    }
    
    return { warnings, errors };
  };

  const handleDeploy = async () => {
    const { errors } = checkProjectReadiness();
    
    if (errors.length > 0) {
      toast({
        title: "Cannot Deploy",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

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

      const newDeployment = {
        url: data.url,
        platform: deploymentPlatform,
        deployedAt: data.deployedAt,
        status: 'success' as const
      };
      
      setDeploymentHistory(prev => [newDeployment, ...prev]);
      
      toast({
        title: "Deployed Successfully!",
        description: `Your app is live on ${deploymentPlatform}`,
      });
    } catch (error) {
      console.error('Deployment failed:', error);
      
      const failedDeployment = {
        url: '',
        platform: deploymentPlatform,
        deployedAt: new Date().toISOString(),
        status: 'failed' as const
      };
      
      setDeploymentHistory(prev => [failedDeployment, ...prev]);
      
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const { warnings, errors } = checkProjectReadiness();
  const hasIssues = warnings.length > 0 || errors.length > 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Deploy & Publish
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Platform Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Deployment Platform</label>
          <Select value={deploymentPlatform} onValueChange={(value: 'vercel' | 'netlify') => setDeploymentPlatform(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vercel">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Vercel
                </div>
              </SelectItem>
              <SelectItem value="netlify">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Netlify
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Project Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Status</label>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Components</span>
              <Badge variant={components.length > 0 ? "default" : "secondary"}>
                {components.length}
              </Badge>
            </div>
            
            {hasIssues && (
              <div className="space-y-1">
                {errors.map((error, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-sm text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                    {error}
                  </div>
                ))}
                {warnings.map((warning, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-sm text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    {warning}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Deploy Button */}
        <Button 
          onClick={handleDeploy}
          disabled={isDeploying || errors.length > 0}
          className="w-full"
          variant={errors.length > 0 ? "secondary" : "default"}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isDeploying ? 'Deploying...' : `Deploy to ${deploymentPlatform}`}
        </Button>

        {/* Deployment History */}
        {deploymentHistory.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Recent Deployments</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {deploymentHistory.map((deployment, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-muted/30 text-sm">
                  <div className="flex items-center gap-2">
                    {deployment.status === 'success' ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(deployment.deployedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {deployment.status === 'success' && deployment.url && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => window.open(deployment.url, '_blank')}
                      className="h-auto p-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}