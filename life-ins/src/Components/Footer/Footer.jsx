import React from 'react';
import { Link } from 'react-router'; // ✅ Correct import
import logo from '/logo.png';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content border-t">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Branding */}
        <div>
          <Link to="/" className="flex items-center gap-3 mb-4">
            <img src={logo} alt="LifeSure Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-primary">Life Care</span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-500">
            LifeCare is a modern life insurance platform focused on secure, personalized, and transparent insurance management — trusted by thousands.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/policies" className="hover:text-primary">All Policies</Link></li>
            <li><Link to="/agents" className="hover:text-primary">Agents</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            <li><Link to="/blogs" className="hover:text-primary">Blogs</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact Support</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>Email: support@lifesure.com</li>
            <li>Phone: +880-1234-567890</li>
            <li>Location: Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t bg-base-300">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} <span className="text-primary font-semibold">Life Care</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
