import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SOSIncident } from '../services/api_incidents';

interface MapComponentProps {
  incidents: SOSIncident[];
  disasterType: string;
  emoji: string;
  color: string;
  onMarkerClick?: (incident: SOSIncident) => void;
  selectedIncident?: SOSIncident | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  incidents,
  disasterType,
  emoji,
  color,
  onMarkerClick,
  selectedIncident,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});
  const groupRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    // Initialize map
    if (!mapContainer.current || map.current) return;

    // Get map center and zoom from env variables
    const centerLat = parseFloat(import.meta.env.VITE_MAP_CENTER_LAT || '23.1815');
    const centerLng = parseFloat(import.meta.env.VITE_MAP_CENTER_LNG || '79.9864');
    const zoomLevel = parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM || '10');

    map.current = L.map(mapContainer.current).setView([centerLat, centerLng], zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    groupRef.current = L.featureGroup().addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when incidents change
  useEffect(() => {
    if (!map.current || !groupRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      groupRef.current?.removeLayer(marker);
    });
    markersRef.current = {};

    // Add new markers
    incidents.forEach((incident) => {
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            background-color: ${color};
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-size: 24px;
            cursor: pointer;
          ">
            ${emoji}
          </div>
        `,
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -25],
      });

      const marker = L.marker([incident.latitude, incident.longitude], {
        icon: customIcon,
      });

      // Create popup with citizen info
      const popupContent = `
        <div style="font-family: Arial, sans-serif; width: 250px;">
          <div style="font-weight: bold; color: ${color}; margin-bottom: 8px;">
            ${emoji} ${disasterType.toUpperCase()}
          </div>
          <div style="font-size: 14px; margin-bottom: 8px;">
            <strong>Citizen:</strong> ${incident.citizen.first_name} ${incident.citizen.last_name}
          </div>
          <div style="font-size: 14px; margin-bottom: 8px;">
            <strong>Phone:</strong> <a href="tel:${incident.citizen.phone_number}">${incident.citizen.phone_number}</a>
          </div>
          <div style="font-size: 14px; margin-bottom: 8px;">
            <strong>Email:</strong> ${incident.citizen.email}
          </div>
          <div style="font-size: 13px; margin-bottom: 8px;">
            <strong>Address:</strong> ${incident.full_address}
          </div>
          <div style="font-size: 13px; margin-bottom: 8px;">
            <strong>Pincode:</strong> ${incident.pincode || 'N/A'}
          </div>
          <div style="font-size: 12px; color: #666; margin-top: 8px;">
            <strong>Reported:</strong> ${new Date(incident.incident_time).toLocaleString()}
          </div>
          <div style="font-size: 12px; margin-top: 8px;">
            <span style="
              display: inline-block;
              padding: 4px 8px;
              background-color: ${incident.status === 'ACTIVE' ? '#ef4444' : '#10b981'};
              color: white;
              border-radius: 4px;
            ">
              ${incident.status_display}
            </span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onMarkerClick?.(incident);
      });

      marker.addTo(groupRef.current);
      markersRef.current[incident.id] = marker;

      // Highlight selected incident
      if (selectedIncident?.id === incident.id) {
        marker.openPopup();
      }
    });

    // Fit bounds if incidents exist
    if (incidents.length > 0 && groupRef.current) {
      const bounds = groupRef.current.getBounds();
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [incidents, selectedIncident, disasterType, emoji, color, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};

export default MapComponent;