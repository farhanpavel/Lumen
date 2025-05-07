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
import { useRouter } from 'next/navigation'; // or 'next/navigation'

// Inside component

// Helper component for "No Jobs Found" message
const NoJobsFoundDisplay = ({ onClearFilters }) => (
  <div className="text-center py-12">
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-[#322372] mb-2">
        No jobs found
      </h3>
      <p className="text-gray-600 mb-4">
        We couldn't find any jobs matching your search criteria. Try adjusting
        your filters.
      </p>
      <Button
        onClick={onClearFilters}
        className="bg-[#7657ff] hover:bg-[#322372] text-white"
      >
        Clear Filters
      </Button>
    </div>
  </div>
);

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
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${url}/api/job`);
        if (!response.ok) throw new Error("Failed to fetch platform jobs");
        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLinkedInJobs = async () => {
      setIsLinkedInLoading(true);
      try {
        const response = await fetch(
          "https://linkedin-data-api.p.rapidapi.com/search-jobs-v2?keywords=Computer%20Science&locationId=103363366&datePosted=anyTime&sort=mostRelevant",
          {
            headers: {
              "x-rapidapi-key":
                "bb834ebd60mshbda2ab24352bae8p137102jsne7dad0e3970e", // Replace with your actual key or use environment variables
              "x-rapidapi-host": "linkedin-data-api.p.rapidapi.com",
            },
          }
        );
        if (!response.ok)
          throw new Error("Failed to fetch LinkedIn jobs from API");
        const data = await response.json();
        setLinkedInJobs(data.data || []);
      } catch (err) {
        setError("Failed to fetch LinkedIn jobs. " + err.message);
        console.error("Error fetching LinkedIn jobs:", err);
      } finally {
        setIsLinkedInLoading(false);
      }
    };

    fetchJobs();
    fetchLinkedInJobs();
  }, []);

  const handleTakeJob = (jobId) => {
    console.log("Taking job:", jobId);
    router.push(`/userdashboard/take/${jobId}/resume-analysis`);
  };

  const handlePrepare = (jobId) => {
    console.log("Preparing for job:", jobId);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterType("all");
  };

  const filteredJobs = (activeTab === "internal" ? jobs : linkedInJobs).filter(
    (job) => {
      if (!job) return false;

      const title = job.title || "";
      const companyName =
        (activeTab === "internal" ? job.company : job.company?.name) || "";

      const searchMatch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        companyName.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterType === "all") return searchMatch;

      if (activeTab === "internal") {
        const employmentTypeMap = {
          FULL_TIME: "Full-time",
          PART_TIME: "Part-time",
          CONTRACT: "Contract",
          INTERNSHIP: "Internship",
        };
        const mappedType =
          employmentTypeMap[job.employmentType] || job.employmentType || "";
        return searchMatch && mappedType === filterType;
      }
      // For LinkedIn jobs, current filter types (Full-time, etc.) apply only via search term.
      // If specific type filtering for LinkedIn is needed, it would require mapping LinkedIn's employment type field.
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

  const renderJobCard = (job, isLinkedIn = false) => {
    if (!job) return null;

    const employmentTypeMap = {
      FULL_TIME: "Full-time",
      PART_TIME: "Part-time",
      CONTRACT: "Contract",
      INTERNSHIP: "Internship",
    };
    const displayEmploymentType =
      employmentTypeMap[job.employmentType] || job.employmentType;

    return (
      <motion.div
        key={job.id} // Unique key for each card
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border-none shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          <CardContent className="p-0 flex-grow flex flex-col">
            <div
              className="p-6 cursor-pointer flex-grow flex flex-col"
              onClick={() =>
                setExpandedId(expandedId === job.id ? null : job.id)
              }
            >
              <div className="flex justify-end items-start mb-4">
                <Badge
                  variant="outline"
                  className="bg-[#7657ff]/10 text-[#7657ff] border-[#7657ff]/20 hover:bg-[#7657ff]/20 whitespace-nowrap"
                >
                  {isLinkedIn ? job.location : displayEmploymentType}
                </Badge>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {job.title || "Untitled Position"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {isLinkedIn
                    ? job.company?.name || "Unknown Company"
                    : job.company || "Unknown Company"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                {!isLinkedIn && (
                  <>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-[#322372]" />
                      <span>{job.location || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase size={16} className="text-[#322372]" />
                      <span>{job.experienceLevel || "Not specified"}</span>
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
                    <div className="border-t border-gray-200 pt-4 mt-2">
                      {isLinkedIn ? (
                        <>
                          <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                            {job.description || "No description available"}
                          </p>
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#7657ff] hover:text-[#322372] flex items-center gap-1 font-medium text-sm"
                          >
                            View on LinkedIn <ExternalLink size={16} />
                          </a>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                            {job.description || "No description available"}
                          </p>
                          <div className="mb-2 text-sm">
                            <span className="font-medium text-[#322372]">
                              Salary:
                            </span>{" "}
                            <span className="text-gray-700">
                              {job.salaryCurrency || ""}
                              {job.salaryMin || "N/A"} -{" "}
                              {job.salaryMax || "N/A"}
                            </span>
                          </div>
                          {job.keywords && job.keywords.length > 0 && (
                            <div className="mb-1 text-sm">
                              <span className="font-medium text-[#322372] block mb-1">
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

              {/* Spacer to push buttons to bottom if content is short */}
              {!(expandedId === job.id) && <div className="flex-grow"></div>}

              <div className="flex items-center justify-between mt-auto pt-4">
                {" "}
                {/* mt-auto pushes buttons to bottom */}
                <div className="flex gap-3">
                  <Button
                    size="sm"
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
                    size="sm"
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
  };

  const currentLoadingState =
    activeTab === "internal" ? isLoading : isLinkedInLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {" "}
        {/* Increased max-width for better spacing */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#322372] mb-2">
            Discover Opportunities
          </h1>
          <p className="text-gray-600">Find and prepare for your dream job</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              {" "}
              {/* Adjusted for better layout on md screens */}
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
            <div className="md:col-span-1">
              {" "}
              {/* Adjusted for better layout on md screens */}
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
            <TabsList className="grid w-full grid-cols-2">
              {" "}
              {/* Removed mb-6, margin handled by content wrapper */}
              <TabsTrigger
                value="internal"
                className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Platform Jobs
              </TabsTrigger>
              <TabsTrigger
                value="linkedin"
                className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                LinkedIn Jobs
              </TabsTrigger>
            </TabsList>
            {/* Content is rendered outside TabsList, associated by activeTab state */}
          </Tabs>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg shadow">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
        {/* This is where the content for the active tab will be rendered */}
        <div className="mt-8">
          {" "}
          {/* Added margin top for separation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab} // This key is crucial for AnimatePresence to detect change between tabs
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentLoadingState ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderJobSkeleton()}
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredJobs.map((job) =>
                      renderJobCard(job, activeTab === "linkedin")
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NoJobsFoundDisplay onClearFilters={clearAllFilters} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
