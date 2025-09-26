import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

type FAQItem = {
    _id: string;
    question: string;
    answer: string;
};

const FAQs = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-center">
          Find answers to the most common questions about our platform and services.
        </p>

        <Card className="shadow-md max-w-4xl mx-auto">
          <CardContent className="p-6">
            {loading ? (
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
      </div>
    </div>
  );
};

export default FAQs;