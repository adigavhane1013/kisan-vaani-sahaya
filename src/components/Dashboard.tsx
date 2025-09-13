import { Mic, Camera, TrendingUp, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/kisan-hero-bg.jpg";

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const features = [
    {
      icon: Mic,
      title: "ಧ್ವನಿ ಪ್ರಶ್ನೆ",
      subtitle: "Voice Query",
      description: "ಮಾತಿನ ಮೂಲಕ ಪ್ರಶ್ನೆ ಕೇಳಿ",
      action: () => onNavigate("voice"),
      variant: "primary" as const,
    },
    {
      icon: Camera,
      title: "ಕ್ಯಾಮೆರಾ",
      subtitle: "Camera Diagnosis",
      description: "ಸಸ್ಯ ರೋಗ ಪತ್ತೆ",
      action: () => onNavigate("camera"),
      variant: "success" as const,
    },
    {
      icon: TrendingUp,
      title: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",
      subtitle: "Market Prices",
      description: "ಇಂದಿನ ಬೆಲೆ ಮಾಹಿತಿ",
      action: () => onNavigate("prices"),
      variant: "accent" as const,
    },
    {
      icon: Building2,
      title: "ಯೋಜನೆಗಳು",
      subtitle: "Government Schemes",
      description: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      action: () => onNavigate("schemes"),
      variant: "warning" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      
      <div className="relative z-10 p-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            ಪ್ರಾಜೆಕ್ಟ್ ಕಿಸಾನ್
          </h1>
          <p className="text-muted-foreground text-lg">
            Project Kisan - Agricultural Assistant
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95 border-2 bg-card/95 backdrop-blur-sm"
              onClick={feature.action}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${
                  feature.variant === 'primary' ? 'bg-primary text-primary-foreground' :
                  feature.variant === 'success' ? 'bg-success text-success-foreground' :
                  feature.variant === 'accent' ? 'bg-accent text-accent-foreground' :
                  'bg-warning text-warning-foreground'
                }`}>
                  <feature.icon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {feature.subtitle}
                  </p>
                  <p className="text-sm text-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>ಸ್ಪರ್ಶಿಸಿ ಪ್ರಾರಂಭಿಸಿ • Touch to begin</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;