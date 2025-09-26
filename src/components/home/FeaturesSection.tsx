
import { Link } from "react-router-dom";
import { ClipboardCheck, Brain, Hospital, MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  const features = [
    {
      icon: ClipboardCheck,
      title: "Smart Diagnosis",
      description: "Get AI-powered preliminary health assessments and recommendations.",
      path: "/diagnosis"
    },
    {
      icon: FileText,
      title: "Medical Reports Analysis",
      description: "Upload your medical reports for AI-powered analysis and detailed insights.",
      path: "/diagnosis",
      highlight: true
    },
    {
      icon: Brain,
      title: "Mental Health",
      description: "Access professional mental health resources and support.",
      path: "/mental-health"
    },
    {
      icon: Hospital,
      title: "Hospital Locator",
      description: "Find nearby hospitals and healthcare facilities instantly.",
      path: "/hospitals"
    },
    {
      icon: MessageCircle,
      title: "AI Health Assistant",
      description: "24/7 AI-powered health assistant for your questions.",
      path: "/ai-assistant"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-healthcare-dark mb-4">Key Features</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Our comprehensive healthcare platform provides everything you need to manage your health effectively.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`group relative bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border ${feature.highlight ? 'border-healthcare-primary' : 'border-gray-200'} hover:border-healthcare-primary transition-all duration-300 animate-fade-up ${feature.highlight ? 'ring-2 ring-healthcare-primary/20' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`h-12 w-12 rounded-xl ${feature.highlight ? 'bg-healthcare-primary/20' : 'bg-healthcare-primary/10'} flex items-center justify-center mb-4 group-hover:bg-healthcare-primary/20 transition-colors`}>
              <feature.icon className="h-6 w-6 text-healthcare-primary" />
            </div>
            <h3 className="text-xl font-semibold text-healthcare-dark mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {feature.description}
            </p>
            <Link to={feature.path}>
              <Button className={`w-full ${feature.highlight ? 'bg-healthcare-primary hover:bg-healthcare-primary/90' : ''}`} variant={feature.highlight ? "default" : "outline"}>
                {feature.highlight ? "Analyze Now" : "Learn More"}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
