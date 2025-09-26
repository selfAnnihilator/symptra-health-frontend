import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

type FAQItem = {
    _id: string;
    question: string;
    answer: string;
};

const HelpCenter = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loadingFAQs, setLoadingFAQs] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoadingFAQs(true);
      try {
        const response = await fetch(`${API_BASE_URL}/faqs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setFaqs(data.data);
        } else {
          toast.error(data.message || 'Failed to load FAQs.');
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        toast.error('Failed to load FAQs.');
      } finally {
        setLoadingFAQs(false);
      }
    };
    fetchFAQs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6 text-center">Help Center</h1>
        <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-center">
          Welcome to the HealthAI Help Center! Here you'll find resources to help you navigate our platform and make the most of our services.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-healthcare-dark mb-6">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-2">Create an Account</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn how to set up your HealthAI account and profile.
                </p>
                <Link to="/signup">
                  <Button variant="outline" className="w-full">
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-2">Symptom Checker</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Understand how our AI-powered symptom analysis works.
                </p>
                <Link to="/diagnosis">
                  <Button variant="outline" className="w-full">
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-2">Manage Health Records</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn how to securely store and access your health information.
                </p>
                <Link to="/records">
                  <Button variant="outline" className="w-full">
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-2">Booking Appointments</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Step-by-step guide for scheduling consultations.
                </p>
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full">
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
            <Card className="shadow-md">
                <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-2xl mb-2 text-healthcare-dark">Still have questions?</h3>
                    <p className="text-gray-700 mb-4">
                        If you couldn't find what you were looking for, please contact our support team.
                    </p>
                    <Link to="/contact-us">
                        <Button className="flex items-center gap-2 mx-auto">
                            <Mail className="h-4 w-4" />
                            Contact Support
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-healthcare-dark mb-6">Frequently Asked Questions</h2>
          <Card className="shadow-md">
            <CardContent className="p-6">
              {loadingFAQs ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
                    <span className="ml-2">Loading FAQs...</span>
                  </div>
              ) : faqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((item) => (
                    <AccordionItem key={item._id} value={item._id}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No FAQs found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter;