import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Incident {
  id: number;
  latitude: number;
  longitude: number;
  citizen_name: string;
  full_address: string;
}

interface MapComponentProps {
  incidents: Incident[];
  emoji: string;
  disasterType: string;
  onMarkerClick?: (incident: Incident) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  incidents,
  emoji,
  disasterType,
  onMarkerClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([22.7196, 75.8577], 12);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      map.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for incidents
    if (incidents.length > 0) {
      incidents.forEach((incident) => {
        // Create custom emoji icon
        const emojiIcon = L.divIcon({
          html: `<div style="font-size: 32px; text-align: center; line-height: 1;">${emoji}</div>`,
          iconSize: [40, 40],
          className: 'emoji-icon',
        });

        const marker = L.marker([incident.latitude, incident.longitude], {
          icon: emojiIcon,
          title: incident.citizen_name,
        })
          .addTo(map.current!)
          .bindPopup(`
            <div class="popup-content">
              <p class="font-bold">${incident.citizen_name}</p>
              <p class="text-sm">${incident.full_address}</p>
            </div>
          `);

        // Add click event
        marker.on('click', () => {
          onMarkerClick?.(incident);
        });

        markersRef.current.push(marker);
      });

      // Fit bounds to all markers
      if (markersRef.current.length > 0) {
        const group = new L.FeatureGroup(markersRef.current);
        map.current?.fitBounds(group.getBounds().pad(0.1));
      }
    }

    return () => {
      // Cleanup is handled by ref
    };
  }, [incidents, emoji, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-80 rounded-lg overflow-hidden border border-gray-200"
      style={{ minHeight: '320px' }}
    />
  );
};

export default MapComponent;