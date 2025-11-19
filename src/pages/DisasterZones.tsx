import { useEffect, useRef } from 'react';
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import L from 'leaflet';

const DisasterZones = () => {
  const floodMapRef = useRef<L.Map | null>(null);
  const earthquakeMapRef = useRef<L.Map | null>(null);

  const disasters = [
    {
      title: "Flood-Prone Regions",
      areas: "Assam, Bihar, Uttar Pradesh",
      impact: "River overflow, severe waterlogging, displacement of communities",
      safety: "Move to higher ground, avoid walking in floodwaters, stay updated on evacuation alerts.",
      status: "High Alert",
      statusColor: "destructive",
      mapId: "flood-map",
      type: "flood"
    },
    {
      title: "Earthquake Risk",
      areas: "Himachal Pradesh, Uttarakhand, Northeast India",
      impact: "Rockfall, roadblocks, disruption of communication networks",
      safety: "Avoid travel near slopes, listen to local warnings, stay in safe zones.",
      status: "Monitoring",
      statusColor: "outline",
      mapId: "earthquake-map",
      type: "earthquake"
    }
  ];

  // Flood data
  const floodAreas = [
    {
      name: "Patna, Bihar",
      waterLevel: 7.5,
      time: "2025-07-09T17:30:00Z",
      coords: [
        [25.5941, 85.1376],
        [25.6, 85.14],
        [25.6, 85.13],
        [25.59, 85.13]
      ] as [number, number][]
    },
    {
      name: "Guwahati, Assam",
      waterLevel: 4.2,
      time: "2025-07-09T16:00:00Z",
      coords: [
        [26.1445, 91.7362],
        [26.15, 91.74],
        [26.15, 91.73],
        [26.14, 91.73]
      ] as [number, number][]
    },
    {
      name: "Lucknow, Uttar Pradesh",
      waterLevel: 2.1,
      time: "2025-07-09T15:00:00Z",
      coords: [
        [26.8467, 80.9462],
        [26.85, 80.95],
        [26.85, 80.94],
        [26.84, 80.94]
      ] as [number, number][]
    }
  ];

  const getFloodColor = (waterLevel: number): string => {
    if (waterLevel > 7) return '#08306b';
    if (waterLevel > 5) return '#2171b5';
    if (waterLevel > 3) return '#6baed6';
    if (waterLevel > 1) return '#c6dbef';
    return '#deebf7';
  };

  const getEqColor = (mag: number): string => {
    if (mag >= 5) return 'red';
    if (mag >= 3) return 'orange';
    return 'yellow';
  };

  const initFloodMap = () => {
    if (floodMapRef.current) return;

    const floodMap = L.map('flood-map', {
      zoomControl: true,
      attributionControl: false
    }).setView([20, 82], 4.5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(floodMap);

    floodAreas.forEach(area => {
      L.polygon(area.coords, {
        color: '#2171b5',
        weight: 2,
        fillColor: getFloodColor(area.waterLevel),
        fillOpacity: 0.7
      }).addTo(floodMap)
        .bindPopup(`<b>${area.name}</b><br>Water Level: ${area.waterLevel} m`);
    });

    floodMapRef.current = floodMap;
    setTimeout(() => floodMap.invalidateSize(), 300);
  };

  const initEarthquakeMap = () => {
    if (earthquakeMapRef.current) return;

    const eqMap = L.map('earthquake-map', {
      zoomControl: true,
      attributionControl: false
    }).setView([20, 82], 4.5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(eqMap);

    // Fetch recent earthquakes from USGS
    const minLat = 6;
    const maxLat = 38;
    const minLon = 68;
    const maxLon = 98;
    
    // Fetch earthquakes from last 30 days
    const usgsUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=${minLat}&maxlatitude=${maxLat}&minlongitude=${minLon}&maxlongitude=${maxLon}&starttime=2025-09-29&orderby=magnitude&limit=50`;

    console.log('Fetching earthquakes from:', usgsUrl);

    fetch(usgsUrl)
      .then(res => {
        console.log('Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Earthquake data received:', data);
        
        if (!data.features || data.features.length === 0) {
          console.log('No earthquakes found in the region');
          // Add a placeholder message
          L.marker([20, 82]).addTo(eqMap)
            .bindPopup('No recent earthquakes in this region');
          return;
        }

        data.features.forEach((q: any) => {
          try {
            const props = q.properties;
            const coords = q.geometry.coordinates;
            const mag = props.mag || 0;
            const place = props.place || 'Unknown location';

            console.log(`Adding marker: ${place}, Magnitude: ${mag}`);

            L.circleMarker([coords[1], coords[0]], {
              radius: Math.max(5, 5 + mag * 2),
              fillColor: getEqColor(mag),
              color: '#000',
              weight: 1.5,
              opacity: 0.9,
              fillOpacity: 0.8
            }).addTo(eqMap)
              .bindPopup(
                `<div style="font-size: 12px;">
                  <b>${place}</b><br>
                  Magnitude: <strong>${mag}</strong><br>
                  Depth: ${coords[2]} km<br>
                  Time: ${new Date(props.time).toLocaleString()}
                </div>`
              );
          } catch (err) {
            console.error('Error processing earthquake feature:', err);
          }
        });

        console.log(`Successfully added ${data.features.length} earthquakes to map`);
      })
      .catch(err => {
        console.error('Error fetching earthquake data:', err);
        // Show error message on map
        L.marker([20, 82]).addTo(eqMap)
          .bindPopup('Failed to load earthquake data. Please try again.');
      });

    earthquakeMapRef.current = eqMap;
    setTimeout(() => eqMap.invalidateSize(), 300);
  };

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initFloodMap();
      initEarthquakeMap();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="border-l-4 border-l-blue-900 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Disaster Zones</CardTitle>
              <p className="text-gray-700">
                Key regions currently affected by disasters, with ongoing response, preparedness, and mitigation efforts.
              </p>
            </CardHeader>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {disasters.map((disaster, index) => (
            <Card key={index} className="border-2 border-blue-900 hover:scale-105 transition-transform duration-300 w-full max-w-sm">
              {/* Dynamic Map Container */}
              <div 
                id={disaster.mapId}
                className="w-full h-64 rounded-t-lg bg-gray-200"
                style={{ minHeight: '250px' }}
              />
              
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-3">{disaster.title}</CardTitle>
                <div className="space-y-2 text-sm">
                  <p><strong>Affected Areas:</strong> {disaster.areas}</p>
                  <p><strong>Impact:</strong> {disaster.impact}</p>
                  <p><strong>Safety Tips:</strong> {disaster.safety}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant={disaster.statusColor as any}>{disaster.status}</Badge>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DisasterZones;