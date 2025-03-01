
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { XCircle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sl-darker px-4">
      <div className="sl-card max-w-md w-full text-center py-12 animate-fade-in">
        <XCircle className="w-20 h-20 text-sl-blue mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-3 text-white">404 - Page Not Found</h1>
        <div className="inline-block px-3 py-1 rounded-full bg-sl-dark border border-sl-blue/30 text-sl-blue text-sm mb-3">
          System Error
        </div>
        <p className="text-xl text-white mb-6">Coordinates Not Found</p>
        <p className="text-slate-400 mb-8">
          The hunter location you're trying to access doesn't exist or has been moved to another dimension.
        </p>
        <a 
          href="/" 
          className="sl-button inline-flex items-center"
        >
          <Home className="w-5 h-5 mr-2" />
          <span>Return to Base</span>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
