import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Layout, Type, Image, Square } from "lucide-react";

const componentCategories = [
  {
    title: "Layout",
    icon: Layout,
    components: ["Container", "Grid", "Flex", "Stack"]
  },
  {
    title: "Typography", 
    icon: Type,
    components: ["Heading", "Paragraph", "List", "Quote"]
  },
  {
    title: "Media",
    icon: Image,
    components: ["Image", "Video", "Gallery", "Icon"]
  },
  {
    title: "Forms",
    icon: Square,
    components: ["Input", "Button", "Select", "Checkbox"]
  }
];

export default function Builder() {
  return (
    <div className="h-full flex">
      {/* Component Panel */}
      <div className="w-80 border-r border-border bg-card p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Components</h2>
          <p className="text-sm text-muted-foreground">
            Drag components to build your page
          </p>
        </div>
        
        <div className="space-y-4">
          {componentCategories.map((category) => (
            <Card key={category.title} className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {category.components.map((component) => (
                  <Button
                    key={component}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    {component}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-muted/30 p-8 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <Layout className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Start Building</h3>
            <p className="text-muted-foreground">
              Drag components from the left panel to start building your website
            </p>
          </div>
          <Button className="gradient-primary text-white">
            Create New Page
          </Button>
        </div>
      </div>
    </div>
  );
}