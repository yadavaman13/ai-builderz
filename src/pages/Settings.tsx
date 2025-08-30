import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Globe, Palette, Bell, Shield } from "lucide-react";

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
              <Card key={category.title} className="border-border cursor-pointer hover:shadow-elegant transition-smooth">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{category.title}</h3>
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
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
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

          {/* Deployment Settings */}
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

          {/* Appearance Settings */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
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
            </CardContent>
          </Card>

          {/* Notifications */}
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
        </div>
      </div>
    </div>
  );
}