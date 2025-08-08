import { MapPin, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationPermissionProps {
  onRetry: () => void;
  error?: string;
  isRetrying?: boolean;
}

export default function LocationPermission({ onRetry, error, isRetrying }: LocationPermissionProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 text-center" data-testid="location-permission-card">
      <div className="flex items-center justify-center mb-3">
        {error?.includes("denied") ? (
          <AlertCircle className="h-8 w-8 text-orange-400" />
        ) : (
          <MapPin className="h-8 w-8 text-gray-400" />
        )}
      </div>
      
      <h3 className="font-medium text-white mb-2" data-testid="text-location-title">
        Location Access
      </h3>
      
      <p className="text-sm text-gray-300 mb-4" data-testid="text-location-message">
        {error || "Allow location access to find nearby bus stops automatically."}
      </p>
      
      {error?.includes("denied") && (
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-300" data-testid="text-location-help">
            To enable location: Click the location icon in your browser's address bar, 
            then select "Allow" and refresh the page.
          </p>
        </div>
      )}
      
      <Button
        onClick={onRetry}
        disabled={isRetrying}
        className="bg-nsw-blue hover:bg-blue-700 disabled:opacity-50"
        data-testid="button-retry-location"
      >
        {isRetrying ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Getting Location...
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4 mr-2" />
            {error?.includes("denied") ? "Try Again" : "Allow Location Access"}
          </>
        )}
      </Button>
    </div>
  );
}