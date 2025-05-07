"use client";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Youtube,
  Search,
  Star,
  ExternalLink,
  Clock,
  Lightbulb,
  Code,
  CheckCircle2,
  X,
} from "lucide-react";
import { url } from "@/components/Url/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CourseRecommendations() {
  const [selectedLackings, setSelectedLackings] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("coursera");
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This would come from the user's profile or assessment
  const lackings = [
    "jwt auth",
    "numpy",
    "mqtt",
    "react hooks",
    "typescript",
    "nextjs",
    "tailwind css",
    "mongodb",
  ];
  const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      if (selectedLackings.length === 0) {
        setCourses([]);
        setVideos([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const query = selectedLackings.join(" ");

        if (selectedPlatform === "coursera") {
          const tags = selectedLackings.join(",");
          const response = await fetch(
            `${url}/api/course/coursera?tags=${tags}`
          );
          if (!response.ok) throw new Error("Failed to fetch courses");
          const data = await response.json();
          setCourses(data.results);
          setVideos([]);
        } else {
          const ytResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(
              query + " tutorial"
            )}&key=${YOUTUBE_API_KEY}`
          );
          if (!ytResponse.ok) throw new Error("Failed to fetch YouTube videos");
          const ytData = await ytResponse.json();
          setVideos(ytData.items);
          setCourses([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedLackings, selectedPlatform]);

  const handleChipClick = (skill) => {
    setSelectedLackings((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearAllSkills = () => {
    setSelectedLackings([]);
  };

  const renderSkeletonCards = () => {
    return Array(6)
      .fill()
      .map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden border-none shadow-md bg-white/80 backdrop-blur-sm"
        >
          <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex flex-wrap gap-2 mb-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <Skeleton className="h-8 w-28" />
          </CardContent>
        </Card>
      ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#322372] mb-2">
            Skill Development
          </h1>
          <p className="text-gray-600">
            Enhance your skills with personalized learning resources
          </p>
        </div>

        <Card className="mb-8 border-none shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#7657ff]" />
              <CardTitle className="text-xl text-[#322372]">
                Your Identified Skill Gaps
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {lackings.map((skill) => (
                <Badge
                  key={skill}
                  variant={
                    selectedLackings.includes(skill) ? "default" : "outline"
                  }
                  className={`
                    px-3 py-1.5 text-sm font-medium cursor-pointer transition-all
                    ${
                      selectedLackings.includes(skill)
                        ? "bg-[#7657ff] hover:bg-[#322372] text-white"
                        : "border-[#7657ff]/30 text-[#322372] hover:border-[#7657ff] hover:bg-[#7657ff]/5"
                    }
                  `}
                  onClick={() => handleChipClick(skill)}
                >
                  {selectedLackings.includes(skill) ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {skill}
                    </span>
                  ) : (
                    <span>{skill}</span>
                  )}
                </Badge>
              ))}
            </div>

            {selectedLackings.length > 0 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {selectedLackings.length} skill
                  {selectedLackings.length !== 1 ? "s" : ""} selected
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllSkills}
                  className="text-[#7657ff] hover:text-[#322372] hover:bg-[#7657ff]/5"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedLackings.length > 0 ? (
          <>
            <Tabs
              defaultValue={selectedPlatform}
              onValueChange={setSelectedPlatform}
              className="mb-8"
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger
                  value="coursera"
                  className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Coursera
                </TabsTrigger>
                <TabsTrigger
                  value="youtube"
                  className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
                >
                  <Youtube className="h-4 w-4 mr-2" />
                  YouTube
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#322372] flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  {selectedPlatform === "coursera"
                    ? "Recommended Courses"
                    : "Tutorial Videos"}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Code className="h-4 w-4" />
                  <span>Searching for: {selectedLackings.join(", ")}</span>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderSkeletonCards()}
                </div>
              ) : (
                <TabsContent value="coursera" className="mt-0">
                  {courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map((course) => (
                        <Card
                          key={course.link}
                          className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm"
                        >
                          <div className="h-48 w-full overflow-hidden relative">
                            <img
                              src={course.image || "/placeholder.svg"}
                              alt={course.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center text-sm font-medium text-amber-600">
                              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 mr-1" />
                              {course.rating}
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-2 text-[#322372] line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-gray-600 mb-3 flex items-center text-sm">
                              <BookOpen className="h-4 w-4 mr-1 text-[#7657ff]" />
                              {course.partner}
                            </p>
                            <div className="mb-4">
                              <p className="font-medium text-sm mb-2 text-gray-700">
                                Skills covered:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {course.skills
                                  .split(", ")
                                  .slice(0, 4)
                                  .map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="secondary"
                                      className="bg-[#322372]/5 text-[#322372] hover:bg-[#322372]/10"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                {course.skills.split(", ").length > 4 && (
                                  <Badge
                                    variant="outline"
                                    className="bg-transparent"
                                  >
                                    +{course.skills.split(", ").length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0 px-6 pb-6">
                            <Button
                              asChild
                              className="w-full bg-[#7657ff] hover:bg-[#322372] text-white"
                            >
                              <a
                                href={course.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center"
                              >
                                View Course{" "}
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </a>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-xl">
                      <div className="max-w-md mx-auto">
                        <BookOpen className="h-12 w-12 mx-auto text-[#7657ff]/50 mb-4" />
                        <h3 className="text-xl font-semibold text-[#322372] mb-2">
                          No courses found
                        </h3>
                        <p className="text-gray-600 mb-4">
                          We couldn&apos;t find any courses matching your selected
                          skills. Try selecting different skills or check
                          YouTube tutorials.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderSkeletonCards()}
                </div>
              ) : (
                <TabsContent value="youtube" className="mt-0">
                  {videos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {videos.map((video) => (
                        <Card
                          key={video.id.videoId}
                          className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm"
                        >
                          <div className="h-48 w-full overflow-hidden relative group">
                            <img
                              src={
                                video.snippet.thumbnails.medium.url ||
                                "/placeholder.svg"
                              }
                              alt={video.snippet.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center">
                                <Youtube className="h-8 w-8 text-red-600" />
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-2 text-[#322372] line-clamp-2">
                              {video.snippet.title}
                            </h3>
                            <p className="text-gray-600 mb-3 flex items-center text-sm">
                              <Youtube className="h-4 w-4 mr-1 text-red-600" />
                              {video.snippet.channelTitle}
                            </p>
                            <p className="text-gray-500 text-sm flex items-center mb-4">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(
                                video.snippet.publishedAt
                              ).toLocaleDateString()}
                            </p>
                          </CardContent>
                          <CardFooter className="pt-0 px-6 pb-6">
                            <Button
                              asChild
                              className="w-full bg-red-600 hover:bg-red-700 text-white"
                            >
                              <a
                                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center"
                              >
                                Watch Video{" "}
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </a>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-xl">
                      <div className="max-w-md mx-auto">
                        <Youtube className="h-12 w-12 mx-auto text-red-500/50 mb-4" />
                        <h3 className="text-xl font-semibold text-[#322372] mb-2">
                          No videos found
                        </h3>
                        <p className="text-gray-600 mb-4">
                          We couldn&apos;t find any videos matching your selected
                          skills. Try selecting different skills or check
                          Coursera courses.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </>
        ) : (
          <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-xl shadow-md">
            <div className="max-w-md mx-auto">
              <Lightbulb className="h-16 w-16 mx-auto text-[#7657ff]/50 mb-4" />
              <h3 className="text-2xl font-semibold text-[#322372] mb-2">
                Select skills to get started
              </h3>
              <p className="text-gray-600 mb-6">
                Choose the skills you want to improve from the list above to see
                personalized course and video recommendations.
              </p>
              <Button
                onClick={() =>
                  setSelectedLackings(["react hooks", "typescript"])
                }
                className="bg-[#7657ff] hover:bg-[#322372] text-white"
              >
                Suggest Popular Skills
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
