import React from "react";

const Footer = () => {
  return (
    <section id="footer">
    <footer className="bg-graybg text-white">
        <div className=" text-center pt-16 ">
            <h1 className="font-bold text-5xl py-4 text-orange">Kaabil.</h1>
            <span className="text-white text-center" >Personalised learning outside classroom</span>


        </div>
      
      <div className="text-center pt-10 text-gray-400 text-sm pb-8">
        <span> Contact Us </span>
      </div>
      <div
        className="grid grid-cols-2 gap-10
      text-center pt-2 text-gray-400 text-sm pb-8"
      >
        <span>contact@kaabil.me</span>
        <span>linkedin.com/in/i-am-shrey</span>
      </div>
    </footer>
    </section>
  );
};

export default Footer;