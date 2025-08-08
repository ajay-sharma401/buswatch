import { useQuery } from "@tanstack/react-query";
import { Clock, Navigation, AlertCircle } from "lucide-react";
import { type TripUpdate, type BusRoute } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface StopArrivalsProps {
  stopId: string;
  stopName?: string;
  limit?: number;
  showHeader?: boolean;
}

interface ArrivalWithRoute extends TripUpdate {
  route?: BusRoute;
}

export default function StopArrivals({ stopId, stopName, limit = 5, showHeader = true }: StopArrivalsProps) {
  const { data: arrivals, isLoading, error } = useQuery<TripUpdate[]>({
    queryKey: ["/api/arrivals/stop", stopId],
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2, // Retry failed requests for better reliability
    staleTime: 15000, // Consider data stale after 15 seconds for real-time updates
  });

  const { data: routes } = useQuery<BusRoute[]>({
    queryKey: ["/api/routes"],
    staleTime: 5 * 60 * 1000, // Routes don't change often, cache for 5 minutes
  });

  // Combine arrivals with route information
  const arrivalsWithRoutes: ArrivalWithRoute[] = (arrivals || [])
    .map(arrival => ({
      ...arrival,
      route: routes?.find(route => route.id === arrival.routeId)
    }))
    .filter(arrival => arrival.arrivalTime) // Only show arrivals with times
    .sort((a, b) => {
      if (!a.arrivalTime || !b.arrivalTime) return 0;
      return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
    })
    .slice(0, limit);

  const formatETA = (arrivalTime: Date | null) => {
    if (!arrivalTime) return "Unknown";
    
    const now = new Date();
    const arrival = new Date(arrivalTime);
    const diffMs = arrival.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    
    if (diffMinutes <= 0) {
      return "Due";
    } else if (diffMinutes === 1) {
      return "1 min";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3" data-testid={`arrivals-loading-${stopId}`}>
        {showHeader && (
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white">Next Arrivals</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Updating...</span>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-3 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-gray-700 rounded"></div>
                    <div className="h-3 w-16 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-12 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3" data-testid={`arrivals-error-${stopId}`}>
        {showHeader && (
          <h3 className="font-medium text-white">Next Arrivals</h3>
        )}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400 text-sm">Unable to load arrival times</p>
          <p className="text-gray-400 text-xs mt-1">Please check your connection</p>
        </div>
      </div>
    );
  }

  if (!arrivals || arrivalsWithRoutes.length === 0) {
    return (
      <div className="space-y-3" data-testid={`arrivals-empty-${stopId}`}>
        {showHeader && (
          <h3 className="font-medium text-white">Next Arrivals</h3>
        )}
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Clock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No upcoming arrivals</p>
          <p className="text-gray-500 text-xs mt-1">Check back in a few minutes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid={`arrivals-${stopId}`}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white" data-testid={`text-arrivals-heading-${stopId}`}>
            Next Arrivals {stopName && `- ${stopName}`}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400" data-testid={`text-live-status-${stopId}`}>Live</span>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {arrivalsWithRoutes.map((arrival, index) => {
          const eta = formatETA(arrival.arrivalTime);
          const isRealtime = arrival.isRealtime;
          const hasDelay = arrival.delay && arrival.delay > 60; // More than 1 minute delay
          
          return (
            <div 
              key={arrival.id} 
              className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors"
              data-testid={`card-arrival-${arrival.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: arrival.route?.color || "#1565C0" }}
                    data-testid={`badge-route-${arrival.routeId}`}
                  >
                    {arrival.route?.routeNumber || arrival.routeId}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-white" data-testid={`text-route-name-${arrival.id}`}>
                      {arrival.route?.routeName || `Route ${arrival.routeId}`}
                    </p>
                    <div className="flex items-center space-x-2 text-xs">
                      {arrival.route?.isNightService && (
                        <span className="text-yellow-400" data-testid={`text-night-service-${arrival.id}`}>
                          Night Service
                        </span>
                      )}
                      {hasDelay && (
                        <div className="flex items-center space-x-1 text-orange-400">
                          <AlertCircle className="h-3 w-3" />
                          <span data-testid={`text-delay-${arrival.id}`}>
                            {Math.round((arrival.delay || 0) / 60)} min delay
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p 
                    className={`font-bold text-lg ${
                      eta === "Due" 
                        ? "text-red-400" 
                        : isRealtime 
                        ? "text-green-400" 
                        : "text-yellow-400"
                    }`}
                    data-testid={`text-eta-${arrival.id}`}
                  >
                    {eta}
                  </p>
                  <div className="flex items-center space-x-1 text-xs">
                    {isRealtime ? (
                      <span className="text-green-400" data-testid={`text-realtime-${arrival.id}`}>Real-time</span>
                    ) : (
                      <span className="text-gray-400" data-testid={`text-scheduled-${arrival.id}`}>Scheduled</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {arrivals && arrivals.length > limit && (
        <button 
          className="w-full text-center py-2 text-sm text-nsw-blue hover:text-blue-300 transition-colors"
          data-testid={`button-show-more-${stopId}`}
        >
          Show {arrivals.length - limit} more arrivals
        </button>
      )}
    </div>
  );
}