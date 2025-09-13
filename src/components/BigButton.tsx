import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface BigButtonProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const BigButton = ({ icon: Icon, title, subtitle, onClick, className, disabled }: BigButtonProps) => {
  return (
    <Card className={`p-6 hover:shadow-lg transition-all duration-200 ${className}`}>
      <Button
        onClick={onClick}
        disabled={disabled}
        className="w-full h-full min-h-[120px] flex flex-col gap-3 text-left bg-transparent hover:bg-primary/10 text-foreground"
        variant="ghost"
      >
        <Icon className="h-12 w-12 text-primary" />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </Button>
    </Card>
  );
};

export default BigButton;