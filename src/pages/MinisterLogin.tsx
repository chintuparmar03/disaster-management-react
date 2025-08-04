
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const MinisterLogin = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Card className="w-full max-w-md border-2 border-blue-900">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900">Minister Login</CardTitle>
            <p className="text-sm text-gray-600">High-level administrative access</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ministerId">Minister ID</Label>
                <Input 
                  id="ministerId" 
                  type="text" 
                  placeholder="Enter your minister ID"
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

              <div className="space-y-2">
                <Label htmlFor="otp">Security OTP</Label>
                <Input 
                  id="otp" 
                  type="text" 
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required 
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">Remember this device</Label>
              </div>
              
              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
                Secure Login
              </Button>
              
              <div className="text-center">
                <button type="button" className="text-sm text-blue-600 hover:underline">
                  Request New OTP
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MinisterLogin;
