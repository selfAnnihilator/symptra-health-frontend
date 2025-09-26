import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ReturnAndReplacment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">Return & Replacement Policy</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          We want you to be completely satisfied with your purchase. Here are the details of our return and replacement policies.
        </p>

        <div className="space-y-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2 text-healthcare-primary" />
                Return Policy
              </CardTitle>
              <CardDescription>
                Details on how to return a product you've purchased from our store.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>You can return most new, unopened items within 30 days of delivery for a full refund. We'll also pay the return shipping costs if the return is a result of our error (you received an incorrect or defective item, etc.).</p>
              <p>You should expect to receive your refund within four weeks of giving your package to the return shipper, however, in many cases you will receive a refund more quickly. This time period includes the transit time for us to receive your return from the shipper (5 to 10 business days), the time it takes us to process your return once we receive it (3 to 5 business days), and the time it takes your bank to process our refund request (5 to 10 business days).</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-healthcare-primary" />
                Replacement Policy
              </CardTitle>
              <CardDescription>
                Details on how to get a replacement for a damaged or defective item.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>If you received a damaged or defective item, we're happy to provide a replacement at no additional cost. Please contact our support team within 14 days of delivery to initiate a replacement request.</p>
              <p>Our team will guide you through the process of providing photos of the item and arranging for the defective product to be returned. Once we receive and verify the item, a replacement will be shipped to you promptly.</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-healthcare-primary" />
                Contacting Support
              </CardTitle>
              <CardDescription>
                For all return and replacement inquiries, please contact our support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>To initiate a return or replacement, please visit our <Link to="/contact-us" className="text-healthcare-primary hover:underline">Contact Us</Link> page and send us a message with your order number and the reason for your request. Alternatively, you can email us directly at <code>support@symptrahealth.com</code>.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReturnAndReplacment;