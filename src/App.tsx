
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Organization from "./pages/Organization";
import DisasterZones from "./pages/DisasterZones";
import EmergencyContacts from "./pages/EmergencyContacts";
import VolunteerLogin from "./pages/VolunteerLogin";
import AgencyLogin from "./pages/AgencyLogin";
import MinisterLogin from "./pages/MinisterLogin";
import ReportDisaster from "./pages/ReportDisaster";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/disaster-zones" element={<DisasterZones />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/volunteer-login" element={<VolunteerLogin />} />
          <Route path="/agency-login" element={<AgencyLogin />} />
          <Route path="/minister-login" element={<MinisterLogin />} />
          <Route path="/report-disaster" element={<ReportDisaster />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
