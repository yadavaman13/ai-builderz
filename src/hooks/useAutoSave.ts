import { useEffect, useRef } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAutoSave = (projectId?: string) => {
  const { components } = useBuilderStore();
  const { user } = useAuth();
  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!user || !projectId) return;

    const currentState = JSON.stringify(components);
    if (currentState === lastSavedRef.current) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const projectData = {
          components,
          tables: [], // Will be populated with actual table bindings
          lastSaved: new Date().toISOString(),
        } as any;

        const { error } = await supabase
          .from('projects')
          .update({ 
            project_data: projectData,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);

        if (error) throw error;

        lastSavedRef.current = currentState;
        
        // Optional: Show subtle save indicator
        console.log('Project auto-saved');
      } catch (error: any) {
        console.error('Auto-save failed:', error);
        toast({
          title: "Auto-save Failed",
          description: "Your changes couldn't be saved automatically.",
          variant: "destructive",
        });
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [components, user, projectId, toast]);

  const manualSave = async () => {
    if (!user || !projectId) return false;

    try {
      const projectData = {
        components,
        tables: [],
        lastSaved: new Date().toISOString(),
      } as any;

      const { error } = await supabase
        .from('projects')
        .update({ 
          project_data: projectData,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      lastSavedRef.current = JSON.stringify(components);
      
      toast({
        title: "Saved",
        description: "Your project has been saved successfully.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return { manualSave };
};