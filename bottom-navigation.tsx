import { useLocation } from "wouter";
import { Home, Map, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Map, label: "Map", path: "/map" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-dark/95 backdrop-blur-sm border-t border-gray-600 z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto px-2">
        {navigationItems.map(({ icon: Icon, label, path }) => {
          const isActive = location === path;
          return (
            <button
              key={path}
              onClick={() => setLocation(path)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-all duration-200 rounded-xl m-1 min-h-[44px]",
                isActive
                  ? "text-nsw-blue bg-blue-500/10 scale-105 shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50 active:scale-95"
              )}
              data-testid={`nav-${label.toLowerCase()}`}
            >
              <Icon className={cn("transition-all", isActive ? "h-6 w-6" : "h-5 w-5")} />
              <span className={cn("text-xs transition-all", isActive ? "font-semibold" : "font-medium")}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
