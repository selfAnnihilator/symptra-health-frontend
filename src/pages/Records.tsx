import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, FileText, Loader2, Mail, Phone, RefreshCcw, Trash2 } from 'lucide-react'; // Import Trash2
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

// Define the base URL for your backend API
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// Type definition for an appointment request from the backend
type AppointmentRequest = {
  _id: string;
  type: 'appointment_booking' | 'free_consultation';
  status: 'pending' | 'approved' | 'rejected';
  data: {
    patientName?: string;
    fullName?: string;
    patientEmail?: string;
    email?: string;
    patientPhone?: string;
    phoneNumber?: string;
    appointmentDate: string;
    appointmentTime: string;
    reasonForVisit?: string;
    service?: string;
  };
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
};

// Type definition for a medical report analysis result from the backend
type MedicalReportAnalysis = {
  _id: string;
  user: string; // User ID
  reportTextSnippet: string;
  aiAnalysis: string;
  originalFileName?: string;
  analysisTimestamp: string;
  createdAt: string;
  updatedAt: string;
};

const Records = () => {
  const { user, getToken, isLoading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [medicalReports, setMedicalReports] = useState<MedicalReportAnalysis[]>([]);
  const [loadingMedicalReports, setLoadingMedicalReports] = useState(true); // Set to true initially

  const fetchAppointments = async () => {
    if (!user) {
      setLoadingAppointments(false);
      return;
    }
    setLoadingAppointments(true);
    try {
      const response = await fetch(`${API_BASE_URL}/requests/user`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        toast.error('Failed to load your appointments. Please log in again.');
        setLoadingAppointments(false);
        return;
      }
      const data = await response.json();
      if (data.success) {
        const userAppointments = data.data.filter(
          (req: any) => req.type === 'appointment_booking' || req.type === 'free_consultation'
        );
        userAppointments.sort((a: AppointmentRequest, b: AppointmentRequest) => 
          new Date(b.data.appointmentDate).getTime() - new Date(a.data.appointmentDate).getTime()
        );
        setAppointments(userAppointments);
      } else {
        toast.error(data.message || 'Failed to load appointments.');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments.');
    } finally {
      setLoadingAppointments(false);
    }
  };

  const fetchMedicalReports = async () => {
    if (!user) {
      setLoadingMedicalReports(false);
      return;
    }
    setLoadingMedicalReports(true);
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/my-reports`, { // NEW ENDPOINT
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        toast.error('Failed to load your medical reports. Please log in again.');
        setLoadingMedicalReports(false);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setMedicalReports(data.data);
      } else {
        toast.error(data.message || 'Failed to load medical reports.');
      }
    } catch (error) {
      console.error('Error fetching medical reports:', error);
      toast.error('Failed to load medical reports.');
    } finally {
      setLoadingMedicalReports(false);
    }
  };

  const handleDeleteMedicalReport = async (reportId: string) => {
    if (confirm('Are you sure you want to delete this medical report?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/analysis/report/${reportId}`, { // NEW DELETE ENDPOINT
          method: 'DELETE',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok && data.success) {
          toast.success('Medical report deleted successfully.');
          fetchMedicalReports(); // Re-fetch to update list
        } else {
          toast.error(data.message || 'Failed to delete medical report.');
        }
      } catch (error) {
        console.error('Error deleting medical report:', error);
        toast.error('Failed to delete medical report.');
      }
    }
  };


  useEffect(() => {
    if (!authLoading && user) {
      fetchAppointments();
      fetchMedicalReports(); // Fetch medical reports here
    } else if (!authLoading && !user) {
        setLoadingAppointments(false);
        setLoadingMedicalReports(false);
    }
  }, [user, authLoading, user?.id]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCcw className="h-8 w-8 animate-spin text-healthcare-primary" />
          <p className="mt-4 text-lg">Loading records...</p>
        </div>
      </div>
    );
  }

  if (!user && !authLoading) {
    toast.error('You must be logged in to view your records.');
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">My Records</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          View your past appointments, medical reports, and health history.
        </p>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="appointments" className="flex items-center justify-center">
              <CalendarCheck className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="medical-reports" className="flex items-center justify-center">
              <FileText className="h-4 w-4 mr-2" />
              Medical Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>Your upcoming and past appointment requests.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAppointments ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
                    <span className="ml-2">Loading appointments...</span>
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appt) => (
                      <div key={appt._id} className="border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-lg">
                            {appt.type === 'appointment_booking' ? appt.data.reasonForVisit : `Free Consultation: ${appt.data.service}`}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            appt.status === 'approved' ? 'bg-green-100 text-green-800' :
                            appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          <CalendarCheck className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                          Date: {format(new Date(appt.data.appointmentDate), 'PPP')} at {appt.data.appointmentTime}
                        </p>
                        <p className="text-gray-600 text-sm mb-1">
                          <Phone className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                          Contact: {appt.type === 'appointment_booking' ? appt.data.patientPhone : appt.data.phoneNumber}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <Mail className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                          Email: {appt.type === 'appointment_booking' ? appt.data.patientEmail : appt.data.email}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          Submitted on: {format(new Date(appt.createdAt), 'PPpp')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No appointment requests found.</p>
                    <p className="mt-2">Book your first appointment via the Dashboard!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical-reports">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>My Medical Reports</CardTitle>
                <CardDescription>Your uploaded and analyzed medical reports.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingMedicalReports ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
                    <span className="ml-2">Loading reports...</span>
                  </div>
                ) : medicalReports.length > 0 ? (
                  <div className="space-y-4">
                    {medicalReports.map((report) => (
                      <div key={report._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-lg">
                            {report.originalFileName || `Report from ${format(new Date(report.analysisTimestamp), 'PP')}`}
                          </h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteMedicalReport(report._id)}
                            title="Delete Report"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          <FileText className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                          Original Text Snippet: {report.reportTextSnippet}
                        </p>
                        <p className="font-semibold text-healthcare-primary mb-2 mt-2">AI Analysis:</p>
                        <p className="whitespace-pre-wrap text-gray-800">{report.aiAnalysis}</p>
                        <p className="text-xs text-gray-500 mt-2 text-right">
                          Analyzed on: {format(new Date(report.analysisTimestamp), 'PPpp')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No medical reports found.</p>
                    <p className="mt-2">Upload your medical reports for analysis in the Diagnosis section!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Records;