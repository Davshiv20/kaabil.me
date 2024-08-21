import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Footer from "@components/Footer";
import LandingNavbar from "@components/LandingNavbar";
import hero from "@assets/hero.png";
import banner from "@assets/banner.png";
import HowItWorks from "@components/howitworks";
import { Button } from "@ui-components/button";
import WhatWeDo from "@components/whatwedo";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);
  const handleGetStarted = () => {
   //navigate("http://localhost:3000/auth/google")
   //http://localhost:3000/auth/google/callback
   

   //uncomment for production
  //  window.open("https://www.kaabil.me/api/auth/google?scope=email",

    // uncomment for local dev
   window.open("http://localhost:3000/api/auth/google?scope=email",
   "_self"
  );
  };

  return (
    <section id="home" className="min-h-screen w-full">
      <div className="md:flex min-h-screen sm:items-center w-full flex-col">
        <LandingNavbar onGetStarted={handleGetStarted}/>
        <div className="flex flex-col w-full mt-24">
          <div className="flex flex-col md:flex-row items-center md:justify-between">
            <div className="flex-grow text-center md:px-12 md:text-left sm:mr-0 mb-8 sm:mb-0">
              <h1 className="text-6xl font-bold mb-4">
                Next - Gen <br />
                <span className="whitespace-no-wrap">Teaching Assistant</span>
              </h1>
              <p className="text-lg mb-4">
                Meet your round-the-clock study partner!
              </p>
              <p className="text-lg mb-4">
              Kaabil is here to teach you in your unique style, offer quick, bite-sized lessons, assist with last-minute preparations and track your progress all year. Earn points as you unlock your potential.
              </p>
              <div className="flex justify-center md:justify-start">
                <Button onClick={handleGetStarted} className="py-8 px-12 rounded-full flex mt-16 text-center md:items-center items-center">
                  Get Started
                </Button>
              </div>
            </div>
            <div className="flex-grow mt-40 flex justify-center sm:justify-end">
              <img src={hero} className="w-full h-auto" alt="hero" />
            </div>
          </div>
          <div className="relative w-full ">
            <img src={banner} alt="banner"></img>
          </div>
          <WhatWeDo />
          <HowItWorks />
          <Footer />
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
