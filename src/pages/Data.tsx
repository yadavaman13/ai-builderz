import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Plus, Table, Key, Users } from "lucide-react";

const sampleTables = [
  {
    name: "users",
    icon: Users,
    rows: 1250,
    columns: 8,
    description: "User accounts and profiles"
  },
  {
    name: "products",
    icon: Table,
    rows: 342,
    columns: 12,
    description: "Product catalog and inventory"
  },
  {
    name: "orders",
    icon: Key,
    rows: 2840,
    columns: 6,
    description: "Customer orders and transactions"
  }
];

export default function Data() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Database</h1>
          <p className="text-muted-foreground">
            Manage your app's data and database schema
          </p>
        </div>
        <Button className="gradient-primary text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Table
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
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
                <p className="text-2xl font-bold">4,432</p>
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
                <p className="text-2xl font-bold">26</p>
                <p className="text-sm text-muted-foreground">Columns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tables</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTables.map((table) => (
            <Card key={table.name} className="border-border hover:shadow-elegant transition-smooth cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <table.icon className="h-5 w-5" />
                  {table.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {table.description}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {table.rows.toLocaleString()} rows
                  </span>
                  <span className="text-muted-foreground">
                    {table.columns} columns
                  </span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Table
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State for New Users */}
      <Card className="border-dashed border-2 border-border">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Database className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Ready to add data?</h3>
          <p className="text-muted-foreground mb-4">
            Create your first table to start storing data for your application
          </p>
          <Button className="gradient-primary text-white">
            Create First Table
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}