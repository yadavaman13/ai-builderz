import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, Smartphone, Monitor, Tablet } from "lucide-react";
import { useState } from "react";

const devices = [
  { name: "Desktop", icon: Monitor, width: "100%" },
  { name: "Tablet", icon: Tablet, width: "768px" },
  { name: "Mobile", icon: Smartphone, width: "375px" }
];

export default function Preview() {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Preview</h1>
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              {devices.map((device) => (
                <Button
                  key={device.name}
                  variant={selectedDevice.name === device.name ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedDevice(device)}
                  className="h-8 px-3"
                >
                  <device.icon className="h-4 w-4 mr-2" />
                  {device.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview Mode
            </Button>
            <Button className="gradient-primary text-white" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-muted/30 p-8 flex items-center justify-center">
        <div 
          className="bg-background border border-border rounded-lg shadow-elegant transition-all duration-300"
          style={{ 
            width: selectedDevice.width,
            height: selectedDevice.name === "Mobile" ? "667px" : "80vh",
            maxWidth: "100%"
          }}
        >
          {/* Mock Preview Content */}
          <div className="h-full flex items-center justify-center">
            <Card className="w-80 border-border">
              <CardContent className="p-12 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Live Preview</h3>
                  <p className="text-muted-foreground">
                    Your website will appear here as you build it. Start by adding components in the Builder.
                  </p>
                </div>
                <Button variant="outline">
                  Go to Builder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Footer */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Viewport: {selectedDevice.name}</span>
            <span>•</span>
            <span>Last updated: Just now</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Auto-refresh:</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>On</span>
          </div>
        </div>
      </div>
    </div>
  );
}