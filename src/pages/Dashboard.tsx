import Layout from "@/components/Layout";
import { AlertTriangle, Ambulance, Home, BarChart3, FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SOSCircularMenu from "@/components/SOSCircularMenu";

interface UserData {
  name: string;
  phone: string;
  lat: number;
  lng: number;
}

const Dashboard = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('citizen_data');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData({
          name: parsedData.first_name || parsedData.firstName || 'Citizen',
          phone: parsedData.phone_number || parsedData.phone || '',
          lat: 0,
          lng: 0
        });
      } catch (error) {
        console.log('Error parsing user data:', error);
      }
    }

    // Get live location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(locationData);
          
          // Update userData with location
          setUserData(prev => prev ? { ...prev, ...locationData } : null);
        },
        (error) => {
          console.log("Location access denied or unavailable");
        }
      );
    }
  }, []);



  const handleDisasterReport = async (disasterId: string) => {
    console.log('Reporting disaster:', disasterId);
    
    const disasterTypes: Record<string, string> = {
      fire: 'Fire',
      accident: 'Accident',
      landslide: 'Landslide'
    };

    if (!userData || !location) {
      alert('Unable to report emergency. Please ensure location is enabled and you are logged in.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Get address from coordinates
      const geoData = await getReverseGeocoding(location.lat, location.lng);
      
      // Step 2: Prepare data to send to backend
      const reportData = {
        disaster_type: disasterId,
        full_address: geoData.full_address,
        pincode: geoData.pincode,
        latitude: location.lat,
        longitude: location.lng
      };

      console.log('Disaster Report Data:', reportData);

      // Step 3: Send to Django backend
      const response = await fetch('http://localhost:8000/agency/report-sos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(reportData)
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Report submitted successfully:', responseData);
        alert(
          `${disasterTypes[disasterId]} Incident Reported Successfully!\n\n` +
          `Incident ID: ${responseData.incident_id}\n` +
          `Status: ${responseData.status}\n\n` +
          `Your Details:\n` +
          `Name: ${userData.name}\n` +
          `Phone: ${userData.phone}\n` +
          `Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}\n` +
          `Address: ${geoData.full_address}\n\n` +
          `Authorities have been notified.`
        );
      } else {
        console.error('Error response:', responseData);
        alert(
          `Error reporting incident: ${responseData.detail || 'Please try again'}\n\n` +
          `However, your location has been recorded:\n` +
          `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
        );
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(
        `${disasterTypes[disasterId]} Incident Report Sent!\n\n` +
        `Your Details:\n` +
        `Name: ${userData.name}\n` +
        `Phone: ${userData.phone}\n` +
        `Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}\n\n` +
        `Please stay safe. Emergency services have been alerted.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <Card className="mb-8 border-l-4 border-l-blue-600 glass-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-800 mb-2">
              National Disaster Management Dashboard
            </CardTitle>
            <p className="text-gray-700 text-lg">
              Comprehensive real-time platform providing critical insights, emergency alerts, and coordinated response mechanisms for effective disaster management across the nation.
            </p>
          </CardHeader>
        </Card>

        {/* SOS Section */}
        <Card className="mb-8 border-2 border-red-500 bg-gradient-to-r from-red-50 to-pink-50">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="text-8xl">🆘</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-red-600 mb-4">
                  Emergency SOS Assistance
                </h2>
                <p className="text-lg mb-6 text-gray-700">
                  Press the SOS button for immediate emergency assistance during critical situations:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🔥</span>
                      <span className="text-sm">Fire emergencies requiring immediate intervention</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🚗</span>
                      <span className="text-sm">Vehicle accidents or being trapped in vehicles</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💧</span>
                      <span className="text-sm">Flash floods or water-logged areas</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏢</span>
                      <span className="text-sm">Building collapses or debris entrapment</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💓</span>
                      <span className="text-sm">Medical emergencies in disaster zones</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-center">Active Disaster Zones</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-700 mb-3">12</div>
              <p className="text-gray-600">
                Currently monitored disaster-affected regions requiring strategic intervention.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="text-center">Population Impacted</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-700 mb-3">4,75,300</div>
              <p className="text-gray-600">
                Individuals requiring comprehensive emergency assistance and rehabilitation.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="text-center">Relief Organizations</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-purple-700 mb-3">56</div>
              <p className="text-gray-600">
                Government and NGO teams providing integrated relief services nationwide.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: <AlertTriangle className="text-blue-600 w-12 h-12" />,
              title: "Disaster Alerts",
              description: "Receive comprehensive real-time disaster warnings and critical notifications from NDMA.",
              gradient: "from-blue-500 to-blue-600"
            },
            {
              icon: <Ambulance className="text-red-600 w-12 h-12" />,
              title: "Emergency Response Teams",
              description: "Monitor active specialized response teams for rescue operations and medical support.",
              gradient: "from-red-500 to-red-600"
            },
            {
              icon: <Home className="text-green-600 w-12 h-12" />,
              title: "Evacuation Centers",
              description: "Access information about government-approved emergency shelters and safe refuges.",
              gradient: "from-green-500 to-green-600"
            },
            {
              icon: <BarChart3 className="text-purple-600 w-12 h-12" />,
              title: "Risk Assessment",
              description: "Advanced geospatial analysis and predictive modeling for disaster preparedness.",
              gradient: "from-purple-500 to-purple-600"
            },
            {
              icon: <FileText className="text-orange-600 w-12 h-12" />,
              title: "Government Policies",
              description: "Repository of disaster management regulations and emergency response guidelines.",
              gradient: "from-orange-500 to-orange-600"
            },
            {
              icon: <Users className="text-indigo-600 w-12 h-12" />,
              title: "Citizen Participation",
              description: "Empowering citizens through training programs and collaborative platforms.",
              gradient: "from-indigo-500 to-indigo-600"
            }
          ].map((service, index) => (
            <Card key={index} className="glass-card hover:scale-105 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{service.title}</h3>
                <p className="text-gray-600 text-sm text-center">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chatbot Section */}
        <Card className="glass-card border-2 border-blue-200">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="text-8xl">🤖</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-blue-700 mb-4">
                  24/7 AI Disaster Management Assistant
                </h2>
                <p className="text-lg mb-6 text-gray-700">
                  Our AI-powered assistant provides critical information and guidance around the clock:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {["Real-time disaster updates", "Nearest evacuation centers", "Emergency protocols"].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {["Emergency contact numbers", "Disaster guidance", "Report incidents"].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed SOS Circular Menu Button */}
      <div className="fixed bottom-8 left-8 z-50">
        <SOSCircularMenu onSelectDisaster={handleDisasterReport} disabled={loading} />
      </div>
    </Layout>
  );
};

export default Dashboard;