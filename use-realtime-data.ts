import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { type TripUpdate, type VehiclePosition, type ServiceAlert } from "@shared/schema";

// Optimized hook for real-time data updates with background refresh
export function useRealtimeData() {
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout>();

  // Vehicle positions - updates every 30 seconds
  const vehicleQuery = useQuery<VehiclePosition[]>({
    queryKey: ["/api/vehicles"],
    refetchInterval: 30000,
    staleTime: 15000, // Consider stale after 15 seconds
  });

  // Service alerts - updates every 2 minutes
  const alertsQuery = useQuery<ServiceAlert[]>({
    queryKey: ["/api/alerts"],
    refetchInterval: 2 * 60 * 1000, // 2 minutes
    staleTime: 60000, // Consider stale after 1 minute
  });

  // Background refresh when app becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Invalidate real-time queries when app becomes visible
        queryClient.invalidateQueries({ 
          predicate: (query) => {
            const key = query.queryKey[0] as string;
            return key?.includes('/api/vehicles') || 
                   key?.includes('/api/arrivals') || 
                   key?.includes('/api/alerts');
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [queryClient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    vehicles: vehicleQuery.data || [],
    alerts: alertsQuery.data || [],
    isLoading: vehicleQuery.isLoading || alertsQuery.isLoading,
    error: vehicleQuery.error || alertsQuery.error,
  };
}

// Hook for arrival times with optimized refresh rate
export function useArrivalTimes(stopId: string) {
  return useQuery<TripUpdate[]>({
    queryKey: ["/api/arrivals/stop", stopId],
    refetchInterval: 30000, // 30 seconds for real-time arrivals
    staleTime: 15000, // Consider stale after 15 seconds
    retry: 2,
    enabled: !!stopId, // Only run if stopId is provided
  });
}