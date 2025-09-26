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
import { Textarea } from "@/components/ui/textarea"; // For potential notes
import { 
  RefreshCw,
  EyeIcon, // View details
  CheckCircle, // Mark as paid
  Truck, // Mark as delivered
  DollarSign, // Payment status icon
  Package, // Order items icon
  MapPin,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { format } from 'date-fns';

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

type OrderItem = {
  product: string; // Product ID
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
};

type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type PaymentResult = {
  id?: string;
  status?: string;
  update_time?: string;
  email_address?: string;
};

type Order = {
  _id: string;
  user: { _id: string; name: string; email: string };
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
};

const AdminOrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { getToken } = useAuth(); // getToken now returns null, but we keep useAuth for context

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, { // Admin endpoint to get all orders
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // CRUCIAL: Browser sends httpOnly cookie automatically
      });

      if (!response.ok) {
        toast.error('Session expired or not authorized. Please log in again.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error(data.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Fetch orders on component mount

  const openViewDialog = (order: Order) => {
    setCurrentOrder(order);
    setDialogOpen(true);
  };

  const handleMarkAsPaid = async (orderId: string) => {
    if (confirm('Are you sure you want to mark this order as PAID?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            id: 'simulated_payment_id', // Mock payment ID
            status: 'COMPLETED', // Mock status
            update_time: new Date().toISOString(),
            email_address: currentOrder?.user.email || 'N/A',
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success('Order marked as paid successfully!');
          fetchOrders(); // Re-fetch orders to update status
          setDialogOpen(false); // Close dialog if open
        } else {
          toast.error(data.message || 'Failed to mark order as paid.');
        }
      } catch (error) {
        console.error('Error marking order as paid:', error);
        toast.error('Failed to mark order as paid.');
      }
    }
  };

  const handleMarkAsDelivered = async (orderId: string) => {
    if (confirm('Are you sure you want to mark this order as DELIVERED?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/deliver`, {
          method: 'PUT',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success('Order marked as delivered successfully!');
          fetchOrders(); // Re-fetch orders to update status
          setDialogOpen(false); // Close dialog if open
        } else {
          toast.error(data.message || 'Failed to mark order as delivered.');
        }
      } catch (error) {
        console.error('Error marking order as delivered:', error);
        toast.error('Failed to mark order as delivered.');
      }
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
          <h2 className="text-xl font-semibold">Order Management</h2>
          <p className="text-sm text-gray-600">View and manage customer orders.</p>
        </div>
      </div>

      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Ordered On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium max-w-[120px] truncate">{order._id}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'PP')}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openViewDialog(order)}
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4 text-gray-600" />
                      </Button>
                      {!order.isPaid && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleMarkAsPaid(order._id)}
                          title="Mark as Paid"
                        >
                          <DollarSign className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {!order.isDelivered && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleMarkAsDelivered(order._id)}
                          title="Mark as Delivered"
                        >
                          <Truck className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details: {currentOrder?._id}</DialogTitle>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center"><User className="h-4 w-4 mr-2" /> Customer Info:</h3>
                  <p>Name: {currentOrder.user.name}</p>
                  <p>Email: {currentOrder.user.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center"><MapPin className="h-4 w-4 mr-2" /> Shipping Address:</h3>
                  <p>{currentOrder.shippingAddress.address}</p>
                  <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}</p>
                  <p>{currentOrder.shippingAddress.country}</p>
                </div>
              </div>

              <h3 className="font-semibold mb-2 flex items-center"><Package className="h-4 w-4 mr-2" /> Order Items:</h3>
              <div className="space-y-2 border rounded-lg p-3">
                {currentOrder.orderItems.map(item => (
                  <div key={item.product} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
                    <div className="flex items-center">
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded mr-2" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-semibold">${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center"><DollarSign className="h-4 w-4 mr-2" /> Payment & Delivery Status:</h3>
                  <p className={currentOrder.isPaid ? 'text-green-600' : 'text-red-600'}>
                    Paid: {currentOrder.isPaid ? `Yes on ${format(new Date(currentOrder.paidAt!), 'PP')}` : 'No'}
                  </p>
                  <p className={currentOrder.isDelivered ? 'text-green-600' : 'text-yellow-600'}>
                    Delivered: {currentOrder.isDelivered ? `Yes on ${format(new Date(currentOrder.deliveredAt!), 'PP')}` : 'No'}
                  </p>
                  <p>Method: {currentOrder.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Totals:</h3>
                  <p>Items: ${currentOrder.orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</p>
                  <p>Shipping: ${currentOrder.shippingPrice.toFixed(2)}</p>
                  <p>Tax: ${currentOrder.taxPrice.toFixed(2)}</p>
                  <p className="font-bold text-lg">Total: ${currentOrder.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
                {!currentOrder.isPaid && (
                  <Button 
                    type="button" 
                    onClick={() => handleMarkAsPaid(currentOrder._id)} 
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Mark as Paid
                  </Button>
                )}
                {!currentOrder.isDelivered && (
                  <Button 
                    type="button" 
                    onClick={() => handleMarkAsDelivered(currentOrder._id)} 
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Truck className="h-4 w-4 mr-2" /> Mark as Delivered
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrdersList;
