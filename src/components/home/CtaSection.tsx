
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const CtaSection = () => {
  const { user } = useAuth();

  const scrollToBookingForm = () => {
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If booking form is not on this page, navigate to the homepage
      window.location.href = '/#booking';
    }
  };

  return (
    <div className="bg-healthcare-primary/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:flex lg:items-center lg:justify-between">
          <div className="lg:max-w-2xl">
            <ShieldCheck className="h-8 w-8 text-healthcare-primary mb-4" />
            <h2 className="text-3xl font-bold text-healthcare-dark mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-gray-600 mb-8 lg:mb-0">
              Join thousands of users who are already benefiting from our AI-powered healthcare platform. 
              Your health data is secure with our HIPAA-compliant systems.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-healthcare-primary hover:bg-healthcare-primary/90 shadow-md w-full">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="bg-healthcare-primary hover:bg-healthcare-primary/90 shadow-md w-full">
                    Sign Up Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-healthcare-primary text-healthcare-primary hover:bg-healthcare-primary/10 w-full"
                  onClick={scrollToBookingForm}
                >
                  Book a Consultation
                  <CalendarCheck className="ml-2 h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;
