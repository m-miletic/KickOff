import React from 'react';
import logoWhite from '../../../assets/logoWhite.png';

const Footer = () => {
  return (
    <footer className="w-full bg-[#001E28] text-white px-6 py-10 mt-16">
      <div className="w-full mx-48 grid grid-cols-1 md:grid-cols-4 gap-8 text-base">
        
        <div>
          <img src={logoWhite} alt="Logo" className="w-36 h-auto mt-8" />
        </div>

        <div className='ml-48'>
          <h3 className="font-semibold mb-3">Account</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/login" className="hover:underline">Login</a></li>
            <li><a href="/signup" className="hover:underline">Register</a></li>
          </ul>
        </div>

        <div className='ml-48'>
          <h3 className="font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: support@kickoff.com</li>
            <li>Phone: +385 95 789 9119</li>
            <li>Location: County of Split-Dalmatia, Croatia</li>
          </ul>
        </div>
      </div>

      <div className="pt-8 text-center text-xs text-white/50">
        &copy; {new Date().getFullYear()} KickOff. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
