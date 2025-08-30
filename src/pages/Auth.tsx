import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Key, Settings, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const authProviders = [
  { name: "Email & Password", enabled: true, users: 1250 },
  { name: "Google OAuth", enabled: true, users: 890 },
  { name: "GitHub OAuth", enabled: false, users: 0 },
  { name: "Discord OAuth", enabled: false, users: 0 }
];

const authStats = [
  { label: "Total Users", value: "2,140", icon: Users },
  { label: "Active Sessions", value: "342", icon: Eye },
  { label: "API Keys", value: "12", icon: Key },
  { label: "Auth Events", value: "15.2k", icon: Shield }
];

export default function Auth() {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Authentication</h1>
          <p className="text-muted-foreground">
            Manage user authentication and security settings
          </p>
        </div>
        <Button className="gradient-primary text-white">
          <Settings className="mr-2 h-4 w-4" />
          Auth Settings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {authStats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Auth Providers */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Authentication Providers</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {authProviders.map((provider) => (
            <Card key={provider.name} className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {provider.name}
                  </span>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    provider.enabled 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  }`}>
                    {provider.enabled ? "Enabled" : "Disabled"}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Users registered</p>
                    <p className="text-lg font-semibold">{provider.users.toLocaleString()}</p>
                  </div>
                  <Button 
                    variant={provider.enabled ? "outline" : "default"}
                    size="sm"
                    className={provider.enabled ? "" : "gradient-primary text-white"}
                  >
                    {provider.enabled ? "Configure" : "Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* API Keys Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">API Keys</h2>
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Supabase Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Public API Key</label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm">
                  {showApiKey ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." : "•".repeat(40)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This key is safe to use in client-side applications. It allows read access to public data.
            </p>
            <Button variant="outline" size="sm">
              Regenerate Key
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Security Best Practices</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Enable Row Level Security (RLS) for all tables</li>
                <li>• Use service role keys only on the server side</li>
                <li>• Regularly rotate your API keys</li>
                <li>• Monitor authentication events for suspicious activity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}