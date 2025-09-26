import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, MessageSquare, User, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { format } from "date-fns"; // For date formatting
import { Calendar } from "@/components/ui/calendar"; // Assuming you have this component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Assuming you have this component
import { cn } from '@/lib/utils';

// Define the base URL for your backend API
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const AppointmentForm = () => {
  const { user, getToken } = useAuth(); // Get current user and getToken (getToken now returns null)
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(new Date());
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [contactPhone, setContactPhone] = useState(user?.phone || ''); // Pre-fill if user has phone
  const [contactEmail, setContactEmail] = useState(user?.email || ''); // Pre-fill with user's email
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill name if user is logged in
  const userName = user?.name || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user) { // Ensure user is logged in
      toast.error('You must be logged in to book an appointment.');
      setIsLoading(false);
      return;
    }

    if (!appointmentDate || !appointmentTime || !reason || !contactPhone || !contactEmail) {
      toast.error('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    // No need to get token from getToken() for httpOnly cookies
    // const token = getToken(); // REMOVE THIS LINE
    // if (!token) { // REMOVE THIS CHECK
    //   toast.error('Authentication token not found. Please log in.');
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const formattedDate = appointmentDate.toISOString(); // Send as ISO string for backend

      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // REMOVE THIS LINE
        },
        credentials: 'include', // CRUCIAL: Browser sends httpOnly cookie automatically
        body: JSON.stringify({
          type: 'appointment_booking',
          data: {
            patientName: userName,
            patientEmail: contactEmail,
            patientPhone: contactPhone,
            appointmentDate: formattedDate,
            appointmentTime: appointmentTime,
            reasonForVisit: reason,
          },
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast.success('Appointment request submitted successfully!');
        // Reset form fields
        setAppointmentDate(new Date());
        setAppointmentTime('');
        setReason('');
        // Keep contact info pre-filled if it came from user object
      } else {
        toast.error(responseData.message || 'Failed to submit appointment request.');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast.error('An error occurred while booking the appointment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Book an Appointment</CardTitle>
        <CardDescription className="text-center">
          Fill out the form below to request an appointment with our specialists.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="patientName" className="text-sm font-medium">Your Name</label>
              <Input
                id="patientName"
                value={userName}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contactEmail" className="text-sm font-medium">Contact Email</label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="your.email@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="contactPhone" className="text-sm font-medium">Contact Phone</label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="(123) 456-7890"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="appointmentTime" className="text-sm font-medium">Preferred Time</label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="appointmentTime"
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="appointmentDate" className="text-sm font-medium">Preferred Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !appointmentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {appointmentDate ? format(appointmentDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={appointmentDate}
                  onSelect={setAppointmentDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">Reason for Visit</label>
            <Textarea
              id="reason"
              placeholder="Briefly describe your reason for the visit..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="min-h-[100px]"
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
                <span className="mr-2">Submitting</span>
                <span className="animate-spin">•</span>
              </span>
            ) : (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Request Appointment
              </>
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};

export default AppointmentForm;