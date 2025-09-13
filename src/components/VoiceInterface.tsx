import { useState, useRef } from "react";
import { Mic, MicOff, ArrowLeft, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VoiceInterfaceProps {
  onBack: () => void;
}

const VoiceInterface = ({ onBack }: VoiceInterfaceProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        processAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    
    // Demo mode response
    setTimeout(() => {
      setTranscript("ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?");
      setResponse("ಇಂದು ಟೊಮೇಟೊ ಬೆಲೆ ಪ್ರತಿ ಕಿಲೋಗೆ ₹25-30. ಬೆಂಗಳೂರು ಮಂಡಿಯಲ್ಲಿ ಉತ್ತಮ ಬೆಲೆ ಸಿಗುತ್ತದೆ.");
      setIsProcessing(false);
    }, 2000);
  };

  const playResponse = () => {
    // Text-to-speech would be implemented here
    console.log("Playing response:", response);
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
            ಧ್ವನಿ ಸಹಾಯಕ
          </h2>
          <p className="text-muted-foreground">
            Voice Assistant
          </p>
        </div>

        <Card className="p-6 text-center">
          <div className="mb-6">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className={`w-24 h-24 rounded-full ${
                isRecording ? "animate-pulse" : ""
              }`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isRecording ? (
                <MicOff size={32} />
              ) : (
                <Mic size={32} />
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {isRecording
              ? "ರೆಕಾರ್ಡಿಂಗ್... ಮಾತನಾಡಿ"
              : isProcessing
              ? "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ..."
              : "ಮಾತನಾಡಲು ಒತ್ತಿ"}
          </p>

          {transcript && (
            <Card className="p-3 bg-muted mb-4">
              <p className="text-sm font-medium">ನೀವು ಹೇಳಿದ್ದು:</p>
              <p className="text-foreground">{transcript}</p>
            </Card>
          )}

          {response && (
            <Card className="p-3 bg-primary/10 border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">ಉತ್ತರ:</p>
                <Button size="sm" variant="ghost" onClick={playResponse}>
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-foreground text-left">{response}</p>
            </Card>
          )}
        </Card>

        <Card className="p-4 bg-muted/50">
          <h3 className="font-medium mb-2">ಉದಾಹರಣೆ ಪ್ರಶ್ನೆಗಳು:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• "ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?"</li>
            <li>• "ಧಾನ್ಯ ಸಬ್ಸಿಡಿ ಯೋಜನೆ"</li>
            <li>• "ಮಳೆ ಬರುತ್ತದೆಯೇ?"</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default VoiceInterface;