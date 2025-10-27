import React from 'react';
import { AlertTriangle, Users, Truck, Clock, TrendingUp, MapPin, CheckCircle, Award } from 'lucide-react';

interface DashboardStats {
  activeIncidents: number;
  resolvedIncidents: number;
  activeVolunteers: number;
  avgResponseTime: string;
}

interface Incident {
  id: number;
  type: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
  status: string;
  time: string;
  volunteers: number;
}

interface Volunteer {
  id: number;
  name: string;
  role: string;
  missions: number;
  rating: number;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
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

const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => (
  <h3 className={`text-lg font-bold text-gray-800 ${className}`}>
    {children}
  </h3>
);

const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

interface DashboardOverviewProps {
  stats: DashboardStats;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats }) => {
  const recentIncidents: Incident[] = [
    { id: 1, type: 'Fire', location: 'Downtown District', severity: 'high', status: 'Active', time: '2 hours ago', volunteers: 12 },
    { id: 2, type: 'Building Collapse', location: 'East Zone', severity: 'high', status: 'Active', time: '4 hours ago', volunteers: 18 },
    { id: 3, type: 'Flooding', location: 'River Valley Area', severity: 'medium', status: 'Ongoing', time: '6 hours ago', volunteers: 15 },
    { id: 4, type: 'Road Accident', location: 'Highway Junction', severity: 'medium', status: 'Under Control', time: '8 hours ago', volunteers: 8 }
  ];

  const topVolunteers: Volunteer[] = [
    { id: 1, name: 'Raj Kumar', role: 'Rescue Lead', missions: 24, rating: 4.9 },
    { id: 2, name: 'Priya Singh', role: 'Medical Coordinator', missions: 18, rating: 4.8 },
    { id: 3, name: 'Amit Patel', role: 'Logistics Manager', missions: 22, rating: 4.7 },
    { id: 4, name: 'Neha Sharma', role: 'Communications', missions: 16, rating: 4.9 }
  ];

  const getSeverityColor = (severity: 'high' | 'medium' | 'low'): string => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'Active': return 'text-red-600 font-semibold';
      case 'Ongoing': return 'text-orange-600 font-semibold';
      case 'Under Control': return 'text-yellow-600 font-semibold';
      case 'Resolved': return 'text-green-600 font-semibold';
      default: return 'text-gray-600';
    }
  };

  const statItems = [
    { icon: AlertTriangle, label: 'Active Incidents', value: stats.activeIncidents, gradient: 'from-red-500 to-red-600', color: 'text-red-600' },
    { icon: CheckCircle, label: 'Resolved Cases', value: stats.resolvedIncidents, gradient: 'from-green-500 to-green-600', color: 'text-green-600' },
    { icon: Users, label: 'Active Volunteers', value: stats.activeVolunteers, gradient: 'from-blue-500 to-blue-600', color: 'text-blue-600' },
    { icon: Clock, label: 'Avg Response', value: stats.avgResponseTime, gradient: 'from-purple-500 to-purple-600', color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Agency Command Center</h1>
        <p className="text-gray-600">Real-time monitoring and coordination of disaster response operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Incidents */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Recent Incidents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Severity</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Volunteers</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIncidents.map((incident) => (
                    <tr key={incident.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-3 font-semibold text-gray-800">{incident.type}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {incident.location}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(incident.severity)}`}>
                          {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-3 ${getStatusColor(incident.status)}`}>{incident.status}</td>
                      <td className="px-6 py-3 text-gray-700 font-semibold">{incident.volunteers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Response Rate</span>
                <span className="text-sm font-bold text-blue-600">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Resolution Rate</span>
                <span className="text-sm font-bold text-green-600">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Volunteer Availability</span>
                <span className="text-sm font-bold text-purple-600">76%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3">Last Updated: 5 minutes ago</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium text-sm">
                Generate Report
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Volunteers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Top Performing Volunteers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Missions</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody>
                {topVolunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-3 font-semibold text-gray-800">{volunteer.name}</td>
                    <td className="px-6 py-3 text-gray-700">{volunteer.role}</td>
                    <td className="px-6 py-3 text-gray-700 font-semibold">{volunteer.missions}</td>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                        ⭐ {volunteer.rating}
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

export default DashboardOverview;