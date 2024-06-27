import React from "react";
import ItemsContainer from "./ItemsContainer";
import SocialIcons from "./SocialIcons";
import { Icons } from "./Menus";

const Footer = () => {
  return (
    <section id="footer">
    <footer className="bg-graybg text-white">
        <div className=" text-center pt-16 ">
            <h1 className="font-bold text-5xl py-4 text-orange">Kaabil.</h1>
            <span className="text-white text-center" >Learning with Kabil is fun, and research shows that it works! With quick, bite-sized lessons, you’ll earn points and unlock new levels while gaining real-world communication skills.</span>


        </div>
      
      <ItemsContainer />
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
      text-center pt-2 text-gray-400 text-sm pb-8"
      >
        <span>© 2024 Appy. All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
        <SocialIcons Icons={Icons} />
      </div>
    </footer>
    </section>
  );
};

export default Footer;