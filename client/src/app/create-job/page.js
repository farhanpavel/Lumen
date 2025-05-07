"use"
import { useState } from 'react';
import Cookies from 'js-cookie';
import Loader from '@/components/Loader'; // Assume you have a Loader component

const JobPostForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        location: '',
        remote: false,
        salaryMin: '',
        salaryMax: '',
        salaryCurrency: 'USD',
        employmentType: '',
        experienceLevel: '',
        keywords: '',
        expiresAt: '',
        benefits: [''],
        requirements: ['']
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayChange = (name, index, value) => {
        const newArray = [...formData[name]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [name]: newArray }));
    };

    const addArrayField = (name) => {
        setFormData(prev => ({ ...prev, [name]: [...prev[name], ''] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsLoading(true);

        // Basic validation
        if (!formData.title || !formData.description || !formData.company) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/job/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('AccessToken')}`
                },
                body: JSON.stringify({
                    ...formData,
                    keywords: formData.keywords.split(',').map(k => k.trim().toLowerCase()),
                    salaryMin: Number(formData.salaryMin),
                    salaryMax: Number(formData.salaryMax),
                    remote: Boolean(formData.remote)
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to post job');
            }

            setSuccess(true);
            // Reset form after successful submission
            setFormData({
                title: '',
                description: '',
                company: '',
                location: '',
                remote: false,
                salaryMin: '',
                salaryMax: '',
                salaryCurrency: 'USD',
                employmentType: '',
                experienceLevel: '',
                keywords: '',
                expiresAt: '',
                benefits: [''],
                requirements: ['']
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Post a New Job</h1>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Job posted successfully!</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Required Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md h-32"
                        required
                    />
                </div>

                {/* Salary and Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary</label>
                        <input
                            type="number"
                            name="salaryMin"
                            value={formData.salaryMin}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Salary</label>
                        <input
                            type="number"
                            name="salaryMax"
                            value={formData.salaryMax}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Employment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                        <select
                            name="employmentType"
                            value={formData.employmentType}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="INTERNSHIP">Internship</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level *</label>
                        <select
                            name="experienceLevel"
                            value={formData.experienceLevel}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        >
                            <option value="">Select Level</option>
                            <option value="ENTRY_LEVEL">Entry Level</option>
                            <option value="ASSOCIATE">Associate</option>
                            <option value="MID_SENIOR_LEVEL">Mid-Senior</option>
                            <option value="DIRECTOR">Director</option>
                            <option value="EXECUTIVE">Executive</option>
                        </select>
                    </div>
                </div>

                {/* Keywords and Expiry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma separated)</label>
                        <input
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            placeholder="e.g., python, machine-learning"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                            type="datetime-local"
                            name="expiresAt"
                            value={formData.expiresAt}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Benefits */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                    {formData.benefits.map((benefit, index) => (
                        <div key={index} className="flex mb-2">
                            <input
                                type="text"
                                value={benefit}
                                onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                                className="flex-1 p-2 border rounded-md mr-2"
                            />
                            {index === formData.benefits.length - 1 && (
                                <button
                                    type="button"
                                    onClick={() => addArrayField('benefits')}
                                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                                >
                                    Add
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Requirements */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    {formData.requirements.map((requirement, index) => (
                        <div key={index} className="flex mb-2">
                            <input
                                type="text"
                                value={requirement}
                                onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                className="flex-1 p-2 border rounded-md mr-2"
                            />
                            {index === formData.requirements.length - 1 && (
                                <button
                                    type="button"
                                    onClick={() => addArrayField('requirements')}
                                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                                >
                                    Add
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="remote"
                            checked={formData.remote}
                            onChange={handleInputChange}
                            className="form-checkbox"
                        />
                        <span className="text-sm text-gray-700">Remote Position</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isLoading ? <Loader className="inline-block h-5 w-5" /> : 'Post Job'}
                </button>
            </form>
        </div>
    );
};

export default JobPostForm;