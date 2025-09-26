import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Truck, CreditCard, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/cartContext';
import { useNavigate } from 'react-router-dom';

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

const CheckoutPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery'); // Default payment method
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('You must be logged in to checkout.');
      navigate('/login', { replace: true });
    } else if (!authLoading && user && cartItems.length === 0) {
      toast.error('Your cart is empty. Please add items before checking out.');
      navigate('/products', { replace: true });
    }
  }, [authLoading, user, cartItems, navigate]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [id]: value }));
  };

  const calculateOrderSummary = () => {
    const itemsPrice = getCartTotal();
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
    const taxPrice = itemsPrice * 0.08; // 8% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingOrder(true);

    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      setIsProcessingOrder(false);
      return;
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      toast.error('Please fill in all shipping details.');
      setIsProcessingOrder(false);
      return;
    }

    if (!user) {
      toast.error('User not authenticated.');
      setIsProcessingOrder(false);
      return;
    }

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateOrderSummary();

    try {
      const orderItemsPayload = cartItems.map(item => ({
        product: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl,
      }));

      // Simulate payment processing based on method selected
      const isPaid = paymentMethod === 'UPI';
      const paymentResult = isPaid ? {
        id: `upi_pay_${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: user.email,
      } : {};
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          orderItems: orderItemsPayload,
          shippingAddress,
          paymentMethod,
          taxPrice,
          shippingPrice,
          totalPrice,
          isPaid: isPaid,
          paidAt: isPaid ? new Date().toISOString() : undefined,
          paymentResult: paymentResult,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderId(data.data._id);
        setOrderSuccess(true);
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${data.data._id}`, { replace: true });
      } else {
        toast.error(data.message || 'Failed to place order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('An error occurred while placing your order.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
        <p className="ml-3 text-lg">Loading checkout...</p>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderSuccess) {
    return null; 
  }

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateOrderSummary();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">Checkout</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Complete your purchase by providing shipping and payment details.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-healthcare-primary" />
                Shipping Address
              </CardTitle>
              <CardDescription>Where should we send your order?</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={shippingAddress.address} onChange={handleShippingChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={shippingAddress.city} onChange={handleShippingChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" value={shippingAddress.postalCode} onChange={handleShippingChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={shippingAddress.country} onChange={handleShippingChange} required />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Payment Method & Order Summary */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-healthcare-primary" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Cash on Delivery" id="cod" />
                    <Label htmlFor="cod">Cash on Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="UPI" id="upi" />
                    <Label htmlFor="upi">UPI / QR Code</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {paymentMethod === 'UPI' && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="h-5 w-5 mr-2 text-healthcare-primary" />
                    Scan & Pay
                  </CardTitle>
                  <CardDescription>Scan the QR code to complete your payment via UPI.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <img
                    src="https://placehold.co/250x250/E0E0E0/333333?text=UPI+QR+Code"
                    alt="UPI QR Code"
                    className="mx-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">UPI ID: your.upi@bank</p>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Items ({cartItems.length}):</span>
                  <span>${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%):</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Order Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                  onClick={handlePlaceOrder}
                  disabled={isProcessingOrder || cartItems.length === 0}
                >
                  {isProcessingOrder ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">Placing Order...</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;