import { Facebook, Twitter, Instagram, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Ink & Paper Express</h3>
            <p className="text-gray-400 mb-4">Your trusted partner for fast HP printer supplies delivery.</p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/printers" className="hover:text-white">HP Printers</a></li>
              <li><a href="/category/ink" className="hover:text-white">Ink Cartridges</a></li>
              <li><a href="/category/paper" className="hover:text-white">Paper & Supplies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
              <li><a href="#" className="hover:text-white">Customer Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                1-800-INKPAPER
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                support@inkpaperexpress.com
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                24/7 Support
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Ink & Paper Express. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
