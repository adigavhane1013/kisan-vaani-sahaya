import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import VoiceInterface from "@/components/VoiceInterface";
import CameraInterface from "@/components/CameraInterface";
import MarketPrices from "@/components/MarketPrices";
import SchemesInterface from "@/components/SchemesInterface";
import { useToast } from "@/hooks/use-toast";

type Screen = "dashboard" | "voice" | "camera" | "prices" | "schemes";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const { toast } = useToast();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
          console.log('Service Worker registered successfully');
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Show welcome toast
    toast({
      title: "ಸ್ವಾಗತ! Welcome to Project Kisan",
      description: "Your voice-first agricultural assistant is ready",
    });
  }, [toast]);

  const navigateToScreen = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const navigateBack = () => {
    setCurrentScreen("dashboard");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "voice":
        return <VoiceInterface onBack={navigateBack} />;
      case "camera":
        return <CameraInterface onBack={navigateBack} />;
      case "prices":
        return <MarketPrices onBack={navigateBack} />;
      case "schemes":
        return <SchemesInterface onBack={navigateBack} />;
      default:
        return <Dashboard onNavigate={navigateToScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
    </div>
  );
};

export default Index;