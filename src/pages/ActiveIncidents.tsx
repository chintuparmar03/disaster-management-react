import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const ActiveIncidents = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-500 p-3 rounded-full">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Active Incidents</h1>
              <p className="text-blue-200 mt-1">Real-time disaster monitoring and response</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-500/20 backdrop-blur-lg rounded-xl border border-red-500/50 p-6">
            <h3 className="text-red-200 text-sm font-medium mb-2">Critical Incidents</h3>
            <p className="text-4xl font-bold text-white">3</p>
          </div>
          <div className="bg-orange-500/20 backdrop-blur-lg rounded-xl border border-orange-500/50 p-6">
            <h3 className="text-orange-200 text-sm font-medium mb-2">Active Alerts</h3>
            <p className="text-4xl font-bold text-white">12</p>
          </div>
          <div className="bg-green-500/20 backdrop-blur-lg rounded-xl border border-green-500/50 p-6">
            <h3 className="text-green-200 text-sm font-medium mb-2">Resolved Today</h3>
            <p className="text-4xl font-bold text-white">8</p>
          </div>
        </div>

        {/* Incidents List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Incidents</h2>
          
          <div className="space-y-4">
            {/* Incident 1 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">Critical</span>
                    <span className="text-red-200 text-sm">2 hours ago</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">Forest Fire in Northern Region</h3>
                  <p className="text-blue-200 text-sm">Location: Shimla, Himachal Pradesh</p>
                  <p className="text-blue-300 text-sm mt-2">Affected: ~5,000 people</p>
                </div>
              </div>
            </div>

            {/* Incident 2 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">High</span>
                    <span className="text-orange-200 text-sm">4 hours ago</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">Flash Flooding in Coastal Areas</h3>
                  <p className="text-blue-200 text-sm">Location: Mumbai, Maharashtra</p>
                  <p className="text-blue-300 text-sm mt-2">Affected: ~12,000 people</p>
                </div>
              </div>
            </div>

            {/* Incident 3 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">Medium</span>
                    <span className="text-yellow-200 text-sm">8 hours ago</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">Earthquake Activity Detected</h3>
                  <p className="text-blue-200 text-sm">Location: Delhi NCR</p>
                  <p className="text-blue-300 text-sm mt-2">Affected: ~500 people</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/report-disaster')}
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
          >
            Report New Incident
          </button>
          <button
            onClick={() => navigate('/disaster-zones')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
          >
            View Disaster Zones
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveIncidents;