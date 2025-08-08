import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center", className)} data-testid="loading-spinner">
      <div className="flex items-center space-x-2">
        <Loader2 className={cn("animate-spin text-nsw-blue", sizeClasses[size])} />
        {text && <span className="text-sm text-gray-400">{text}</span>}
      </div>
    </div>
  );
}

export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}