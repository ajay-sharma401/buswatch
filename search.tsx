import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Clock, Star, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { type BusStop, type BusRoute } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StopArrivals from "@/components/bus/stop-arrivals";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "stops" | "routes">("all");
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());

  const { data: stops, isLoading: stopsLoading } = useQuery<BusStop[]>({
    queryKey: ["/api/stops"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const { data: routes, isLoading: routesLoading } = useQuery<BusRoute[]>({
    queryKey: ["/api/routes"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Optimized search with memoization and result limits
  const filteredStops = useMemo(() => {
    if (!stops || !searchQuery) return [];
    return stops.filter(stop =>
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.suburb?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.id.includes(searchQuery)
    ).slice(0, 20); // Limit results for performance
  }, [stops, searchQuery]);

  const filteredRoutes = useMemo(() => {
    if (!routes || !searchQuery) return [];
    return routes.filter(route =>
      route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.routeName.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 20); // Limit results for performance
  }, [routes, searchQuery]);

  const showStops = searchType === "all" || searchType === "stops";
  const showRoutes = searchType === "all" || searchType === "routes";

  const toggleStopExpanded = (stopId: string) => {
    setExpandedStops(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stopId)) {
        newSet.delete(stopId);
      } else {
        newSet.add(stopId);
      }
      return newSet;
    });
  };

  const isLoading = stopsLoading || routesLoading;

  return (
    <ErrorBoundary>
      <div className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search routes, stops, or destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-nsw-blue text-base h-12 transition-colors"
              data-testid="input-search"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-nsw-blue" />
              </div>
            )}
          </div>

        <div className="flex space-x-2">
          <Button
            variant={searchType === "all" ? "default" : "outline"}
            onClick={() => setSearchType("all")}
            className={`transition-all ${searchType === "all" ? "bg-nsw-blue hover:bg-blue-700 scale-105" : "hover:bg-gray-700"}`}
            data-testid="button-filter-all"
            disabled={isLoading}
          >
            All ({(filteredStops.length + filteredRoutes.length) || 0})
          </Button>
          <Button
            variant={searchType === "stops" ? "default" : "outline"}
            onClick={() => setSearchType("stops")}
            className={`transition-all ${searchType === "stops" ? "bg-nsw-blue hover:bg-blue-700 scale-105" : "hover:bg-gray-700"}`}
            data-testid="button-filter-stops"
            disabled={isLoading}
          >
            Stops ({filteredStops.length || 0})
          </Button>
          <Button
            variant={searchType === "routes" ? "default" : "outline"}
            onClick={() => setSearchType("routes")}
            className={`transition-all ${searchType === "routes" ? "bg-nsw-blue hover:bg-blue-700 scale-105" : "hover:bg-gray-700"}`}
            data-testid="button-filter-routes"
            disabled={isLoading}
          >
            Routes ({filteredRoutes.length || 0})
          </Button>
        </div>
      </div>

      {isLoading && searchQuery && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-lg p-4 mx-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery && !isLoading && (
        <div className="space-y-4">
          {showStops && filteredStops.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 text-white" data-testid="text-stops-heading">Bus Stops</h2>
              <div className="space-y-2">
                {filteredStops.map((stop) => {
                  const isExpanded = expandedStops.has(stop.id);
                  return (
                    <div
                      key={stop.id}
                      className="bg-surface-dark rounded-lg overflow-hidden"
                      data-testid={`card-stop-${stop.id}`}
                    >
                      <div className="p-4 hover:bg-gray-700 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <MapPin className="text-gray-400 mt-1 h-4 w-4" />
                            <div>
                              <h3 className="font-medium text-white" data-testid={`text-stop-name-${stop.id}`}>
                                {stop.name}
                              </h3>
                              <p className="text-sm text-gray-400" data-testid={`text-stop-id-${stop.id}`}>
                                Stop ID: {stop.id}
                              </p>
                              {stop.suburb && (
                                <p className="text-sm text-gray-400" data-testid={`text-stop-suburb-${stop.id}`}>
                                  {stop.suburb}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-yellow-400 hover:text-yellow-300"
                              data-testid={`button-favorite-${stop.id}`}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStopExpanded(stop.id)}
                              className="text-gray-400 hover:text-white"
                              data-testid={`button-toggle-arrivals-${stop.id}`}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-700">
                          <div className="pt-4">
                            <StopArrivals 
                              stopId={stop.id} 
                              limit={3}
                              showHeader={false}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {showRoutes && filteredRoutes.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 text-white" data-testid="text-routes-heading">Bus Routes</h2>
              <div className="space-y-2">
                {filteredRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="bg-surface-dark rounded-lg p-4 hover:bg-gray-700 transition-colors"
                    data-testid={`card-route-${route.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: route.color || "#1565C0" }}
                        data-testid={`badge-route-${route.id}`}
                      >
                        {route.routeNumber}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white" data-testid={`text-route-name-${route.id}`}>
                          {route.routeName}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm">
                          {route.isNightService && (
                            <span className="text-yellow-400" data-testid={`text-night-service-${route.id}`}>
                              Night Service
                            </span>
                          )}
                          <span
                            className={`${
                              route.status === "active"
                                ? "text-green-400"
                                : route.status === "limited"
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                            data-testid={`text-route-status-${route.id}`}
                          >
                            {route.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery && filteredStops.length === 0 && filteredRoutes.length === 0 && (
            <div className="text-center py-8" data-testid="container-no-results">
              <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No results found</h3>
              <p className="text-gray-500">Try searching for a different route or stop</p>
            </div>
          )}
        </div>
      )}

      {!searchQuery && !isLoading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Search for Bus Information</h3>
          <p className="text-gray-400 text-sm">
            Enter a route number, stop name, or destination to get started
          </p>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
}
