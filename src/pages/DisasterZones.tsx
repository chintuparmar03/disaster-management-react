
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DisasterZones = () => {
  const disasters = [
    {
      title: "Flood-Prone Regions",
      areas: "Assam, Bihar, Uttar Pradesh",
      impact: "River overflow, severe waterlogging, displacement of communities",
      safety: "Move to higher ground, avoid walking in floodwaters, stay updated on evacuation alerts.",
      status: "High Alert",
      statusColor: "destructive",
      image: "/images/flood.jpg"
    },
    {
      title: "Cyclone Warning",
      areas: "Odisha, West Bengal, Andhra Pradesh", 
      impact: "Strong winds (120+ km/h), coastal flooding, heavy rainfall",
      safety: "Stay indoors, secure loose objects, follow evacuation advisories.",
      status: "Warning",
      statusColor: "secondary",
      image: "/images/cyclone.jpg"
    },
    {
      title: "Landslide Risk",
      areas: "Himachal Pradesh, Uttarakhand, Northeast India",
      impact: "Rockfall, roadblocks, disruption of communication networks",
      safety: "Avoid travel near slopes, listen to local warnings, stay in safe zones.",
      status: "Monitoring",
      statusColor: "outline",
      image: "/images/earthquake.jpg"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="border-l-4 border-l-blue-900 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Disaster Zones</CardTitle>
              <p className="text-gray-700">
                Key regions currently affected by disasters, with ongoing response, preparedness, and mitigation efforts.
              </p>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disasters.map((disaster, index) => (
            <Card key={index} className="border-2 border-blue-900 hover:scale-105 transition-transform duration-300">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img 
                  src={disaster.image} 
                  alt={disaster.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-3">{disaster.title}</CardTitle>
                <div className="space-y-2 text-sm">
                  <p><strong>Affected Areas:</strong> {disaster.areas}</p>
                  <p><strong>Impact:</strong> {disaster.impact}</p>
                  <p><strong>Safety Tips:</strong> {disaster.safety}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant={disaster.statusColor as any}>{disaster.status}</Badge>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DisasterZones;
