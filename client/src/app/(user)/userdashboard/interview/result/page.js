"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Clock, Mail, CheckCircle, ArrowLeft, User } from "lucide-react";

export default function InterviewResultPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-[#322372] mb-8 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl mb-8 text-center"
        >
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-green-100 p-6 rounded-full mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-[#322372] mb-4">
              Interview Results Submitted
            </h1>

            <p className="text-gray-600 max-w-lg mx-auto mb-8">
              Thank you for completing the interview process. Your results have
              been successfully submitted to our HR team.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 max-w-md w-full mb-8">
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Next Steps
                  </h3>
                  <p className="text-gray-700">
                    Our HR team will review your interview results and contact
                    you shortly with feedback and next steps.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 max-w-md w-full mb-8">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-purple-800 mb-2">
                    Stay Connected
                  </h3>
                  <p className="text-gray-700">
                    Please check your email regularly for updates. The typical
                    response time is 3-5 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* New HR Interview Button */}
            <button
              onClick={() => router.push("/userdashboard/meet")}
              className="flex items-center gap-2 px-6 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl font-medium transition-all mt-4"
            >
              <User className="w-5 h-5" />
              Go to HR Interview
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-xl font-bold text-[#322372] mb-6 text-center">
            What You Can Do Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f8f9ff] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#322372] mb-3">
                Prepare for Next Steps
              </h3>
              <p className="text-gray-700 mb-4">
                While waiting for HR's response, you can prepare for potential
                next rounds by reviewing common interview questions.
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-[#7657ff] text-white rounded-lg hover:bg-[#322372] transition-colors"
              >
                Practice More
              </button>
            </div>
            <div className="bg-[#f8f9ff] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#322372] mb-3">
                Explore Other Opportunities
              </h3>
              <p className="text-gray-700 mb-4">
                Browse our career portal to discover other positions that might
                interest you.
              </p>
              <button className="px-4 py-2 bg-[#4299e1] text-white rounded-lg hover:bg-[#3182ce] transition-colors">
                View Openings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
