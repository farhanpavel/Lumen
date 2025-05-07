"use client"; // Assuming this is still needed, though not in the second snippet directly
import React from "react";
import {
  FileText, // For Resume Upload & Onboarding
  TrendingUp, // For ATS-Friendly Resume Insights (improvement/getting past filters)
  GraduationCap, // For AI Mock Interviews (learning/preparation)
  Crown, // For Intelligent Resume Rating (top-tier resume)
  ShoppingCart, // For Targeted Skill Prep & Career Paths (collecting skills - a bit of a stretch)
  Box, // For AI Cover Letter Assistant (application package - also a stretch)
  // Consider adding more appropriate icons if possible, e.g.:
  // UploadCloud for uploads
  // MessageCircle or Mic for interviews
  // Sparkles or Star for ratings
  // Target or Map or ClipboardList for career paths/skill prep
  // PenTool or Edit3 or Mail for cover letters
} from "lucide-react";

export default function Feature() {
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      title: "Seamless Resume Upload & Onboarding",
      description:
        "Easily upload your resume and answer a few key questions. Lumen intelligently extracts your information to kickstart your personalized career journey.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      title: "ATS-Friendly Resume Insights",
      description:
        "Understand how Applicant Tracking Systems see your resume. Get actionable tips to optimize it for better visibility and pass the initial screening.",
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-white" />,
      title: "AI-Powered Mock Interviews",
      description:
        "Practice your interview skills with our AI. Get instant feedback on your answers, delivery, and confidence to face real interviews without fear.",
    },
    {
      icon: <Crown className="h-6 w-6 text-white" />,
      title: "Intelligent Resume Rating",
      description:
        "Receive a comprehensive rating of your resume, highlighting strengths and areas for improvement to make your application stand out from the crowd.",
    },
    {
      icon: <ShoppingCart className="h-6 w-6 text-white" />, // Placeholder icon, ideally change
      title: "Targeted Skill Prep & Career Paths",
      description:
        "Based on your current skills and desired job roles, Lumen generates a personalized preparation plan and illuminates potential career trajectories for you.",
    },
    {
      icon: <Box className="h-6 w-6 text-white" />, // Placeholder icon, ideally change
      title: "AI Cover Letter Assistant",
      description:
        "Craft compelling cover letters effortlessly. Our AI assistant helps you tailor your message to specific job openings, saving you time and boosting your impact.",
    },
  ];

  return (
    <section className="py-16 font-mona">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-tertiary">
            {" "}
            {/* Increased size slightly */}
            Unlock Your Potential with{" "}
            <span className="text-[#7657ff]/90">Lumen's Smart Tools</span>{" "}
            {/* Slightly more opaque span */}
          </h2>
          <p className="text-[#5a5a5a] text-base font-medium w-[70%] md:w-[55%] mx-auto text-center mt-3">
            {" "}
            {/* Increased width and base size */}
            From crafting the perfect resume to acing the interview, Lumen
            provides a comprehensive suite of AI-powered tools to guide you
            every step of the way towards your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl p-6 flex items-start gap-4 hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              {" "}
              {/* Added bg-white and hover shadow for cards */}
              <div className="bg-tertiary text-white p-3 rounded-lg shadow-md">
                {" "}
                {/* Shadow on icon bg */}
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-occean">
                  {" "}
                  {/* Ensure 'text-occean' is defined in your Tailwind config */}
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>{" "}
                {/* Slightly larger text for description */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
