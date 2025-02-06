import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  selectedRegion: string | null;
}

const Map = ({ selectedRegion }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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
      // Here we would update the map view based on selected region
      console.log("Selected region:", selectedRegion);
    }
  }, [selectedRegion]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-xl bg-space-dark animate-fade-in">
      <div ref={mapContainerRef} className="h-[600px] w-full" />
    </div>
  );
};

export default Map;