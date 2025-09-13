import { useState, useRef } from "react";
import { Camera, ArrowLeft, Upload, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CameraInterfaceProps {
  onBack: () => void;
}

const CameraInterface = ({ onBack }: CameraInterfaceProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDiagnosis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePlant = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setConfidence(0);
    
    // Simulate AI analysis with progress
    const progressInterval = setInterval(() => {
      setConfidence(prev => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          // Demo diagnosis result
          setTimeout(() => {
            setDiagnosis({
              disease: "ಎಲೆ ಕಲೆ ರೋಗ",
              disease_en: "Leaf Spot Disease",
              confidence: 87,
              severity: "ಮಧ್ಯಮ",
              advice_kannada: "ಕಾಪರ್ ಆಧಾರಿತ ಶಿಲೀಂದ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ. ೭-೧೦ ದಿನಗಳಿಗೊಮ್ಮೆ ಪುನರಾವರ್ತಿಸಿ.",
              remedies: [
                "ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದು ನಾಶಮಾಡಿ",
                "ಹೆಚ್ಚು ನೀರು ಕೊಡಬೇಡಿ",
                "ಗಾಳಿ ಇರುವಂತೆ ಮಾಡಿ"
              ]
            });
            setIsAnalyzing(false);
          }, 1000);
          return 87;
        }
        return prev + Math.random() * 10;
      });
    }, 100);
  };

  const connectToHuman = () => {
    // Simulate connecting to agricultural expert
    alert("ಕೃಷಿ ತಜ್ಞರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಲಾಗುತ್ತಿದೆ... • Connecting to agricultural expert...");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          ಹಿಂತಿರುಗಿ
        </Button>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">
            ಸಸ್ಯ ರೋಗ ಪತ್ತೆ
          </h2>
          <p className="text-muted-foreground">
            Plant Disease Diagnosis
          </p>
        </div>

        <Card className="p-6">
          {!selectedImage ? (
            <div className="text-center">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 mb-4">
                <Camera className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  ಸಸ್ಯದ ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  ಫೋಟೋ ಆಯ್ಕೆ ಮಾಡಿ
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected plant"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  ಬದಲಿಸಿ
                </Button>
              </div>

              {!diagnosis && !isAnalyzing && (
                <Button 
                  onClick={analyzePlant}
                  className="w-full"
                  size="lg"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  ರೋಗ ಪತ್ತೆ ಮಾಡಿ
                </Button>
              )}

              {isAnalyzing && (
                <Card className="p-4">
                  <div className="text-center mb-4">
                    <p className="font-medium">ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...</p>
                    <p className="text-sm text-muted-foreground">Analyzing image</p>
                  </div>
                  <Progress value={confidence} className="mb-2" />
                  <p className="text-sm text-center">{Math.round(confidence)}%</p>
                </Card>
              )}

              {diagnosis && (
                <div className="space-y-4">
                  <Card className="p-4 border-success/50 bg-success/5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-success">ರೋಗ ಪತ್ತೆಯಾಗಿದೆ</h3>
                      <span className="text-sm bg-success/20 text-success px-2 py-1 rounded">
                        {diagnosis.confidence}% ವಿಶ್ವಾಸ
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-lg">{diagnosis.disease}</h4>
                      <p className="text-sm text-muted-foreground">{diagnosis.disease_en}</p>
                    </div>

                    <div className="mb-4">
                      <p className="font-medium mb-1">ಸಲಹೆ:</p>
                      <p className="text-sm">{diagnosis.advice_kannada}</p>
                    </div>

                    <div>
                      <p className="font-medium mb-2">ಪರಿಹಾರ ಕ್ರಮಗಳು:</p>
                      <ul className="text-sm space-y-1">
                        {diagnosis.remedies.map((remedy: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            {remedy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>

                  {diagnosis.confidence < 70 && (
                    <Card className="p-4 border-warning/50 bg-warning/5">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 text-warning mr-2" />
                        <h4 className="font-medium text-warning">ಕಡಿಮೆ ವಿಶ್ವಾಸ</h4>
                      </div>
                      <p className="text-sm mb-3">
                        ನಿಖರ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={connectToHuman}
                      >
                        ತಜ್ಞರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ
                      </Button>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </Card>
      </div>
    </div>
  );
};

export default CameraInterface;