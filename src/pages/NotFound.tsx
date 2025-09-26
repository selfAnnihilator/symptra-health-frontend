
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="pt-32 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-healthcare-primary">404</h1>
          <p className="text-xl text-gray-600 mb-8">This page is under construction</p>
          <Button asChild>
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Return Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
