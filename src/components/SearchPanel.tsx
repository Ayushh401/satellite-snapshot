import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface SearchPanelProps {
  onRegionSelect: (region: string, startDate: Date, endDate: Date) => void;
}

const SearchPanel = ({ onRegionSelect }: SearchPanelProps) => {
  const [minLon, setMinLon] = useState("");
  const [minLat, setMinLat] = useState("");
  const [maxLon, setMaxLon] = useState("");
  const [maxLat, setMaxLat] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleSearch = () => {
    if (!minLon || !minLat || !maxLon || !maxLat) {
      toast.error("Please fill in all coordinate fields");
      return;
    }

    const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;
    onRegionSelect(bbox, startDate, endDate);
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
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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