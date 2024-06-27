import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/Dashboard/logo_2.png';
import pp from '../../assets/Dashboard/pp.png';

const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setOpen(false); 
    }
  };

  return (
    <nav className="fixed shadow-md overflow-hidden top-0 left-0 w-full bg-bluebg border-b border-gray-300 px-8 py-4 flex justify-between backdrop-blur-sm items-center">
      <div className="w-full md:w-auto">
        <Link to="/">
          {/* Increased the max-height and adjusted margins */}
          <img className="max-h-16 max-w-16 sm:max-h-32 sm:max-w-24 md:max-h-24 md:max-w-24" src={logo} alt="logo"  />
        </Link>
      </div>
      <div className="flex items-center ">
        {/* <input
          type="text"
          placeholder="Search"
          className="px-2 py-1 sm:px-4 sm:py-2 rounded-full border border-slate-900 focus:outline-none focus:border-blue-500"
        /> */}
        <div className="py-4 sm:p-4">
          {/* <button className="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} sm:width={24} sm:height={24} fill={"none"}>
              <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button> */}
        </div>
        <div className="ml-2 sm:ml-4 h-8 my-2 w-8 sm:h-10 sm:w-10">
          <img src={user && user.image ? user.image : pp} className="rounded-full" alt="profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
