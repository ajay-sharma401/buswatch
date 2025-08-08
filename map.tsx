import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { type VehiclePosition } from "@shared/schema";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React Leaflet
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.divIcon({
  html: '<i class="fas fa-bus text-blue-500 text-xl"></i>',
  iconSize: [25, 25],
  className: 'custom-div-icon'
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapPage() {
  const { data: vehicles, isLoading } = useQuery<VehiclePosition[]>({
    queryKey: ["/api/vehicles"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const sydneyCenter: LatLngExpression = [-33.8688, 151.2093];

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center" data-testid="map-loading">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-nsw-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900">
      <div className="px-4 py-3 bg-surface-dark border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold" data-testid="text-map-title">Live Bus Locations</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300" data-testid="text-live-status">Live</span>
          </div>
        </div>
      </div>
      
      <div className="h-full" data-testid="container-map">
        <MapContainer
          center={sydneyCenter}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {vehicles?.map((vehicle) => (
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
      </div>
    </div>
  );
}
