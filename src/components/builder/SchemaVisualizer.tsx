import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Database, 
  Table, 
  Key, 
  Link, 
  Eye, 
  EyeOff,
  RefreshCw,
  GitBranch
} from "lucide-react";
import { useDatabaseStore } from "@/stores/databaseStore";

interface TableSchema {
  name: string;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    primary: boolean;
  }>;
  relationships: Array<{
    column: string;
    referencedTable: string;
    referencedColumn: string;
  }>;
}

interface SchemaVisualizerProps {
  className?: string;
}

export function SchemaVisualizer({ className }: SchemaVisualizerProps) {
  const [tablesData, setTablesData] = useState<TableSchema[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showRelationships, setShowRelationships] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { tables } = useDatabaseStore();

  // Mock refresh function
  const handleRefreshSchema = async () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Convert database tables to visual format
  useEffect(() => {
    if (tables && tables.length > 0) {
      const formattedTables: TableSchema[] = tables.map(table => ({
        name: table.name,
        columns: table.columns || [],
        relationships: [], // Would be populated from foreign key information
      }));
      setTablesData(formattedTables);
    }
  }, [tables]);

  const getColumnIcon = (column: any) => {
    if (column.primary) return <Key className="h-3 w-3 text-amber-500" />;
    if (column.nullable) return <div className="w-3 h-3 rounded-full bg-muted" />;
    return <div className="w-3 h-3 rounded-full bg-primary" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'text': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'varchar': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'integer': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'bigint': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'boolean': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'timestamp': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'uuid': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'json': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'jsonb': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };
    
    const baseType = type.toLowerCase().split('(')[0];
    return colors[baseType] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Schema
          </CardTitle>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRelationships(!showRelationships)}
            >
              {showRelationships ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefreshSchema}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Table className="h-3 w-3" />
            {tablesData.length} tables
          </div>
          {showRelationships && (
            <div className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              Relationships shown
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {tablesData.map((table) => (
              <Card 
                key={table.name}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTable === table.name ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedTable(selectedTable === table.name ? null : table.name)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      {table.name}
                    </CardTitle>
                    <Badge variant="secondary">
                      {table.columns.length} columns
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {table.columns.slice(0, selectedTable === table.name ? undefined : 3).map((column) => (
                      <div key={column.name} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                        <div className="flex items-center gap-2">
                          {getColumnIcon(column)}
                          <span className="font-medium">{column.name}</span>
                          {column.primary && (
                            <Badge variant="outline" className="text-xs">
                              PK
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getTypeColor(column.type)}`}
                          >
                            {column.type}
                          </Badge>
                          {!column.nullable && (
                            <Badge variant="outline" className="text-xs">
                              NOT NULL
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {selectedTable !== table.name && table.columns.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center py-1">
                        +{table.columns.length - 3} more columns
                      </div>
                    )}
                    
                    {showRelationships && table.relationships.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <Link className="h-3 w-3" />
                          Relationships
                        </div>
                        {table.relationships.map((rel, idx) => (
                          <div key={idx} className="text-xs bg-accent/30 rounded p-2">
                            <span className="font-medium">{rel.column}</span>
                            <span className="text-muted-foreground mx-1">→</span>
                            <span className="font-medium">{rel.referencedTable}.{rel.referencedColumn}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {tablesData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No database tables found</p>
                <p className="text-xs">Create tables to see the schema visualization</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}