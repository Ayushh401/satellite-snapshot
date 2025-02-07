import { useState } from "react";
import Map from "../components/Map";
import SearchPanel from "../components/SearchPanel";
import DataPanel from "../components/DataPanel";

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [overlayType, setOverlayType] = useState<"standard" | "heatmap" | "density">("standard");

  const handleRegionSelect = (region: string, startDate: Date, endDate: Date) => {
    setSelectedRegion(region);
    setDateRange({ start: startDate, end: endDate });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space to-ocean text-white">
      <div className="container mx-auto p-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Earth Data Explorer</h1>
          <p className="text-gray-300">Explore satellite data from ASF</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Map 
              selectedRegion={selectedRegion} 
              overlayType={overlayType}
            />
          </div>
          <div className="space-y-6">
            <SearchPanel onRegionSelect={handleRegionSelect} />
            <DataPanel selectedRegion={selectedRegion} dateRange={dateRange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;