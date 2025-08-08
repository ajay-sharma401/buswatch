import { useQuery } from "@tanstack/react-query";
import { Moon, Info } from "lucide-react";
import { type BusRoute } from "@shared/schema";

export default function NightServices() {
  const { data: nightRoutes, isLoading } = useQuery<BusRoute[]>({
    queryKey: ["/api/routes/night"],
  });

  if (isLoading) {
    return (
      <div className="px-4 mb-4">
        <h2 className="font-semibold mb-3 text-white" data-testid="text-night-services-heading">Night Services (1AM - 4AM)</h2>
        <div className="bg-surface-dark rounded-lg p-4">
          <div className="animate-pulse">
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-3 h-20"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-4">
      <h2 className="font-semibold mb-3 text-white" data-testid="text-night-services-heading">Night Services (1AM - 4AM)</h2>
      <div className="bg-surface-dark rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {nightRoutes?.map((route) => (
            <button
              key={route.id}
              className="bg-gray-800 rounded-lg p-3 text-center hover:bg-gray-700 transition-colors"
              data-testid={`card-night-route-${route.id}`}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm"
                style={{ backgroundColor: route.color || "#1565C0" }}
                data-testid={`badge-night-route-${route.id}`}
              >
                {route.routeNumber}
              </div>
              <p className="text-sm font-medium text-white" data-testid={`text-night-route-name-${route.id}`}>
                {route.routeName}
              </p>
              <p 
                className={`text-xs ${
                  route.status === "active" 
                    ? "text-green-400" 
                    : route.status === "limited"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
                data-testid={`text-night-route-status-${route.id}`}
              >
                {route.status}
              </p>
            </button>
          ))}
        </div>
        
        <div className="p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="text-blue-400 h-4 w-4" />
            <span className="text-sm font-medium text-white" data-testid="text-night-info-title">Night Service Information</span>
          </div>
          <p className="text-xs text-gray-300" data-testid="text-night-info-description">
            Night buses run limited schedules between 1:00 AM and 4:00 AM. Check real-time updates for accurate arrival times.
          </p>
        </div>
      </div>
    </div>
  );
}
