'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Oval } from 'react-loader-spinner';
import {url} from "@/components/Url/page";

export default function ExamPage({ params }) {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(45 * 60);
    const [isLoading, setIsLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [violations, setViolations] = useState(0);
    const [error, setError] = useState('');

    let jobId = params.id;
    // Fetch questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`${url}/api/resume/create-questions`,{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobId: jobId })
                });
                const data = await response.json();
                setQuestions(data.questions);
                setAnswers(Array(data.questions.length).fill(''));
            } catch (err) {
                setError('Failed to load questions');
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, [params.sessionId]);

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Tab switching detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setViolations(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 3) handleSubmit();
                    return newCount;
                });
            }
        };

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleAnswerChange = (index, answer) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const submission = questions.map((q, i) => ({
                q,
                a: answers[i]
            }));

            const response = await fetch(`${url}/api/resume/review-answers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submission)
            });

            const resultData = await response.json();

            if (resultData.success && resultData.analysis) {
                setResult(resultData.analysis);
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            setError('Submission failed');
        } finally {
            setIsLoading(false);
        }
    };


    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                    <div className="text-red-600 text-xl font-semibold mb-4">Error</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Oval
                    height={50}
                    width={50}
                    color="#3b82f6"
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#bfdbfe"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                />
            </div>
        );
    }

    if (result) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Exam Results</h1>

                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl font-semibold">Score:</span>
                            <div className="relative pt-1 w-1/2">
                                <div className="flex mb-2 items-center justify-between">
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded-full">
                                            <div
                                                className="h-4 bg-blue-600 rounded-full transition-all duration-500"
                                                style={{ width: `${result.score}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold ml-3">{result.score}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Feedback</h2>
                            <p className="text-gray-600 leading-relaxed">{result.comment}</p>
                        </div>

                        {result.lackings.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Areas to Improve</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.lackings.map((topic, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                                        >
                      {topic}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Technical Exam</h1>
                        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                            Time Remaining: {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="space-y-8">
                        {questions.map((question, index) => (
                            <div key={index} className="border-b pb-6">
                                <div className="flex items-start mb-4">
                                    <span className="text-gray-600 mr-2">{index + 1}.</span>
                                    <h3 className="text-lg font-semibold text-gray-800">{question}</h3>
                                </div>
                                <textarea
                                    value={answers[index]}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Type your answer here..."
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                        <div className="text-red-600">
                            Tab Switch Violations: {violations}/3
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Submit Answers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}