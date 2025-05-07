"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";

export default function Page() {
  const router = useRouter();
  const [planner, setPlanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("AccessToken");
  useEffect(() => {
    const jobId = Cookies.get("jobId");
    const fetchPlanner = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/planner/generate/${jobId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch planner data");
        }

        const data = await response.json();
        setPlanner(data.data);
      } catch (err) {
        console.error("Error fetching planner:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanner();
  }, []);

  const handleTitleClick = (id, index) => {
    // Fix: Use the title from planner.title array instead of the index
    const title = planner.title[index];
    // Create a slug from the title
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    router.push(
      `/userdashboard/learn/${slug}?title=${encodeURIComponent(title)}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7fe]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#7657ff] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#7657ff] font-medium">
            Loading your learning plan...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7fe] p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-[#7657ff] text-white rounded-md hover:bg-[#322372] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!planner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7fe] p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Learning Plan Found
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have any active learning plans.
          </p>
          <button className="py-2 px-4 bg-[#7657ff] text-white rounded-md hover:bg-[#322372] transition-colors">
            Create a Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7fe] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#322372] mb-2">
            Your Learning Plan
          </h1>
          <p className="text-gray-600">
            Follow this personalized roadmap to prepare for your job interview
          </p>
        </div>

        {/* Plan Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Job Preparation Plan
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Created on {new Date(planner.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  planner.status === "NOT_STARTED"
                    ? "bg-blue-100 text-blue-700"
                    : planner.status === "IN_PROGRESS"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {planner.status.replace(/_/g, " ")}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  planner.priority === "HIGH"
                    ? "bg-red-100 text-red-700"
                    : planner.priority === "MEDIUM"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {planner.priority} Priority
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-[#7657ff]" />
              <span>{planner.title.length} learning topics</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-[#7657ff]" />
              <span>Estimated completion: {planner.title.length} days</span>
            </div>
          </div>
        </div>

        {/* Learning Topics */}
        <div className="space-y-4">
          {planner.title.map((title, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="cursor-pointer"
              onClick={() => handleTitleClick(planner.id, index)}
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="flex items-center p-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#7657ff]/10 rounded-full flex items-center justify-center text-[#7657ff] mr-4">
                    {index + 1}
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Day {index + 1} • Estimated time: 2-3 hours
                    </p>
                  </div>

                  <div className="flex-shrink-0 ml-4">
                    <ArrowRight className="h-5 w-5 text-[#7657ff]" />
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="h-1 w-full bg-gray-100">
                  <div className="h-full bg-[#7657ff] w-0"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image */}
      </div>
    </div>
  );
}
