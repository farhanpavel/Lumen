'use client'
import { useState, useEffect } from 'react';
import { url } from "@/components/Url/page";

export default function CourseRecommendations() {
    const [selectedLackings, setSelectedLackings] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('coursera');
    const [courses, setCourses] = useState([]);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const lackings = ['jwt auth', 'numpy', 'mqtt'];
    const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; // Add to .env

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
                const query = selectedLackings.join(' ');

                if(selectedPlatform === 'coursera') {
                    const tags = selectedLackings.join(',');
                    const response = await fetch(`${url}/api/course/coursera?tags=${tags}`);
                    if (!response.ok) throw new Error('Failed to fetch courses');
                    const data = await response.json();
                    setCourses(data.results);
                    setVideos([]);
                } else {
                    const ytResponse = await fetch(
                        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query + " tutorial")}&key=${YOUTUBE_API_KEY}`
                    );
                    if (!ytResponse.ok) throw new Error('Failed to fetch YouTube videos');
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
        setSelectedLackings(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold">Recommended Learning Resources</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedPlatform('coursera')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            selectedPlatform === 'coursera'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Coursera
                    </button>
                    <button
                        onClick={() => setSelectedPlatform('youtube')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            selectedPlatform === 'youtube'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        YouTube
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Your identified skill gaps:</h2>
                <div className="flex flex-wrap gap-2">
                    {lackings.map((skill) => (
                        <button
                            key={skill}
                            onClick={() => handleChipClick(skill)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                ${selectedLackings.includes(skill)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center my-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Searching {selectedPlatform}...</p>
                </div>
            )}

            {error && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {selectedPlatform === 'coursera' ? (
                    courses.map((course) => (
                        <div key={course.link} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                            <div className="h-48 w-full overflow-hidden">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{course.title}</h3>
                                <p className="text-gray-600 mb-3">
                                    {course.partner} • Rating: {course.rating}
                                </p>
                                <div className="mb-4">
                                    <p className="font-medium mb-2">Skills covered:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {course.skills.split(', ').map((skill) => (
                                            <span key={skill} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <a
                                    href={course.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    View Course →
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    videos.map((video) => (
                        <div key={video.id.videoId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                            <div className="h-48 w-full overflow-hidden">
                                <img
                                    src={video.snippet.thumbnails.medium.url}
                                    alt={video.snippet.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{video.snippet.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{video.snippet.channelTitle}</p>
                                <a
                                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block text-red-600 hover:text-red-800 font-medium"
                                >
                                    Watch Video →
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}