import React from "react";
import { Star } from "lucide-react";

export default function Service() {
  const testimonials = [
    {
      quote:
        '"It\'s easier than ever with Optimize Press 3.0...if a 72 year old can do this - you can."',
      author: "Paul Clegg, UK",
      stars: 5,
    },
    {
      quote:
        '"...we can quickly build new pages to test out new layouts or features without too much work."',
      author: "Paul Clegg, UK",
      stars: 5,
    },
    {
      quote:
        '"Have been using it for 5 years and don\'t ever see myself switching"',
      author: "Paul Clegg, UK",
      stars: 5,
    },
    {
      quote:
        '"It\'s easier than ever with Optimize Press 3.0...if a 72 year old can do this - you can."',
      author: "Paul Clegg, UK",
      stars: 5,
    },
  ];

  return (
    <div className="bg-occean font-mona ">
      <div className="container mx-auto max-w-6xl px-7 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-3xl font-bold text-white ">
            Our Core Services to Boost Your Career Readiness
          </h2>
          <p className="text-white text-sm font-medium w-[50%] mx-auto text-center mt-3 ">
            Lumen provides a suite of AI-powered tools and guidance designed to
            bridge the gap between your education and ideal employment,
            equipping you with everything you need to succeed.
          </p>

          {/* Service Cards - You can expand this section as needed */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
            <div className="bg-occean/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                AI-Powered Interview & Skill Preparation
              </h3>
              <p className="text-white/70">
                Practice with AI mock interviews, receive personalized feedback,
                and follow tailored plans to develop in-demand job skills.
              </p>
            </div>

            <div className="bg-occean/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                Smart Resume & Application Crafting
              </h3>
              <p className="text-white/70">
                Optimize your resume with ATS insights, get detailed ratings,
                and leverage AI to write compelling cover letters that get
                noticed.
              </p>
            </div>

            <div className="bg-occean/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                Personalized Career Path Navigation
              </h3>
              <p className="text-white/70">
                Discover potential career trajectories based on your profile and
                aspirations, with clear guidance to help you make informed
                decisions.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="mt-12 px-8 py-3 bg-white text-occean font-bold rounded-lg hover:bg-white/90 transition-colors">
            Start Building Your Future Today
          </button>
        </div>
      </div>
    </div>
  );
}
