
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-healthcare-dark mb-8 text-center">Privacy Policy</h1>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="prose max-w-none text-gray-700 space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Introduction</h2>
                  <p>
                    HealthAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                  </p>
                  <p>
                    Please read this Privacy Policy carefully. By accessing or using our platform, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this policy.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Information We Collect</h2>
                  <p>We may collect the following types of information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Personal Identification Information:</strong> Name, email address, phone number, date of birth, and other information you provide when creating an account or profile.
                    </li>
                    <li>
                      <strong>Health Information:</strong> Medical history, symptoms, diagnoses, treatments, and other health-related data you provide when using our services.
                    </li>
                    <li>
                      <strong>Device Information:</strong> IP address, browser type, operating system, and other technical information about your device.
                    </li>
                    <li>
                      <strong>Usage Data:</strong> Information about how you interact with our platform, including pages visited, features used, and time spent.
                    </li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">How We Use Your Information</h2>
                  <p>We may use the information we collect for various purposes, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Providing and improving our services</li>
                    <li>Personalizing your experience</li>
                    <li>Processing appointments and consultations</li>
                    <li>Communicating with you about your account or our services</li>
                    <li>Analyzing usage patterns to enhance our platform</li>
                    <li>Ensuring the security and integrity of our services</li>
                    <li>Complying with legal obligations</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">HIPAA Compliance</h2>
                  <p>
                    As a healthcare service provider, we comply with the Health Insurance Portability and Accountability Act (HIPAA). We implement appropriate safeguards to protect the privacy and security of your protected health information (PHI) as required by law.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Information Sharing and Disclosure</h2>
                  <p>
                    We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>With healthcare providers involved in your care</li>
                    <li>With third-party service providers who perform services on our behalf</li>
                    <li>In response to legal requests or to comply with applicable laws</li>
                    <li>To protect our rights, privacy, safety, or property</li>
                    <li>In connection with a business transaction, such as a merger or acquisition</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Your Rights and Choices</h2>
                  <p>
                    You have certain rights regarding your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Accessing and updating your information</li>
                    <li>Requesting deletion of your data</li>
                    <li>Opting out of marketing communications</li>
                    <li>Setting browser cookies preferences</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Changes to This Privacy Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold text-healthcare-primary mb-4">Contact Us</h2>
                  <p>
                    If you have questions or concerns about this Privacy Policy, please contact us at:
                  </p>
                  <p className="mt-2">
                    Email: privacy@healthai.com<br />
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

export default PrivacyPolicy;
