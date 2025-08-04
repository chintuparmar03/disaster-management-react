
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

const EmergencyContacts = () => {
  const contacts = [
    {
      name: "National Emergency Response Center",
      phone: "112",
      email: "emergency@ndma.gov.in",
      address: "New Delhi",
      type: "National"
    },
    {
      name: "NDRF Control Room",
      phone: "011-26701728",
      email: "ndrf@nic.in",
      address: "Ghaziabad, UP",
      type: "Rescue"
    },
    {
      name: "Fire Services",
      phone: "101",
      email: "fire@delhi.gov.in",
      address: "Delhi Fire Service",
      type: "Fire"
    },
    {
      name: "Police Emergency",
      phone: "100",
      email: "police@delhi.gov.in",
      address: "Delhi Police HQ",
      type: "Police"
    },
    {
      name: "Medical Emergency",
      phone: "108",
      email: "medical@emergency.gov.in",
      address: "All India Institute",
      type: "Medical"
    },
    {
      name: "Disaster Management Control Room",
      phone: "1078",
      email: "control@ndma.gov.in",
      address: "NDMA Headquarters",
      type: "Disaster"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="border-l-4 border-l-blue-900 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Emergency Contacts</CardTitle>
              <p className="text-gray-700">
                Important contact numbers for emergency situations and disaster response.
              </p>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact, index) => (
            <Card key={index} className="border-2 border-blue-900 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{contact.name}</CardTitle>
                <span className="text-sm text-blue-600 font-medium">{contact.type}</span>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <a href={`tel:${contact.phone}`} className="text-green-600 font-bold text-lg">
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <a href={`mailto:${contact.email}`} className="text-blue-600 text-sm">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600 text-sm">{contact.address}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyContacts;
