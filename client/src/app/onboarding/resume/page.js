"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { url } from "@/components/Url/page";

export default function ResumeAnalysisPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'uploading', 'success', 'error'
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      handleFileUpload(droppedFile);
    } else {
      setUploadStatus("error");
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (selectedFile) => {
    setFile(selectedFile);
    setUploadStatus("uploading");
    setIsLoading(true);

    // Create FormData for the file upload
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Get JWT token from cookies
      const token = Cookies.get("AccessToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        if (progress >= 95) clearInterval(progressInterval);
      }, 100);

      // Make the API call
      const response = await fetch(`${url}/api/resume`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();
      setUploadStatus("success");

      // Redirect to questions page after 1.5 seconds
      setTimeout(() => {
        router.push("/onboarding/question");
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setIsLoading(false);
      setTimeout(() => {
        setUploadStatus(null);
        setFile(null);
      }, 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7fe] to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#322372] mb-4">
            Resume Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume and our AI will analyze it to provide
            personalized insights and improvement suggestions.
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Card className="border-[#7657ff]/20 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-[#322372] to-[#7657ff] p-6 text-white">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Upload
                </h2>
                <p className="mt-2 text-white/80">
                  Let&lsquo;s start by uploading your resume. We&lsquo;ll analyze it and
                  provide feedback to help you stand out.
                </p>
              </div>

              {!file || uploadStatus === "error" ? (
                <div
                  className={`p-8 border-2 border-dashed rounded-lg m-6 transition-colors ${
                    isDragging
                      ? "border-[#7657ff] bg-[#7657ff]/5"
                      : "border-gray-300 bg-gray-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <motion.div
                      className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#7657ff]/10 text-[#7657ff]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Upload className="h-10 w-10" />
                    </motion.div>

                    <h3 className="mt-4 text-xl font-medium text-gray-900">
                      Hi! Please upload your resume
                    </h3>

                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                      Drag and drop your PDF file here, or click the button
                      below to select a file from your computer.
                    </p>

                    {uploadStatus === "error" && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-red-500">
                        <AlertCircle className="h-5 w-5" />
                        <span>Please upload a PDF file</span>
                      </div>
                    )}

                    <div className="mt-6">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="application/pdf"
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-[#7657ff] hover:bg-[#7657ff]/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Select Resume"
                        )}
                      </Button>
                    </div>

                    <p className="mt-4 text-xs text-gray-500">
                      Supported file: PDF (Max 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 m-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#7657ff]/10 p-3 rounded-lg">
                      <FileText className="h-8 w-8 text-[#7657ff]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          {file.name}
                        </h3>
                        {uploadStatus === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Loader2 className="h-5 w-5 text-[#7657ff] animate-spin" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • PDF
                      </p>

                      {uploadStatus === "uploading" && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Uploading...</span>
                            <span className="text-[#7657ff] font-medium">
                              {uploadProgress}%
                            </span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}

                      {uploadStatus === "success" && (
                        <motion.div
                          className="mt-6"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-green-700 font-medium">
                              <CheckCircle className="h-5 w-5" />
                              <span>
                                Upload complete! Redirecting to questions...
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-[#7657ff]/10 p-3 inline-block rounded-lg mb-4">
              <FileText className="h-6 w-6 text-[#7657ff]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Resume Analysis</h3>
            <p className="text-gray-600 text-sm">
              Our AI analyzes your resume structure, content, and formatting to
              identify strengths and weaknesses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-[#7657ff]/10 p-3 inline-block rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-[#7657ff]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Personalized Feedback
            </h3>
            <p className="text-gray-600 text-sm">
              Receive tailored suggestions to improve your resume and increase
              your chances of landing interviews.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-[#7657ff]/10 p-3 inline-block rounded-lg mb-4">
              <ArrowRight className="h-6 w-6 text-[#7657ff]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
            <p className="text-gray-600 text-sm">
              Get actionable recommendations on how to enhance your professional
              profile and job search strategy.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
