import { Button } from "@ui-components/button";
import search from "@assets/search.png";
import elearning from "@assets/elearning.png"
import signup from "@assets/signup.png";

const HowItWorks = () => {
    return (
    <section id="howItWorks">
      <div className="bg-slate-200 w-full min-h-full font-Space Grotesk flex flex-col md:items-center items-center md:justify-center p-8">
        <div className="align items-center"></div>
        <h1 className="text-5xl font-bold mt-16 text-center">How it Works?</h1>
        <span className="md:px-40 px-8 text-center mt-8">
            Kaabil.me is a self-learning platform designed to keep you engaged and motivated. Our platform tailors courses to your unique learning style, ensuring that you stay interested and make consistent progress. With Kaabil.me, you get personalized content that adapts to your needs, making learning more effective and enjoyable. The platform includes interactive quizzes and real-world projects that reinforce your knowledge. Join Kaabil.me today and experience a new way of learning that’s tailored just for you.
        </span>
        <div className="flex flex-col md:flex-row mt-16 p-16 justify-center px-4">
            <div className="flex flex-col justify-center items-center text-center space-y-4">
                <img src={signup} className="h-40 w-40" alt="signup" />
                <Button className="rounded-full">1</Button>
                <h1 className="text-2xl text-slate-800">Create Account</h1>
                <span>Create account now to receive latest updates and information on our courses</span>
            </div>
            <div className="flex flex-col justify-center items-center text-center space-y-4">
                <img src={search} className="h-40 w-40" alt="signup" />
                <Button className="rounded-full">2</Button>
                <h1 className="text-2xl text-slate-800">Explore Courses</h1>
                <span>Click to explore our engaging courses and embark on your learning adventure now!</span>
            </div>
            <div className="flex flex-col justify-center items-center text-center space-y-4">
                <img src={elearning} className="h-40 w-40" alt="signup" />
                <Button className="rounded-full">3</Button>
                <h1 className="text-2xl text-slate-800">Start Learning</h1>
                <span>Enter into the new age of learning with your own personalised tutor</span>
            </div>
        </div>
        {/* <div className="flex flex-row p-16 justify-center space-x-16 relative z-50">
        <h1 className="text-white font-bold text-3xl">Start Learning Today</h1>
      </div> */}
      {/* Add extra space at the bottom */}
      <div className="h-16"></div>
      </div>
      </section>
    );
};

export default HowItWorks;
