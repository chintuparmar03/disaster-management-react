import Layout from "@/components/Layout";
import { AlertTriangle, Ambulance, Home, BarChart3, FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SOSCircularMenu from "@/components/SOSCircularMenu";
import { reportEmergencySOS, getCitizenData, getErrorMessage } from "@/services/api";

interface UserData {
  name: string;
  phone: string;
  lat: number;
  lng: number;
}

interface LocationState {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

const Dashboard = () => {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isAcquiringLocation, setIsAcquiringLocation] = useState(true);

  useEffect(() => {
    // Get user data from localStorage or use service function
    const citizenData = getCitizenData();
    
    if (citizenData || localStorage.getItem('citizen_data')) {
      try {
        const data = citizenData || JSON.parse(localStorage.getItem('citizen_data') || '{}');
        setUserData({
          name: data.first_name || data.firstName || 'Citizen',
          phone: data.phone_number || data.phone || '',
          lat: 0,
          lng: 0
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Get live location with high accuracy
    if (navigator.geolocation) {
      console.log('[Location] Requesting geolocation with high accuracy...');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          console.log('[Location Success]', {
            latitude,
            longitude,
            accuracy,
            timestamp: position.timestamp
          });

          // Validate coordinates
          if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
            console.error('[Location] Invalid coordinates received:', latitude, longitude);
            setLocationError('Invalid coordinates received from geolocation.');
            setIsAcquiringLocation(false);
            return;
          }

          const locationData: LocationState = {
            lat: latitude,
            lng: longitude,
            accuracy: accuracy,
            timestamp: position.timestamp
          };

          setLocation(locationData);
          setLocationError(null);
          setIsAcquiringLocation(false);

          // Update userData with location
          setUserData(prev => prev ? { 
            ...prev, 
            lat: latitude, 
            lng: longitude 
          } : null);

          console.log('[Location] Location acquired successfully');
        },
        (error) => {
          let errorMessage = 'Unable to get your location.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable it in browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check GPS/WiFi.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'Unknown error occurred while fetching location.';
          }

          console.error('[Location Error]', error.code, error.message);
          setLocationError(errorMessage);
          setIsAcquiringLocation(false);
        },
        {
          enableHighAccuracy: true,    // Request GPS instead of IP-based location
          timeout: 15000,              // Wait up to 15 seconds
          maximumAge: 0                // Don't use cached position
        }
      );
    } else {
      console.error('[Location] Geolocation is not supported by this browser.');
      setLocationError('Geolocation is not supported by your browser.');
      setIsAcquiringLocation(false);
    }
  }, []);

  // Validate coordinates before sending
  const validateCoordinates = (coords: LocationState | null): boolean => {
    if (!coords) {
      return false;
    }

    const { lat, lng } = coords;

    // Check for hardcoded zeros
    if (lat === 0 && lng === 0) {
      console.warn('[Validation] Coordinates are (0, 0) - likely not initialized');
      return false;
    }

    // Validate ranges
    if (Math.abs(lat) > 90) {
      console.error('[Validation] Latitude out of range:', lat);
      return false;
    }

    if (Math.abs(lng) > 180) {
      console.error('[Validation] Longitude out of range:', lng);
      return false;
    }

    return true;
  };

  const handleDisasterReport = async (disasterId: string) => {
    console.log('[DisasterReport] Initiating report for disaster:', disasterId);
    
    const disasterTypes: Record<string, string> = {
      fire: 'Fire',
      accident: 'Accident',
      landslide: 'Landslide'
    };

    // Validate location
    if (!location) {
      const message = locationError || 'Unable to acquire your location. Please ensure GPS/location permission is enabled and try again.';
      console.warn('[DisasterReport] Location not available:', message);
      alert(message);
      return;
    }

    // Validate coordinates
    if (!validateCoordinates(location)) {
      console.warn('[DisasterReport] Coordinates validation failed');
      alert('Location coordinates are invalid. Please wait a moment and try again.');
      return;
    }

    // Validate user data
    if (!userData) {
      console.warn('[DisasterReport] User data not found');
      alert('User data not found. Please login again.');
      return;
    }

    setLoading(true);

    try {
      // Prepare data exactly as backend expects
      const emergencyData = {
        disaster_type: disasterId,
        latitude: location.lat,
        longitude: location.lng,
        full_address: '',  // Backend will fill this via reverse geocoding
        pincode: ''        // Backend will fill this via reverse geocoding
      };

      console.log('[DisasterReport] Sending emergency data:', {
        ...emergencyData,
        accuracy: location.accuracy,
        timestamp: new Date(location.timestamp).toISOString()
      });

      // Use service function to report emergency
      const response = await reportEmergencySOS(emergencyData);

      console.log('[DisasterReport] Report submitted successfully:', response.data);
      
      alert(
        `${disasterTypes[disasterId]} Incident Reported Successfully!\n\n` +
        `Incident ID: ${response.data.incident_id}\n` +
        `Status: ${response.data.status}\n\n` +
        `Your Details:\n` +
        `Name: ${userData.name}\n` +
        `Phone: ${userData.phone}\n` +
        `Location: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}\n` +
        `Accuracy: ±${location.accuracy.toFixed(0)}m\n\n` +
        `Message: ${response.data.message}\n\n` +
        `Authorities have been notified.`
      );
    } catch (error: any) {
      console.error('[DisasterReport] Error submitting report:', error);
      
      const errorMessage = getErrorMessage(error);
      
      alert(
        `Error reporting incident:\n${errorMessage}\n\n` +
        `Your Location:\n` +
        `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}\n` +
        `Accuracy: ±${location.accuracy.toFixed(0)}m\n\n` +
        `Please try again or contact support.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Location Status Banner */}
        {isAcquiringLocation && (
          <Card className="mb-8 border-l-4 border-l-yellow-500 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                <span className="text-yellow-800 font-semibold">Acquiring your location...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {locationError && (
          <Card className="mb-8 border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-red-600">⚠️</span>
                <div className="flex-1">
                  <p className="text-red-800 font-semibold">Location Error</p>
                  <p className="text-red-700 text-sm">{locationError}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {location && !locationError && (
          <Card className="mb-8 border-l-4 border-l-green-500 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-green-600">✓</span>
                <div>
                  <p className="text-green-800 font-semibold">Location Acquired</p>
                  <p className="text-green-700 text-sm">
                    Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)} (Accuracy: ±{location.accuracy.toFixed(0)}m)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                      <span className="text-2xl">⛏️</span>
                      <span className="text-sm">Landslides or ground instability</span>
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
        <SOSCircularMenu onSelectDisaster={handleDisasterReport} disabled={loading || isAcquiringLocation} />
      </div>
    </Layout>
  );
};

export default Dashboard;