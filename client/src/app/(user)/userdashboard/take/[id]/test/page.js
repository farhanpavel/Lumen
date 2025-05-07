"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { url } from "@/components/Url/page";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Send,
  BookOpen,
  Lightbulb,
  Loader2,Code
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ExamPage({ params }) {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [violations, setViolations] = useState(0);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);

  const jobId = params.id;

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${url}/api/resume/create-questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error("Invalid questions data");
        }
        setQuestions(data.questions);
        setAnswers(Array(data.questions.length).fill(""));
      } catch (err) {
        setError(`Failed to load questions: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [jobId]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !hasAutoSubmitted) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasAutoSubmitted]);

  // Tab switching detection with debouncing
  useEffect(() => {
    let timeoutId;
    const handleVisibilityChange = () => {
      if (document.hidden && !hasAutoSubmitted) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setViolations((prev) => {
            const newCount = prev + 1;
            if (newCount >= 3) {
              // Show confirmation before auto-submission
              if (
                window.confirm(
                  "You have switched tabs 3 times. Your exam will be submitted automatically."
                )
              ) {
                handleSubmit();
              }
            }
            return newCount;
          });
        }, 500); // Debounce by 500ms
      }
    };

    const handleBeforeUnload = (e) => {
      if (answers.some((a) => a.trim() !== "") && !hasAutoSubmitted) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved answers. Are you sure you want to leave?";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearTimeout(timeoutId);
    };
  }, [answers, hasAutoSubmitted]);

  // Update progress
  useEffect(() => {
    if (questions.length > 0) {
      const answeredCount = answers.filter((a) => a.trim() !== "").length;
      setProgress((answeredCount / questions.length) * 100);
    }
  }, [answers, questions]);

  const handleAnswerChange = useCallback((index, answer) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = answer;
      return newAnswers;
    });
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 300) return "text-red-600"; // Less than 5 minutes
    if (timeLeft < 600) return "text-amber-600"; // Less than 10 minutes
    return "text-[#322372]";
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || hasAutoSubmitted || questions.length === 0) return;
    setIsSubmitting(true);
    setHasAutoSubmitted(true);

    try {
      const submission = questions.map((q, i) => ({
        q,
        a: answers[i] || "",
      }));

      const response = await fetch(`${url}/api/resume/review-answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultData = await response.json();

      if (resultData.success && resultData.analysis) {
        setResult(resultData.analysis);
      } else {
        throw new Error(resultData.message || "Invalid response from server");
      }
    } catch (err) {
      setError(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, hasAutoSubmitted, questions, answers]);

  const navigateQuestion = (direction) => {
    const newIndex = currentQuestion + direction;
    if (newIndex >= 0 && newIndex < questions.length) {
      setCurrentQuestion(newIndex);
    }
  };

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
                onClick={() => router.push("/userdashboard/overview")}
                className="bg-[#7657ff] hover:bg-[#322372]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                Loading Exam Questions
              </h3>
              <p className="mt-2 text-gray-600 text-center max-w-xs">
                We're preparing your technical assessment. This should only take
                a moment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#322372] to-[#7657ff] text-white pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Exam Results</CardTitle>
                  <p className="text-white/80 text-sm mt-1">
                    Technical Assessment Completed
                  </p>
                </div>
                <Badge
                  className={`${
                    result.score >= 70
                      ? "bg-green-500/20 text-green-100 hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-100 hover:bg-red-500/30"
                  } border-0 py-1.5 px-3`}
                >
                  {result.score >= 70 ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Passed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="h-4 w-4" /> Not Passed
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
                      <Lightbulb className="h-5 w-5 text-[#7657ff]" /> Your
                      Score
                    </h3>
                    <span
                      className={`text-xl font-bold ${
                        result.score >= 70 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {result.score}%
                    </span>
                  </div>
                  <Progress
                    value={result.score}
                    className="h-3 bg-gray-100"
                    indicatorClassName={`${
                      result.score >= 70 ? "bg-green-600" : "bg-red-600"
                    } transition-all duration-1000 ease-in-out`}
                  />
                  <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>0%</span>
                    <span>Passing: 70%</span>
                    <span>100%</span>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-[#7657ff]" /> Feedback
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                      {result.comment || "No feedback provided."}
                    </p>
                  </div>
                </div>

                {result.lackings?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[#7657ff]" /> Areas to
                      Improve
                    </h3>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                      <div className="flex items-start gap-3 mb-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <p className="text-amber-800">
                          Focus on improving these areas to enhance your
                          technical skills:
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {result.lackings.map((topic, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-white border-amber-300 text-amber-800 hover:bg-amber-50 py-1.5 px-3"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 border-t border-gray-200 p-6">
              <div className="w-full flex flex-col sm:flex-row gap-4 justify-between">
                <Button
                  onClick={() => router.push(`/userdashboard/take/${params.id}/coding-test`)}
                  className="bg-[#7657ff] hover:bg-[#322372]"
                >
                  <Code  className="h-4 w-4 mr-2" /> Take coding Test
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/userdashboard/preparation")}
                  className="border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
                >
                  <BookOpen className="h-4 w-4 mr-2" /> View Learning Resources
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden mb-6">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-[#322372]">
                  Technical Assessment
                </CardTitle>
                <p className="text-gray-500 text-sm mt-1">Job ID: {jobId}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Clock className={`h-4 w-4 ${getTimeColor()}`} />
                  <span className={`font-mono font-medium ${getTimeColor()}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Progress:</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7657ff] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {violations > 0 && (
              <Alert
                variant="warning"
                className="mb-6 bg-amber-50 border-amber-200 text-amber-800"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Tab Switch Detected</AlertTitle>
                <AlertDescription>
                  You have switched tabs {violations} time
                  {violations !== 1 ? "s" : ""}. 3 violations will result in
                  automatic submission.
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-[#322372]/5 text-[#322372] border-[#322372]/20"
                >
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span
                  className={
                    answers[currentQuestion]?.trim()
                      ? "text-green-600"
                      : "text-gray-400"
                  }
                >
                  {answers[currentQuestion]?.trim() ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Answered
                    </span>
                  ) : (
                    "Not answered"
                  )}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-[#322372] mb-4">
                {questions[currentQuestion] || "Loading question..."}
              </h3>
              <Textarea
                value={answers[currentQuestion] || ""}
                onChange={(e) =>
                  handleAnswerChange(currentQuestion, e.target.value)
                }
                className="min-h-[200px] border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                placeholder="Type your answer here..."
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigateQuestion(-1)}
                disabled={currentQuestion === 0 || isSubmitting}
                className="border-[#7657ff]/30 text-[#7657ff] hover:bg-[#7657ff]/10 disabled:opacity-50"
              >
                Previous
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button
                  onClick={() => navigateQuestion(1)}
                  disabled={isSubmitting}
                  className="bg-[#7657ff] hover:bg-[#322372]"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#7657ff] hover:bg-[#322372]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Submit Exam
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentQuestion(index)}
                  disabled={isSubmitting}
                  className={`h-8 w-8 p-0 ${
                    currentQuestion === index
                      ? "bg-[#7657ff] text-white hover:bg-[#322372] border-[#7657ff]"
                      : answers[index]?.trim()
                      ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
