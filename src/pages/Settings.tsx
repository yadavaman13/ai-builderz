import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Globe, Palette, Bell, Shield } from "lucide-react";
import { useState } from "react";

const settingsCategories = [
  {
    title: "Profile",
    icon: User,
    description: "Manage your account and personal information"
  },
  {
    title: "Deployment", 
    icon: Globe,
    description: "Configure deployment and domain settings"
  },
  {
    title: "Appearance",
    icon: Palette,
    description: "Customize the look and feel of your builder"
  },
  {
    title: "Notifications",
    icon: Bell,
    description: "Control email and push notification preferences"
  }
];

export default function Settings() {
  const [selectedCategory, setSelectedCategory] = useState("Profile");

  const renderSettingsContent = () => {
    switch (selectedCategory) {
      case "Profile":
        return (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about yourself..." />
              </div>
              <Button className="gradient-primary text-white">
                Save Profile
              </Button>
            </CardContent>
          </Card>
        );

      case "Deployment":
        return (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Deployment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="domain">Custom Domain</Label>
                <Input id="domain" placeholder="myapp.com" />
                <p className="text-sm text-muted-foreground">
                  Connect your custom domain to your deployed app
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="flex">
                  <Input id="subdomain" placeholder="myapp" className="rounded-r-none" />
                  <div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                    .aibuilder.app
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto Deploy</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically deploy when you make changes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button variant="outline">
                Deploy Now
              </Button>
            </CardContent>
          </Card>
        );

      case "Appearance":
        return (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              {/* Theme Color Customization */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Theme Colors</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Customize your builder's color scheme
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color" className="text-xs">Primary</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded border bg-primary"></div>
                      <Input id="primary-color" value="#7C3AED" className="h-8 text-xs" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color" className="text-xs">Secondary</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded border bg-secondary"></div>
                      <Input id="secondary-color" value="#374151" className="h-8 text-xs" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color" className="text-xs">Accent</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded border bg-accent"></div>
                      <Input id="accent-color" value="#0EA5E9" className="h-8 text-xs" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="background-color" className="text-xs">Background</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded border bg-background"></div>
                      <Input id="background-color" value="#0F172A" className="h-8 text-xs" />
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Reset to Default
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use smaller spacing and components
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth transitions and animations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Grid Snapping</Label>
                  <p className="text-sm text-muted-foreground">
                    Snap components to grid when dragging
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        );

      case "Notifications":
        return (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your projects via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Deployment Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when deployments succeed or fail
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Important security and account notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, deployment, and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <div className="space-y-2">
            {settingsCategories.map((category) => (
              <Card 
                key={category.title} 
                className={`border-border cursor-pointer hover:shadow-elegant transition-smooth ${
                  selectedCategory === category.title 
                    ? 'border-primary bg-primary/5' 
                    : ''
                }`}
                onClick={() => setSelectedCategory(category.title)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      selectedCategory === category.title 
                        ? 'bg-primary text-white' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${
                        selectedCategory === category.title 
                          ? 'text-primary' 
                          : ''
                      }`}>
                        {category.title}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2">
          {renderSettingsContent()}
        </div>
      </div>
    </div>
  );
}