import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Phone, User, Clock, Search, Filter } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { getActiveIncidents } from '../services/incident';

interface IncidentLocation {
  id: number;
  disaster_type: string;
  full_address: string;
  pincode: string;
  latitude: number;
  longitude: number;
  citizen_name: string;
  citizen_phone: string;
  reported_time: string;
  status: string;
}

interface DisasterTypeGroup {
  type: string;
  emoji: string;
  incidents: IncidentLocation[];
  color: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const ActiveIncidents: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [incidents, setIncidents] = useState<IncidentLocation[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await getActiveIncidents();
      setIncidents(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching incidents:', err);
      setError(err.message || 'Failed to fetch incidents');
      // Use mock data for demo
      setIncidents(getMockIncidents());
    } finally {
      setLoading(false);
    }
  };

  const getMockIncidents = (): IncidentLocation[] => [
    {
      id: 1,
      disaster_type: 'fire',
      full_address: 'Downtown District, Main Street, Indore, Madhya Pradesh',
      pincode: '452001',
      latitude: 22.7196,
      longitude: 75.8577,
      citizen_name: 'Raj Kumar',
      citizen_phone: '9876543210',
      reported_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    },
    {
      id: 2,
      disaster_type: 'accident',
      full_address: 'Highway Junction, National Highway 59, Indore',
      pincode: '452010',
      latitude: 22.7390,
      longitude: 75.8659,
      citizen_name: 'Priya Singh',
      citizen_phone: '9876543211',
      reported_time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    },
    {
      id: 3,
      disaster_type: 'landslide',
      full_address: 'Khandwa Road, Hill Area, Indore',
      pincode: '452012',
      latitude: 22.7050,
      longitude: 75.8500,
      citizen_name: 'Amit Patel',
      citizen_phone: '9876543212',
      reported_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'active'
    },
    {
      id: 4,
      disaster_type: 'fire',
      full_address: 'Commercial Zone, Sector 5, Indore',
      pincode: '452008',
      latitude: 22.7150,
      longitude: 75.8480,
      citizen_name: 'Neha Sharma',
      citizen_phone: '9876543213',
      reported_time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: 'active'
    },
    {
      id: 5,
      disaster_type: 'accident',
      full_address: 'East Zone, Bypass Road, Indore',
      pincode: '452011',
      latitude: 22.7450,
      longitude: 75.8900,
      citizen_name: 'Vikram Reddy',
      citizen_phone: '9876543214',
      reported_time: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    },
    {
      id: 6,
      disaster_type: 'landslide',
      full_address: 'Valley Road, North Area, Indore',
      pincode: '452015',
      latitude: 22.7300,
      longitude: 75.8300,
      citizen_name: 'Anjali Gupta',
      citizen_phone: '9876543215',
      reported_time: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    }
  ];

  const disasterTypes: { [key: string]: { emoji: string; color: string } } = {
    fire: { emoji: '🔥', color: 'from-red-500 to-red-600' },
    accident: { emoji: '🚗', color: 'from-orange-500 to-orange-600' },
    landslide: { emoji: '⛏️', color: 'from-yellow-500 to-yellow-600' }
  };

  const groupedIncidents: DisasterTypeGroup[] = Object.entries(disasterTypes).map(([type, info]) => ({
    type,
    emoji: info.emoji,
    color: info.color,
    incidents: incidents.filter(i => i.disaster_type === type)
  }));

  const filteredIncidents = incidents.filter(i =>
    i.citizen_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.full_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading && incidents.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Active Incidents</h1>
          <p className="text-gray-600">Loading real-time disaster incidents...</p>
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading incidents from map...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Active Incidents - Real-time Map View</h1>
        <p className="text-gray-600">Monitor all active disaster incidents with live geolocation data</p>
      </div>

      {error && (
        <Card className="border-l-4 border-l-red-600 bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-700 font-medium">{error}</p>
            <p className="text-red-600 text-sm mt-1">Note: Using demo data for preview</p>
          </CardContent>
        </Card>
      )}

      {/* Map Grid - Three Maps for Each Disaster Type */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {groupedIncidents.map((group) => (
          <Card key={group.type} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className={`bg-gradient-to-r ${group.color} text-white`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{group.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold capitalize">{group.type}</h3>
                  <p className="text-xs opacity-90">{group.incidents.length} active</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {group.incidents.length > 0 ? (
                <>
                  <MapComponent
                    incidents={group.incidents}
                    emoji={group.emoji}
                    disasterType={group.type}
                    onMarkerClick={setSelectedIncident}
                  />
                  <div className="p-4 border-t border-gray-200 space-y-2 max-h-48 overflow-y-auto">
                    {group.incidents.map((incident) => (
                      <button
                        key={incident.id}
                        onClick={() => setSelectedIncident(incident)}
                        className={`w-full text-left p-3 rounded-lg transition ${
                          selectedIncident?.id === incident.id
                            ? 'bg-blue-100 border-2 border-blue-500'
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <p className="font-semibold text-gray-800 text-sm">{incident.citizen_name}</p>
                        <p className="text-xs text-gray-600 line-clamp-1">{incident.full_address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatTime(incident.reported_time)}
                        </p>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <span className="text-5xl mb-3 block">{group.emoji}</span>
                    <p>No active {group.type} incidents</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Information */}
      {selectedIncident && (
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{disasterTypes[selectedIncident.disaster_type]?.emoji || '📍'}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800 capitalize">
                  {selectedIncident.disaster_type} Incident Details
                </h3>
                <p className="text-sm text-gray-600">
                  Reported {formatTime(selectedIncident.reported_time)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Citizen Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Citizen Information</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-lg font-semibold text-gray-800">{selectedIncident.citizen_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone Number</p>
                      <a href={`tel:${selectedIncident.citizen_phone}`} className="text-lg font-semibold text-blue-600 hover:underline">
                        {selectedIncident.citizen_phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Location Information</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Full Address</p>
                      <p className="text-base font-semibold text-gray-800">{selectedIncident.full_address}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pincode</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedIncident.pincode}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Latitude</p>
                      <p className="text-sm font-mono text-gray-800">{selectedIncident.latitude.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">Longitude</p>
                      <p className="text-sm font-mono text-gray-800">{selectedIncident.longitude.toFixed(4)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
                Assign Volunteers
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium">
                Send Alert
              </button>
              <button className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium">
                Update Status
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Incidents List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">All Active Incidents</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Citizen</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Reported</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className="border-t border-gray-200 hover:bg-blue-50 transition cursor-pointer"
                  >
                    <td className="px-6 py-3">
                      <span className="text-2xl mr-2">
                        {disasterTypes[incident.disaster_type]?.emoji || '📍'}
                      </span>
                      <span className="font-semibold text-gray-800 capitalize">{incident.disaster_type}</span>
                    </td>
                    <td className="px-6 py-3 text-gray-800 font-medium">{incident.citizen_name}</td>
                    <td className="px-6 py-3 text-gray-700 text-sm line-clamp-1">{incident.full_address}</td>
                    <td className="px-6 py-3">
                      <a href={`tel:${incident.citizen_phone}`} className="text-blue-600 hover:underline">
                        {incident.citizen_phone}
                      </a>
                    </td>
                    <td className="px-6 py-3 text-gray-600 text-sm">{formatTime(incident.reported_time)}</td>
                    <td className="px-6 py-3 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        {incident.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveIncidents;