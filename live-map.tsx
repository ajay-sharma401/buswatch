import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { type VehiclePosition } from "@shared/schema";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React Leaflet
import L from "leaflet";

let DefaultIcon = L.divIcon({
  html: '<div class="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>',
  iconSize: [12, 12],
  className: 'custom-div-icon'
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function LiveMap() {
  const { data: vehicles, isLoading } = useQuery<VehiclePosition[]>({
    queryKey: ["/api/vehicles"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const sydneyCenter: LatLngExpression = [-33.8688, 151.2093];

  if (isLoading) {
    return (
      <div className="px-4 mb-4">
        <div className="bg-surface-dark rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h2 className="font-semibold text-white" data-testid="text-map-title">Live Bus Locations</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300" data-testid="text-live-status">Live</span>
            </div>
          </div>
          <div className="h-64 bg-gray-800 relative flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-nsw-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400" data-testid="text-map-loading">Loading map...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-4">
      <div className="bg-surface-dark rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="font-semibold text-white" data-testid="text-map-title">Live Bus Locations</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300" data-testid="text-live-status">Live</span>
          </div>
        </div>
        <div className="h-64 relative" data-testid="container-map">
          {vehicles && vehicles.length > 0 ? (
            <MapContainer
              center={sydneyCenter}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {vehicles.map((vehicle) => (
                <Marker
                  key={vehicle.id}
                  position={[vehicle.latitude, vehicle.longitude]}
                  data-testid={`marker-vehicle-${vehicle.vehicleId}`}
                >
                  <Popup>
                    <div className="text-black">
                      <p className="font-semibold">Bus {vehicle.vehicleId}</p>
                      <p>Route: {vehicle.routeId}</p>
                      {vehicle.speed && <p>Speed: {vehicle.speed} km/h</p>}
                      <p className="text-xs text-gray-600">
                        Updated: {new Date(vehicle.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <p className="text-gray-400" data-testid="text-no-vehicles">No live vehicles available</p>
                <p className="text-xs text-gray-500 mt-1" data-testid="text-data-source">NSW Real-time GTFS Vehicle Positions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
