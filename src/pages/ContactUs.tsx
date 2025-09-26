import { useState } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { Label } from "@/components/ui/label";

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

const ContactUs = () => {
  const { user } = useAuth(); // Get logged-in user info
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !subject || !message) {
      toast.error("Please fill out all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const payload: any = {
        type: 'contact_us_inquiry', // New type for contact form submissions
        data: {
          fullName: name,
          email: email,
          subject: subject,
          message: message,
        },
      };

      // If user is logged in, attach their ID to submittedBy
      // The backend model's submittedBy is now optional (required: false)
      const token = localStorage.getItem('token'); // Check if a token exists (user is logged in)
      if (user && user.id) {
        // No need to explicitly add submittedBy to payload, backend middleware will handle it
        // if submittedBy is populated from req.user.id
      }

      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookie if logged in
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast.success("Your message has been sent successfully!");
        // Reset form fields
        setName(user?.name || ''); // Reset to user's name or empty
        setEmail(user?.email || ''); // Reset to user's email or empty
        setSubject('');
        setMessage('');
      } else {
        toast.error(responseData.message || "Failed to send your message.");
      }
    } catch (error) {
      console.error("Error sending contact message:", error);
      toast.error("An error occurred while sending your message.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Have questions or feedback? Reach out to us using the form below, or find our contact details.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
              <CardDescription>We'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="John Doe" 
                    required 
                    readOnly={!!user}
                    className={!!user ? "bg-gray-100 cursor-not-allowed" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="john.doe@example.com" 
                    required 
                    readOnly={!!user}
                    className={!!user ? "bg-gray-100 cursor-not-allowed" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder="Inquiry about services" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea 
                    id="message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Type your message here..." 
                    required 
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
              <CardContent>
                <Button 
                  type="submit" 
                  className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">Sending...</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg bg-healthcare-primary text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
              <CardDescription className="text-white/80">Reach out to us directly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6" />
                <a href="mailto:support@symptrahealth.com" className="hover:underline">support@symptrahealth.com</a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6" />
                <a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 flex-shrink-0 mt-1" />
                <p>123 Health Street, Suite 456<br/>Medical City, State 12345<br/>Country</p>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Business Hours:</h3>
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p>Saturday: 10:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;