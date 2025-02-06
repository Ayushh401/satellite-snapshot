import { useQuery } from "@tanstack/react-query";
import { searchASFGranules, type ASFGranule } from "@/utils/asfApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { loadGeoTIFF, createImageFromGeoTIFF } from "@/utils/geotiffUtils";
import { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface DataPanelProps {
  selectedRegion: string | null;
  dateRange: {
    start: Date;
    end: Date;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DataPanel = ({ selectedRegion, dateRange }: DataPanelProps) => {
  const [selectedGranule, setSelectedGranule] = useState<ASFGranule | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  const { data: granules, isLoading, error } = useQuery({
    queryKey: ['asfGranules', selectedRegion, dateRange],
    queryFn: () => searchASFGranules({
      bbox: selectedRegion ? `${selectedRegion}` : undefined,
      platform: 'SENTINEL-1',
      start: dateRange.start.toISOString(),
      end: dateRange.end.toISOString(),
    }),
    enabled: !!selectedRegion,
  });

  const handleGranuleSelect = async (granule: ASFGranule) => {
    setSelectedGranule(granule);
    try {
      const tiff = await loadGeoTIFF(granule.downloadUrl);
      const canvas = await createImageFromGeoTIFF(tiff);
      setPreviewImage(canvas.toDataURL());
    } catch (error) {
      console.error('Error loading GeoTIFF preview:', error);
    }
  };

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

  const pieData = granules?.reduce((acc: any[], granule) => {
    const date = new Date(granule.acquisitionDate).toLocaleDateString();
    const existing = acc.find(item => item.name === date);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: date, value: 1 });
    }
    return acc;
  }, []) || [];

  return (
    <div className="p-6 rounded-lg bg-space-light/20 backdrop-blur-sm animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Data for Selected Region</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded">
          <Tabs defaultValue="bar" onValueChange={(value) => setChartType(value as 'bar' | 'line' | 'pie')}>
            <TabsList className="mb-4">
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="line">Line Chart</TabsTrigger>
              <TabsTrigger value="pie">Pie Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="bar">
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
            </TabsContent>
            <TabsContent value="line">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="pie">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 bg-white/5 rounded">
          <h3 className="font-medium mb-2">Available Granules</h3>
          <div className="space-y-4">
            {granules?.slice(0, 5).map((granule) => (
              <div key={granule.granuleName} className="p-4 bg-white/10 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium">{granule.granuleName}</p>
                    <p className="text-sm text-gray-300">
                      {new Date(granule.acquisitionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleGranuleSelect(granule)}
                  >
                    View Preview
                  </Button>
                </div>
                {selectedGranule?.granuleName === granule.granuleName && previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="GeoTIFF Preview" 
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;