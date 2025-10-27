import React, { useState, useEffect } from 'react';
import AgencyNavbar from "@/components/AgencyNavbar";
import DashboardOverview from '../pages/DashboardOverview';
import ActiveIncidents from '../pages/ActiveIncidents';
import ResolvedIncidents from '../pages/ResolvedIncidents';
import VolunteerAssignment from '../pages/VolunteerAssignment';
import VolunteerManagement from '../pages/VolunteerManagement';

interface DashboardStats {
  activeIncidents: number;
  resolvedIncidents: number;
  activeVolunteers: number;
  avgResponseTime: string;
}

interface AgencyData {
  agency_name?: string;
  agency_id?: string;
  [key: string]: any;
}

const AgencyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [agencyName, setAgencyName] = useState<string>('NDRF Command Center');

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeIncidents: 5,
    resolvedIncidents: 32,
    activeVolunteers: 24,
    avgResponseTime: '12 min'
  });

  useEffect(() => {
    // Fetch agency data from localStorage or API
    const agencyData = localStorage.getItem('agency_data');
    if (agencyData) {
      try {
        const data: AgencyData = JSON.parse(agencyData);
        setAgencyName(data.agency_name || 'Agency Command Center');
      } catch (error) {
        console.error('Error parsing agency data:', error);
      }
    }
  }, []);

  const renderContent = (): React.ReactNode => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview stats={dashboardStats} />;
      case 'active-incidents':
        return <ActiveIncidents />;
      case 'resolved-incidents':
        return <ResolvedIncidents />;
      case 'volunteer-assignment':
        return <VolunteerAssignment />;
      case 'volunteer-management':
        return <VolunteerManagement />;
      default:
        return <DashboardOverview stats={dashboardStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AgencyNavbar activeTab={activeTab} setActiveTab={setActiveTab} agencyName={agencyName} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AgencyDashboard;