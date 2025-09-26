import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left max-w-2xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-healthcare-primary/10 text-healthcare-primary text-sm font-medium mb-4">
            <CheckCircle className="h-4 w-4 mr-2" /> HIPAA Compliant & Secure
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-healthcare-dark leading-tight mb-6">
            Your Health, <span className="text-healthcare-primary">Simplified</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Experience the future of healthcare with our AI-powered platform. Get
            instant health insights, connect with local hospitals, and manage your
            health journey all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button asChild size="lg">
              <Link to={user ? "/dashboard" : "/signup"}>
                {user ? "Go to Dashboard" : "Get Started Now"}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact-us">Contact Us</Link>
            </Button>
          </div>
          <div className="mt-8 text-gray-500 text-sm flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <p>Trusted by healthcare providers nationwide:</p>
            <div className="flex items-center gap-3">
              {/* Placeholder logos - replace with actual image paths if available */}
              <img src="https://placehold.co/150x50?text=Wellness" alt="Wellness Logo" className="h-8" />
              <img src="https://placehold.co/150x50?text=Memorial+Hospital" alt="Memorial Hospital Logo" className="h-8" />
              <img src="https://placehold.co/150x50?text=MedTech" alt="MedTech Logo" className="h-8" />
            </div>
          </div>
        </div>
        <div className="mt-10 md:mt-0 flex-shrink-0">
          {/* Replace with your doctor.jpg image */}
          <img 
            src="/doctor.jpg" // Changed image source
            alt="Doctor illustration" 
            className="rounded-lg shadow-xl w-full h-auto max-w-md" // Added max-w-md for better responsiveness
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;