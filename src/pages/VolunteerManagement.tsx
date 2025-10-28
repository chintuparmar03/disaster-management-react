import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Heart, MapPin, Calendar, Users } from 'lucide-react';

const VolunteerAssignment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-purple-200 hover:text-white mb-8 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-500 p-3 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Volunteer Assignment</h1>
              <p className="text-purple-200 mt-1">Assign volunteers to active disaster relief operations</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-500/20 backdrop-blur-lg rounded-xl border border-green-500/50 p-6">
            <h3 className="text-green-200 text-sm font-medium mb-2">Available Volunteers</h3>
            <p className="text-4xl font-bold text-white">156</p>
          </div>
          <div className="bg-blue-500/20 backdrop-blur-lg rounded-xl border border-blue-500/50 p-6">
            <h3 className="text-blue-200 text-sm font-medium mb-2">Currently Assigned</h3>
            <p className="text-4xl font-bold text-white">89</p>
          </div>
          <div className="bg-orange-500/20 backdrop-blur-lg rounded-xl border border-orange-500/50 p-6">
            <h3 className="text-orange-200 text-sm font-medium mb-2">Pending Assignments</h3>
            <p className="text-4xl font-bold text-white">12</p>
          </div>
        </div>

        {/* Current Assignments */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Current Assignments</h2>
          
          <div className="space-y-4">
            {/* Assignment 1 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Flood Relief - Mumbai</h3>
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <MapPin className="w-4 h-4" />
                    Mumbai, Maharashtra
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Active</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-purple-300">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>25 Volunteers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Started 2 days ago</span>
                </div>
              </div>
            </div>

            {/* Assignment 2 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Wildfire Response - Shimla</h3>
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <MapPin className="w-4 h-4" />
                    Shimla, Himachal Pradesh
                  </div>
                </div>
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">Urgent</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-purple-300">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>18 Volunteers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Started 5 hours ago</span>
                </div>
              </div>
            </div>

            {/* Assignment 3 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Medical Camp - Delhi NCR</h3>
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <MapPin className="w-4 h-4" />
                    Delhi NCR
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Active</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-purple-300">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>12 Volunteers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Started 1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Pending Assignments</h2>
          
          <div className="space-y-4">
            {/* Pending 1 */}
            <div className="bg-white/5 border border-orange-500/30 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Cyclone Preparation - Vishakhapatnam</h3>
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <MapPin className="w-4 h-4" />
                    Vishakhapatnam, Andhra Pradesh
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">Pending</span>
              </div>
              <div className="text-sm text-purple-300">
                <p>Volunteers needed: 30 | Skills: First Aid, Logistics</p>
              </div>
            </div>

            {/* Pending 2 */}
            <div className="bg-white/5 border border-orange-500/30 rounded-lg p-4 hover:bg-white/10 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Food Distribution - Uttarakhand</h3>
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <MapPin className="w-4 h-4" />
                    Uttarakhand
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">Pending</span>
              </div>
              <div className="text-sm text-purple-300">
                <p>Volunteers needed: 15 | Skills: Coordination, Distribution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/volunteer-management')}
            className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
          >
            Volunteer Management
          </button>
          <button
            onClick={() => navigate('/active-incidents')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
          >
            View Active Incidents
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerAssignment;