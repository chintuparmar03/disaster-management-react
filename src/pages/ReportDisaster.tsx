
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Upload } from "lucide-react";

const ReportDisaster = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto border-2 border-blue-900">
          <CardHeader className="text-center bg-blue-50">
            <CardTitle className="text-2xl text-blue-900 flex items-center justify-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Disaster Report
            </CardTitle>
            <p className="text-gray-700">Report a disaster incident for immediate response</p>
          </CardHeader>
          <CardContent className="p-6">
            <form className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Enter your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input id="mobile" type="tel" placeholder="Enter your mobile number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" min="18" max="120" placeholder="Enter your age" required />
                </div>
              </div>

              {/* Aadhaar Section */}
              <Card className="bg-blue-50 border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Aadhaar Card Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number</Label>
                      <Input 
                        id="aadhaar" 
                        pattern="[0-9]{12}" 
                        placeholder="12-digit Aadhaar Number" 
                        maxLength={12}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhaarFront">Aadhaar Card (Front)</Label>
                      <Input id="aadhaarFront" type="file" accept="image/*,.pdf" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaarBack">Aadhaar Card (Back)</Label>
                    <Input id="aadhaarBack" type="file" accept="image/*,.pdf" required />
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Applicant Address</Label>
                  <Textarea id="address" placeholder="Enter your complete address" rows={3} required />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Enter city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" pattern="[0-9]{6}" placeholder="6-digit pincode" maxLength={6} required />
                  </div>
                </div>
              </div>

              {/* Disaster Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="disasterType">Type of Disaster</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Disaster Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flood">Flood</SelectItem>
                      <SelectItem value="earthquake">Earthquake</SelectItem>
                      <SelectItem value="cyclone">Cyclone</SelectItem>
                      <SelectItem value="landslide">Landslide</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disasterImage">Upload Disaster Image</Label>
                  <Input id="disasterImage" type="file" accept="image/*" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="disasterAddress">Disaster Location Address</Label>
                <Textarea 
                  id="disasterAddress" 
                  placeholder="Provide detailed location of the disaster" 
                  rows={3} 
                  required 
                />
              </div>

              <div className="text-center pt-4">
                <Button type="submit" size="lg" className="bg-blue-900 hover:bg-blue-800">
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Disaster Report
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportDisaster;
