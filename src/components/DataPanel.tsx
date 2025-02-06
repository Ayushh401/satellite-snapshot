import { useQuery } from "@tanstack/react-query";
import { searchASFGranules, type ASFGranule } from "@/utils/asfApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface DataPanelProps {
  selectedRegion: string | null;
}

const DataPanel = ({ selectedRegion }: DataPanelProps) => {
  const { data: granules, isLoading, error } = useQuery({
    queryKey: ['asfGranules', selectedRegion],
    queryFn: () => searchASFGranules({
      bbox: selectedRegion ? `${selectedRegion}` : undefined,
      platform: 'SENTINEL-1',
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
    }),
    enabled: !!selectedRegion,
  });

  if (!selectedRegion) {
    return (
      <div className="p-6 rounded-lg bg-space-light/20 backdrop-blur-sm animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Data Visualization</h2>
        <p className="text-gray-300">Select a region to view satellite data</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 rounded-lg bg-space-light/20 backdrop-blur-sm animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Loading Data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-space-light/20 backdrop-blur-sm animate-fade-in">
        <h2 className="text-xl font-semibold mb-4 text-red-500">Error Loading Data</h2>
        <p className="text-gray-300">Failed to fetch satellite data</p>
      </div>
    );
  }

  const chartData = granules?.map(granule => ({
    date: new Date(granule.acquisitionDate).toLocaleDateString(),
    count: 1,
  })) || [];

  return (
    <div className="p-6 rounded-lg bg-space-light/20 backdrop-blur-sm animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Data for {selectedRegion}</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded">
          <h3 className="font-medium mb-2">Satellite Coverage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded">
          <h3 className="font-medium mb-2">Available Granules</h3>
          <div className="space-y-2">
            {granules?.slice(0, 5).map((granule) => (
              <div key={granule.granuleName} className="text-sm text-gray-300">
                <p>Name: {granule.granuleName}</p>
                <p>Date: {new Date(granule.acquisitionDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;