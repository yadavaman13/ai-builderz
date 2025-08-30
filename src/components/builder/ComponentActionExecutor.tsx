import React from 'react';
import { useDatabaseStore } from '@/stores/databaseStore';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ComponentActionExecutorProps {
  componentId: string;
  componentType: string;
  children: React.ReactNode;
}

export const ComponentActionExecutor: React.FC<ComponentActionExecutorProps> = ({
  componentId,
  componentType,
  children,
}) => {
  const { getBinding } = useDatabaseStore();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const executeAction = async (formData?: Record<string, any>) => {
    const binding = getBinding(componentId);
    if (!binding) return;

    try {
      switch (binding.action) {
        case 'insert':
          if (!binding.table || !formData) break;
          
          // For demo, only allow inserts to known tables
          if (!['profiles', 'projects'].includes(binding.table)) {
            toast({
              title: "Table Not Supported",
              description: "This table is not available for inserts in the demo.",
              variant: "destructive",
            });
            break;
          }

          const { error: insertError } = await supabase
            .from(binding.table as 'profiles' | 'projects')
            .insert(formData as any);

          if (insertError) throw insertError;

          toast({
            title: "Data Inserted",
            description: `Successfully added data to ${binding.table}`,
          });
          break;

        case 'select':
          if (!binding.table) break;
          
          if (!['profiles', 'projects'].includes(binding.table)) {
            toast({
              title: "Query Results",
              description: "Demo data would be displayed here.",
            });
            break;
          }

          const { data, error: selectError } = await supabase
            .from(binding.table as 'profiles' | 'projects')
            .select('*')
            .limit(5);

          if (selectError) throw selectError;

          toast({
            title: "Query Executed",
            description: `Retrieved ${data?.length || 0} records from ${binding.table}`,
          });
          break;

        case 'auth_login':
          toast({
            title: "Login Action",
            description: "This would trigger the login process",
          });
          break;

        case 'auth_logout':
          await signOut();
          toast({
            title: "Logged Out",
            description: "Successfully logged out",
          });
          break;

        default:
          toast({
            title: "Action Not Implemented",
            description: `${binding.action} action is not yet implemented`,
          });
      }
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // For form components, we can extract form data
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());
    executeAction(data);
  };

  // For button components, just execute the action
  const handleButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    executeAction();
  };

  // Clone children and add event handlers based on component type
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    if (componentType === 'form') {
      return React.cloneElement(child, {
        onSubmit: handleFormSubmit,
      } as any);
    }

    if (componentType === 'button') {
      return React.cloneElement(child, {
        onClick: handleButtonClick,
      } as any);
    }

    return child;
  });

  return <>{enhancedChildren}</>;
};