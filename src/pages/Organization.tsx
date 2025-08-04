
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Organization = () => {
  const organizations = [
    {
      icon: "🚑",
      name: "National Disaster Response Force (NDRF)",
      description: "India's frontline force for disaster response, specializing in rescue and relief operations.",
      operations: [
        "Earthquake rescue missions in Nepal",
        "Flood relief operations in Assam", 
        "Cyclone response in West Bengal"
      ],
      gradient: "from-red-500 to-red-600"
    },
    {
      icon: "🌪",
      name: "Indian Meteorological Department (IMD)",
      description: "Responsible for weather forecasting and early warning systems for natural disasters.",
      operations: [
        "Early warning alerts for cyclones",
        "Weather predictions for flood-prone areas",
        "Real-time earthquake monitoring"
      ],
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: "📚",
      name: "National Institute of Disaster Management (NIDM)",
      description: "Premier institute focusing on disaster preparedness, training, and policy research.",
      operations: [
        "Training for disaster first responders",
        "National-level policy research",
        "Community awareness programs"
      ],
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: "❤",
      name: "Indian Red Cross Society (IRCS)",
      description: "Humanitarian organization providing emergency relief, medical aid, and shelter.",
      operations: [
        "COVID-19 medical assistance",
        "Flood relief camps in Kerala",
        "Earthquake relief in Gujarat"
      ],
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: "🏛",
      name: "State Disaster Response Fund (SDRF)",
      description: "Coordinates state-level disaster relief, evacuation, and mitigation programs.",
      operations: [
        "Relief efforts during Maharashtra floods",
        "Wildfire management in Uttarakhand",
        "Drought assistance in Rajasthan"
      ],
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: "🌍",
      name: "United Nations Disaster Relief (UNDRR)",
      description: "International agency supporting India's disaster risk reduction and resilience-building.",
      operations: [
        "Climate change adaptation strategies",
        "Funding for disaster-prone communities",
        "Technical expertise in disaster mitigation"
      ],
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 border-l-4 border-l-blue-600 glass-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-800 mb-2">Partner Organizations</CardTitle>
            <p className="text-gray-700 text-lg">
              Key organizations working for disaster response, preparedness, and mitigation across India.
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {organizations.map((org, index) => (
            <Card key={index} className="glass-card hover:scale-105 transition-all duration-300 group overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${org.gradient} text-white p-6`}>
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{org.icon}</div>
                  <CardTitle className="text-xl font-bold leading-tight">{org.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{org.description}</p>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3 text-sm">Key Operations:</h5>
                  <ul className="space-y-2">
                    {org.operations.map((operation, opIndex) => (
                      <li key={opIndex} className="text-xs text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        <span>{operation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Organization;
