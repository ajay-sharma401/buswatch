import { useState, useCallback } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
}

interface LocationError {
  code: number;
  message: string;
}

export default function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = useCallback(async (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = { code: 0, message: "Geolocation is not supported by this browser." };
        setError(error);
        reject(error);
        return;
      }

      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(locationData);
          setIsLoading(false);
          resolve(locationData);
        },
        (error) => {
          let friendlyMessage = error.message;
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              friendlyMessage = "Location access was denied. You can still search for bus stops manually.";
              break;
            case error.POSITION_UNAVAILABLE:
              friendlyMessage = "Location information is unavailable. Please try again.";
              break;
            case error.TIMEOUT:
              friendlyMessage = "Location request timed out. Please try again.";
              break;
            default:
              friendlyMessage = "Unable to get your location. Please try again.";
              break;
          }
          
          const locationError = {
            code: error.code,
            message: friendlyMessage,
          };
          setError(locationError);
          setIsLoading(false);
          reject(locationError);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    error,
    isLoading,
    requestLocation,
    clearLocation,
  };
}
