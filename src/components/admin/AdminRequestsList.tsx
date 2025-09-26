import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckIcon, 
  XIcon, 
  RefreshCw,
  EyeIcon // View details
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';

// Define the base URL for your backend API
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

type RequestStatus = 'pending' | 'approved' | 'rejected';
// ADD 'contact_us_inquiry' to the RequestType enum
type RequestType = 'article_approval' | 'product_approval' | 'user_registration' | 'appointment_booking' | 'free_consultation' | 'contact_us_inquiry';

type RequestItem = {
  _id: string;
  type: RequestType;
  status: RequestStatus;
  data: any; // Mixed type for request-specific data
  submittedBy: {
    _id: string;
    name: string;
    email: string;
  };
  reviewedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
};

const AdminRequestsList = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<RequestItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('pending');
  const [filterType, setFilterType] = useState<RequestType | 'all'>('all');
  const { getToken } = useAuth();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        toast.error('Session expired or not authorized. Please log in again.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        let fetchedRequests: RequestItem[] = data.data.map((r: any) => ({
          _id: r._id,
          type: r.type,
          status: r.status,
          data: r.data,
          submittedBy: r.submittedBy || { _id: '', name: 'Unknown', email: 'unknown@example.com' },
          reviewedBy: r.reviewedBy || undefined,
          reviewNotes: r.reviewNotes || undefined,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));

        if (filterStatus !== 'all' && filterStatus !== 'pending') {
          fetchedRequests = fetchedRequests.filter(req => req.status === filterStatus);
        }
        if (filterType !== 'all') {
          fetchedRequests = fetchedRequests.filter(req => req.type === filterType);
        }

        setRequests(fetchedRequests);
      } else {
        toast.error(data.message || 'Failed to load requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterStatus, filterType]); 

  const openViewDialog = (request: RequestItem) => {
    setCurrentRequest(request);
    setReviewNotes(request.reviewNotes || '');
    setDialogOpen(true);
  };

  const handleProcessRequest = async (status: RequestStatus) => {
    if (!currentRequest) return;

    try {
      const response = await fetch(`${API_BASE_URL}/requests/${currentRequest._id}/process`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status, reviewNotes }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Request ${status} successfully`);
        setDialogOpen(false);
        fetchRequests();
      } else {
        toast.error(data.message || `Failed to ${status} request`);
      }
    } catch (error) {
      console.error(`Error processing request:`, error);
      toast.error(`Failed to ${status} request`);
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch(status) {
      case 'approved':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  const getRequestTypeBadge = (type: RequestType) => {
    let colorClass = 'bg-gray-100 text-gray-800';
    if (type === 'appointment_booking') colorClass = 'bg-blue-100 text-blue-800';
    if (type === 'free_consultation') colorClass = 'bg-purple-100 text-purple-800';
    if (type === 'article_approval') colorClass = 'bg-indigo-100 text-indigo-800';
    if (type === 'contact_us_inquiry') colorClass = 'bg-orange-100 text-orange-800'; // NEW COLOR
    // Add more types as needed

    return <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
      {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>;
  };

  const renderRequestData = (request: RequestItem) => {
    switch(request.type) {
      case 'appointment_booking':
        return (
          <div className="space-y-1">
            <p><strong>Patient:</strong> {request.data.patientName}</p>
            <p><strong>Email:</strong> {request.data.patientEmail}</p>
            <p><strong>Phone:</strong> {request.data.patientPhone}</p>
            <p><strong>Date:</strong> {format(new Date(request.data.appointmentDate), 'PPP')}</p>
            <p><strong>Time:</strong> {request.data.appointmentTime}</p>
            <p><strong>Reason:</strong> {request.data.reasonForVisit}</p>
          </div>
        );
      case 'free_consultation':
        return (
          <div className="space-y-1">
            <p><strong>Full Name:</strong> {request.data.fullName}</p>
            <p><strong>Email:</strong> {request.data.email}</p>
            <p><strong>Phone:</strong> {request.data.phoneNumber}</p>
            <p><strong>Service:</strong> {request.data.service}</p>
            <p><strong>Date:</strong> {format(new Date(request.data.appointmentDate), 'PPP')}</p>
            <p><strong>Time:</strong> {request.data.appointmentTime}</p>
          </div>
        );
      case 'article_approval':
        return (
          <div className="space-y-1">
            <p><strong>Article ID:</strong> {request.data.articleId}</p>
            <p><strong>Article Title:</strong> {request.data.title}</p>
          </div>
        );
      case 'contact_us_inquiry': // NEW CASE
        return (
          <div className="space-y-1">
            <p><strong>Name:</strong> {request.data.fullName}</p>
            <p><strong>Email:</strong> {request.data.email}</p>
            <p><strong>Subject:</strong> {request.data.subject}</p>
            <p><strong>Message:</strong> {request.data.message}</p>
          </div>
        );
      // Add cases for other request types (product_approval, user_registration)
      default:
        return <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded">{JSON.stringify(request.data, null, 2)}</pre>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-healthcare-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Request Management</h2>
          <p className="text-sm text-gray-600">Review and process various user requests</p>
        </div>
        <div className="flex space-x-2">
          <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val as RequestStatus | 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={(val) => setFilterType(val as RequestType | 'all')}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="appointment_booking">Appointment Booking</SelectItem>
              <SelectItem value="free_consultation">Free Consultation</SelectItem>
              <SelectItem value="article_approval">Article Approval</SelectItem>
              <SelectItem value="product_approval">Product Approval</SelectItem>
              <SelectItem value="user_registration">User Registration</SelectItem>
              <SelectItem value="contact_us_inquiry">Contact Us Inquiry</SelectItem> {/* NEW FILTER OPTION */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{getRequestTypeBadge(request.type)}</TableCell>
                  <TableCell>{request.submittedBy?.name || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{format(new Date(request.createdAt), 'PPpp')}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openViewDialog(request)}
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4 text-gray-600" />
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setCurrentRequest(request);
                              setReviewNotes('');
                              setDialogOpen(true);
                            }}
                            title="Process Request"
                          >
                            <CheckIcon className="h-4 w-4 text-green-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No requests found matching current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Process Request: {currentRequest?.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</DialogTitle>
          </DialogHeader>
          {currentRequest && (
            <div className="space-y-4 pt-4">
              <div className="border rounded-lg p-3 bg-gray-50">
                <h3 className="font-semibold mb-2">Request Details:</h3>
                {renderRequestData(currentRequest)}
                <p className="text-gray-600 text-sm mt-2">
                  Submitted by: {currentRequest.submittedBy?.name} ({currentRequest.submittedBy?.email})
                </p>
                <p className="text-gray-600 text-sm">
                  Status: {getStatusBadge(currentRequest.status)}
                </p>
              </div>

              {currentRequest.status === 'pending' && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="reviewNotes" className="text-sm font-medium">Review Notes (Optional)</label>
                    <Textarea
                      id="reviewNotes"
                      placeholder="Add notes for approval or rejection..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => handleProcessRequest('rejected')} 
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <XIcon className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => handleProcessRequest('approved')} 
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </DialogFooter>
                </>
              )}
              {currentRequest.status !== 'pending' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Review Notes:</p>
                  <p className="text-gray-700">{currentRequest.reviewNotes || 'No notes provided.'}</p>
                  <p className="text-gray-600 text-sm">Reviewed by: {currentRequest.reviewedBy?.name || 'N/A'} ({currentRequest.reviewedBy?.email || 'N/A'})</p>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequestsList;