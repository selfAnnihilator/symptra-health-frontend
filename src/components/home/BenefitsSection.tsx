
import { CheckCircle, Users, Shield, Award } from "lucide-react";

const BenefitsSection = () => {
  return (
    <div className="bg-healthcare-dark text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            Our platform offers unique benefits that set us apart from traditional healthcare solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start space-x-4">
            <div className="bg-healthcare-primary/20 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-healthcare-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Advanced AI Technology</h3>
              <p className="text-gray-300">
                Our proprietary AI algorithms provide accurate health assessments based on the latest medical research.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-healthcare-primary/20 p-2 rounded-lg">
              <Users className="h-6 w-6 text-healthcare-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Expert-Backed Insights</h3>
              <p className="text-gray-300">
                All AI recommendations are developed and validated by qualified healthcare professionals.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-healthcare-primary/20 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-healthcare-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Data Security & Privacy</h3>
              <p className="text-gray-300">
                Your health information is encrypted and protected with the highest security standards.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-healthcare-primary/20 p-2 rounded-lg">
              <Award className="h-6 w-6 text-healthcare-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Care</h3>
              <p className="text-gray-300">
                From physical to mental health, we provide a holistic approach to healthcare.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
