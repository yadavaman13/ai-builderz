import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  MousePointer2, 
  Layers, 
  Database, 
  Rocket, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { useBuilderStore } from "@/stores/builderStore";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    id: "welcome",
    title: "Welcome to Visual Builder",
    description: "Let's build something amazing together! This quick tour will show you the basics.",
    icon: Sparkles,
    content: "Start by dragging components from the left sidebar onto the canvas. You can build anything from simple landing pages to complex dashboards.",
  },
  {
    id: "drag-drop",
    title: "Drag & Drop Components",
    description: "Add components by dragging them from the sidebar to the canvas.",
    icon: MousePointer2,
    content: "Try dragging a Button or Text component from the Component Library on the left. Drop it anywhere on the canvas to place it.",
    highlight: "component-library",
  },
  {
    id: "customize",
    title: "Customize Properties",
    description: "Select any component to customize its properties in the right panel.",
    icon: Layers,
    content: "Click on a component to select it, then use the Properties Panel on the right to change colors, text, size, and more.",
    highlight: "properties-panel",
  },
  {
    id: "database",
    title: "Connect to Database",
    description: "Bind forms and components to your Supabase database for real functionality.",
    icon: Database,
    content: "Use the Database Binding Panel to connect forms to your database tables. Create new tables or bind to existing ones.",
    highlight: "database-panel",
  },
  {
    id: "deploy",
    title: "Preview & Deploy",
    description: "Preview your app and deploy it with one click to Vercel or Netlify.",
    icon: Rocket,
    content: "Click Preview to see your app in action, then use the Deploy button to publish it live on the web.",
    highlight: "toolbar",
  }
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { components } = useBuilderStore();

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  // Auto-advance when user adds first component
  useEffect(() => {
    if (currentStep === 1 && components.length > 0) {
      setTimeout(() => setCurrentStep(2), 1000);
    }
  }, [components.length, currentStep]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const skipTour = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-lg shadow-2xl border-primary/20 animate-scale-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full">
            <currentStepData.icon className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {currentStepData.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <Badge variant="secondary">
                {currentStep + 1} of {onboardingSteps.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-primary"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={skipTour}>
                Skip Tour
              </Button>
              <Button onClick={nextStep} className="gradient-primary text-white">
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}