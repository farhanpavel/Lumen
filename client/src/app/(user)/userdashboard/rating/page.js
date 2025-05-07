"use client";
import { useState, useEffect } from "react";
import {
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Award,
  TrendingUp,
  BarChart3,
  Lightbulb,
  ExternalLink,
  Download,
  Edit,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { url as API_BASE_URL } from "@/components/Url/page";
import Cookies from "js-cookie";

// Initial structure with placeholder data
const initialResumeAnalysisData = {
  name: "User Name",
  email: "user@example.com",
  phone: "N/A",
  location: "N/A",
  currentRole: "Role from Resume",
  resumeLink: "#",
  overallScore: 0,
  lastUpdated: new Date().toISOString().split("T")[0],
  sections: {
    summary: {
      content: "Loading summary...",
      score: 0,
      feedback: "Loading feedback...",
      suggestions: ["Loading suggestions..."],
    },
    experience: {
      score: 0,
      feedback: "Loading feedback...",
      suggestions: ["Loading suggestions..."],
    },
    skills: {
      score: 0,
      feedback: "Loading feedback...",
      content: [],
      missing: [],
      suggestions: ["Loading suggestions..."],
    },
    education: {
      content: "Loading education...",
      score: 0,
      feedback: "Loading feedback...",
      suggestions: ["Loading suggestions..."],
    },
    projects: {
      content: [],
      score: 0,
      feedback: "Loading feedback...",
      suggestions: ["Loading suggestions..."],
    },
  },
  keywordMatch: {
    score: 0,
    jobKeywords: [],
    missing: [],
    suggestions: ["Loading suggestions..."],
  },
  atsCompatibility: {
    score: 0,
    issues: ["Loading issues..."],
    suggestions: ["Loading suggestions..."],
  },
};

export default function ResumeAnalysisPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [resumeData, setResumeData] = useState(initialResumeAnalysisData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  // Get the user ID from cookies or context
  // For now, we'll use a placeholder - in a real app, get this from auth context
  const userId = "50368124-40b9-4dd8-b60f-ef6ad4df784d"; // Replace with actual user ID retrieval

  useEffect(() => {
    const fetchResumeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get auth token from cookies
        const token = Cookies.get("AccessToken");

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        // Fetch resume data
        const response = await fetch(
          `${API_BASE_URL}/api/rating/resumes/user`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "Resume not found for this user. You might need to create one first."
            );
          }
          throw new Error(`Failed to fetch resume: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          const apiData = result.data;

          // Update resume data from API
          setResumeData((prevData) => ({
            ...prevData,
            resumeLink: apiData.resumeUrl || "#",
            lastUpdated: apiData.createdAt
              ? new Date(apiData.createdAt).toLocaleDateString()
              : prevData.lastUpdated,
            currentRole: apiData.jobTitle || prevData.currentRole,
            sections: {
              ...prevData.sections,
              summary: {
                ...prevData.sections.summary,
                content: apiData.summary || "No summary provided.",
              },
              skills: {
                ...prevData.sections.skills,
                content: apiData.skills || [],
              },
              education: {
                ...prevData.sections.education,
                content:
                  apiData.education || "No education information provided.",
              },
              projects: {
                ...prevData.sections.projects,
                content: apiData.projects || [],
              },
            },
          }));

          // Now fetch the AI analysis
          setIsAnalysisLoading(true);
          await fetchResumeAnalysis(token);
        } else {
          throw new Error(result.message || "Failed to fetch resume data.");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching resume:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchResumeData();
    } else {
      setError("User ID is not available.");
      setIsLoading(false);
    }
  }, [userId]);

  // Separate function to fetch AI analysis
  const fetchResumeAnalysis = async (token) => {
    try {
      const analysisResponse = await fetch(
        `${API_BASE_URL}/api/rating/resumes/analyze`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!analysisResponse.ok) {
        throw new Error(
          `Failed to fetch analysis: ${analysisResponse.statusText}`
        );
      }

      const analysisResult = await analysisResponse.json();

      if (
        analysisResult.success &&
        analysisResult.data &&
        analysisResult.data.analysis
      ) {
        const analysis = analysisResult.data.analysis;

        // Update state with AI analysis data
        setResumeData((prevData) => ({
          ...prevData,
          overallScore: analysis.overallScore || 0,
          sections: {
            ...prevData.sections,
            summary: {
              ...prevData.sections.summary,
              score: analysis.sections?.summary?.score || 0,
              feedback:
                analysis.sections?.summary?.feedback ||
                "No feedback available.",
              suggestions: analysis.sections?.summary?.suggestions || [],
            },
            experience: {
              ...prevData.sections.experience,
              score: analysis.sections?.experience?.score || 0,
              feedback:
                analysis.sections?.experience?.feedback ||
                "No feedback available.",
              suggestions: analysis.sections?.experience?.suggestions || [],
            },
            skills: {
              ...prevData.sections.skills,
              score: analysis.sections?.skills?.score || 0,
              feedback:
                analysis.sections?.skills?.feedback || "No feedback available.",
              missing: analysis.sections?.skills?.missing || [],
              suggestions: analysis.sections?.skills?.suggestions || [],
            },
            education: {
              ...prevData.sections.education,
              score: analysis.sections?.education?.score || 0,
              feedback:
                analysis.sections?.education?.feedback ||
                "No feedback available.",
              suggestions: analysis.sections?.education?.suggestions || [],
            },
            projects: {
              ...prevData.sections.projects,
              score: analysis.sections?.projects?.score || 0,
              feedback:
                analysis.sections?.projects?.feedback ||
                "No feedback available.",
              suggestions: analysis.sections?.projects?.suggestions || [],
            },
          },
          keywordMatch: {
            score: analysis.keywordMatch?.score || 0,
            jobKeywords: analysis.keywordMatch?.jobKeywords || [],
            missing: analysis.keywordMatch?.missing || [],
            suggestions: analysis.keywordMatch?.suggestions || [],
          },
          atsCompatibility: {
            score: analysis.atsCompatibility?.score || 0,
            issues: analysis.atsCompatibility?.issues || [],
            suggestions: analysis.atsCompatibility?.suggestions || [],
          },
        }));
      }
    } catch (err) {
      console.error("Error fetching resume analysis:", err);
      // We don't set the main error state here to still show the resume data
      // Instead, we could show a warning about analysis not being available
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  // Calculate section scores for the chart
  const sectionScores = [
    { name: "Summary", score: resumeData.sections.summary.score },
    { name: "Experience", score: resumeData.sections.experience.score },
    { name: "Skills", score: resumeData.sections.skills.score },
    { name: "Education", score: resumeData.sections.education.score },
    { name: "Projects", score: resumeData.sections.projects.score },
    { name: "Keywords", score: resumeData.keywordMatch.score },
    { name: "ATS", score: resumeData.atsCompatibility.score },
  ];

  const improvementAreas = [...sectionScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const strengths = [...sectionScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-amber-100";
    return "bg-red-100";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-tertiary";
    return "bg-red-600";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#7657ff]" />
        <p className="mt-4 text-lg text-[#322372]">
          Loading Resume Analysis...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-2xl font-semibold text-red-700">
          Error Loading Resume
        </h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <Button
          className="mt-6 bg-[#7657ff] hover:bg-[#322372]"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
        {error.includes("Resume not found") && (
          <Button
            variant="outline"
            className="mt-2 border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
            onClick={() => (window.location.href = "/resume/create")}
          >
            Upload/Create Resume
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#322372] mb-2">
            Resume Analysis
          </h1>
          <p className="text-gray-600">
            Review your resume's strengths and areas for improvement
          </p>
          {isAnalysisLoading && (
            <div className="flex items-center mt-2 text-[#7657ff]">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Analyzing your resume...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Resume preview and overall score */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#322372] to-[#7657ff] text-white pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Resume Document</CardTitle>
                    <CardDescription className="text-white/80">
                      Last updated: {resumeData.lastUpdated}
                    </CardDescription>
                  </div>
                  <FileText className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent className="p-4 text-center">
                <FileText size={80} className="mx-auto text-gray-300 my-6" />
                <p className="text-sm text-gray-600 mb-4">
                  Your resume document is available for download.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
                >
                  <a
                    href={resumeData.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    View/Download Resume PDF
                  </a>
                </Button>
              </CardContent>
              <CardFooter className="flex justify-end p-4">
                <Button
                  className="bg-[#7657ff] hover:bg-[#322372]"
                  onClick={() =>
                    (window.location.href = `/resume/edit/${userId}`)
                  }
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Resume Data
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right column - Detailed analysis */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <Tabs
                  defaultValue={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="sections"
                      className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
                    >
                      Section Analysis
                    </TabsTrigger>
                    <TabsTrigger
                      value="keywords"
                      className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
                    >
                      Keywords & ATS
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs value={activeTab}>
                  <TabsContent value="overview" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                        <FileText className="h-5 w-5" /> Resume Summary
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <p className="text-gray-700 italic whitespace-pre-line">
                          {resumeData.sections.summary.content}
                        </p>
                      </div>

                      {!isAnalysisLoading &&
                        resumeData.sections.summary.feedback && (
                          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-md border border-amber-200">
                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-amber-800">
                                {resumeData.sections.summary.feedback}
                              </p>
                              <ul className="mt-2 space-y-1 text-sm text-amber-700">
                                {resumeData.sections.summary.suggestions.map(
                                  (suggestion, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                      <span>{suggestion}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        )}
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" /> Resume Strengths
                        </h3>
                        <div className="space-y-3">
                          {isAnalysisLoading ? (
                            <div className="flex items-center justify-center p-6">
                              <Loader2 className="h-6 w-6 animate-spin text-[#7657ff]" />
                            </div>
                          ) : strengths.length > 0 ? (
                            strengths.map((strength) => (
                              <div
                                key={strength.name}
                                className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200"
                              >
                                <span className="font-medium text-green-800">
                                  {strength.name}
                                </span>
                                <Badge className="bg-green-600">
                                  {strength.score}%
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 p-3">
                              Analysis not available yet.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" /> Areas to Improve
                        </h3>
                        <div className="space-y-3">
                          {isAnalysisLoading ? (
                            <div className="flex items-center justify-center p-6">
                              <Loader2 className="h-6 w-6 animate-spin text-[#7657ff]" />
                            </div>
                          ) : resumeData.keywordMatch.score > 0 ? (
                            <>
                              <div className="p-3 bg-red-50 rounded-md border border-red-200">
                                <p className="font-medium text-red-800">
                                  Missing Key Skills
                                </p>
                                <p className="text-sm text-red-700 mt-1">
                                  Your resume is missing several in-demand
                                  skills for your target roles.
                                </p>
                              </div>
                              <div className="p-3 bg-red-50 rounded-md border border-red-200">
                                <p className="font-medium text-red-800">
                                  Keyword Match
                                </p>
                                <p className="text-sm text-red-700 mt-1">
                                  Your resume has only{" "}
                                  {resumeData.keywordMatch.score}% match with
                                  common job posting keywords.
                                </p>
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-500 p-3">
                              Analysis not available yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {!isAnalysisLoading && resumeData.overallScore > 0 && (
                      <div className="mt-6 p-4 bg-[#7657ff]/10 rounded-md border border-[#7657ff]/20">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-6 w-6 text-[#7657ff] flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-[#322372]">
                              AI Recommendation
                            </h4>
                            <p className="text-gray-700 mt-1">
                              Focus on improving your project descriptions and
                              adding missing technical skills to increase your
                              resume's effectiveness.
                            </p>
                            <Button
                              className="mt-3 bg-[#7657ff] hover:bg-[#322372]"
                              onClick={() => setActiveTab("sections")}
                            >
                              View Detailed Recommendations
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="sections" className="mt-0 space-y-6">
                    <div className="space-y-6">
                      {/* Summary Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-[#322372] capitalize">
                            Summary
                          </h3>
                          <Badge
                            className={`${getScoreBg(
                              resumeData.sections.summary.score
                            )} ${getScoreColor(
                              resumeData.sections.summary.score
                            )} border-0`}
                          >
                            {resumeData.sections.summary.score}%
                          </Badge>
                        </div>
                        <Progress
                          value={resumeData.sections.summary.score}
                          className="h-2"
                          indicatorClassName={getProgressColor(
                            resumeData.sections.summary.score
                          )}
                        />
                        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                          <p className="font-medium text-gray-800 mb-2">
                            Content:
                          </p>
                          <p className="text-gray-700 italic whitespace-pre-line mb-3">
                            {resumeData.sections.summary.content}
                          </p>
                          <Separator />
                          {isAnalysisLoading ? (
                            <div className="flex items-center justify-center p-4 mt-3">
                              <Loader2 className="h-5 w-5 animate-spin text-[#7657ff] mr-2" />
                              <span>Analyzing...</span>
                            </div>
                          ) : (
                            <>
                              <p className="font-medium text-gray-800 mt-3">
                                {resumeData.sections.summary.feedback}
                              </p>
                              <ul className="mt-3 space-y-2">
                                {resumeData.sections.summary.suggestions.map(
                                  (suggestion, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2 text-gray-700"
                                    >
                                      <ChevronRight className="h-4 w-4 mt-0.5 text-[#7657ff] flex-shrink-0" />
                                      <span>{suggestion}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-[#322372] capitalize">
                            Skills
                          </h3>
                          <Badge
                            className={`${getScoreBg(
                              resumeData.sections.skills.score
                            )} ${getScoreColor(
                              resumeData.sections.skills.score
                            )} border-0`}
                          >
                            {resumeData.sections.skills.score}%
                          </Badge>
                        </div>
                        <Progress
                          value={resumeData.sections.skills.score}
                          className="h-2"
                          indicatorClassName={getProgressColor(
                            resumeData.sections.skills.score
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Your Skills
                            </h4>
                            {resumeData.sections.skills.content.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {resumeData.sections.skills.content.map(
                                  (skill) => (
                                    <Badge
                                      key={skill}
                                      variant="secondary"
                                      className="bg-[#322372]/10 text-[#322372]"
                                    >
                                      {skill}
                                    </Badge>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No skills listed in resume.
                              </p>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Suggested Missing Skills
                            </h4>
                            {isAnalysisLoading ? (
                              <div className="flex items-center p-2">
                                <Loader2 className="h-4 w-4 animate-spin text-[#7657ff] mr-2" />
                                <span className="text-sm">Analyzing...</span>
                              </div>
                            ) : resumeData.sections.skills.missing &&
                              resumeData.sections.skills.missing.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {resumeData.sections.skills.missing.map(
                                  (skill) => (
                                    <Badge
                                      key={skill}
                                      variant="outline"
                                      className="border-red-200 text-red-700 bg-red-50"
                                    >
                                      {skill}
                                    </Badge>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No missing skills identified.
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                          {isAnalysisLoading ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-5 w-5 animate-spin text-[#7657ff] mr-2" />
                              <span>Analyzing...</span>
                            </div>
                          ) : (
                            <>
                              <p className="font-medium text-gray-800">
                                {resumeData.sections.skills.feedback}
                              </p>
                              <ul className="mt-3 space-y-2">
                                {resumeData.sections.skills.suggestions.map(
                                  (suggestion, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2 text-gray-700"
                                    >
                                      <ChevronRight className="h-4 w-4 mt-0.5 text-[#7657ff] flex-shrink-0" />
                                      <span>{suggestion}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Education Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-[#322372] capitalize">
                            Education
                          </h3>
                          <Badge
                            className={`${getScoreBg(
                              resumeData.sections.education.score
                            )} ${getScoreColor(
                              resumeData.sections.education.score
                            )} border-0`}
                          >
                            {resumeData.sections.education.score}%
                          </Badge>
                        </div>
                        <Progress
                          value={resumeData.sections.education.score}
                          className="h-2"
                          indicatorClassName={getProgressColor(
                            resumeData.sections.education.score
                          )}
                        />
                        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                          <p className="font-medium text-gray-800 mb-2">
                            Details:
                          </p>
                          <p className="text-gray-700 italic mb-3">
                            {resumeData.sections.education.content}
                          </p>
                          <Separator />
                          {isAnalysisLoading ? (
                            <div className="flex items-center justify-center p-4 mt-3">
                              <Loader2 className="h-5 w-5 animate-spin text-[#7657ff] mr-2" />
                              <span>Analyzing...</span>
                            </div>
                          ) : (
                            <>
                              <p className="font-medium text-gray-800 mt-3">
                                {resumeData.sections.education.feedback}
                              </p>
                              <ul className="mt-3 space-y-2">
                                {resumeData.sections.education.suggestions.map(
                                  (suggestion, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2 text-gray-700"
                                    >
                                      <ChevronRight className="h-4 w-4 mt-0.5 text-[#7657ff] flex-shrink-0" />
                                      <span>{suggestion}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Projects Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-[#322372] capitalize">
                            Projects
                          </h3>
                          <Badge
                            className={`${getScoreBg(
                              resumeData.sections.projects.score
                            )} ${getScoreColor(
                              resumeData.sections.projects.score
                            )} border-0`}
                          >
                            {resumeData.sections.projects.score}%
                          </Badge>
                        </div>
                        <Progress
                          value={resumeData.sections.projects.score}
                          className="h-2"
                          indicatorClassName={getProgressColor(
                            resumeData.sections.projects.score
                          )}
                        />
                        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Your Projects:
                          </h4>
                          {resumeData.sections.projects.content &&
                          resumeData.sections.projects.content.length > 0 ? (
                            <ul className="space-y-3 mb-3">
                              {resumeData.sections.projects.content.map(
                                (project, index) => (
                                  <li
                                    key={index}
                                    className="p-3 border rounded-md bg-white"
                                  >
                                    <h5 className="font-semibold text-gray-800">
                                      {project.title}
                                    </h5>
                                    {project.url && (
                                      <a
                                        href={
                                          project.url.startsWith("http")
                                            ? project.url
                                            : `http://${project.url}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-[#7657ff] hover:underline"
                                      >
                                        {project.url}
                                      </a>
                                    )}
                                    <p className="text-sm text-gray-600 mt-1">
                                      {project.description}
                                    </p>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500 mb-3">
                              No projects listed in resume.
                            </p>
                          )}
                          <Separator />
                          {isAnalysisLoading ? (
                            <div className="flex items-center justify-center p-4 mt-3">
                              <Loader2 className="h-5 w-5 animate-spin text-[#7657ff] mr-2" />
                              <span>Analyzing...</span>
                            </div>
                          ) : (
                            <>
                              <p className="font-medium text-gray-800 mt-3">
                                {resumeData.sections.projects.feedback}
                              </p>
                              <ul className="mt-3 space-y-2">
                                {resumeData.sections.projects.suggestions.map(
                                  (suggestion, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2 text-gray-700"
                                    >
                                      <ChevronRight className="h-4 w-4 mt-0.5 text-[#7657ff] flex-shrink-0" />
                                      <span>{suggestion}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="keywords" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" /> Keyword Match
                          Analysis
                        </h3>
                        <Badge
                          className={`${getScoreBg(
                            resumeData.keywordMatch.score
                          )} ${getScoreColor(
                            resumeData.keywordMatch.score
                          )} border-0`}
                        >
                          {resumeData.keywordMatch.score}%
                        </Badge>
                      </div>
                      <Progress
                        value={resumeData.keywordMatch.score}
                        className="h-2"
                        indicatorClassName={getProgressColor(
                          resumeData.keywordMatch.score
                        )}
                      />

                      {isAnalysisLoading ? (
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-[#7657ff] mr-3" />
                          <span>Analyzing keywords...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Job Posting Keywords
                            </h4>
                            {resumeData.keywordMatch.jobKeywords &&
                            resumeData.keywordMatch.jobKeywords.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {resumeData.keywordMatch.jobKeywords.map(
                                  (keyword) => (
                                    <Badge
                                      key={keyword}
                                      variant="outline"
                                      className={
                                        resumeData.keywordMatch.missing.includes(
                                          keyword
                                        )
                                          ? "border-red-200 text-red-700 bg-red-50"
                                          : "border-green-200 text-green-700 bg-green-50"
                                      }
                                    >
                                      {keyword}
                                      {resumeData.keywordMatch.missing.includes(
                                        keyword
                                      )
                                        ? " ✗"
                                        : " ✓"}
                                    </Badge>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No keyword data available.
                              </p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-700">
                              Keyword Suggestions
                            </h4>
                            {resumeData.keywordMatch.suggestions &&
                            resumeData.keywordMatch.suggestions.length > 0 ? (
                              <ul className="space-y-2">
                                {resumeData.keywordMatch.suggestions.map(
                                  (suggestion, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2 text-gray-700"
                                    >
                                      <ChevronRight className="h-4 w-4 mt-0.5 text-[#7657ff] flex-shrink-0" />
                                      <span>{suggestion}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No keyword suggestions available.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                          <FileText className="h-5 w-5" /> ATS Compatibility
                        </h3>
                        <Badge
                          className={`${getScoreBg(
                            resumeData.atsCompatibility.score
                          )} ${getScoreColor(
                            resumeData.atsCompatibility.score
                          )} border-0`}
                        >
                          {resumeData.atsCompatibility.score}%
                        </Badge>
                      </div>
                      <Progress
                        value={resumeData.atsCompatibility.score}
                        className="h-2"
                        indicatorClassName={getProgressColor(
                          resumeData.atsCompatibility.score
                        )}
                      />

                      {isAnalysisLoading ? (
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-[#7657ff] mr-3" />
                          <span>Analyzing ATS compatibility...</span>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            ATS Issues
                          </h4>
                          {resumeData.atsCompatibility.issues &&
                          resumeData.atsCompatibility.issues.length > 0 ? (
                            <ul className="space-y-2">
                              {resumeData.atsCompatibility.issues.map(
                                (issue, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-gray-700"
                                  >
                                    <AlertCircle className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                                    <span>{issue}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No ATS issues identified.
                            </p>
                          )}

                          <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">
                            Suggestions
                          </h4>
                          {resumeData.atsCompatibility.suggestions &&
                          resumeData.atsCompatibility.suggestions.length > 0 ? (
                            <ul className="space-y-2">
                              {resumeData.atsCompatibility.suggestions.map(
                                (suggestion, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-gray-700"
                                  >
                                    <ChevronRight className="h-4 w-4 mt-0.5 text-[#7657ff] flex-shrink-0" />
                                    <span>{suggestion}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No ATS suggestions available.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                  <p className="text-gray-600 text-sm">
                    Get personalized help to improve your resume and increase
                    your chances of landing interviews.
                  </p>
                  <Button
                    asChild
                    className="whitespace-nowrap bg-[#7657ff] hover:bg-[#322372]"
                  >
                    <a href="#" className="flex items-center">
                      Get Expert Review{" "}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardFooter>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#7657ff]" />
                    Overall Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  {isAnalysisLoading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                      <Loader2 className="h-10 w-10 animate-spin text-[#7657ff] mb-3" />
                      <span>Calculating score...</span>
                    </div>
                  ) : (
                    <>
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-32 h-32">
                          <circle
                            className="text-gray-200"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="56"
                            cx="64"
                            cy="64"
                          />
                          <circle
                            className="text-[#7657ff]"
                            strokeWidth="10"
                            strokeDasharray={360}
                            strokeDashoffset={
                              360 - (360 * resumeData.overallScore) / 100
                            }
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="56"
                            cx="64"
                            cy="64"
                          />
                        </svg>
                        <span className="absolute text-4xl font-bold text-[#322372]">
                          {resumeData.overallScore}%
                        </span>
                      </div>
                      <p className="text-gray-600 mt-4">
                        Your resume is{" "}
                        <span
                          className={`font-medium ${getScoreColor(
                            resumeData.overallScore
                          )}`}
                        >
                          {resumeData.overallScore >= 80
                            ? "excellent"
                            : resumeData.overallScore >= 60
                            ? "good"
                            : "needs improvement"}
                        </span>
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#7657ff]" />
                    Top Improvement Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAnalysisLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#7657ff] mr-3" />
                      <span>Analyzing areas for improvement...</span>
                    </div>
                  ) : improvementAreas.length > 0 ? (
                    improvementAreas.map((area) => (
                      <div key={area.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">
                            {area.name}
                          </span>
                          <span
                            className={`font-bold ${getScoreColor(area.score)}`}
                          >
                            {area.score}%
                          </span>
                        </div>
                        <Progress
                          value={area.score}
                          className="h-2"
                          indicatorClassName={getProgressColor(area.score)}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 p-3">
                      Analysis not available yet.
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full text-[#7657ff] hover:bg-[#7657ff]/10 hover:text-[#322372]"
                    onClick={() => setActiveTab("sections")}
                  >
                    View All Sections <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
