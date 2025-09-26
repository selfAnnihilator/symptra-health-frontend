
import { Zap, Brain, Hospital } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-healthcare-dark mb-4">How It Works</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Our platform combines advanced AI technology with medical expertise to provide you with reliable health insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative flex flex-col items-center text-center p-6">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-healthcare-primary text-white flex items-center justify-center font-bold">
              1
            </div>
            <Zap className="h-12 w-12 text-healthcare-primary mb-4" />
            <h3 className="text-xl font-bold text-healthcare-dark mb-2">Check Your Symptoms</h3>
            <p className="text-gray-600">
              Input your symptoms into our AI-powered checker for instant preliminary assessments.
            </p>
          </div>
          
          <div className="relative flex flex-col items-center text-center p-6">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-healthcare-primary text-white flex items-center justify-center font-bold">
              2
            </div>
            <Brain className="h-12 w-12 text-healthcare-primary mb-4" />
            <h3 className="text-xl font-bold text-healthcare-dark mb-2">Get AI Insights</h3>
            <p className="text-gray-600">
              Receive personalized health recommendations based on advanced AI analysis.
            </p>
          </div>
          
          <div className="relative flex flex-col items-center text-center p-6">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-healthcare-primary text-white flex items-center justify-center font-bold">
              3
            </div>
            <Hospital className="h-12 w-12 text-healthcare-primary mb-4" />
            <h3 className="text-xl font-bold text-healthcare-dark mb-2">Connect with Care</h3>
            <p className="text-gray-600">
              Find healthcare providers and facilities based on your specific needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
