
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

const VolunteerLogin = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Card className="w-full max-w-md border-2 border-blue-900">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900">Volunteer Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="volunteerId">Volunteer ID</Label>
                <Input 
                  id="volunteerId" 
                  type="email" 
                  placeholder="Enter your email"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  required 
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
              
              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
                Login
              </Button>
              
              <div className="text-center space-y-2">
                <Link to="#" className="text-sm text-blue-600 hover:underline">
                  Forgot Volunteer ID?
                </Link>
                <p className="text-sm">
                  Agency Login? <Link to="/agency-login" className="text-blue-600 hover:underline">Login Here</Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VolunteerLogin;
