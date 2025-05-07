"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle,
  Copy,
  ExternalLink,
  Video,
  Clock,
  ArrowRight,
  ThumbsUp,
  Sparkles,
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SuccessPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(null);

  // Demo Google Meet link - this would come from your API in a real implementation
  const meetLink = "https://meet.google.com/abc-defg-hij";

  // Demo interview time - this would come from your API in a real implementation
  const interviewDate = new Date();
  interviewDate.setDate(interviewDate.getDate() + 2); // Interview in 2 days
  interviewDate.setHours(10, 0, 0, 0); // 10:00 AM

  useEffect(() => {
    // Calculate time remaining until interview
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = interviewDate - now;

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setCountdown({ days, hours, minutes });
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#7657ff]/10 mb-4">
            <Sparkles className="h-8 w-8 text-[#7657ff]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#322372] mb-2">
            Congratulations!
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            You&apos;ve successfully completed all the assessment stages. You&apos;re now
            invited to the final HR interview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-md bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-[#322372] mb-1">
                  Assessment Completed
                </h3>
                <p className="text-sm text-gray-600">
                  You&apos;ve successfully passed all required assessments
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#7657ff]/10 p-3 rounded-full mb-4">
                  <Calendar className="h-6 w-6 text-[#7657ff]" />
                </div>
                <h3 className="font-semibold text-[#322372] mb-1">
                  Interview Scheduled
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(interviewDate)} at {formatTime(interviewDate)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#322372]/10 p-3 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-[#322372]" />
                </div>
                <h3 className="font-semibold text-[#322372] mb-1">
                  Time Remaining
                </h3>
                {countdown && (
                  <p className="text-sm text-gray-600">
                    {countdown.days} days, {countdown.hours} hours,{" "}
                    {countdown.minutes} minutes
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-r from-[#322372] to-[#7657ff] text-white pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Final HR Interview</CardTitle>
                <p className="text-white/80 text-sm mt-1">
                  Join via Google Meet
                </p>
              </div>
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                <Video className="h-3.5 w-3.5 mr-1" /> Video Interview
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-[#7657ff]/5 border border-[#7657ff]/20 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-[#322372] mb-4">
                  Your Google Meet Link
                </h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between w-full max-w-md">
                    <span className="font-mono text-[#322372] truncate">
                      {meetLink}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                      className="h-8 w-8 text-gray-500 hover:text-[#7657ff]"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  className="bg-[#7657ff] hover:bg-[#322372]"
                  onClick={() => window.open(meetLink, "_blank")}
                >
                  <Video className="h-4 w-4 mr-2" /> Join Meeting
                </Button>
              </div>

              <Alert className="bg-amber-50 border-amber-200">
                <ThumbsUp className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Please join the meeting 5 minutes before the scheduled time to
                  ensure a smooth start.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#322372]">
                  What to Expect
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-[#7657ff] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Discussion about your experience and skills
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-[#7657ff] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Questions about your career goals and aspirations
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-[#7657ff] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Information about the company culture and benefits
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-[#7657ff] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Opportunity to ask questions about the role
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="w-full flex flex-col sm:flex-row gap-4 justify-between">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
              >
                Return to Dashboard
              </Button>
              <Button
                onClick={() =>
                  window.open("https://calendly.com/demo/interview", "_blank")
                }
                className="bg-[#322372] hover:bg-[#322372]/90"
              >
                <Calendar className="h-4 w-4 mr-2" /> Add to Calendar
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-md bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#7657ff]/10 p-3 rounded-full">
                <Sparkles className="h-6 w-6 text-[#7657ff]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#322372] mb-2">
                  Prepare for Success
                </h3>
                <p className="text-gray-700 mb-4">
                  Take some time to prepare for your interview. Research the
                  company, review your resume, and prepare questions to ask the
                  interviewer.
                </p>
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("#", "_blank")}
                    className="border-[#7657ff]/30 text-[#7657ff] hover:bg-[#7657ff]/10"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Interview
                    Tips
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("#", "_blank")}
                    className="border-[#7657ff]/30 text-[#7657ff] hover:bg-[#7657ff]/10"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Company
                    Information
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
