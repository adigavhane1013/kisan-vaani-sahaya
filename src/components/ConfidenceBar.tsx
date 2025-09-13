import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

interface ConfidenceBarProps {
  confidence: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const ConfidenceBar = ({ confidence, showIcon = true, size = "md" }: ConfidenceBarProps) => {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return { color: "text-success", bg: "bg-success" };
    if (conf >= 60) return { color: "text-warning", bg: "bg-warning" };
    return { color: "text-destructive", bg: "bg-destructive" };
  };

  const getConfidenceIcon = (conf: number) => {
    if (conf >= 80) return CheckCircle;
    if (conf >= 60) return TrendingUp;
    return AlertCircle;
  };

  const { color, bg } = getConfidenceColor(confidence);
  const Icon = getConfidenceIcon(confidence);
  
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showIcon && <Icon className={`h-4 w-4 ${color}`} />}
          <span className="text-sm font-medium">Confidence</span>
        </div>
        <span className={`text-sm font-semibold ${color}`}>
          {Math.round(confidence)}%
        </span>
      </div>
      
      <div className="relative">
        <Progress 
          value={confidence} 
          className={`${sizeClasses[size]}`}
        />
        <div 
          className={`absolute top-0 left-0 h-full ${bg} rounded-full transition-all duration-300`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      
      <div className="text-xs text-muted-foreground">
        {confidence >= 80 && "High confidence - diagnosis reliable"}
        {confidence >= 60 && confidence < 80 && "Medium confidence - consider expert consultation"}
        {confidence < 60 && "Low confidence - expert consultation recommended"}
      </div>
    </div>
  );
};

export default ConfidenceBar;