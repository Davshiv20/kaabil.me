import React from "react";
import rightbgcloud from "../assets/rightbgcloud.png";
import bgcloud from "../assets/bg_cloud.png";
import what_we_do from "../assets/whatwedo_.png";

const WhatWeDo = () => {
  return (
    <section id="whatWeDo">
      <div className="relative bg-bluebg w-full py-40 min-h-screen font-Space Grotesk flex flex-col md:flex-row items-center justify-center">
        {/* Cloud images for larger screens */}
        <img
          src={bgcloud}
          alt="Background Cloud"
          className="hidden md:block absolute bottom-0 opacity-75 left-0 w-[453px] h-[435.92px] object-cover z-0"
        />
        <img
          src={rightbgcloud}
          alt="Bg cloud"
          className="hidden md:block absolute bottom-0 right-0 opacity-75 h-[500px]"
        />
        <div className="flex flex-col md:flex-row justify-center items-center gap-16">
          <div className="relative order-2 md:order-1 mt-8 md:mt-0">
            <img
              src={what_we_do}
              alt="What We Do"
              className=" w-[453px] h-[435.92px] z-10"
            />
          </div>
          <div className="flex flex-col text-white max-w-lg order-1 md:order-2 text-center md:text-left">
            <h1 className="font-bold text-5xl mb-4">What We Do</h1>
            <span className="mb-4 px-2 md:px-0 mt-12">
              At Kaabil, we revolutionize learning by providing an engaging, interactive, and personalized experience for learners of all ages and backgrounds.
              <ul className="list-disc pl-5">
                <li>For students, Kaabil provides personalized support by adapting to individual learning styles for mastery of each topic.</li>
                <li>Parents are equipped with detailed insights into their child's academic progress and engagement, enabling effective support at home.</li>
                <li>For teachers, Kaabil offers the ability to assign questions and exercises through the platform, enhancing classroom learning with interactive content. It also delivers advanced analytics to monitor class performance, allowing for targeted teaching strategies.</li>
              </ul> 
            </span>
            <span className="mb-4 px-2 md:px-0 ">
            By enabling personalized learning paths, continuous feedback, and practical tools for both learning and teaching, Kaabil ensures that every participant not only engages with educational content but also excels.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
