import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Database, Trash2 } from "lucide-react";

interface DeletionConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  componentType: string;
  componentId: string;
  hasBindings: boolean;
  bindingDetails?: {
    tables: string[];
    actions: string[];
  };
  onConfirm: () => void;
}

export function DeletionConfirmDialog({
  open,
  onOpenChange,
  componentType,
  componentId,
  hasBindings,
  bindingDetails,
  onConfirm,
}: DeletionConfirmDialogProps) {
  const [forceDelete, setForceDelete] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
    setForceDelete(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setForceDelete(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Delete Component
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left text-sm">
                Are you sure you want to delete this {componentType} component?
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          {hasBindings && bindingDetails && (
            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <div className="space-y-2">
                  <p className="font-medium">This component has database bindings:</p>
                  
                  {bindingDetails.tables.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm">Connected Tables:</p>
                      <div className="flex flex-wrap gap-1">
                        {bindingDetails.tables.map((table) => (
                          <Badge key={table} variant="secondary" className="text-xs">
                            <Database className="w-3 h-3 mr-1" />
                            {table}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {bindingDetails.actions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm">Active Actions:</p>
                      <div className="flex flex-wrap gap-1">
                        {bindingDetails.actions.map((action) => (
                          <Badge key={action} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm mt-2">
                    Deleting this component will remove its database connections. 
                    Consider removing bindings first if you want to preserve the data structure.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {hasBindings && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="forceDelete"
                checked={forceDelete}
                onChange={(e) => setForceDelete(e.target.checked)}
                className="rounded border-border"
              />
              <label
                htmlFor="forceDelete"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I understand and want to delete anyway
              </label>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={hasBindings && !forceDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Component
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}