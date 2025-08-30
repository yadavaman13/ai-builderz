import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Layers, Database, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
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
  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="relative px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                    Build Full-Stack Apps{" "}
                    <span className="bg-gradient-primary bg-clip-text text-transparent">
                      Visually
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Create beautiful websites and web apps with our AI-powered drag-and-drop builder. 
                    No coding required - just design, deploy, and scale.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="gradient-primary text-white shadow-elegant hover:shadow-glow transition-smooth">
                    <Link to="/auth">
                      Start Building <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-border hover:bg-secondary transition-smooth">
                    <Link to="/preview">
                      View Demo
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl rounded-full" />
                <img 
                  src={heroImage} 
                  alt="AI Builder Interface"
                  className="relative w-full h-auto rounded-2xl shadow-elegant border border-border"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-card/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Everything you need to build
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From visual design to backend deployment, our platform handles it all
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden bg-card border-border hover:shadow-elegant transition-smooth">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to start building?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of creators building the next generation of web apps
              </p>
            </div>
            
            <Button asChild size="lg" className="gradient-primary text-white shadow-elegant hover:shadow-glow transition-smooth">
              <Link to="/auth">
                <Zap className="mr-2 h-4 w-4" />
                Start Building Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}