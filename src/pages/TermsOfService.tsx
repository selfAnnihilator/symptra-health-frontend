
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-healthcare-dark mb-8 text-center">Terms of Service</h1>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="prose max-w-none text-gray-700 space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Introduction</h2>
                  <p>
                    Welcome to HealthAI. By accessing or using our website, mobile application, and services, you agree to be bound by these Terms of Service ("Terms"). Please read these Terms carefully before using our platform.
                  </p>
                  <p>
                    If you do not agree with any part of these Terms, you may not access or use our services.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Definitions</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>"Service"</strong> refers to the HealthAI website, mobile application, and all content, services, and products available through them.
                    </li>
                    <li>
                      <strong>"User"</strong> refers to any individual who accesses or uses our Service.
                    </li>
                    <li>
                      <strong>"Content"</strong> refers to any information, data, text, software, graphics, or other materials displayed, generated, or accessible through our Service.
                    </li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Use of Service</h2>
                  <p>
                    Our Service is intended to provide health information and tools to help users make informed decisions about their health. However, the Service is not intended to replace professional medical advice, diagnosis, or treatment.
                  </p>
                  <p>
                    You acknowledge and agree that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You will use the Service in compliance with all applicable laws and regulations.</li>
                    <li>You will not use the Service for any illegal or unauthorized purpose.</li>
                    <li>You will provide accurate, current, and complete information when creating an account.</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                    <li>You will promptly notify us of any unauthorized use of your account.</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Medical Disclaimer</h2>
                  <p>
                    The content provided through our Service is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                  </p>
                  <p>
                    The AI symptom checker and other diagnostic tools are designed to assist users in understanding potential health conditions but should not be relied upon as the sole basis for healthcare decisions.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">User Content</h2>
                  <p>
                    You retain ownership of any content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content for the purpose of providing and improving our Service.
                  </p>
                  <p>
                    You are solely responsible for any content you provide and the consequences of sharing it.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Intellectual Property</h2>
                  <p>
                    The Service and its original content, features, and functionality are owned by HealthAI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p>
                    You may not copy, modify, distribute, sell, or lease any part of our Service without our explicit permission.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Privacy</h2>
                  <p>
                    Your use of our Service is also governed by our Privacy Policy, which can be found at <a href="/privacy-policy" className="text-healthcare-primary hover:underline">Privacy Policy</a>.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Limitation of Liability</h2>
                  <p>
                    To the maximum extent permitted by law, HealthAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the Service.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting an announcement on our Service or sending you an email. Your continued use of the Service after such modifications constitutes your acceptance of the revised Terms.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Governing Law</h2>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Contact Us</h2>
                  <p>
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <p className="mt-2">
                    Email: legal@healthai.com<br />
                    Address: 123 Health Street, Medical Center, CA 90210<br />
                    Phone: +1 (800) HEALTH-AI
                  </p>
                </section>
                
                <p className="text-sm text-gray-500 italic mt-8">
                  Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
