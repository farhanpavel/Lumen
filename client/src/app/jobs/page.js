// "use client";
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import Loader from "@/components/Loader/loader";
// import {url} from "@/components/Url/page";

// const API_URL = url; // Set this in your .env

// const JobsPage = () => {
//     const [jobs, setJobs] = useState([]);
//     const [linkedInJobs, setLinkedInJobs] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isLinkedInLoading, setIsLinkedInLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [showLinkedInJobs, setShowLinkedInJobs] = useState(false);
//     const [expandedId, setExpandedId] = useState(null);

//     useEffect(() => {
//         // Fetch regular jobs
//         const fetchJobs = async () => {
//             try {
//                 const response = await fetch(`${API_URL}/api/job`);
//                 if (!response.ok) throw new Error('Failed to fetch jobs');
//                 const data = await response.json();
//                 setJobs(data.jobs);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         // Fetch LinkedIn jobs
//         const fetchLinkedInJobs = async () => {
//             try {
//                 const response = await fetch(
//                     'https://linkedin-data-api.p.rapidapi.com/search-jobs-v2?keywords=Computer%20Science&locationId=103363366&datePosted=anyTime&sort=mostRelevant',
//                     {
//                         headers: {
//                             'x-rapidapi-key': 'bb834ebd60mshbda2ab24352bae8p137102jsne7dad0e3970e',
//                             'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
//                         }
//                     }
//                 );
//                 const data = await response.json();
//                 setLinkedInJobs(data.data || []);
//             } catch (err) {
//                 setError('Failed to fetch LinkedIn jobs');
//             } finally {
//                 setIsLinkedInLoading(false);
//             }
//         };

//         fetchJobs();
//         fetchLinkedInJobs();
//     }, []);

//     const handleTakeJob = (jobId) => {
//         console.log('Taking job:', jobId);
//     };

//     const handlePrepare = (jobId) => {
//         console.log('Preparing for job:', jobId);
//     };

//     const renderJobCard = (job, isLinkedIn = false) => (
//         <motion.div
//             key={job.id}
//             className="bg-white rounded-lg shadow-md overflow-hidden"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//         >
//             <div
//                 className="p-6 cursor-pointer"
//                 onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
//             >
//                 <div className="flex justify-between items-start mb-4">
//                     <div>
//                         <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
//                         <p className="text-sm text-gray-600 mt-1">
//                             {isLinkedIn ? job.company?.name : job.company}
//                         </p>
//                     </div>
//                     <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
//                     {isLinkedIn ? job.location : job.employmentType}
//                 </span>
//                 </div>

//                 {!isLinkedIn && (
//                     <div className="flex items-center text-sm text-gray-600 mb-4">
//                         <span className="mr-4">📍 {job.location}</span>
//                         <span>💼 {job.experienceLevel}</span>
//                     </div>
//                 )}

//                 <motion.div
//                     className="overflow-hidden"
//                     initial={{ height: 0 }}
//                     animate={{ height: expandedId === job.id ? 'auto' : 0 }}
//                     transition={{ duration: 0.3 }}
//                 >
//                     <div className="border-t pt-4 mt-4">
//                         {isLinkedIn ? (
//                             <>
//                                 <p className="text-gray-700 mb-4">{job.description || 'No description available'}</p>
//                                 <a
//                                     href={job.url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-600 hover:underline"
//                                 >
//                                     View on LinkedIn
//                                 </a>
//                             </>
//                         ) : (
//                             <>
//                                 <p className="text-gray-700 mb-4">{job.description}</p>
//                                 <div className="mb-4">
//                                     <span className="font-medium">Salary:</span> {job.salaryCurrency}
//                                     {job.salaryMin} - {job.salaryMax}
//                                 </div>
//                                 <div className="mb-4">
//                                     <span className="font-medium">Keywords:</span>
//                                     <div className="flex flex-wrap gap-2 mt-2">
//                                         {job.keywords?.map((keyword) => (
//                                             <span
//                                                 key={keyword.id}
//                                                 className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
//                                             >
//                                             {keyword.name}
//                                         </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </motion.div>

//                 {/* Buttons for both types */}
//                 <div className="flex gap-3 mt-4">
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             isLinkedIn ? window.open(job.url, '_blank') : handleTakeJob(job.id);
//                         }}
//                         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//                     >
//                         {isLinkedIn ? 'Apply Now' : 'Take Job'}
//                     </button>
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             handlePrepare(job.id);
//                         }}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                     >
//                         Prepare
//                     </button>
//                 </div>
//             </div>
//         </motion.div>
//     );

//     return (
//         <div className="min-h-screen bg-gray-50 p-8">
//             <div className="max-w-6xl mx-auto">
//                 <div className="flex justify-between items-center mb-8">
//                     <h1 className="text-3xl font-bold text-gray-800">Available Jobs</h1>
//                     <label className="flex items-center gap-2">
//                         <input
//                             type="checkbox"
//                             checked={showLinkedInJobs}
//                             onChange={(e) => setShowLinkedInJobs(e.target.checked)}
//                             className="form-checkbox h-5 w-5 text-blue-600"
//                         />
//                         <span className="text-gray-700">Show LinkedIn Jobs</span>
//                     </label>
//                 </div>

//                 {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

//                 {(isLoading || isLinkedInLoading) ? (
//                     <div className="flex justify-center py-12">
//                         <Loader size="large" />
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {showLinkedInJobs
//                             ? linkedInJobs.map((job) => renderJobCard(job, true))
//                             : jobs.map((job) => renderJobCard(job))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default JobsPage;

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { url } from "@/components/Url/page";

// API URL
const API_URL = url;

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [linkedInJobs, setLinkedInJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("internal");
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    // Fetch regular jobs
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/job`);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data.jobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch LinkedIn jobs
    const fetchLinkedInJobs = async () => {
      try {
        const response = await fetch(
          "https://linkedin-data-api.p.rapidapi.com/search-jobs-v2?keywords=Computer%20Science&locationId=103363366&datePosted=anyTime&sort=mostRelevant",
          {
            headers: {
              "x-rapidapi-key":
                "bb834ebd60mshbda2ab24352bae8p137102jsne7dad0e3970e",
              "x-rapidapi-host": "linkedin-data-api.p.rapidapi.com",
            },
          }
        );
        const data = await response.json();
        setLinkedInJobs(data.data || []);
      } catch (err) {
        setError("Failed to fetch LinkedIn jobs");
      } finally {
        setIsLinkedInLoading(false);
      }
    };

    fetchJobs();
    fetchLinkedInJobs();
  }, []);

  const handleTakeJob = (jobId) => {
    console.log("Taking job:", jobId);
  };

  const handlePrepare = (jobId) => {
    console.log("Preparing for job:", jobId);
  };

  const filteredJobs = (activeTab === "internal" ? jobs : linkedInJobs).filter(
    (job) => {
      const title = activeTab === "internal" ? job.title : job.title;
      const company =
        activeTab === "internal" ? job.company : job.company?.name;
      const searchMatch =
        (title && title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company && company.toLowerCase().includes(searchTerm.toLowerCase()));

      if (filterType === "all") return searchMatch;
      if (activeTab === "internal") {
        return searchMatch && job.employmentType === filterType;
      }
      return searchMatch;
    }
  );

  const renderJobSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card
          key={i}
          className="overflow-hidden border-none shadow-md bg-white/80 backdrop-blur-sm"
        >
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-3 mt-6">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );

  const renderJobCard = (job, isLinkedIn = false) => (
    <motion.div
      key={job.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-none shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          <div
            className="p-6 cursor-pointer"
            onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {job.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {isLinkedIn ? job.company?.name : job.company}
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-[#7657ff]/10 text-[#7657ff] border-[#7657ff]/20 hover:bg-[#7657ff]/20"
              >
                {isLinkedIn ? job.location : job.employmentType}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              {!isLinkedIn && (
                <>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-[#322372]" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} className="text-[#322372]" />
                    <span>{job.experienceLevel}</span>
                  </div>
                </>
              )}
              {isLinkedIn && job.postedAt && (
                <div className="flex items-center gap-1">
                  <Clock size={16} className="text-[#322372]" />
                  <span>{job.postedAt}</span>
                </div>
              )}
            </div>

            <AnimatePresence>
              {expandedId === job.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-gray-100 pt-4 mt-2">
                    {isLinkedIn ? (
                      <>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {job.description || "No description available"}
                        </p>
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7657ff] hover:text-[#322372] flex items-center gap-1 font-medium"
                        >
                          View on LinkedIn <ExternalLink size={16} />
                        </a>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {job.description}
                        </p>
                        <div className="mb-4">
                          <span className="font-medium text-[#322372]">
                            Salary:
                          </span>{" "}
                          <span className="text-gray-700">
                            {job.salaryCurrency}
                            {job.salaryMin} - {job.salaryMax}
                          </span>
                        </div>
                        {job.keywords && job.keywords.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium text-[#322372] block mb-2">
                              Skills Required:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {job.keywords.map((keyword) => (
                                <Badge
                                  key={keyword.id}
                                  variant="secondary"
                                  className="bg-[#322372]/10 text-[#322372] hover:bg-[#322372]/20"
                                >
                                  {keyword.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-3">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    isLinkedIn
                      ? window.open(job.url, "_blank")
                      : handleTakeJob(job.id);
                  }}
                  className="bg-[#7657ff] hover:bg-[#322372] text-white transition-colors"
                >
                  {isLinkedIn ? "Apply Now" : "Take Job"}
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrepare(job.id);
                  }}
                  variant="outline"
                  className="border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
                >
                  Prepare
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedId(expandedId === job.id ? null : job.id);
                }}
                className="text-gray-500 hover:text-[#7657ff]"
              >
                {expandedId === job.id ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#322372] mb-2">
            Discover Opportunities
          </h1>
          <p className="text-gray-600">Find and prepare for your dream job</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-full">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 h-10 rounded-md border border-[#7657ff]/20 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7657ff] focus-visible:ring-offset-2"
                >
                  <option value="all">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="internal"
                className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
              >
                Platform Jobs
              </TabsTrigger>
              <TabsTrigger
                value="linkedin"
                className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
              >
                LinkedIn Jobs
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <Tabs>
            <TabsContent value={activeTab} className="mt-0">
              {(activeTab === "internal" && isLoading) ||
              (activeTab === "linkedin" && isLinkedInLoading) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderJobSkeleton()}
                </div>
              ) : filteredJobs.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredJobs.map((job) =>
                    renderJobCard(job, activeTab === "linkedin")
                  )}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-[#322372] mb-2">
                      No jobs found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any jobs matching your search criteria.
                      Try adjusting your filters.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterType("all");
                      }}
                      className="bg-[#7657ff] hover:bg-[#322372]"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </AnimatePresence>
      </div>
    </div>
  );
}
