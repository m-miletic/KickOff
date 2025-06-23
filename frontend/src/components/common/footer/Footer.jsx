import React from 'react';
import logoWhite from '../../../assets/logoWhite.png';

const Footer = () => {
  return (
    <footer className="bg-[#001E28] text-white px-6 py-8 mt-12"> {/* bg-transparent za sliku ako je bg */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        
        {/* Logo Column */}
        <div className="flex items-start">
          <img src={logoWhite} alt="Logo" className="w-20 h-auto" />
        </div>

        {/* Explore Column */}
        <div>
          <h3 className="font-semibold mb-2">Explore</h3>
          <ul className="space-y-1">
            <li><a href="/home" className="hover:underline">Home</a></li>
            <li><a href="/tournaments" className="hover:underline">Tournaments</a></li>
            <li><a href="/gallery" className="hover:underline">Gallery</a></li>
          </ul>
        </div>

        {/* Account Column */}
        <div>
          <h3 className="font-semibold mb-2">Account</h3>
          <ul className="space-y-1">
            <li><a href="/login" className="hover:underline">Login</a></li>
            <li><a href="/signup" className="hover:underline">Register</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-8 text-xs text-white/50">
        &copy; {new Date().getFullYear()} KickOff. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
