'use client';

import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import {url} from "@/components/Url/page";
import Cookies from "js-cookie";

export default function Page({ params }) {
    const [isLoading, setIsLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const jobId = params.id;

    useEffect(() => {
        const validateResume = async () => {
            try {
                const response = await fetch(`${url}/api/resume/validate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Cookies.get("AccessToken")
                    },
                    body: JSON.stringify({ jobId }),
                });

                if (!response.ok) throw new Error('Validation failed');
                const data = await response.json();
                setResult(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        validateResume();
    }, [jobId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <PulseLoader color="#3B82F6" size={15} />
                    <p className="mt-4 text-gray-600">Analyzing your resume...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-red-50 p-8 rounded-lg max-w-md text-center">
                    <h3 className="text-red-600 font-semibold text-lg">Error</h3>
                    <p className="text-red-700 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Resume Analysis for Job #{jobId}
                </h1>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Match Results</h2>
                        <span
                            className={`px-4 py-2 rounded-full ${
                                result.eligible
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                        {result.eligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-2">
                                Match Percentage: {result.percentage}%
                            </h3>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                    style={{ width: `${result.percentage}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2">Analysis Summary</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {result.description}
                            </p>
                        </div>

                        {result.lackings.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium mb-2">
                                    Recommended Improvements
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.lackings.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                                        >
                                        {skill}
                                    </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ← Back to Job Listings
                    </button>

                    {(result.eligible) && (
                        <button
                            onClick={() => window.location.href = `/userdashboard/take/${jobId}/test`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Take Test
                        </button>
                    )}

                    <button
                        onClick={() => window.location.href = '/userdashboard/preparation'}
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        Preparation
                    </button>
                </div>
            </div>
        </div>
    );
}
