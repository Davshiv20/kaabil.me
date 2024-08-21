import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '@assets/logo.png';
import menu from '@assets/menu.png';
import close from '@assets/close.png';
import { landinNavItems as navItems} from '@components/navItems'; 

const LandingNavbar = ({onGetStarted}) => {
  const [open, setOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setOpen(false); 
    }
  };

  return (
    <nav className="shadow-md fixed top-0 left-0 w-full bg-white backdrop-blur-sm border-b border-gray-300 z-20 px-6 md:py-6 py-6 md:flex justify-between items-center">
      <div className="flex justify-between items-center w-full md:w-auto sm:w-auto sm:h-auto">
        <img className="h-6 mx-4 cursor-pointer" src={logo} alt="logo" onClick={() => window.location.href = '/'} />
        <div className="text-3xl cursor-pointer md:hidden " onClick={() => setOpen(!open)}>
          {open ? (
            <img src={close} className="h-[20px] w-[20px]" alt="close" />
          ) : (
            <img src={menu} className="h-[20px] w-[20px]" alt="menu" />
          )}
        </div>
      </div>
      <div
        className={`md:flex md:items-center md:pb-0 pb-12  absolute md:static bg-white  md:z-auto z-[-1] left-0 w-full md:w-auto transition-all duration-500 ease-in ${
          open ? 'top-12 opacity-100 ' : 'top-[-490px] opacity-0'
        } md:opacity-100 md:space-x-8 px-8 py-8 md:py-0 md:space-y-0 text-gray-700`}
      >
        {/* <div className='sm:py-8 sm:px-8 flex flex-row'> */}
        {navItems.map((item, index) => (
          item.button ? (
            <Link
              to={item.link}
              key={index}
              className="hover:text-black hover:bg-orange duration-500 md:ml-8 text-xl md:my-0 my-7 cursor-pointer bg-green-500 text-white py-2 px-4 rounded-full border-black border-2 border-b-4 active:border-b-2"
              onClick={onGetStarted}
            >
              {item.text}
            </Link>
            
          ) : (
            <p
              key={index}
              className="hover:text-green-500  duration-500 md:ml-8 text-xl md:my-0 my-7 cursor-pointer"
              onClick={() => scrollToSection(item.id)}
            >
              {item.text}
            </p>
            
          )
          
        ))}
      </div>
    </nav>
  );
};

export default LandingNavbar;
