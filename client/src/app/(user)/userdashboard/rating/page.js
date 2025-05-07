// "use client";
// import { useState } from "react";
// import {
//   FileText,
//   AlertCircle,
//   CheckCircle,
//   ChevronRight,
//   Award,
//   TrendingUp,
//   BarChart3,
//   Lightbulb,
//   ExternalLink,
//   Download,
//   Edit,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";

// export default function ResumeAnalysisPage() {
//   const [activeTab, setActiveTab] = useState("overview");

//   // Demo data - this would come from your API/backend
//   const resumeData = {
//     name: "John Smith",
//     email: "john.smith@example.com",
//     phone: "+1 (555) 123-4567",
//     location: "New York, NY",
//     currentRole: "Frontend Developer",
//     resumeLink: "#",
//     resumeImage: "/placeholder.svg?height=800&width=600",
//     overallScore: 72,
//     lastUpdated: "2023-11-15",
//     sections: {
//       summary: {
//         content:
//           "Frontend developer with 3 years of experience in React and JavaScript. Passionate about creating user-friendly interfaces and optimizing web performance.",
//         score: 65,
//         feedback:
//           "Your summary is too generic and doesn't highlight your unique value proposition.",
//         suggestions: [
//           "Include specific achievements with metrics",
//           "Mention your specialization within frontend development",
//           "Add industry-specific keywords relevant to your target roles",
//         ],
//       },
//       experience: {
//         score: 78,
//         feedback:
//           "Your experience section is solid but lacks quantifiable achievements.",
//         suggestions: [
//           "Add metrics to demonstrate impact (e.g., 'Improved page load time by 40%')",
//           "Highlight leadership experiences even in individual contributor roles",
//           "Focus more on results rather than responsibilities",
//         ],
//       },
//       skills: {
//         score: 82,
//         feedback:
//           "Good range of technical skills, but missing some in-demand technologies.",
//         content: ["React", "JavaScript", "HTML", "CSS", "Git"],
//         missing: [
//           "TypeScript",
//           "Next.js",
//           "Testing (Jest/RTL)",
//           "State Management (Redux/Context)",
//         ],
//         suggestions: [
//           "Add skill proficiency levels",
//           "Group skills by category (frontend, backend, tools)",
//           "Include relevant soft skills",
//         ],
//       },
//       education: {
//         score: 90,
//         feedback: "Education section is well-structured and complete.",
//         suggestions: [
//           "Include relevant coursework if you're early in your career",
//           "Add GPA if it's above 3.5",
//         ],
//       },
//       projects: {
//         score: 60,
//         feedback:
//           "Project descriptions are too vague and don't showcase technical depth.",
//         suggestions: [
//           "Include links to GitHub repositories or live demos",
//           "Describe technical challenges you overcame",
//           "Mention technologies used for each project",
//         ],
//       },
//     },
//     keywordMatch: {
//       score: 58,
//       jobKeywords: [
//         "React",
//         "TypeScript",
//         "Next.js",
//         "Redux",
//         "API integration",
//         "responsive design",
//       ],
//       missing: ["TypeScript", "Next.js", "Redux"],
//       suggestions: [
//         "Add missing keywords if you have experience with them",
//         "Include variations of keywords (e.g., 'React.js' and 'ReactJS')",
//         "Place important keywords in your summary and experience bullet points",
//       ],
//     },
//     atsCompatibility: {
//       score: 75,
//       issues: [
//         "Complex formatting may not parse correctly in ATS systems",
//         "Some bullet points exceed recommended length",
//         "Skills section format may not be optimal for keyword scanning",
//       ],
//       suggestions: [
//         "Use a simpler, ATS-friendly format",
//         "Keep bullet points under 2 lines",
//         "Ensure consistent date formatting throughout",
//       ],
//     },
//   };

//   // Calculate section scores for the chart
//   const sectionScores = [
//     { name: "Summary", score: resumeData.sections.summary.score },
//     { name: "Experience", score: resumeData.sections.experience.score },
//     { name: "Skills", score: resumeData.sections.skills.score },
//     { name: "Education", score: resumeData.sections.education.score },
//     { name: "Projects", score: resumeData.sections.projects.score },
//     { name: "Keywords", score: resumeData.keywordMatch.score },
//     { name: "ATS", score: resumeData.atsCompatibility.score },
//   ];

//   // Get improvement areas sorted by priority (lowest scores first)
//   const improvementAreas = [...sectionScores]
//     .sort((a, b) => a.score - b.score)
//     .slice(0, 3);

//   // Get strengths (highest scores)
//   const strengths = [...sectionScores]
//     .sort((a, b) => b.score - a.score)
//     .slice(0, 2);

//   const getScoreColor = (score) => {
//     if (score >= 80) return "text-green-600";
//     if (score >= 60) return "text-amber-600";
//     return "text-red-600";
//   };

//   const getScoreBg = (score) => {
//     if (score >= 80) return "bg-green-100";
//     if (score >= 60) return "bg-amber-100";
//     return "bg-red-100";
//   };

//   const getProgressColor = (score) => {
//     if (score >= 80) return "bg-green-600";
//     if (score >= 60) return "bg-tertiary";
//     return "bg-red-600";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-[#322372] mb-2">
//             Resume Analysis
//           </h1>
//           <p className="text-gray-600">
//             Review your resume's strengths and areas for improvement
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left column - Resume preview and overall score */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
//               <CardHeader className="bg-gradient-to-r from-[#322372] to-[#7657ff] text-white pb-4">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle className="text-xl">Resume Preview</CardTitle>
//                     <CardDescription className="text-white/80">
//                       Last updated: {resumeData.lastUpdated}
//                     </CardDescription>
//                   </div>
//                   <FileText className="h-6 w-6" />
//                 </div>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <div className="relative aspect-[3/4] w-full bg-gray-100">
//                   <img
//                     src={resumeData.resumeImage || "/placeholder.svg"}
//                     alt="Resume preview"
//                     className="w-full h-full object-cover object-top"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none"></div>
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-between p-4">
//                 <Button
//                   variant="outline"
//                   className="border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
//                 >
//                   <Download className="h-4 w-4 mr-2" />
//                   Download
//                 </Button>
//                 <Button className="bg-[#7657ff] hover:bg-[#322372]">
//                   <Edit className="h-4 w-4 mr-2" />
//                   Edit Resume
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>

//           {/* Right column - Detailed analysis */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
//               <CardHeader className="pb-2">
//                 <Tabs
//                   defaultValue={activeTab}
//                   onValueChange={setActiveTab}
//                   className="w-full"
//                 >
//                   <TabsList className="grid w-full grid-cols-3">
//                     <TabsTrigger
//                       value="overview"
//                       className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
//                     >
//                       Overview
//                     </TabsTrigger>
//                     <TabsTrigger
//                       value="sections"
//                       className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
//                     >
//                       Section Analysis
//                     </TabsTrigger>
//                     <TabsTrigger
//                       value="keywords"
//                       className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
//                     >
//                       Keywords & ATS
//                     </TabsTrigger>
//                   </TabsList>
//                 </Tabs>
//               </CardHeader>

//               <CardContent className="p-6">
//                 <Tabs>
//                   <TabsContent value="overview" className="mt-0 space-y-6">
//                     <div className="space-y-4">
//                       <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
//                         <FileText className="h-5 w-5" /> Resume Summary
//                       </h3>
//                       <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
//                         <p className="text-gray-700 italic">
//                           {resumeData.sections.summary.content}
//                         </p>
//                       </div>
//                       <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-md border border-amber-200">
//                         <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
//                         <div>
//                           <p className="font-medium text-amber-800">
//                             {resumeData.sections.summary.feedback}
//                           </p>
//                           <ul className="mt-2 space-y-1 text-sm text-amber-700">
//                             {resumeData.sections.summary.suggestions.map(
//                               (suggestion, index) => (
//                                 <li
//                                   key={index}
//                                   className="flex items-start gap-2"
//                                 >
//                                   <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                                   <span>{suggestion}</span>
//                                 </li>
//                               )
//                             )}
//                           </ul>
//                         </div>
//                       </div>
//                     </div>

//                     <Separator className="my-6" />

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-4">
//                         <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
//                           <CheckCircle className="h-5 w-5" /> Resume Strengths
//                         </h3>
//                         <div className="space-y-3">
//                           {strengths.map((strength) => (
//                             <div
//                               key={strength.name}
//                               className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200"
//                             >
//                               <span className="font-medium text-green-800">
//                                 {strength.name}
//                               </span>
//                               <Badge className="bg-green-600">
//                                 {strength.score}%
//                               </Badge>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="space-y-4">
//                         <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
//                           <AlertCircle className="h-5 w-5" /> Critical Issues
//                         </h3>
//                         <div className="space-y-3">
//                           <div className="p-3 bg-red-50 rounded-md border border-red-200">
//                             <p className="font-medium text-red-800">
//                               Missing Key Skills
//                             </p>
//                             <p className="text-sm text-red-700 mt-1">
//                               Your resume is missing several in-demand skills
//                               for your target roles.
//                             </p>
//                           </div>
//                           <div className="p-3 bg-red-50 rounded-md border border-red-200">
//                             <p className="font-medium text-red-800">
//                               Low Keyword Match
//                             </p>
//                             <p className="text-sm text-red-700 mt-1">
//                               Your resume has only 58% match with common job
//                               posting keywords.
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-6 p-4 bg-[#7657ff]/10 rounded-md border border-[#7657ff]/20">
//                       <div className="flex items-start gap-3">
//                         <Lightbulb className="h-6 w-6 text-[#7657ff] flex-shrink-0" />
//                         <div>
//                           <h4 className="font-semibold text-[#322372]">
//                             AI Recommendation
//                           </h4>
//                           <p className="text-gray-700 mt-1">
//                             Focus on improving your project descriptions and
//                             adding missing technical skills like TypeScript and
//                             Next.js to increase your resume's effectiveness for
//                             frontend developer roles.
//                           </p>
//                           <Button
//                             className="mt-3 bg-[#7657ff] hover:bg-[#322372]"
//                             onClick={() => setActiveTab("sections")}
//                           >
//                             View Detailed Recommendations
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="sections" className="mt-0 space-y-6">
//                     <div className="space-y-6">
//                       {Object.entries(resumeData.sections).map(
//                         ([key, section]) => (
//                           <div key={key} className="space-y-3">
//                             <div className="flex items-center justify-between">
//                               <h3 className="text-lg font-semibold text-[#322372] capitalize">
//                                 {key}
//                               </h3>
//                               <Badge
//                                 className={`${getScoreBg(
//                                   section.score
//                                 )} ${getScoreColor(section.score)} border-0`}
//                               >
//                                 {section.score}%
//                               </Badge>
//                             </div>
//                             <Progress
//                               value={section.score}
//                               className="h-2"
//                               indicatorClassName={getProgressColor(
//                                 section.score
//                               )}
//                             />
//                             <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
//                               <p className="font-medium text-gray-800">
//                                 {section.feedback}
//                               </p>
//                               <ul className="mt-3 space-y-2">
//                                 {section.suggestions.map(
//                                   (suggestion, index) => (
//                                     <li
//                                       key={index}
//                                       className="flex items-start gap-2 text-gray-700"
//                                     >
//                                       <ChevronRight className="h-4 w-4 mt-0.5 text-[#7657ff] flex-shrink-0" />
//                                       <span>{suggestion}</span>
//                                     </li>
//                                   )
//                                 )}
//                               </ul>
//                             </div>

//                             {key === "skills" && (
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
//                                 <div>
//                                   <h4 className="text-sm font-medium text-gray-700 mb-2">
//                                     Current Skills
//                                   </h4>
//                                   <div className="flex flex-wrap gap-2">
//                                     {section.content.map((skill) => (
//                                       <Badge
//                                         key={skill}
//                                         variant="outline"
//                                         className="bg-gray-100"
//                                       >
//                                         {skill}
//                                       </Badge>
//                                     ))}
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <h4 className="text-sm font-medium text-gray-700 mb-2">
//                                     Missing Skills
//                                   </h4>
//                                   <div className="flex flex-wrap gap-2">
//                                     {section.missing.map((skill) => (
//                                       <Badge
//                                         key={skill}
//                                         variant="outline"
//                                         className="border-red-200 text-red-700 bg-red-50"
//                                       >
//                                         {skill}
//                                       </Badge>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="keywords" className="mt-0 space-y-6">
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
//                           <BarChart3 className="h-5 w-5" /> Keyword Match
//                           Analysis
//                         </h3>
//                         <Badge
//                           className={`${getScoreBg(
//                             resumeData.keywordMatch.score
//                           )} ${getScoreColor(
//                             resumeData.keywordMatch.score
//                           )} border-0`}
//                         >
//                           {resumeData.keywordMatch.score}%
//                         </Badge>
//                       </div>
//                       <Progress
//                         value={resumeData.keywordMatch.score}
//                         className="h-2"
//                         indicatorClassName={getProgressColor(
//                           resumeData.keywordMatch.score
//                         )}
//                       />

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                         <div>
//                           <h4 className="text-sm font-medium text-gray-700 mb-2">
//                             Job Posting Keywords
//                           </h4>
//                           <div className="flex flex-wrap gap-2">
//                             {resumeData.keywordMatch.jobKeywords.map(
//                               (keyword) => (
//                                 <Badge
//                                   key={keyword}
//                                   variant="outline"
//                                   className={
//                                     resumeData.keywordMatch.missing.includes(
//                                       keyword
//                                     )
//                                       ? "border-red-200 text-red-700 bg-red-50"
//                                       : "border-green-200 text-green-700 bg-green-50"
//                                   }
//                                 >
//                                   {keyword}
//                                   {resumeData.keywordMatch.missing.includes(
//                                     keyword
//                                   )
//                                     ? " ✗"
//                                     : " ✓"}
//                                 </Badge>
//                               )
//                             )}
//                           </div>
//                         </div>

//                         <div className="space-y-3">
//                           <h4 className="text-sm font-medium text-gray-700">
//                             Keyword Suggestions
//                           </h4>
//                           <ul className="space-y-2">
//                             {resumeData.keywordMatch.suggestions.map(
//                               (suggestion, index) => (
//                                 <li
//                                   key={index}
//                                   className="flex items-start gap-2 text-gray-700"
//                                 >
//                                   <ChevronRight className="h-4 w-4 mt-0.5 text-[#7657ff] flex-shrink-0" />
//                                   <span>{suggestion}</span>
//                                 </li>
//                               )
//                             )}
//                           </ul>
//                         </div>
//                       </div>
//                     </div>

//                     <Separator className="my-6" />

//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
//                           <FileText className="h-5 w-5" /> ATS Compatibility
//                         </h3>
//                         <Badge
//                           className={`${getScoreBg(
//                             resumeData.atsCompatibility.score
//                           )} ${getScoreColor(
//                             resumeData.atsCompatibility.score
//                           )} border-0`}
//                         >
//                           {resumeData.atsCompatibility.score}%
//                         </Badge>
//                       </div>
//                       <Progress
//                         value={resumeData.atsCompatibility.score}
//                         className="h-2"
//                         indicatorClassName={getProgressColor(
//                           resumeData.atsCompatibility.score
//                         )}
//                       />

//                       <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mt-4">
//                         <h4 className="text-sm font-medium text-gray-700 mb-2">
//                           ATS Issues
//                         </h4>
//                         <ul className="space-y-2">
//                           {resumeData.atsCompatibility.issues.map(
//                             (issue, index) => (
//                               <li
//                                 key={index}
//                                 className="flex items-start gap-2 text-gray-700"
//                               >
//                                 <AlertCircle className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
//                                 <span>{issue}</span>
//                               </li>
//                             )
//                           )}
//                         </ul>

//                         <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">
//                           Suggestions
//                         </h4>
//                         <ul className="space-y-2">
//                           {resumeData.atsCompatibility.suggestions.map(
//                             (suggestion, index) => (
//                               <li
//                                 key={index}
//                                 className="flex items-start gap-2 text-gray-700"
//                               >
//                                 <ChevronRight className="h-4 w-4 mt-0.5 text-[#7657ff] flex-shrink-0" />
//                                 <span>{suggestion}</span>
//                               </li>
//                             )
//                           )}
//                         </ul>
//                       </div>
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>

//               <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
//                 <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
//                   <p className="text-gray-600 text-sm">
//                     Get personalized help to improve your resume and increase
//                     your chances of landing interviews.
//                   </p>
//                   <Button
//                     asChild
//                     className="whitespace-nowrap bg-[#7657ff] hover:bg-[#322372]"
//                   >
//                     <a href="#" className="flex items-center">
//                       Get Expert Review{" "}
//                       <ExternalLink className="h-4 w-4 ml-2" />
//                     </a>
//                   </Button>
//                 </div>
//               </CardFooter>
//             </Card>
//             <div className="flex justify-around">
//               <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-xl flex items-center gap-2">
//                     <Award className="h-5 w-5 text-[#7657ff]" />
//                     Overall Score
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-center pb-6">
//                   <div className="relative inline-flex items-center justify-center">
//                     <svg className="w-32 h-32">
//                       <circle
//                         className="text-gray-200"
//                         strokeWidth="10"
//                         stroke="currentColor"
//                         fill="transparent"
//                         r="56"
//                         cx="64"
//                         cy="64"
//                       />
//                       <circle
//                         className="text-[#7657ff]"
//                         strokeWidth="10"
//                         strokeDasharray={360}
//                         strokeDashoffset={
//                           360 - (360 * resumeData.overallScore) / 100
//                         }
//                         strokeLinecap="round"
//                         stroke="currentColor"
//                         fill="transparent"
//                         r="56"
//                         cx="64"
//                         cy="64"
//                       />
//                     </svg>
//                     <span className="absolute text-4xl font-bold text-[#322372]">
//                       {resumeData.overallScore}%
//                     </span>
//                   </div>
//                   <p className="text-gray-600 mt-4">
//                     Your resume is{" "}
//                     <span className="font-medium text-amber-600">good</span>,
//                     but has room for improvement
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-xl flex items-center gap-2">
//                     <TrendingUp className="h-5 w-5 text-[#7657ff]" />
//                     Top Improvement Areas
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {improvementAreas.map((area) => (
//                     <div key={area.name} className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="font-medium text-gray-700">
//                           {area.name}
//                         </span>
//                         <span
//                           className={`font-bold ${getScoreColor(area.score)}`}
//                         >
//                           {area.score}%
//                         </span>
//                       </div>
//                       <Progress
//                         value={area.score}
//                         className="h-2"
//                         indicatorClassName={getProgressColor(area.score)}
//                       />
//                     </div>
//                   ))}
//                 </CardContent>
//                 <CardFooter>
//                   <Button
//                     variant="ghost"
//                     className="w-full text-[#7657ff] hover:bg-[#7657ff]/10 hover:text-[#322372]"
//                     onClick={() => setActiveTab("sections")}
//                   >
//                     View All Sections <ChevronRight className="h-4 w-4 ml-1" />
//                   </Button>
//                 </CardFooter>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
  Loader2, // For loading spinner
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
import { url as API_BASE_URL } from "@/components/Url/page"; // Assuming your URL component exports the base URL

// Initial structure with dummy analytical data
const initialResumeAnalysisData = {
  name: "User Name", // Will be placeholder until user data is fetched
  email: "user@example.com", // Placeholder
  phone: "N/A", // Placeholder
  location: "N/A", // Placeholder
  currentRole: "Role from Resume", // Can be mapped from jobTitle
  resumeLink: "#",
  // resumeImage: "/placeholder.svg?height=800&width=600", // Will be replaced by link
  overallScore: 72, // Dummy analytical score
  lastUpdated: new Date().toISOString().split("T")[0], // Will be updated from API
  sections: {
    summary: {
      content: "Loading summary...",
      score: 65, // Dummy analytical score
      feedback:
        "Your summary is too generic and doesn't highlight your unique value proposition.", // Dummy
      suggestions: [
        "Include specific achievements with metrics",
        "Mention your specialization within frontend development",
        "Add industry-specific keywords relevant to your target roles",
      ], // Dummy
    },
    experience: {
      score: 78, // Dummy analytical score
      feedback:
        "Your experience section is solid but lacks quantifiable achievements.", // Dummy
      suggestions: [
        "Add metrics to demonstrate impact (e.g., 'Improved page load time by 40%')",
        "Highlight leadership experiences even in individual contributor roles",
        "Focus more on results rather than responsibilities",
      ], // Dummy
      // We could add actual experience items here if the API provided them structured
    },
    skills: {
      score: 82, // Dummy analytical score
      feedback:
        "Good range of technical skills, but missing some in-demand technologies.", // Dummy
      content: [], // Will be populated from API
      missing: [
        "TypeScript",
        "Next.js",
        "Testing (Jest/RTL)",
        "State Management (Redux/Context)",
      ], // Dummy
      suggestions: [
        "Add skill proficiency levels",
        "Group skills by category (frontend, backend, tools)",
        "Include relevant soft skills",
      ], // Dummy
    },
    education: {
      content: "Loading education...", // Will be populated from API (if available as string)
      score: 90, // Dummy analytical score
      feedback: "Education section is well-structured and complete.", // Dummy
      suggestions: [
        "Include relevant coursework if you're early in your career",
        "Add GPA if it's above 3.5",
      ], // Dummy
    },
    projects: {
      content: [], // Will be populated from API (if available as array of objects)
      score: 60, // Dummy analytical score
      feedback:
        "Project descriptions are too vague and don't showcase technical depth.", // Dummy
      suggestions: [
        "Include links to GitHub repositories or live demos",
        "Describe technical challenges you overcame",
        "Mention technologies used for each project",
      ], // Dummy
    },
  },
  keywordMatch: {
    // Dummy analytical data
    score: 58,
    jobKeywords: [
      "React",
      "TypeScript",
      "Next.js",
      "Redux",
      "API integration",
      "responsive design",
    ],
    missing: ["TypeScript", "Next.js", "Redux"],
    suggestions: [
      "Add missing keywords if you have experience with them",
      "Include variations of keywords (e.g., 'React.js' and 'ReactJS')",
      "Place important keywords in your summary and experience bullet points",
    ],
  },
  atsCompatibility: {
    // Dummy analytical data
    score: 75,
    issues: [
      "Complex formatting may not parse correctly in ATS systems",
      "Some bullet points exceed recommended length",
      "Skills section format may not be optimal for keyword scanning",
    ],
    suggestions: [
      "Use a simpler, ATS-friendly format",
      "Keep bullet points under 2 lines",
      "Ensure consistent date formatting throughout",
    ],
  },
};

export default function ResumeAnalysisPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [resumeData, setResumeData] = useState(initialResumeAnalysisData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // IMPORTANT: Replace this with the actual logged-in user's ID
  const userId = "50368124-40b9-4dd8-b60f-ef6ad4df784d"; // Example userId from your JSON

  useEffect(() => {
    const fetchResumeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/resumes/user/${userId}`
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

          // Transform API data and merge with initial analytical structure
          setResumeData((prevData) => ({
            ...prevData, // Keep existing analytical scores, feedback, etc.
            resumeLink: apiData.resumeUrl || "#",
            lastUpdated: apiData.createdAt
              ? new Date(apiData.createdAt).toLocaleDateString()
              : prevData.lastUpdated,
            currentRole: apiData.jobTitle || prevData.currentRole,
            // You might want to fetch user details (name, email) separately
            // name: apiData.user?.name || prevData.name,
            // email: apiData.user?.email || prevData.email,
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
                // Assuming education is a string in API, if it's structured, adjust accordingly
                content:
                  apiData.education || "No education information provided.",
              },
              projects: {
                ...prevData.sections.projects,
                // Assuming projects is an array of { title, description, url }
                content: apiData.projects || [],
              },
              // Note: Experience section in frontend is more about analysis.
              // If API provides structured experience, map it here.
              // For now, yearsExperience from API can be displayed somewhere else or integrated.
            },
            // You can also store raw API data if needed for other purposes
            // rawApiData: apiData,
          }));
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

  // Calculate section scores for the chart (remains the same, uses data from resumeData state)
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
        {/* Optionally, link to a resume creation/upload page if error is 404 */}
        {error.includes("Resume not found") && (
          <Button
            variant="outline"
            className="mt-2 border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
            onClick={() => alert("Navigate to resume upload/creation page")}
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
            Review your resume's strengths and areas for improvement for{" "}
            {resumeData.name}
          </p>
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
                {/* Replace image with a link to the PDF */}
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
                {/* <Button
                  variant="outline"
                  className="border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button> */}
                <Button
                  className="bg-[#7657ff] hover:bg-[#322372]"
                  onClick={() =>
                    alert("Navigate to resume edit page with userId: " + userId)
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
                  {" "}
                  {/* Control TabsContent with activeTab state */}
                  <TabsContent value="overview" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                        <FileText className="h-5 w-5" /> Resume Summary
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <p className="text-gray-700 italic whitespace-pre-line">
                          {" "}
                          {/* Added whitespace-pre-line for newlines */}
                          {resumeData.sections.summary.content}
                        </p>
                      </div>
                      {/* Analytical feedback (dummy) */}
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
                    </div>

                    <Separator className="my-6" />

                    {/* Other parts of Overview tab use resumeData which contains dummy analytical data */}
                    {/* ... Strengths, Critical Issues, AI Recommendation ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" /> Resume Strengths
                          (Demo)
                        </h3>
                        <div className="space-y-3">
                          {strengths.map((strength) => (
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
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" /> Critical Issues
                          (Demo)
                        </h3>
                        <div className="space-y-3">
                          <div className="p-3 bg-red-50 rounded-md border border-red-200">
                            <p className="font-medium text-red-800">
                              Missing Key Skills
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                              Your resume is missing several in-demand skills
                              for your target roles. (Based on demo analysis)
                            </p>
                          </div>
                          <div className="p-3 bg-red-50 rounded-md border border-red-200">
                            <p className="font-medium text-red-800">
                              Low Keyword Match
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                              Your resume has only{" "}
                              {resumeData.keywordMatch.score}% match with common
                              job posting keywords. (Based on demo analysis)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-[#7657ff]/10 rounded-md border border-[#7657ff]/20">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-6 w-6 text-[#7657ff] flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-[#322372]">
                            AI Recommendation (Demo)
                          </h4>
                          <p className="text-gray-700 mt-1">
                            Focus on improving your project descriptions and
                            adding missing technical skills like TypeScript and
                            Next.js to increase your resume's effectiveness for
                            frontend developer roles.
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
                            {resumeData.sections.summary.score}% (Demo Score)
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
                          <p className="font-medium text-gray-800 mt-3">
                            {resumeData.sections.summary.feedback} (Demo
                            Feedback)
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
                            {resumeData.sections.skills.score}% (Demo Score)
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
                              Your Skills (from API)
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
                              Suggested Missing Skills (Demo)
                            </h4>
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
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                          <p className="font-medium text-gray-800">
                            {resumeData.sections.skills.feedback} (Demo
                            Feedback)
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
                            {resumeData.sections.education.score}% (Demo Score)
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
                            Details (from API):
                          </p>
                          <p className="text-gray-700 italic mb-3">
                            {resumeData.sections.education.content}
                          </p>
                          <Separator />
                          <p className="font-medium text-gray-800 mt-3">
                            {resumeData.sections.education.feedback} (Demo
                            Feedback)
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
                            {resumeData.sections.projects.score}% (Demo Score)
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
                            Your Projects (from API):
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
                          <p className="font-medium text-gray-800 mt-3">
                            {resumeData.sections.projects.feedback} (Demo
                            Feedback)
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
                        </div>
                      </div>

                      {/* Map other sections similarly if needed, e.g., experience */}
                      {/* The current dummy data structure for 'experience' is mostly analytical feedback */}
                    </div>
                  </TabsContent>
                  <TabsContent value="keywords" className="mt-0 space-y-6">
                    {/* This section relies heavily on dummy analytical data from resumeData */}
                    {/* ... Keyword Match Analysis, ATS Compatibility ... */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" /> Keyword Match
                          Analysis (Demo)
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Job Posting Keywords
                          </h4>
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
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-700">
                            Keyword Suggestions
                          </h4>
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
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                          <FileText className="h-5 w-5" /> ATS Compatibility
                          (Demo)
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

                      <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          ATS Issues
                        </h4>
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

                        <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">
                          Suggestions
                        </h4>
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
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                  <p className="text-gray-600 text-sm">
                    Get personalized help to improve your resume and increase
                    your chances of landing interviews. (Demo)
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
              {" "}
              {/* Changed from flex to grid for better responsiveness */}
              <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#7657ff]" />
                    Overall Score (Demo)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-6">
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
                    <span className="font-medium text-amber-600">good</span>,
                    but has room for improvement (Based on demo analysis)
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#7657ff]" />
                    Top Improvement Areas (Demo)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {improvementAreas.map((area) => (
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
                  ))}
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
