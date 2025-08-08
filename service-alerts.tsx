import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { type ServiceAlert } from "@shared/schema";

export default function ServiceAlerts() {
  const { data: alerts, isLoading } = useQuery<ServiceAlert[]>({
    queryKey: ["/api/alerts"],
  });

  const activeAlerts = alerts?.filter(alert => alert.isActive) || [];

  if (isLoading || activeAlerts.length === 0) {
    return null;
  }

  return (
    <div>
      {activeAlerts.map((alert) => (
        <div 
          key={alert.id}
          className={`px-4 py-3 border-b ${
            alert.severity === "critical" 
              ? "bg-red-900 border-red-700" 
              : alert.severity === "warning"
              ? "bg-orange-900 border-orange-700"
              : "bg-blue-900 border-blue-700"
          }`}
          data-testid={`alert-${alert.id}`}
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle 
              className={`mt-1 h-4 w-4 ${
                alert.severity === "critical" 
                  ? "text-red-400" 
                  : alert.severity === "warning"
                  ? "text-orange-400"
                  : "text-blue-400"
              }`} 
            />
            <div className="flex-1">
              <h3 className={`font-medium ${
                alert.severity === "critical" 
                  ? "text-red-100" 
                  : alert.severity === "warning"
                  ? "text-orange-100"
                  : "text-blue-100"
              }`} data-testid={`text-alert-title-${alert.id}`}>
                {alert.title}
              </h3>
              <p className={`text-sm mt-1 ${
                alert.severity === "critical" 
                  ? "text-red-200" 
                  : alert.severity === "warning"
                  ? "text-orange-200"
                  : "text-blue-200"
              }`} data-testid={`text-alert-description-${alert.id}`}>
                {alert.description}
              </p>
              <span className={`text-xs ${
                alert.severity === "critical" 
                  ? "text-red-300" 
                  : alert.severity === "warning"
                  ? "text-orange-300"
                  : "text-blue-300"
              }`} data-testid={`text-alert-timestamp-${alert.id}`}>
                Updated {alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString() : 'recently'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
