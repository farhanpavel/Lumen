"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  Plus,
  CheckCircle2,
  ListChecks,
  Globe,
  Save,
} from "lucide-react";
import { url } from "@/components/Url/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function JobPostForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    remote: false,
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "BDT",
    employmentType: "",
    experienceLevel: "",
    keywords: "",
    expiresAt: "",
    benefits: [""],
    requirements: [""],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordsList, setKeywordsList] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (name, index, value) => {
    const newArray = [...formData[name]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [name]: newArray }));
  };

  const addArrayField = (name) => {
    setFormData((prev) => ({ ...prev, [name]: [...prev[name], ""] }));
  };

  const removeArrayField = (name, index) => {
    if (formData[name].length > 1) {
      const newArray = [...formData[name]];
      newArray.splice(index, 1);
      setFormData((prev) => ({ ...prev, [name]: newArray }));
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      const newKeyword = keywordInput.trim();
      setKeywordsList((prev) => [...prev, newKeyword]);
      setKeywordInput("");
      setFormData((prev) => ({
        ...prev,
        keywords: [
          ...prev.keywords.split(",").filter((k) => k.trim()),
          newKeyword,
        ].join(","),
      }));
    }
  };

  const removeKeyword = (keyword) => {
    setKeywordsList((prev) => prev.filter((k) => k !== keyword));
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords
        .split(",")
        .filter((k) => k.trim() !== keyword)
        .join(","),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    // Basic validation
    if (!formData.title || !formData.description || !formData.company) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${url}/api/job/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${Cookies.get("AccessToken")}`,
        },
        body: JSON.stringify({
          ...formData,
          keywords: formData.keywords
            .split(",")
            .filter((k) => k.trim())
            .map((k) => k.trim().toLowerCase()),
          salaryMin: Number(formData.salaryMin),
          salaryMax: Number(formData.salaryMax),
          remote: Boolean(formData.remote),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to post job");
      }

      setSuccess(true);
      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        company: "",
        location: "",
        remote: false,
        salaryMin: "",
        salaryMax: "",
        salaryCurrency: "BDT",
        employmentType: "",
        experienceLevel: "",
        keywords: "",
        expiresAt: "",
        benefits: [""],
        requirements: [""],
      });
      setKeywordsList([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#322372] to-[#7657ff] text-white rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Create New Job Posting
            </CardTitle>
            <CardDescription className="text-white/80">
              Fill in the details to create a new job opportunity
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-500 text-green-700 bg-green-50">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Job posted successfully!</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Job Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Senior Software Engineer"
                      className="border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">
                      Company <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Building
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="e.g. Acme Corporation"
                        className="pl-10 border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the role, responsibilities, and ideal candidate..."
                    className="min-h-[150px] border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                    required
                  />
                </div>
              </div>

              <Separator className="bg-gray-200" />

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Compensation & Location
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin" className="text-sm font-medium">
                      Minimum Salary
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {formData.salaryCurrency}
                      </span>
                      <Input
                        id="salaryMin"
                        name="salaryMin"
                        type="number"
                        value={formData.salaryMin}
                        onChange={handleInputChange}
                        className="pl-12 border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaryMax" className="text-sm font-medium">
                      Maximum Salary
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {formData.salaryCurrency}
                      </span>
                      <Input
                        id="salaryMax"
                        name="salaryMax"
                        type="number"
                        value={formData.salaryMax}
                        onChange={handleInputChange}
                        className="pl-12 border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="salaryCurrency"
                      className="text-sm font-medium"
                    >
                      Currency
                    </Label>
                    <Select
                      value={formData.salaryCurrency}
                      onValueChange={(value) =>
                        handleSelectChange("salaryCurrency", value)
                      }
                    >
                      <SelectTrigger className="border-[#7657ff]/20 focus:ring-[#7657ff]">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BDT">BDT</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Dhaka, Bangladesh"
                        className="pl-10 border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 h-full pt-6">
                    <Switch
                      id="remote"
                      name="remote"
                      checked={formData.remote}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, remote: checked }))
                      }
                      className="data-[state=checked]:bg-[#7657ff]"
                    />
                    <Label
                      htmlFor="remote"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Globe size={16} className="text-gray-500" />
                      Remote Position
                    </Label>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-200" />

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                  <ListChecks className="h-5 w-5" /> Job Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="employmentType"
                      className="text-sm font-medium"
                    >
                      Employment Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value) =>
                        handleSelectChange("employmentType", value)
                      }
                      required
                    >
                      <SelectTrigger className="border-[#7657ff]/20 focus:ring-[#7657ff]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="experienceLevel"
                      className="text-sm font-medium"
                    >
                      Experience Level <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.experienceLevel}
                      onValueChange={(value) =>
                        handleSelectChange("experienceLevel", value)
                      }
                      required
                    >
                      <SelectTrigger className="border-[#7657ff]/20 focus:ring-[#7657ff]">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ENTRY_LEVEL">Entry Level</SelectItem>
                        <SelectItem value="ASSOCIATE">Associate</SelectItem>
                        <SelectItem value="MID_SENIOR_LEVEL">
                          Mid-Senior
                        </SelectItem>
                        <SelectItem value="DIRECTOR">Director</SelectItem>
                        <SelectItem value="EXECUTIVE">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="keywords" className="text-sm font-medium">
                      Keywords
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <Input
                          id="keywordInput"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          placeholder="e.g. React, JavaScript"
                          className="pl-10 border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addKeyword();
                            }
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={addKeyword}
                        variant="outline"
                        className="border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    {keywordsList.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {keywordsList.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-[#7657ff]/10 text-[#7657ff] hover:bg-[#7657ff]/20 cursor-pointer"
                            onClick={() => removeKeyword(keyword)}
                          >
                            {keyword} &times;
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiresAt" className="text-sm font-medium">
                      Expiry Date
                    </Label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <Input
                        id="expiresAt"
                        name="expiresAt"
                        type="datetime-local"
                        value={formData.expiresAt}
                        onChange={handleInputChange}
                        className="pl-10 border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-200" />

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#322372] flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Benefits & Requirements
                </h3>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Benefits</Label>
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) =>
                          handleArrayChange("benefits", index, e.target.value)
                        }
                        placeholder="e.g. Health Insurance"
                        className="flex-1 border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => removeArrayField("benefits", index)}
                      >
                        &times;
                      </Button>
                      {index === formData.benefits.length - 1 && (
                        <Button
                          type="button"
                          onClick={() => addArrayField("benefits")}
                          variant="outline"
                          className="border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
                        >
                          <Plus size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Requirements</Label>
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={requirement}
                        onChange={(e) =>
                          handleArrayChange(
                            "requirements",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="e.g. 3+ years of experience"
                        className="flex-1 border-[#7657ff]/20 focus-visible:ring-[#7657ff]"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => removeArrayField("requirements", index)}
                      >
                        &times;
                      </Button>
                      {index === formData.requirements.length - 1 && (
                        <Button
                          type="button"
                          onClick={() => addArrayField("requirements")}
                          variant="outline"
                          className="border-[#7657ff] text-[#7657ff] hover:bg-[#7657ff]/10"
                        >
                          <Plus size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#322372] to-[#7657ff] hover:from-[#322372]/90 hover:to-[#7657ff]/90 text-white py-6"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Posting Job...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      <span>Post Job</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
