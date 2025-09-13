import { useState } from "react";
import { ArrowLeft, Globe, Settings, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
  explainMode: "farmer" | "expert";
  onExplainModeChange: (mode: "farmer" | "expert") => void;
}

const Header = ({
  title,
  showBack,
  onBack,
  language,
  onLanguageChange,
  demoMode,
  onDemoModeChange,
  explainMode,
  onExplainModeChange
}: HeaderProps) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {showBack && onBack ? (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Project Kisan</span>
            </div>
          )}
          {title && <h1 className="text-lg font-semibold">{title}</h1>}
        </div>

        <div className="flex items-center gap-2">
          {demoMode && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
              Demo Mode
            </span>
          )}
          
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-auto">
              <Globe className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showSettings && (
        <div className="border-t bg-muted/50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="demo-mode">Demo Mode</Label>
            <Switch
              id="demo-mode"
              checked={demoMode}
              onCheckedChange={onDemoModeChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Explanation Mode</Label>
            <div className="flex items-center gap-2">
              <span className={explainMode === "farmer" ? "font-medium" : "text-muted-foreground"}>
                🧑 Farmer
              </span>
              <Switch
                checked={explainMode === "expert"}
                onCheckedChange={(checked) => onExplainModeChange(checked ? "expert" : "farmer")}
              />
              <span className={explainMode === "expert" ? "font-medium" : "text-muted-foreground"}>
                👨‍🎓 Expert
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;