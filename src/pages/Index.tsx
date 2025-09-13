import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import VoiceInterface from "@/components/VoiceInterface";
import CameraInterface from "@/components/CameraInterface";
import MarketPrices from "@/components/MarketPrices";
import SchemesInterface from "@/components/SchemesInterface";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { getLocalData, setLocalData } from "@/utils/offline";

type Screen = "dashboard" | "voice" | "camera" | "prices" | "schemes";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [language, setLanguage] = useState(getLocalData('language') || 'kn');
  const [demoMode, setDemoMode] = useState(getLocalData('demoMode') || true);
  const [explainMode, setExplainMode] = useState<'farmer' | 'expert'>(getLocalData('explainMode') || 'farmer');
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

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setLocalData('language', lang);
  };

  const handleDemoModeChange = (enabled: boolean) => {
    setDemoMode(enabled);
    setLocalData('demoMode', enabled);
  };

  const handleExplainModeChange = (mode: 'farmer' | 'expert') => {
    setExplainMode(mode);
    setLocalData('explainMode', mode);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={currentScreen !== "dashboard" ? "Project Kisan" : undefined}
        showBack={currentScreen !== "dashboard"}
        onBack={navigateBack}
        language={language}
        onLanguageChange={handleLanguageChange}
        demoMode={demoMode}
        onDemoModeChange={handleDemoModeChange}
        explainMode={explainMode}
        onExplainModeChange={handleExplainModeChange}
      />
      {renderScreen()}
    </div>
  );
};

export default Index;