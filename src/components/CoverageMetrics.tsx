import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface CoverageMetricsProps {
  granules: any[];
  dateRange: {
    start: Date;
    end: Date;
  };
  selectedRegion: string;
}

const CoverageMetrics = ({ granules, dateRange, selectedRegion }: CoverageMetricsProps) => {
  const calculateMetrics = () => {
    if (!granules?.length) return null;

    const totalDays = (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24);
    const daysWithData = new Set(granules.map(g => new Date(g.acquisitionDate).toDateString())).size;
    const coveragePercentage = (daysWithData / totalDays) * 100;

    const qualityScores = granules.map(g => g.qualityScore || 1);
    const avgQuality = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;

    const [minLon, minLat, maxLon, maxLat] = selectedRegion.split(',').map(Number);
    const totalArea = Math.abs((maxLon - minLon) * (maxLat - minLat));
    const coveredArea = granules.reduce((acc, g) => acc + (g.coverage || 0), 0);
    const areaPercentage = (coveredArea / totalArea) * 100;

    return {
      daysWithData,
      totalDays,
      coveragePercentage,
      avgQuality,
      areaPercentage,
    };
  };

  const metrics = calculateMetrics();

  if (!metrics) return null;

  return (
    <Card className="p-4 bg-white/5">
      <h3 className="text-lg font-semibold mb-4">Enhanced Coverage Metrics</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Temporal Coverage</span>
            <span>{metrics.coveragePercentage.toFixed(1)}%</span>
          </div>
          <Progress value={metrics.coveragePercentage} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span>Data Quality Score</span>
            <span>{(metrics.avgQuality * 100).toFixed(1)}%</span>
          </div>
          <Progress value={metrics.avgQuality * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span>Spatial Coverage</span>
            <span>{metrics.areaPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={metrics.areaPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-400">Days with Data</p>
            <p className="text-lg font-medium">{metrics.daysWithData} / {Math.round(metrics.totalDays)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Coverage Density</p>
            <p className="text-lg font-medium">{(granules.length / metrics.totalDays).toFixed(1)} granules/day</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CoverageMetrics;