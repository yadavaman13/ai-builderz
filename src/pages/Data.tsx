import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Plus, Table, Key, Users, RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { useDatabaseStore } from "@/stores/databaseStore";
import { useToast } from "@/hooks/use-toast";

export default function Data() {
  const { tables, loading, error, fetchTables } = useDatabaseStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleRefresh = () => {
    fetchTables();
    toast({
      title: "Refreshed",
      description: "Database tables have been refreshed.",
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Database</h1>
          <p className="text-muted-foreground">
            Manage your Supabase tables and data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="gradient-primary text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Table
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10">
          <CardContent className="p-4">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tables.length}</p>
                <p className="text-sm text-muted-foreground">Tables</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Table className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {tables.reduce((total, table) => total + (table.row_count || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Rows</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Key className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {tables.reduce((total, table) => total + table.columns.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Columns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tables</h2>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : tables.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <Card key={table.name} className="border-border hover:shadow-elegant transition-smooth cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Table className="h-5 w-5" />
                    {table.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Columns:</p>
                    <div className="flex flex-wrap gap-1">
                      {table.columns.slice(0, 4).map((col) => (
                        <span
                          key={col.name}
                          className="px-2 py-1 text-xs bg-muted rounded-md"
                        >
                          {col.name}
                          {col.primary && <Key className="inline h-3 w-3 ml-1" />}
                        </span>
                      ))}
                      {table.columns.length > 4 && (
                        <span className="px-2 py-1 text-xs text-muted-foreground">
                          +{table.columns.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {table.row_count?.toLocaleString() || 0} rows
                    </span>
                    <span className="text-muted-foreground">
                      {table.columns.length} columns
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Data
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tables found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first table to start storing data for your application
              </p>
              <Button className="gradient-primary text-white">
                Create First Table
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}