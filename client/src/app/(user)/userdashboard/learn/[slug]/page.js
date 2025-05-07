"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, ExternalLink, BookOpen, Code, Youtube } from "lucide-react";
import Cookies from "js-cookie";
import { url } from "@/components/Url/page";

export default function TopicPage() {
  const params = useParams();
  const slug = params.slug;
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState(null);
  const [activeTab, setActiveTab] = useState("context");
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("AccessToken");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `${url}/api/planner/topic/${encodeURIComponent(title)}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch resources: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch resources");
        }

        setResources(data.data);
        if (data.data.videos && data.data.videos.length > 0) {
          setSelectedVideo(data.data.videos[0]);
        }
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchResources();
    }
  }, [title]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 text-[#7657ff] animate-spin" />
        <p className="mt-4 text-lg text-gray-700">
          Loading resources for {title}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-3xl w-full">
          <h1 className="text-2xl font-bold text-red-700 mb-4">
            Error Loading Resources
          </h1>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-[#7657ff] text-white rounded-md hover:bg-[#6447ee] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!resources) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-3xl w-full">
          <h1 className="text-2xl font-bold text-yellow-700 mb-4">
            No Resources Found
          </h1>
          <p className="text-yellow-600">
            No learning resources were found for this topic.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-[#7657ff] text-white rounded-md hover:bg-[#6447ee] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#322372] to-[#7657ff] text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {resources.title}
          </h1>
          <p className="text-lg opacity-90">
            Comprehensive learning resources to master this topic
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#7657ff] text-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex overflow-x-auto">
          <button
            className={`px-6 py-4 font-medium flex items-center ${
              activeTab === "context" ? "bg-[#322372]" : "hover:bg-opacity-80"
            }`}
            onClick={() => setActiveTab("context")}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Overview
          </button>
          <button
            className={`px-6 py-4 font-medium flex items-center ${
              activeTab === "code" ? "bg-[#322372]" : "hover:bg-opacity-80"
            }`}
            onClick={() => setActiveTab("code")}
          >
            <Code className="mr-2 h-5 w-5" />
            Code Examples
          </button>
          <button
            className={`px-6 py-4 font-medium flex items-center ${
              activeTab === "videos" ? "bg-[#322372]" : "hover:bg-opacity-80"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            <Youtube className="mr-2 h-5 w-5" />
            Videos
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Context Tab */}
        {activeTab === "context" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#322372]">Overview</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-gray-700">
                {resources.context}
              </p>
            </div>

            {resources.documentation && resources.documentation.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-[#322372]">
                  Documentation & Resources
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resources.documentation.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#7657ff] hover:shadow-md transition-all"
                    >
                      <div className="bg-[#7657ff] bg-opacity-10 p-2 rounded-full mr-3">
                        <ExternalLink className="h-5 w-5 text-[#7657ff]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {doc.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Official Documentation
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Code Examples Tab */}
        {activeTab === "code" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#322372]">
              Code Examples
            </h2>

            {resources.codeExamples && resources.codeExamples.length > 0 ? (
              <div className="space-y-8">
                {resources.codeExamples.map((example, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">
                        {example.title}
                      </h3>
                      <span className="text-sm px-2 py-1 bg-[#7657ff] bg-opacity-10 text-[#7657ff] rounded">
                        {example.language}
                      </span>
                    </div>
                    <pre className="p-4 overflow-x-auto bg-gray-50 text-sm">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No code examples available for this topic.
              </p>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#322372]">
              Video Tutorials
            </h2>

            {resources.videos && resources.videos.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {selectedVideo && (
                    <div className="bg-black rounded-lg overflow-hidden aspect-video">
                      <iframe
                        src={selectedVideo.embedUrl}
                        title={selectedVideo.title}
                        className="w-full h-full"
                        allowFullScreen
                        frameBorder="0"
                      ></iframe>
                    </div>
                  )}

                  {selectedVideo && (
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedVideo.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedVideo.channelTitle} •{" "}
                        {new Date(
                          selectedVideo.publishedAt
                        ).toLocaleDateString()}
                      </p>
                      <p className="mt-3 text-gray-700 line-clamp-3">
                        {selectedVideo.description}
                      </p>
                      <a
                        href={selectedVideo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-3 text-[#7657ff] hover:underline"
                      >
                        Watch on YouTube{" "}
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <h3 className="text-lg font-medium mb-3 text-gray-900">
                    More Videos
                  </h3>
                  <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
                    {resources.videos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className={`flex cursor-pointer rounded-lg overflow-hidden border ${
                          selectedVideo && selectedVideo.id === video.id
                            ? "border-[#7657ff] bg-[#7657ff] bg-opacity-5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="w-32 h-20 flex-shrink-0 bg-gray-100">
                          <img
                            src={video.thumbnailUrl || "/placeholder.svg"}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <h4 className="font-medium text-sm line-clamp-2 text-gray-900">
                            {video.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {video.channelTitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                No video tutorials available for this topic.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
