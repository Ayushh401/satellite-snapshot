import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SearchPanelProps {
  onRegionSelect: (region: string) => void;
}

const SearchPanel = ({ onRegionSelect }: SearchPanelProps) => {
  const [minLon, setMinLon] = useState("");
  const [minLat, setMinLat] = useState("");
  const [maxLon, setMaxLon] = useState("");
  const [maxLat, setMaxLat] = useState("");

  const handleSearch = () => {
    if (!minLon || !minLat || !maxLon || !maxLat) {
      toast.error("Please fill in all coordinate fields");
      return;
    }

    const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;
    onRegionSelect(bbox);
  };

  return (
    <div className="p-6 rounded-lg bg-space-light/20 backdrop-blur-sm animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Search Region</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Min Longitude</label>
            <Input
              type="number"
              placeholder="-180 to 180"
              value={minLon}
              onChange={(e) => setMinLon(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Min Latitude</label>
            <Input
              type="number"
              placeholder="-90 to 90"
              value={minLat}
              onChange={(e) => setMinLat(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Max Longitude</label>
            <Input
              type="number"
              placeholder="-180 to 180"
              value={maxLon}
              onChange={(e) => setMaxLon(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Max Latitude</label>
            <Input
              type="number"
              placeholder="-90 to 90"
              value={maxLat}
              onChange={(e) => setMaxLat(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
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