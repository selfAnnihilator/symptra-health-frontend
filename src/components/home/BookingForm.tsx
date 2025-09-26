import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

// Define the base URL for your backend API
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const serviceOptions = [
  { id: "general_checkup", name: "General Checkup" },
  { id: "mental_health_consult", name: "Mental Health Consultation" },
  { id: "disease_diagnosis", name: "Disease Diagnosis" },
  { id: "medical_report_analysis", name: "Medical Report Analysis" },
  { id: "specialist_referral", name: "Specialist Referral" },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", 
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const BookingForm = () => {
  const { user, getToken } = useAuth(); // Get current user and getToken
  const [name, setName] = useState(user?.name || ''); // Pre-fill name if logged in
  const [email, setEmail] = useState(user?.email || ''); // Pre-fill email if logged in
  const [phone, setPhone] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState("");
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !phone || !serviceNeeded || !appointmentDate || !timeSlot) {
      toast.error("Please fill out all fields for the consultation.");
      setIsLoading(false);
      return;
    }

    const token = getToken(); // Get token for authenticated request (optional for public forms, but good practice if user might be logged in)

    try {
      const formattedDate = appointmentDate.toISOString();

      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include Authorization header if user is logged in, otherwise it's a public request
          ...(token && { 'Authorization': `Bearer ${token}` }), 
        },
        body: JSON.stringify({
          type: 'free_consultation', // New type for this request
          data: {
            fullName: name,
            email: email,
            phoneNumber: phone,
            service: serviceNeeded,
            appointmentDate: formattedDate,
            appointmentTime: timeSlot,
          },
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast.success("Free consultation booked successfully!", {
          description: `${format(appointmentDate, "PPP")} at ${timeSlot}`
        });
        // Reset form fields after successful submission
        setName(user?.name || ''); // Reset to user's name or empty
        setEmail(user?.email || ''); // Reset to user's email or empty
        setPhone('');
        setServiceNeeded("");
        setAppointmentDate(new Date());
        setTimeSlot("");
      } else {
        toast.error(responseData.message || "Failed to book consultation.");
      }
    } catch (error) {
      console.error("Error booking consultation:", error);
      toast.error("An error occurred while booking the consultation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-healthcare-dark mb-4">Book a Free Consultation</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          placeholder="Your Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          readOnly={!!user} // Make read-only if user is logged in and name is pre-filled
          className={cn(!!user && "bg-gray-100 cursor-not-allowed")}
        />
        <Input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          readOnly={!!user} // Make read-only if user is logged in and email is pre-filled
          className={cn(!!user && "bg-gray-100 cursor-not-allowed")}
        />
        <Input 
          type="tel" 
          placeholder="Phone Number" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          required 
        />
        <Select value={serviceNeeded} onValueChange={setServiceNeeded} required>
          <SelectTrigger>
            <SelectValue placeholder="Service Needed" />
          </SelectTrigger>
          <SelectContent>
            {serviceOptions.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !appointmentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {appointmentDate ? format(appointmentDate, "PPP") : <span>Appointment Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={appointmentDate}
                onSelect={setAppointmentDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          <Select value={timeSlot} onValueChange={setTimeSlot} required>
            <SelectTrigger>
              <SelectValue placeholder="Time Slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          type="submit" 
          className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="mr-2">Booking</span>
              <span className="animate-spin">•</span>
            </span>
          ) : (
            "Book Appointment"
          )}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          By submitting this form, you agree to our{" "}
          <Link to="/terms-of-service" className="underline hover:text-healthcare-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy-policy" className="underline hover:text-healthcare-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
};

export default BookingForm;

