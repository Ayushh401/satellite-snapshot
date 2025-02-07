import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Ticket, Image } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchPanelProps {
  onRegionSelect: (region: string, startDate: Date, endDate: Date, filters: SearchFilters) => void;
}

interface SearchFilters {
  platform: string;
  dataQuality: string;
  coverageType: string;
}

const SearchPanel = ({ onRegionSelect }: SearchPanelProps) => {
  const [minLon, setMinLon] = useState("");
  const [minLat, setMinLat] = useState("");
  const [maxLon, setMaxLon] = useState("");
  const [maxLat, setMaxLat] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState<SearchFilters>({
    platform: "all",
    dataQuality: "all",
    coverageType: "all"
  });

  const handleSearch = () => {
    if (!minLon || !minLat || !maxLon || !maxLat) {
      toast.error("Please fill in all coordinate fields");
      return;
    }

    const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;
    onRegionSelect(bbox, startDate, endDate, filters);
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

        <div className="space-y-3">
          <Select
            value={filters.platform}
            onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value }))}
          >
            <SelectTrigger>
              <Ticket className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="sentinel1">Sentinel-1</SelectItem>
              <SelectItem value="sentinel2">Sentinel-2</SelectItem>
              <SelectItem value="landsat">Landsat</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.dataQuality}
            onValueChange={(value) => setFilters(prev => ({ ...prev, dataQuality: value }))}
          >
            <SelectTrigger>
              <Image className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Data Quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quality Levels</SelectItem>
              <SelectItem value="high">High Quality</SelectItem>
              <SelectItem value="medium">Medium Quality</SelectItem>
              <SelectItem value="low">Low Quality</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.coverageType}
            onValueChange={(value) => setFilters(prev => ({ ...prev, coverageType: value }))}
          >
            <SelectTrigger>
              <Image className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Coverage Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coverage Types</SelectItem>
              <SelectItem value="full">Full Coverage</SelectItem>
              <SelectItem value="partial">Partial Coverage</SelectItem>
              <SelectItem value="minimal">Minimal Coverage</SelectItem>
            </SelectContent>
          </Select>
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