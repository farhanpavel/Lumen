"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { url } from "@/components/Url/page";
import {
  Mic,
  SkipForward,
  Volume2,
  VolumeX,
  CheckCircle,
  Clock,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  Loader,
} from "lucide-react";
import Cookies from "js-cookie";

export default function InterviewPage() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timer, setTimer] = useState(120);
  const [countdown, setCountdown] = useState(5);
  const [isMicActive, setIsMicActive] = useState(false);
  const [inputText, setInputText] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [jobDetails, setJobDetails] = useState(null);
  const [resumeDetails, setResumeDetails] = useState(null);
  const [answers, setAnswers] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const audioRef = useRef(null);

  const jobId = "f7e29eaf-106b-4072-8899-e3cf679d2f70";

  const difficulty = searchParams.get("difficulty") || "medium";

  const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  const ELEVENLABS_VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("AccessToken");
        // Use the new API endpoint to generate questions
        const response = await fetch(
          `${url}/api/interview/generate-questions-for-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              jobId,

              difficulty,
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch questions");

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to generate questions");
        }

        // Set job and resume details
        setJobDetails(data.data.job);
        setResumeDetails(data.data.resume);

        // Set questions and initialize answers array
        setQuestions(data.data.questions);
        setAnswers(
          data.data.questions.map((q) => ({
            question: q.question,
            answer: "",
          }))
        );

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(
          error.message ||
            "Failed to load interview questions. Please try again later."
        );
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchQuestions();
    } else {
      setError("Missing job ID or user ID. Please provide both parameters.");
      setIsLoading(false);
    }
  }, [jobId, difficulty]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const newTranscript =
          event.results[event.results.length - 1][0].transcript;
        setInputText((prev) => prev + " " + newTranscript);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error("Speech Recognition is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    if (isCountdownActive) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(countdownInterval);
        setIsCountdownActive(false);
        if (questions.length > 0) {
          setCurrentQuestion(questions[0].question);
        }
      }

      return () => clearInterval(countdownInterval);
    }
  }, [countdown, isCountdownActive, questions]);

  useEffect(() => {
    if (questions.length > 0) {
      setProgress((currentQuestionIndex / (questions.length - 1)) * 100);
    }
  }, [currentQuestionIndex, questions]);

  const speakQuestion = async (text) => {
    if (!text) return;

    try {
      setIsSpeaking(true);
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: text,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate speech");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        audioRef.current.onended = () => {
          setIsSpeaking(false);
        };
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  };

  const nextQuestion = async () => {
    // Stop the speech recognition if it is active
    if (isMicActive && recognition) {
      recognition.stop();
      setIsMicActive(false);
    }

    // Stop any ongoing speech
    stopSpeaking();

    // Save the current answer
    if (currentQuestion && inputText.trim() !== "") {
      // Update the answers array
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex].answer = inputText.trim();
      setAnswers(updatedAnswers);
    }

    // Move to the next question or finish the interview
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const newQuestion = questions[nextIndex].question;
      setCurrentQuestion(newQuestion);
      setTimer(120);
      setInputText("");
      speakQuestion(newQuestion);
    } else {
      // Submit all answers for evaluation
      await submitAnswers();
    }
  };

  const submitAnswers = async () => {
    try {
      router.push("/userdashboard/interview/result");
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("There was an error submitting your answers. Please try again.");
    }
  };

  useEffect(() => {
    if (!isCountdownActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      nextQuestion();
    }
  }, [timer, isCountdownActive]);

  const handleMicClick = () => {
    if (recognition) {
      if (!isMicActive) {
        setIsMicActive(true);
        recognition.start();
      } else {
        setIsMicActive(false);
        recognition.stop();
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-12 shadow-xl text-center">
          <Loader className="w-12 h-12 text-[#7657ff] animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#322372]">
            Loading Interview
          </h2>
          <p className="text-gray-500 mt-2">Preparing your questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-12 shadow-xl text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#322372]">Error</h2>
          <p className="text-gray-600 mt-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-[#7657ff] hover:bg-[#322372] text-white rounded-xl font-medium transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] flex flex-col items-center justify-center p-6">
      <audio ref={audioRef} />

      {isCountdownActive ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-12 shadow-xl">
            <h1 className="text-4xl font-bold mb-8 text-[#322372]">
              Preparing Your Interview
            </h1>
            <div className="relative w-40 h-40 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * countdown) / 5}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#7657ff" />
                    <stop offset="100%" stopColor="#4299e1" />
                  </linearGradient>
                </defs>
              </svg>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-[#322372]"
              >
                {countdown}
              </motion.div>
            </div>
            <p className="mt-8 text-gray-600">
              Get ready to answer interview questions
            </p>
            {jobDetails && (
              <div className="mt-4 text-gray-600">
                <p className="font-medium text-[#322372]">{jobDetails.title}</p>
                <p className="text-sm">{jobDetails.company}</p>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#7657ff] to-[#4299e1]"
            />
          </div>

          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl px-6 py-3 flex items-center shadow-md"
            >
              <HelpCircle className="w-5 h-5 text-[#7657ff] mr-2" />
              <div>
                <span className="text-gray-500 text-sm block">Question</span>
                <span className="text-[#322372] font-medium">
                  {currentQuestionIndex + 1}/{questions.length}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-white rounded-xl px-6 py-3 flex items-center shadow-md ${
                timer < 30 ? "animate-pulse" : ""
              }`}
            >
              <Clock
                className={`w-5 h-5 mr-2 ${
                  timer < 30 ? "text-red-500" : "text-[#7657ff]"
                }`}
              />
              <div>
                <span className="text-gray-500 text-sm block">Time Left</span>
                <span
                  className={`font-medium ${
                    timer < 30 ? "text-red-500" : "text-[#322372]"
                  }`}
                >
                  {formatTime(timer)}
                </span>
              </div>
            </motion.div>
          </div>

          {currentQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <MessageSquare className="w-6 h-6 text-[#7657ff] mr-3" />
                  <h2 className="text-2xl font-bold text-[#322372]">
                    Interview Question
                  </h2>
                </div>
                <button
                  onClick={
                    isSpeaking
                      ? stopSpeaking
                      : () => speakQuestion(currentQuestion)
                  }
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label={
                    isSpeaking ? "Stop speaking" : "Read question aloud"
                  }
                >
                  {isSpeaking ? (
                    <Volume2 className="w-6 h-6 text-[#7657ff]" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-gray-500" />
                  )}
                </button>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentQuestion}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="relative">
              <textarea
                className="w-full h-48 bg-white rounded-xl p-6 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#7657ff]/50 placeholder-gray-400 shadow-md"
                placeholder="Your answer will appear here as you speak..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              {isMicActive && (
                <div className="absolute bottom-4 right-4 flex items-center">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-gray-500 text-sm">Recording...</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMicClick}
                disabled={isSpeaking}
                className={`
                  flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all w-full sm:w-auto shadow-md
                  ${
                    isMicActive
                      ? "bg-green-500 text-white"
                      : "bg-[#7657ff] text-white"
                  }
                  ${
                    isSpeaking
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg hover:shadow-[#7657ff]/20"
                  }
                `}
              >
                <Mic className="w-5 h-5" />
                {isMicActive ? "Stop Recording" : "Start Recording"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                className={`
                  flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all w-full sm:w-auto shadow-md
                  ${
                    isLastQuestion
                      ? "bg-green-500 text-white hover:shadow-lg hover:shadow-green-500/20"
                      : "bg-[#4299e1] text-white hover:bg-[#3182ce]"
                  }
                `}
              >
                {isLastQuestion ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Finish Interview
                  </>
                ) : (
                  <>
                    <SkipForward className="w-5 h-5" />
                    Next Question
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Job details section */}
          {jobDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-white rounded-xl p-4 shadow-md"
            >
              <h3 className="text-[#322372] text-sm font-medium mb-2 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-[#7657ff]" />
                Job Details
              </h3>
              <div className="text-gray-600 text-sm">
                <p>
                  <span className="font-medium">Position:</span>{" "}
                  {jobDetails.title}
                </p>
                <p>
                  <span className="font-medium">Company:</span>{" "}
                  {jobDetails.company}
                </p>
                <p className="mt-1 text-xs line-clamp-2">
                  {jobDetails.description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Tips section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-xl p-4 shadow-md"
          >
            <h3 className="text-[#322372] text-sm font-medium mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-[#7657ff]" />
              Interview Tips
            </h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Structure your answers with examples</li>
              <li>• Keep your responses concise and relevant</li>
            </ul>
          </motion.div>
        </div>
      )}
    </div>
  );
}
