import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

interface MapProps {
  selectedRegion: string | null;
  coverageData?: Array<[number, number, number]>; // lat, lng, intensity
  overlayType: "standard" | "heatmap" | "density";
}

const Map = ({ selectedRegion, coverageData = [], overlayType }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const boundaryRef = useRef<L.Rectangle | null>(null);
  const heatLayerRef = useRef<any>(null);
  const [activeLayer, setActiveLayer] = useState<"street" | "satellite" | "terrain">("street");

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);

    const layers = {
      street: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }),
      satellite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
      })
    };

    layers[activeLayer].addTo(mapRef.current);

    const layerControl = L.control.layers({
      "Street": layers.street,
      "Satellite": layers.satellite,
      "Terrain": layers.terrain
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !coverageData.length) return;

    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
    }

    if (overlayType === "heatmap") {
      heatLayerRef.current = L.heatLayer(coverageData, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        max: 1.0,
        gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
      }).addTo(mapRef.current);
    }
  }, [coverageData, overlayType]);

  useEffect(() => {
    if (selectedRegion && mapRef.current) {
      if (boundaryRef.current) {
        boundaryRef.current.remove();
      }

      try {
        const [minLon, minLat, maxLon, maxLat] = selectedRegion.split(',').map(Number);
        
        boundaryRef.current = L.rectangle([[minLat, minLon], [maxLat, maxLon]], {
          color: "#ff7800",
          weight: 1,
          fillOpacity: 0.3
        }).addTo(mapRef.current);

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