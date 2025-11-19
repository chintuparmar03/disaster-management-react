import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  MapPin,
  Phone,
  User,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Loader,
  Mail,
  Navigation,
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { incidentAPI, SOSIncident, FilterParams } from '../services/api_incidents';
import { log } from 'console';

// Card Components
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

// Main Component
const ActiveIncidents: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [incidents, setIncidents] = useState<SOSIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<SOSIncident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const disasterTypes = incidentAPI.getDisasterTypes();

  // Fetch incidents
  const fetchIncidents = async () => {
    try {
      setRefreshing(true);
      const filters: FilterParams = {
        status: 'PENDING',
        ordering: '-incident_time',
      };

      if (filterType !== 'all') {
        filters.disaster_type = filterType;
      }

      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await incidentAPI.getActiveIncidents(filters);
      console.log(response.data);
      setIncidents(response.data || []);
      setError('');
    } catch (err: any) {
      console.error('Error fetching incidents:', err);
      setError(err.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto-refresh and initial fetch
  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update incidents when filters change
  useEffect(() => {
    if (!loading) {
      fetchIncidents();
    }
  }, [filterType, searchTerm]);

  // Group incidents by disaster type
  const groupedIncidents = Object.entries(disasterTypes).map(([key, type]) => ({
    key,
    ...type,
    incidents: incidents.filter((i) => i.disaster_type === key),
  }));

  // Get citizen name
  const getCitizenName = (incident: SOSIncident): string => {
    const { first_name, last_name, username } = incident.citizen;
    if (first_name && last_name) return `${first_name} ${last_name}`;
    return first_name || last_name || username;
  };

  // Format time
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedIncident) return;

    try {
      await incidentAPI.updateIncidentStatus(selectedIncident.id, {
        status: newStatus,
        status_reason: `Status updated to ${newStatus}`,
      });

      setSelectedIncident((prev) =>
        prev ? { ...prev, status: newStatus, status_display: newStatus } : null
      );
      fetchIncidents();
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError('Failed to update incident status');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Active Incidents</h1>
          <p className="text-gray-600">Loading real-time disaster incidents...</p>
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Fetching reported incidents from citizens...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Active Incidents Dashboard</h1>
          <p className="text-gray-600">Real-time citizen-reported disasters with geolocation</p>
        </div>
        <button
          onClick={fetchIncidents}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            refreshing
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-l-4 border-l-red-600 bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-700 font-medium">{error}</p>
            <p className="text-red-600 text-sm mt-1">
              Ensure the backend API is running at http://localhost:8000
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-gray-600 text-sm">Total Active</p>
            <p className="text-3xl font-bold text-blue-600">{incidents.length}</p>
          </CardContent>
        </Card>
        {Object.entries(disasterTypes).map(([key, type]) => {
          const count = incidents.filter((i) => i.disaster_type === key).length;
          return (
            <Card key={key}>
              <CardContent className="py-4">
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <span>{type.emoji}</span>
                  {type.label}
                </p>
                <p className="text-3xl font-bold" style={{ color: type.color }}>
                  {count}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by citizen name, email, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Disaster Types</option>
          {Object.entries(disasterTypes).map(([key, type]) => (
            <option key={key} value={key}>
              {type.emoji} {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Maps Grid - One for Each Disaster Type */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {groupedIncidents.map((group) => (
          <Card key={group.key} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader style={{ backgroundImage: `linear-gradient(135deg, ${group.color}dd, ${group.color})` }} className="text-white">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{group.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold">{group.label}</h3>
                  <p className="text-xs opacity-90">{group.incidents.length} active</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {group.incidents.length > 0 ? (
                <>
                  <MapComponent
                    incidents={group.incidents}
                    disasterType={group.key}
                    emoji={group.emoji}
                    color={group.color}
                    onMarkerClick={setSelectedIncident}
                    selectedIncident={selectedIncident}
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
                        <p className="font-semibold text-gray-800 text-sm">
                          {getCitizenName(incident)}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-1">{incident.full_address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatTime(incident.incident_time)}
                        </p>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <span className="text-5xl mb-3 block">{group.emoji}</span>
                    <p>No {group.label.toLowerCase()} incidents</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Information Panel */}
      {selectedIncident && (
        <Card className="border-l-4" style={{ borderLeftColor: disasterTypes[selectedIncident.disaster_type]?.color }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{disasterTypes[selectedIncident.disaster_type]?.emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {disasterTypes[selectedIncident.disaster_type]?.label} - Incident Details
                </h3>
                <p className="text-sm text-gray-600">
                  Reported {formatTime(selectedIncident.incident_time)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Citizen Info */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Citizen Information</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-lg font-semibold text-gray-800">{getCitizenName(selectedIncident)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <a
                        href={`tel:${selectedIncident.citizen.phone_number}`}
                        className="text-lg font-semibold text-blue-600 hover:underline"
                      >
                        {selectedIncident.citizen.phone_number}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-sm text-gray-800">{selectedIncident.citizen.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Location Information</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Address</p>
                      <p className="text-base font-semibold text-gray-800">{selectedIncident.full_address}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pincode</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedIncident.pincode || 'N/A'}</p>
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

            {/* Status and Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Status</p>
                  <p className="text-lg font-semibold" style={{ color: disasterTypes[selectedIncident.disaster_type]?.color }}>
                    {selectedIncident.status_display}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => handleStatusUpdate('DISPATCHED')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
                >
                  <Navigation className="w-4 h-4 inline mr-2" />
                  Dispatch Volunteers
                </button>
                <button
                  onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm"
                >
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusUpdate('RESOLVED')}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium text-sm"
                >
                  Resolve Incident
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No incidents message */}
      {incidents.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No active incidents</p>
            <p className="text-gray-500 text-sm">There are no disaster incidents reported at the moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActiveIncidents;