import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Users, Shield, Heart, UserPlus, LogIn, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate(); // Add this line

  const handleNavigation = (path: string) => {
    // In your actual app, use: navigate(path)
    console.log('Navigate to:', path);
    navigate(path); 
};

  const userTypes = [
    {
      id: 'citizen',
      title: 'Citizen',
      icon: Users,
      description: 'Register or login to report disasters and access emergency services',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      actions: [
        { label: 'Register', path: '/citizen-register', icon: UserPlus },
        { label: 'Login', path: '/citizen-login', icon: LogIn }
      ]
    },
    {
      id: 'agency',
      title: 'Emergency Agency',
      icon: Shield,
      description: 'Access agency portal for disaster response and coordination',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      actions: [
        { label: 'Agency Login', path: '/agency-login', icon: Shield }
      ]
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      icon: Heart,
      description: 'Join as a volunteer to help during disaster relief operations',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      actions: [
        { label: 'Volunteer Login', path: '/volunteer-login', icon: Heart }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue- to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-500 p-4 rounded-full shadow-2xl">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            National Disaster Management System
          </h1>
          <p className="text-lg text-blue-200">
            Choose your portal to continue
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((type) => {
            const Icon = type.icon;
            return (
             <div
  key={type.id}
  className="bg-white rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
  onMouseEnter={() => setActiveSection(type.id)}
  onMouseLeave={() => setActiveSection('')}
>
                <div className={`${type.color} p-6 text-center`}>
                  <Icon className="w-16 h-16 text-white mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-white">{type.title}</h3>
                </div>
                
                <div className="p-6">
                  <p className="text-black-100 text-center mb-6 min-h-[60px]">
                    {type.description}
                  </p>
                  
                  <div className="space-y-3">
                    {type.actions.map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <button
                          key={action.path}
                          onClick={() => handleNavigation(action.path)}
                          className={`w-full ${type.color} ${type.hoverColor} text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
                        >
                          <ActionIcon className="w-5 h-5" />
                          {action.label}
                          <ChevronRight className="w-5 h-5 ml-auto" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-blue-200 text-sm">
            &copy; 2025 National Disaster Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;