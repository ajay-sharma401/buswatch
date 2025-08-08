import { MapPin, Star } from "lucide-react";
import useLocation from "@/hooks/use-location";
import { Button } from "@/components/ui/button";
import LocationPermission from "@/components/ui/location-permission";
import { useState } from "react";

export default function QuickActions() {
  const { requestLocation, isLoading, error } = useLocation();
  const [showLocationCard, setShowLocationCard] = useState(false);

  const handleNearbyStops = async () => {
    try {
      await requestLocation();
      // Navigate to nearby stops or show in current view
      console.log("Finding nearby stops...");
      setShowLocationCard(false);
    } catch (error) {
      console.error("Failed to get location:", error);
      setShowLocationCard(true);
    }
  };

  const handleFavorites = () => {
    // Navigate to favorites view or expand favorites section
    console.log("Show favorites");
  };

  if (showLocationCard && error) {
    return (
      <div className="px-4 py-4">
        <LocationPermission
          onRetry={() => {
            setShowLocationCard(false);
            handleNearbyStops();
          }}
          error={error.message}
          isRetrying={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleNearbyStops}
          disabled={isLoading}
          className="bg-nsw-blue hover:bg-blue-700 p-4 h-auto flex-col items-start text-left"
          data-testid="button-nearby-stops"
        >
          <MapPin className="text-white mb-2 h-5 w-5" />
          <p className="font-medium text-white">
            {isLoading ? "Finding..." : "Nearby Stops"}
          </p>
          <p className="text-sm text-blue-100">Find buses near you</p>
        </Button>
        
        <Button
          onClick={handleFavorites}
          variant="secondary"
          className="bg-surface-light hover:bg-gray-600 p-4 h-auto flex-col items-start text-left"
          data-testid="button-favorites"
        >
          <Star className="text-yellow-400 mb-2 h-5 w-5" />
          <p className="font-medium text-white">Favorites</p>
          <p className="text-sm text-gray-300">Quick access routes</p>
        </Button>
      </div>
    </div>
  );
}
