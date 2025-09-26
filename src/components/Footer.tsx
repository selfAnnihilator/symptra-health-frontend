import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">HealthAI</h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner in personalized digital healthcare.
              AI-powered insights, secure records, and seamless appointments.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/articles" className="text-gray-400 hover:text-white transition-colors">Articles</Link></li>
              <li><Link to="/contact-us" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help-center" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/faqs" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/return-policy" className="text-gray-400 hover:text-white transition-colors">Return Policy</Link></li> {/* ADD THIS LINK */}
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {/* Social media icons can go here */}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Subscribe to our newsletter for health tips and updates.
            </p>
            {/* Newsletter form can be added here */}
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} HealthAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;