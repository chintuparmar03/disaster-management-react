
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/organization", label: "Partner Organizations" },
    { path: "/disaster-zones", label: "Disaster Zones" },
    { path: "/emergency-contacts", label: "Emergency Contacts" },
    { path: "/volunteer-login", label: "Volunteer Login" },
    { path: "/agency-login", label: "Agency Login" },
  ];

  return (
    <nav className="bg-white shadow-md border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3 text-xl font-bold text-blue-800">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="hidden md:block">National Disaster Management Platform</span>
          </Link>
          
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block pb-4`}>
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
