import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VoicePlayerProps {
  text: string;
  language: string;
  autoPlay?: boolean;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
}

const VoicePlayer = ({ text, language, autoPlay = false, onPlayStart, onPlayEnd }: VoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([0.8]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playText = async () => {
    if (!text) return;

    try {
      setIsPlaying(true);
      onPlayStart?.();

      // In demo mode, use Web Speech API
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
        utterance.volume = isMuted ? 0 : volume[0];
        
        utterance.onend = () => {
          setIsPlaying(false);
          onPlayEnd?.();
        };
        
        utterance.onerror = () => {
          setIsPlaying(false);
          onPlayEnd?.();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback: Call backend TTS API
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language })
        });

        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.volume = isMuted ? 0 : volume[0];
            audioRef.current.play();
          }
        } else {
          throw new Error('TTS service unavailable');
        }
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
      onPlayEnd?.();
    }
  };

  const stopPlayback = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    onPlayEnd?.();
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      playText();
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <Button
        size="sm"
        variant="outline"
        onClick={togglePlayback}
        disabled={!text}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <div className="flex items-center gap-2 flex-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>

        <Slider
          value={volume}
          onValueChange={setVolume}
          max={1}
          min={0}
          step={0.1}
          className="flex-1"
        />
      </div>

      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          onPlayEnd?.();
        }}
        onError={() => {
          setIsPlaying(false);
          onPlayEnd?.();
        }}
      />
    </div>
  );
};

export default VoicePlayer;