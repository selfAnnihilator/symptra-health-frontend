import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { EnhancedDiagnosis } from "@/components/diagnosis/EnhancedDiagnosis";

const Diagnosis = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full p-3 mb-4">
              <Stethoscope className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-healthcare-dark mb-3">AI-Powered Health Assessment</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get instant insights about your health concerns with our advanced symptom checker and analysis tools.
            </p>
          </div>

          {/* Main Diagnosis Component */}
          <EnhancedDiagnosis />

          {/* Disclaimer Section */}
          <section className="mt-16">
            <Card className="shadow-lg border-0 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Important Medical Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-700 mb-4">
                    The information provided by our AI health assessment tool is for <strong>informational purposes only</strong> and should not be considered as medical advice, diagnosis, or treatment.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Never disregard professional medical advice or delay seeking it because of something you have read or interpreted from this tool.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>In case of a medical emergency, call your doctor or emergency services immediately.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Additional Resources */}
          <section className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Find a Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Connect with healthcare professionals in your area.</p>
                <Button variant="outline" className="w-full">Search Doctors</Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Health Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Read our latest health and wellness articles.</p>
                <Button variant="outline" className="w-full">Browse Articles</Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Emergency Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Immediate assistance for urgent medical needs.</p>
                <Button variant="destructive" className="w-full">Emergency Contacts</Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;