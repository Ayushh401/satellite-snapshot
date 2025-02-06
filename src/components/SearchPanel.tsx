import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchPanelProps {
  onRegionSelect: (region: string) => void;
}

const SearchPanel = ({ onRegionSelect }: SearchPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onRegionSelect(searchQuery);
    }
  };

  return (
    <div className="p-6 rounded-lg bg-space-light/20 backdrop-blur-sm animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Search Region</h2>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter region name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
        <Button 
          onClick={handleSearch}
          className="w-full bg-ocean hover:bg-ocean-light transition-colors"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchPanel;