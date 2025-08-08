import { useQuery } from "@tanstack/react-query";
import { Clock, ChevronRight } from "lucide-react";
import { type RecentSearch } from "@shared/schema";

export default function RecentSearches() {
  const { data: searches, isLoading } = useQuery<RecentSearch[]>({
    queryKey: ["/api/searches/recent"],
  });

  if (isLoading || !searches || searches.length === 0) {
    return null;
  }

  const handleSelectSearch = (search: RecentSearch) => {
    // Navigate to search results or perform search again
    console.log("Select search:", search.query);
  };

  const formatTimestamp = (timestamp: Date | null | undefined) => {
    if (!timestamp) return "Unknown";
    
    const now = new Date();
    const searchTime = new Date(timestamp);
    const diffMs = now.getTime() - searchTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)} hours ago`;
    } else {
      return searchTime.toLocaleDateString();
    }
  };

  return (
    <div className="px-4 mb-4">
      <h2 className="font-semibold mb-3 text-white" data-testid="text-recent-searches-heading">Recent Searches</h2>
      <div className="space-y-2">
        {searches.map((search) => (
          <button
            key={search.id}
            onClick={() => handleSelectSearch(search)}
            className="w-full bg-surface-dark rounded-lg p-3 text-left hover:bg-gray-700 transition-colors"
            data-testid={`button-recent-search-${search.id}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="text-gray-400 h-4 w-4" />
                <div>
                  <p className="font-medium text-sm text-white" data-testid={`text-search-query-${search.id}`}>
                    {search.query}
                  </p>
                  <p className="text-xs text-gray-400" data-testid={`text-search-timestamp-${search.id}`}>
                    {formatTimestamp(search.timestamp)}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-400 h-4 w-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
