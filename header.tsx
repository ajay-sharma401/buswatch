import { useState } from "react";
import { Bus, Moon, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [nightModeActive, setNightModeActive] = useState(true);

  return (
    <header className="bg-surface-dark shadow-lg sticky top-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-nsw-blue rounded-lg flex items-center justify-center">
              <Bus className="text-white h-4 w-4" />
            </div>
            <h1 className="text-xl font-semibold text-white" data-testid="text-app-title">
              NightRider
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setNightModeActive(!nightModeActive)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
                nightModeActive
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-700 text-gray-300"
              }`}
              data-testid="button-night-mode"
            >
              <Moon className="h-3 w-3" />
              <span className="text-xs font-medium">
                {nightModeActive ? "Night Mode" : "All Services"}
              </span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-700 text-gray-300"
              data-testid="button-settings"
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
