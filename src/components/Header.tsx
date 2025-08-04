
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src="/images/ndma.jpg" 
            alt="NDMA Logo" 
            className="h-16 w-16 rounded-full border-2 border-white/20"
          />
          <div className="text-white">
            <h1 className="text-xl font-bold">भारत सरकार | Government of India</h1>
            <p className="text-blue-100 text-sm">National Disaster Management Authority</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <img 
            src="/images/image1.jpg" 
            alt="Emblem of India" 
            className="h-12 w-auto"
          />
          <img 
            src="/images/azadi.jpg" 
            alt="Home Ministry Logo" 
            className="h-12 w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
