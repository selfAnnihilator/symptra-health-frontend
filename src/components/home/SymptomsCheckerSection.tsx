import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, MessageSquareText, SearchCheck } from "lucide-react";

const SymptomsCheckerSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-healthcare-dark mb-4">
          Unsure About Your Symptoms?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Use our AI-powered symptom checker to get insights into possible conditions.
          It's quick, easy, and provides preliminary guidance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-md">
            <CardContent className="p-6 flex flex-col items-center">
              <Stethoscope className="h-12 w-12 text-healthcare-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Symptom Analysis</h3>
              <p className="text-gray-600 text-center mb-4">
                Input your symptoms and receive a list of potential conditions.
              </p>
              <Button asChild variant="outline" className="mt-auto w-full">
                <div>
                  <Link to="/diagnosis" className="w-full h-full flex items-center justify-center">
                    Start Checking
                  </Link>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6 flex flex-col items-center">
              <SearchCheck className="h-12 w-12 text-healthcare-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Medical Reports Analysis</h3>
              <p className="text-gray-600 text-center mb-4">
                Upload your medical reports for a quick AI-powered summary and insights.
              </p>
              <Button asChild className="mt-auto w-full">
                <div>
                  <Link to="/medical-report" className="w-full h-full flex items-center justify-center">
                    Analyze Now
                  </Link>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6 flex flex-col items-center">
              <MessageSquareText className="h-12 w-12 text-healthcare-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Guidance</h3>
              <p className="text-gray-600 text-center mb-4">
                Get advice on whether a doctor's visit is recommended based on your input.
              </p>
              <Button asChild variant="outline" className="mt-auto w-full">
                <div>
                  <Link to="/ai-assistant" className="w-full h-full flex items-center justify-center">
                    Ask AI Assistant
                  </Link>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SymptomsCheckerSection;