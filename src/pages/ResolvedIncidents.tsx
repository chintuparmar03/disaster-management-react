import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, CheckCircle } from 'lucide-react';

const ResolvedIncidents = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-green-200 hover:text-white mb-8 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-500 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Resolved Incidents</h1>
              <p className="text-green-200 mt-1">Successfully managed and resolved disasters</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-500/20 backdrop-blur-lg rounded-xl border border-green-500/50 p-6">
            <h3 className="text-green-200 text-sm font-medium mb-2">Total Resolved</h3>
            <p className="text-4xl font-bold text-white">127</p>
          </div>
          <div className="bg-blue-500/20 backdrop-blur-lg rounded-xl border border-blue-500/50 p-6">
            <h3 className="text-blue-200 text-sm font-medium mb-2">This Month</h3>
            <p className="text-4xl font-bold text-white">23</p>
          </div>
          <div className="bg-purple-500/20 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6">
            <h3 className="text-purple-200 text-sm font-medium mb-2">Avg Response Time</h3>
            <p className="text-4xl font-bold text-white">4.2h</p>
          </div>
        </div>

        {/* Resolved Incidents List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recently Resolved</h2>
          
          <div className="space-y-4">
            {/* Incident 1 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Resolved</span>
                    <span className="text-green-200 text-sm">Resolved 1 day ago</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">Building Fire in Commercial Area</h3>
                  <p className="text-green-200 text-sm">Location: Bangalore, Karnataka</p>
                  <p className="text-green-300 text-sm mt-2">Response Time: 3.5 hours | People Rescued: 45</p>
                </div>
              </div>
            </div>

            {/* Incident 2 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Resolved</span>
                    <span className="text-green-200 text-sm">Resolved 2 days ago</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">Road Accident & Traffic Blockage</h3>
                  <p className="text-green-200 text-sm">Location: Pune, Maharashtra</p>
                  <p className="text-green-300 text-sm mt-2">Response Time: 2.1 hours | People Affected: 200</p>
                </div>
              </div>
            </div>

            {/* Incident 3 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Resolved</span>
                    <span className="text-green-200 text-sm">Resolved 3 days ago</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">Power Outage Emergency</h3>
                  <p className="text-green-200 text-sm">Location: Chennai, Tamil Nadu</p>
                  <p className="text-green-300 text-sm mt-2">Response Time: 5.8 hours | People Affected: 8,000</p>
                </div>
              </div>
            </div>

            {/* Incident 4 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Resolved</span>
                    <span className="text-green-200 text-sm">Resolved 5 days ago</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">Gas Leak in Residential Complex</h3>
                  <p className="text-green-200 text-sm">Location: Hyderabad, Telangana</p>
                  <p className="text-green-300 text-sm mt-2">Response Time: 1.8 hours | People Evacuated: 120</p>
                </div>
              </div>
            </div>

            {/* Incident 5 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Resolved</span>
                    <span className="text-green-200 text-sm">Resolved 1 week ago</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">Minor Earthquake Aftershocks</h3>
                  <p className="text-green-200 text-sm">Location: Guwahati, Assam</p>
                  <p className="text-green-300 text-sm mt-2">Response Time: 6.2 hours | People Affected: 3,500</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/active-incidents')}
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
          >
            View Active Incidents
          </button>
          <button
            onClick={() => navigate('/report-disaster')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
          >
            Report New Incident
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResolvedIncidents;