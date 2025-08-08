import SearchBar from "@/components/bus/search-bar";
import ServiceAlerts from "@/components/bus/service-alerts";
import QuickActions from "@/components/bus/quick-actions";
import LiveMap from "@/components/bus/live-map";
import FavoriteStops from "@/components/bus/favorite-stops";
import NightServices from "@/components/bus/night-services";
import RecentSearches from "@/components/bus/recent-searches";
import StopArrivals from "@/components/bus/stop-arrivals";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Suspense } from "react";

// Loading skeleton for components
function ComponentSkeleton({ height = "h-24" }: { height?: string }) {
  return (
    <div className={`animate-pulse bg-gray-800 rounded-lg ${height} mx-4 mb-4`}>
      <div className="p-4">
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <ErrorBoundary fallback={<ComponentSkeleton height="h-16" />}>
        <Suspense fallback={<ComponentSkeleton height="h-16" />}>
          <SearchBar />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<ComponentSkeleton height="h-20" />}>
        <Suspense fallback={<ComponentSkeleton height="h-20" />}>
          <ServiceAlerts />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<ComponentSkeleton height="h-32" />}>
        <Suspense fallback={<ComponentSkeleton height="h-32" />}>
          <QuickActions />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<ComponentSkeleton height="h-48" />}>
        <Suspense fallback={<ComponentSkeleton height="h-48" />}>
          <LiveMap />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<ComponentSkeleton height="h-32" />}>
        <Suspense fallback={<ComponentSkeleton height="h-32" />}>
          <FavoriteStops />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<ComponentSkeleton height="h-40" />}>
        <Suspense fallback={<ComponentSkeleton height="h-40" />}>
          <div className="px-4 mb-4">
            <StopArrivals 
              stopId="200060" 
              stopName="Central Station - Eddy Ave"
              limit={4}
              showHeader={true}
            />
          </div>
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<ComponentSkeleton height="h-32" />}>
        <Suspense fallback={<ComponentSkeleton height="h-32" />}>
          <NightServices />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<ComponentSkeleton height="h-24" />}>
        <Suspense fallback={<ComponentSkeleton height="h-24" />}>
          <RecentSearches />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
