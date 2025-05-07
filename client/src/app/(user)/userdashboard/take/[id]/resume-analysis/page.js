"use client";

import { useEffect, useState } from "react";
import { url } from "@/components/Url/page";
import Cookies from "js-cookie";
import {
  FileText,
  CheckCircle,
  XCircle,
  ArrowLeft,
  BookOpen,
  ClipboardCheck,
  AlertTriangle,
  Loader2,
  BarChart3,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Page({ params }) {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const jobId = params?.id;

  useEffect(() => {
    const validateResume = async () => {
      try {
        const response = await fetch(`${url}/api/resume/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Cookies.get("AccessToken"),
          },
          body: JSON.stringify({ jobId }),
        });

        if (!response.ok) throw new Error("Validation failed");
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    validateResume();
  }, [jobId]);

  useEffect(() => {
    if (!isLoading && result) {
      // Animate progress bar
      const timer = setTimeout(() => {
        setProgress(result.percentage);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, result]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-amber-600";
    return "bg-red-600";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-[#7657ff] animate-spin" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-[#7657ff]/20"></div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#322372]">
                Analyzing Your Resume
              </h3>
              <p className="mt-2 text-gray-600 text-center max-w-xs">
                We're comparing your resume with the job requirements to
                determine your eligibility.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="pt-6">
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => window.history.back()}
                className="bg-[#7657ff] hover:bg-[#322372]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Job Listings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#322372] mb-2">
            Resume Analysis
          </h1>
          <p className="text-gray-600">Job compatibility assessment</p>
        </div>

        <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-r from-[#322372] to-[#7657ff] text-white pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Match Results</CardTitle>
                <p className="text-white/80 text-sm mt-1">
                  Based on your resume and job requirements
                </p>
              </div>
              <Badge
                className={`${
                  result.eligible
                    ? "bg-green-500/20 text-green-100 hover:bg-green-500/30"
                    : "bg-red-500/20 text-red-100 hover:bg-red-500/30"
                } border-0 py-1.5 px-3`}
              >
                {result.eligible || true ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Eligible
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Not Eligible
                  </span>
                )}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#7657ff]" /> Match
                    Percentage
                  </h3>
                  <span
                    className={`text-xl font-bold ${getScoreColor(
                      result.percentage
                    )}`}
                  >
                    {result.percentage}%
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-3 bg-gray-100"
                  indicatorClassName={`${getProgressColor(
                    result.percentage
                  )} transition-all duration-1000 ease-in-out`}
                />
                <div className="flex justify-between text-xs text-gray-500 px-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <Separator className="bg-gray-200" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#7657ff]" /> Analysis
                  Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-gray-700 leading-relaxed">
                    {result.description}
                  </p>
                </div>
              </div>

              {result.lackings.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#7657ff]" />{" "}
                    Recommended Improvements
                  </h3>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <div className="flex items-start gap-3 mb-3">
                      <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
                      <p className="text-amber-800">
                        Improve your match score by developing these skills that
                        are required for the job:
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {result.lackings.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-white border-amber-300 text-amber-800 hover:bg-amber-50 py-1.5 px-3"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="w-full flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Job Listings
              </Button>

              {(result.eligible || true) && (
                <Button
                  onClick={() =>
                    (window.location.href = `/userdashboard/take/${jobId}/test`)
                  }
                  className="bg-[#7657ff] hover:bg-[#322372]"
                >
                  <ClipboardCheck className="h-4 w-4 mr-2" /> Take Test
                </Button>
              )}

              <Button
                variant="secondary"
                onClick={() =>
                  (window.location.href = "/userdashboard/preparation")
                }
                className="bg-[#322372]/10 text-[#322372] hover:bg-[#322372]/20"
              >
                <BookOpen className="h-4 w-4 mr-2" /> Preparation Resources
              </Button>
            </div>
          </CardFooter>
        </Card>

        {!result.eligible && (
          <Card className="border-none shadow-md bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Lightbulb className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#322372] mb-2">
                    Not Eligible Yet?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Don't worry! You can improve your skills and try again.
                    Visit our preparation page to find resources that will help
                    you develop the skills needed for this job.
                  </p>
                  <Button
                    onClick={() =>
                      (window.location.href = "/userdashboard/preparation")
                    }
                    className="bg-[#7657ff] hover:bg-[#322372]"
                  >
                    <BookOpen className="h-4 w-4 mr-2" /> Go to Preparation
                    Resources
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
