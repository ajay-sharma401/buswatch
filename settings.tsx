import { useState } from "react";
import { Settings, Moon, Bell, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const [nightModeOnly, setNightModeOnly] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleClearFavorites = () => {
    // TODO: Implement clear favorites functionality
    console.log("Clear favorites");
  };

  const handleClearSearchHistory = () => {
    // TODO: Implement clear search history functionality
    console.log("Clear search history");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-6">
        <Settings className="h-12 w-12 text-nsw-blue mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white" data-testid="text-settings-title">Settings</h1>
        <p className="text-gray-400" data-testid="text-settings-subtitle">
          Customize your NightRider experience
        </p>
      </div>

      <Card className="bg-surface-dark border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Moon className="h-5 w-5" />
            <span data-testid="text-night-mode-heading">Night Mode Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium" data-testid="text-night-only-label">Night Services Only (1-4 AM)</p>
              <p className="text-sm text-gray-400" data-testid="text-night-only-description">
                Show only night bus routes and services
              </p>
            </div>
            <Switch
              checked={nightModeOnly}
              onCheckedChange={setNightModeOnly}
              data-testid="switch-night-mode"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium" data-testid="text-auto-refresh-label">Auto Refresh</p>
              <p className="text-sm text-gray-400" data-testid="text-auto-refresh-description">
                Automatically update bus times every 30 seconds
              </p>
            </div>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
              data-testid="switch-auto-refresh"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface-dark border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span data-testid="text-notifications-heading">Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium" data-testid="text-notifications-label">Service Alerts</p>
              <p className="text-sm text-gray-400" data-testid="text-notifications-description">
                Get notified about delays and service disruptions
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
              data-testid="switch-notifications"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface-dark border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span data-testid="text-location-heading">Location Services</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium" data-testid="text-location-label">Share Location</p>
              <p className="text-sm text-gray-400" data-testid="text-location-description">
                Find nearby bus stops automatically
              </p>
            </div>
            <Switch
              checked={locationSharing}
              onCheckedChange={setLocationSharing}
              data-testid="switch-location"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface-dark border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Trash2 className="h-5 w-5" />
            <span data-testid="text-data-heading">Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={handleClearFavorites}
            className="w-full justify-start border-gray-600 text-white hover:bg-gray-700"
            data-testid="button-clear-favorites"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Favorite Stops
          </Button>
          <Button
            variant="outline"
            onClick={handleClearSearchHistory}
            className="w-full justify-start border-gray-600 text-white hover:bg-gray-700"
            data-testid="button-clear-history"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Search History
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-surface-dark border-gray-700">
        <CardHeader>
          <CardTitle className="text-white" data-testid="text-about-heading">About NightRider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-gray-400" data-testid="text-app-version">Version 1.0.0</p>
          <p className="text-gray-400" data-testid="text-app-description">
            Real-time bus tracking for NSW night shift workers
          </p>
          <p className="text-sm text-gray-500" data-testid="text-data-source">
            Data provided by Transport for NSW
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
