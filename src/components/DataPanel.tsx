interface DataPanelProps {
  selectedRegion: string | null;
}

const DataPanel = ({ selectedRegion }: DataPanelProps) => {
  if (!selectedRegion) {
    return (
      <div className="p-6 rounded-lg bg-space-light/20 backdrop-blur-sm animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Data Visualization</h2>
        <p className="text-gray-300">Select a region to view satellite data</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-space-light/20 backdrop-blur-sm animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Data for {selectedRegion}</h2>
      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded">
          <h3 className="font-medium mb-2">Satellite Coverage</h3>
          <p className="text-sm text-gray-300">Loading satellite data...</p>
        </div>
        <div className="p-4 bg-white/5 rounded">
          <h3 className="font-medium mb-2">Latest Imagery</h3>
          <p className="text-sm text-gray-300">No imagery available yet</p>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;