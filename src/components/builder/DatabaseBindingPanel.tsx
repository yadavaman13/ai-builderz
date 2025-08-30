import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Database, Plus, Play, AlertTriangle, CheckCircle } from "lucide-react";
import { useBuilderStore } from '@/stores/builderStore';
import { useDatabaseStore, ComponentBinding } from '@/stores/databaseStore';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CreateTableDialog: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  suggestedSchema?: { name: string; columns: any[] } 
}> = ({ isOpen, onClose, suggestedSchema }) => {
  const [tableName, setTableName] = useState(suggestedSchema?.name || '');
  const [columns, setColumns] = useState(suggestedSchema?.columns || [
    { name: 'id', type: 'uuid', nullable: false, primary: true, unique: false },
    { name: 'created_at', type: 'timestamp', nullable: false, primary: false, unique: false }
  ]);
  const { createTable } = useDatabaseStore();
  const { toast } = useToast();

  const handleCreateTable = async () => {
    if (!tableName.trim()) return;
    
    const success = await createTable(tableName, columns);
    if (success) {
      toast({
        title: "Table Created",
        description: `Table "${tableName}" has been created successfully.`,
      });
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Failed to create table. Check your schema.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Table Name</Label>
            <Input
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="e.g., user_forms, contact_submissions"
            />
          </div>
          
          <div>
            <Label>Columns</Label>
            <div className="space-y-2 mt-2">
              {columns.map((col, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={col.name}
                    onChange={(e) => {
                      const newCols = [...columns];
                      newCols[index].name = e.target.value;
                      setColumns(newCols);
                    }}
                    placeholder="Column name"
                    className="flex-1"
                  />
                  <Select
                    value={col.type}
                    onValueChange={(value) => {
                      const newCols = [...columns];
                      newCols[index].type = value;
                      setColumns(newCols);
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">TEXT</SelectItem>
                      <SelectItem value="integer">INTEGER</SelectItem>
                      <SelectItem value="uuid">UUID</SelectItem>
                      <SelectItem value="timestamp">TIMESTAMP</SelectItem>
                      <SelectItem value="boolean">BOOLEAN</SelectItem>
                      <SelectItem value="jsonb">JSONB</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setColumns(columns.filter((_, i) => i !== index))}
                    disabled={columns.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setColumns([...columns, { name: '', type: 'text', nullable: true, primary: false, unique: false }])}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleCreateTable} className="gradient-primary text-white">
              Create Table
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const DatabaseBindingPanel: React.FC = () => {
  const { selectedComponentId, getSelectedComponent } = useBuilderStore();
  const { tables, bindings, loading, fetchTables, addBinding, updateBinding, removeBinding, getBinding, testAction } = useDatabaseStore();
  const [binding, setBinding] = useState<Partial<ComponentBinding>>({});
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const selectedComponent = getSelectedComponent();
  const currentBinding = selectedComponentId ? getBinding(selectedComponentId) : null;

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    if (currentBinding) {
      setBinding(currentBinding);
    } else {
      setBinding({});
    }
    setTestResult('idle');
  }, [currentBinding, selectedComponentId]);

  const getSuggestedActions = (componentType: string) => {
    switch (componentType) {
      case 'button':
        return ['insert', 'select', 'update', 'delete', 'auth_login', 'auth_logout'];
      case 'form':
        return ['insert'];
      case 'table':
        return ['select'];
      case 'chart':
        return ['select'];
      default:
        return ['select'];
    }
  };

  const getSuggestedSchema = (componentType: string) => {
    if (componentType === 'form') {
      return {
        name: 'form_submissions',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primary: true, unique: false },
          { name: 'name', type: 'text', nullable: true, primary: false, unique: false },
          { name: 'email', type: 'text', nullable: true, primary: false, unique: false },
          { name: 'message', type: 'text', nullable: true, primary: false, unique: false },
          { name: 'created_at', type: 'timestamp', nullable: false, primary: false, unique: false }
        ]
      };
    }
    return null;
  };

  const handleSaveBinding = () => {
    if (!selectedComponentId || !binding.action) return;

    const newBinding: ComponentBinding = {
      componentId: selectedComponentId,
      action: binding.action as ComponentBinding['action'],
      table: binding.table,
      fields: binding.fields || {},
      query: binding.query,
      conditions: binding.conditions || {},
    };

    addBinding(newBinding);
    toast({
      title: "Binding Saved",
      description: "Component has been successfully bound to database action.",
    });
  };

  const handleTestAction = async () => {
    if (!selectedComponentId) return;
    
    setTestResult('testing');
    const success = await testAction(selectedComponentId, {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test submission'
    });
    
    setTestResult(success ? 'success' : 'error');
    toast({
      title: success ? "Test Successful" : "Test Failed",
      description: success 
        ? "Database action executed successfully!" 
        : "Database action failed. Check your configuration.",
      variant: success ? "default" : "destructive",
    });
  };

  if (!selectedComponent) {
    return (
      <Card className="w-80 border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Binding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>Select a component to configure database bindings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const suggestedActions = getSuggestedActions(selectedComponent.type);
  const suggestedSchema = getSuggestedSchema(selectedComponent.type);

  return (
    <Card className="w-80 border-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Binding
        </CardTitle>
        <p className="text-sm text-muted-foreground capitalize">
          {selectedComponent.type} Component
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Binding Status */}
        {currentBinding && (
          <div className="p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{currentBinding.action}</Badge>
              {currentBinding.table && (
                <Badge variant="outline">{currentBinding.table}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeBinding(selectedComponentId!)}
              className="text-destructive"
            >
              Remove Binding
            </Button>
          </div>
        )}

        {/* Action Selection */}
        <div className="space-y-2">
          <Label>Database Action</Label>
          <Select
            value={binding.action || ''}
            onValueChange={(value) => setBinding({ ...binding, action: value as ComponentBinding['action'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              {suggestedActions.map(action => (
                <SelectItem key={action} value={action}>
                  {action.replace('_', ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {suggestedActions.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Suggested actions for {selectedComponent.type} components
            </p>
          )}
        </div>

        {/* Table Selection */}
        {binding.action && !['auth_login', 'auth_logout'].includes(binding.action) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Target Table</Label>
              {suggestedSchema && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateTable(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Create
                </Button>
              )}
            </div>
            <Select
              value={binding.table || ''}
              onValueChange={(value) => setBinding({ ...binding, table: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map(table => (
                  <SelectItem key={table.name} value={table.name}>
                    {table.name} ({table.row_count} rows)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loading && (
              <p className="text-xs text-muted-foreground">Loading tables...</p>
            )}
            {tables.length === 0 && !loading && (
              <div className="p-3 border border-dashed border-border rounded-lg text-center">
                <AlertTriangle className="h-4 w-4 mx-auto mb-2 text-amber-500" />
                <p className="text-xs text-muted-foreground mb-2">No tables found</p>
                {suggestedSchema && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateTable(true)}
                  >
                    Create Suggested Table
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleSaveBinding}
            disabled={!binding.action}
            className="w-full gradient-primary text-white"
          >
            Save Binding
          </Button>
          
          {currentBinding && (
            <Button
              variant="outline"
              onClick={handleTestAction}
              disabled={testResult === 'testing'}
              className="w-full"
            >
              {testResult === 'testing' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />}
              {testResult === 'success' && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
              {testResult === 'error' && <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />}
              <Play className="h-4 w-4 mr-2" />
              Test Action
            </Button>
          )}
        </div>

        {/* Schema Info */}
        {binding.table && (
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Table Schema:</p>
            {tables.find(t => t.name === binding.table)?.columns.map(col => (
              <div key={col.name} className="flex justify-between">
                <span>{col.name}</span>
                <span className="text-xs">{col.type}</span>
              </div>
            ))}
          </div>
        )}

        <CreateTableDialog
          isOpen={showCreateTable}
          onClose={() => setShowCreateTable(false)}
          suggestedSchema={suggestedSchema}
        />
      </CardContent>
    </Card>
  );
};