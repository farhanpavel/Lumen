import React from "react";
import {
  CheckCircle,
  Award,
  Zap,
  Shield,
  Clock,
  Users, // Consider if this icon/concept fits job seekers or replace
  ArrowRight,
} from "lucide-react";

export default function Benefit() {
  const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-tertiary" />,
      title: "Fast-Track Your Applications", // Rewritten title
      description:
        "Automatically screen your resume against job requirements (ATS check) and get instant feedback to save time.", // Rewritten description
    },
    {
      icon: <Award className="h-8 w-8 text-tertiary" />, // Changed icon to Award for improvement focus
      title: "Boost Your Interview Confidence", // Rewritten title
      description:
        "Practice with AI mock interviews tailored to your target role and get personalized feedback to perform your best.", // Rewritten description
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-tertiary" />, // Changed icon to CheckCircle for readiness focus
      title: "Optimize Your Resume & Cover Letter", // Rewritten title
      description:
        "Get an objective rating for your resume and use our AI assistant to craft compelling cover letters.", // Rewritten description
    },
    {
      icon: <Shield className="h-8 w-8 text-tertiary" />,
      title: "Personalized Preparation", // Rewritten title
      description:
        "Receive targeted preparation plans based on your current skills and the specific job roles you're applying for.", // Rewritten description
    },
    {
      icon: <Clock className="h-8 w-8 text-tertiary" />, // Keep Clock icon for time
      title: "Clear Career Pathing", // Rewritten title
      description:
        "Visualize potential career paths and understand the steps needed to reach your professional goals.", // Rewritten description
    },
    {
      icon: <Users className="h-8 w-8 text-tertiary" />, // Keep Users icon but rephrase benefit
      title: "Unlock Your Potential", // Rewritten title
      description:
        "Bridge the gap between your current skills and industry demands to land your dream job faster.", // Rewritten description
    },
  ];

  return (
    <div className="min-h-screen font-mona">
      <div className="bg-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              {/* These numbers might need to be actual or placeholder stats relevant to job seekers */}
              <p className="text-4xl font-bold text-tertiary mb-2">93%</p>
              <p className="text-gray-600">Users felt more prepared</p>{" "}
              {/* Reworded */}
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-tertiary mb-2">2X</p>{" "}
              {/* Example stat */}
              <p className="text-gray-600">Faster application process</p>{" "}
              {/* Reworded */}
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-tertiary mb-2">100+</p>{" "}
              {/* Example stat */}
              <p className="text-gray-600">Mock interviews completed</p>{" "}
              {/* Reworded */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Benefits Section */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-tertiary">Lumen?</span>{" "}
              {/* Changed "Our Platform" to "Lumen?" */}
            </h2>
            <p className="text-[#5a5a5a] text-sm font-medium w-[50%] mx-auto text-center mt-3 ">
              Lumen empowers you to navigate the job market with confidence,
              bridging the gap between your skills and industry demands.
            </p>{" "}
            {/* Rewritten description */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="bg-tertiary/10 p-3 inline-block rounded-lg mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-tertiary/5 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-tertiary/20 relative">
            <div className="absolute -top-5 left-10 bg-tertiary text-white text-xl font-bold py-2 px-6 rounded-full">
              Success Story
            </div>
            <div className="md:flex items-center gap-8">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden">
                  <img
                    src="/images/user_story.jpg"
                    alt="Success story user"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl italic mb-6">
                  &quot;Finding my first job felt overwhelming, but Lumen
                  changed everything. The resume rating helped me improve my CV,
                  the AI interviews boosted my confidence, and the personalized
                  preparation made me feel truly ready. I landed a great role
                  just weeks after using it! &quot;
                </p>
                <div>
                  <p className="font-bold text-lg">John Doe</p>
                  <p className="text-gray-600">
                    Fresh Graduate & Software Engineer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-occean py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>{" "}
          {/* Rewritten Heading */}
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            Join job seekers who are getting interview-ready and finding
            opportunities with Lumen.
          </p>{" "}
          {/* Rewritten description */}
          <button className="px-8 py-4 bg-white text-occean font-bold rounded-full hover:bg-white/90 transition-colors flex items-center gap-2 mx-auto">
            Get Started Now {/* Rewritten Button Text */}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Comparison Section */}
    </div>
  );
}
