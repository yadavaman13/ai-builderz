import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Layers, Database, Sparkles, Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-image.jpg";

const features = [
  {
    icon: Layers,
    title: "Drag & Drop Builder",
    description: "Visually design your app with an intuitive drag-and-drop interface"
  },
  {
    icon: Database,
    title: "Auto Backend",
    description: "Automatic Supabase integration for authentication and database"
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Let AI help you build faster with intelligent suggestions"
  }
];

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-full">
      {/* Enhanced Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">Visual Builder</h1>
                <div className="text-xs text-muted-foreground">Build beautiful websites with AI</div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/preview" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
              <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Projects  
              </Link>
              <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </Link>
            </div>

            {/* Auth Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/projects">
                      My Projects
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={signOut}
                    className="text-muted-foreground"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="gradient-primary text-white">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        
        <div className="relative px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Hero Content */}
              <div className="space-y-8 lg:pr-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI-Powered Visual Builder</span>
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                    Build Full-Stack{" "}
                    <br />
                    Apps{" "}
                    <span className="bg-gradient-primary bg-clip-text text-transparent relative">
                      Visually
                      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-primary opacity-30 blur-sm" />
                    </span>
                  </h1>
                  
                  <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                    Create beautiful websites and web apps with our AI-powered 
                    drag-and-drop builder. No coding required - just design, 
                    deploy, and scale.
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild 
                    size="lg" 
                    className="gradient-primary text-white shadow-2xl hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                  >
                    <Link to="/auth" className="text-lg px-8 py-4">
                      Start Building <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                                     <Button 
                     asChild 
                     variant="outline" 
                     size="lg" 
                     className="border-2 hover:bg-primary/5 transition-all duration-300"
                   >
                     <Link to="/preview" className="text-lg px-8 py-4">
                       <Layers className="mr-2 h-5 w-5" />
                       View Demo
                     </Link>
                   </Button>
                </div>

                {/* Social Proof */}
                <div className="pt-8 border-t border-border/50">
                  <div className="flex items-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>1000+ Apps Built</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span>Zero Code Required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      <span>AI-Enhanced</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hero Visual */}
              <div className="relative lg:pl-8">
                {/* Floating Elements */}
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-primary opacity-20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-accent to-primary opacity-15 rounded-full blur-3xl animate-pulse delay-1000" />
                
                {/* Main Image Container */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-2xl rounded-2xl transform group-hover:scale-105 transition-transform duration-500" />
                  <div className="relative bg-background rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
                    <img 
                      src={heroImage} 
                      alt="AI Builder Interface showing dashboard analytics and components"
                      className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay with stats */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Build Time</span>
                          <span className="font-semibold text-green-600">5 minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="px-6 py-24 bg-gradient-to-b from-card/30 to-background">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Database className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Everything Included</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold">
              Everything you need to build
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From visual design to backend deployment, our platform handles it all. 
              Build professional web applications without writing a single line of code.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl group"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-primary shadow-xl">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Join the Revolution</span>
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                Ready to start{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  building?
                </span>
              </h2>
              
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Join thousands of creators building the next generation of web apps. 
                Start your journey today and see what you can create.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                             <Button 
                 asChild 
                 size="lg" 
                 className="gradient-primary text-white shadow-2xl hover:shadow-glow transition-all duration-300 transform hover:scale-105"
               >
                 <Link to="/auth" className="text-lg px-8 py-4">
                   <Layers className="mr-2 h-5 w-5" />
                   Start Building Now
                 </Link>
               </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 hover:bg-primary/5 transition-all duration-300"
              >
                <Link to="/preview" className="text-lg px-8 py-4">
                  Explore Features
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-12 border-t border-border/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Apps Created</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">5 min</div>
                  <div className="text-sm text-muted-foreground">Avg Build Time</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}