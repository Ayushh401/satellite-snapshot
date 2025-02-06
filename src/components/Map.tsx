import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  selectedRegion: string | null;
}

const Map = ({ selectedRegion }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const boundaryRef = useRef<L.Rectangle | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (selectedRegion && mapRef.current) {
      // Remove existing boundary
      if (boundaryRef.current) {
        boundaryRef.current.remove();
      }

      try {
        // Parse the bbox string (format: "minlon,minlat,maxlon,maxlat")
        const [minLon, minLat, maxLon, maxLat] = selectedRegion.split(',').map(Number);
        
        // Create a rectangle for the boundary
        boundaryRef.current = L.rectangle([[minLat, minLon], [maxLat, maxLon]], {
          color: "#ff7800",
          weight: 1
        }).addTo(mapRef.current);

        // Fit the map to the boundary
        mapRef.current.fitBounds([[minLat, minLon], [maxLat, maxLon]]);
      } catch (error) {
        console.error('Error parsing region coordinates:', error);
      }
    }
  }, [selectedRegion]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-xl bg-space-dark animate-fade-in">
      <div ref={mapContainerRef} className="h-[600px] w-full" />
    </div>
  );
};

export default Map;