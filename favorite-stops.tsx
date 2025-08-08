import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Clock } from "lucide-react";
import { type FavoriteStop, type BusStop, type TripUpdate, type BusRoute } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FavoriteStopWithDetails extends FavoriteStop {
  stop?: BusStop;
  arrivals?: Array<TripUpdate & { route?: BusRoute }>;
}

export default function FavoriteStops() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites } = useQuery<FavoriteStop[]>({
    queryKey: ["/api/favorites"],
  });

  const { data: stops } = useQuery<BusStop[]>({
    queryKey: ["/api/stops"],
  });

  const { data: routes } = useQuery<BusRoute[]>({
    queryKey: ["/api/routes"],
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (stopId: string) => {
      await apiRequest("DELETE", `/api/favorites/${stopId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from favorites",
        description: "Stop removed from your favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove stop from favorites",
        variant: "destructive",
      });
    },
  });

  // Combine favorites with stop details
  const favoritesWithDetails: FavoriteStopWithDetails[] = favorites?.map(fav => ({
    ...fav,
    stop: stops?.find(stop => stop.id === fav.stopId),
  })) || [];

  const handleRemoveFavorite = (stopId: string) => {
    removeFavoriteMutation.mutate(stopId);
  };

  if (!favorites || favorites.length === 0) {
    return (
      <div className="px-4 mb-4">
        <h2 className="font-semibold mb-3 text-white" data-testid="text-favorites-heading">Your Favorite Stops</h2>
        <div className="bg-surface-dark rounded-lg p-6 text-center">
          <Star className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2" data-testid="text-no-favorites">No favorite stops yet</h3>
          <p className="text-gray-500" data-testid="text-no-favorites-description">
            Add stops to your favorites for quick access to arrival times
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-4">
      <h2 className="font-semibold mb-3 text-white" data-testid="text-favorites-heading">Your Favorite Stops</h2>
      <div className="space-y-3">
        {favoritesWithDetails.map((favorite) => (
          <div key={favorite.id} className="bg-surface-dark rounded-lg overflow-hidden" data-testid={`card-favorite-${favorite.stopId}`}>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium text-white" data-testid={`text-stop-name-${favorite.stopId}`}>
                    {favorite.stop?.name || "Unknown Stop"}
                  </h3>
                  <p className="text-sm text-gray-400" data-testid={`text-stop-id-${favorite.stopId}`}>
                    Stop ID: {favorite.stopId}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFavorite(favorite.stopId)}
                  className="text-yellow-400 hover:text-yellow-300"
                  disabled={removeFavoriteMutation.isPending}
                  data-testid={`button-remove-favorite-${favorite.stopId}`}
                >
                  <Star className="h-4 w-4 fill-current" />
                </Button>
              </div>
              
              {/* Mock arrival times for demonstration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold" data-testid="text-route-number">380</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white" data-testid="text-route-destination">Circular Quay</p>
                      <p className="text-xs text-gray-400" data-testid="text-route-headsign">via Elizabeth St</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-400" data-testid="text-arrival-time">3 min</p>
                    <p className="text-xs text-gray-400" data-testid="text-arrival-confidence">Real-time</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold" data-testid="text-route-number">N10</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white" data-testid="text-route-destination">Leichhardt</p>
                      <p className="text-xs text-gray-400" data-testid="text-route-headsign">Night Service</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-yellow-400" data-testid="text-arrival-time">12 min</p>
                    <p className="text-xs text-gray-400" data-testid="text-arrival-confidence">Scheduled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
