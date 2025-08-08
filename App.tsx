import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import Header from "@/components/layout/header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import Home from "@/pages/home";
import MapPage from "@/pages/map";
import SearchPage from "@/pages/search";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/map" component={MapPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-900 text-white night-optimized">
            <Header />
            <main className="pb-20 min-h-[calc(100vh-5rem)]">
              <ErrorBoundary>
                <Router />
              </ErrorBoundary>
            </main>
            <BottomNavigation />
            <Toaster />
          </div>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
