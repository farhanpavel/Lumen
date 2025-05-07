"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loader from "@/components/Loader/loader";
import {url} from "@/components/Url/page";

const API_URL = url; // Set this in your .env

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [linkedInJobs, setLinkedInJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLinkedInLoading, setIsLinkedInLoading] = useState(true);
    const [error, setError] = useState('');
    const [showLinkedInJobs, setShowLinkedInJobs] = useState(false);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        // Fetch regular jobs
        const fetchJobs = async () => {
            try {
                const response = await fetch(`${API_URL}/api/job`);
                if (!response.ok) throw new Error('Failed to fetch jobs');
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
                    'https://linkedin-data-api.p.rapidapi.com/search-jobs-v2?keywords=Computer%20Science&locationId=103363366&datePosted=anyTime&sort=mostRelevant',
                    {
                        headers: {
                            'x-rapidapi-key': 'bb834ebd60mshbda2ab24352bae8p137102jsne7dad0e3970e',
                            'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
                        }
                    }
                );
                const data = await response.json();
                setLinkedInJobs(data.data || []);
            } catch (err) {
                setError('Failed to fetch LinkedIn jobs');
            } finally {
                setIsLinkedInLoading(false);
            }
        };

        fetchJobs();
        fetchLinkedInJobs();
    }, []);

    const handleTakeJob = (jobId) => {
        console.log('Taking job:', jobId);
    };

    const handlePrepare = (jobId) => {
        console.log('Preparing for job:', jobId);
    };

    const renderJobCard = (job, isLinkedIn = false) => (
        <motion.div
            key={job.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {isLinkedIn ? job.company?.name : job.company}
                        </p>
                    </div>
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {isLinkedIn ? job.location : job.employmentType}
                </span>
                </div>

                {!isLinkedIn && (
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                        <span className="mr-4">📍 {job.location}</span>
                        <span>💼 {job.experienceLevel}</span>
                    </div>
                )}

                <motion.div
                    className="overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{ height: expandedId === job.id ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="border-t pt-4 mt-4">
                        {isLinkedIn ? (
                            <>
                                <p className="text-gray-700 mb-4">{job.description || 'No description available'}</p>
                                <a
                                    href={job.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    View on LinkedIn
                                </a>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-700 mb-4">{job.description}</p>
                                <div className="mb-4">
                                    <span className="font-medium">Salary:</span> {job.salaryCurrency}
                                    {job.salaryMin} - {job.salaryMax}
                                </div>
                                <div className="mb-4">
                                    <span className="font-medium">Keywords:</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {job.keywords?.map((keyword) => (
                                            <span
                                                key={keyword.id}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                                            >
                                            {keyword.name}
                                        </span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Buttons for both types */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            isLinkedIn ? window.open(job.url, '_blank') : handleTakeJob(job.id);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        {isLinkedIn ? 'Apply Now' : 'Take Job'}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrepare(job.id);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Prepare
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Available Jobs</h1>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showLinkedInJobs}
                            onChange={(e) => setShowLinkedInJobs(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-700">Show LinkedIn Jobs</span>
                    </label>
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                {(isLoading || isLinkedInLoading) ? (
                    <div className="flex justify-center py-12">
                        <Loader size="large" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {showLinkedInJobs
                            ? linkedInJobs.map((job) => renderJobCard(job, true))
                            : jobs.map((job) => renderJobCard(job))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobsPage;