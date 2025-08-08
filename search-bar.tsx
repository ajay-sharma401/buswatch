import { useState } from "react";
import { Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type InsertRecentSearch } from "@shared/schema";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const saveSearchMutation = useMutation({
    mutationFn: async (searchData: InsertRecentSearch) => {
      await apiRequest("POST", "/api/searches", searchData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/searches/recent"] });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveSearchMutation.mutate({
        query: searchQuery.trim(),
        searchType: "route",
        metadata: { source: "search_bar" },
      });
      // Navigate to search page with query
      // This would be implemented with wouter navigation
      console.log("Search for:", searchQuery);
    }
  };

  return (
    <div className="px-4 py-3 bg-surface-dark border-b border-gray-700">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search routes, stops, or destinations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-nsw-blue focus:outline-none text-base"
          data-testid="input-search-bar"
        />
      </form>
    </div>
  );
}
