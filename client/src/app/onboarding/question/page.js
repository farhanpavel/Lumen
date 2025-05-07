"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Github,
  Globe,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  Code,
  Languages,
  Award,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cookies from "js-cookie";
import { url } from "@/components/Url/page";

export default function ResumeQuestionsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [projectLinks, setProjectLinks] = useState([
    { title: "", url: "", description: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    jobTitle: "",
    yearsExperience: "",
    education: "",
    skills: [],
    languages: [],
    frameworks: [],
    jobPreference: "",
    availability: "",
    salaryExpectation: "",
    relocation: false,
    aboutYou: "",
    industry: "",
    certifications: "",
    otherTech: "",
  });

  // Define all steps
  const steps = [
    { id: "career", title: "Career Information", icon: Briefcase },
    { id: "education", title: "Education & Skills", icon: GraduationCap },
    { id: "technical", title: "Technical Skills", icon: Code },
    { id: "preferences", title: "Job Preferences", icon: Award },
    { id: "projects", title: "Projects & Portfolio", icon: Github },
  ];

  // Calculate progress percentage
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name, value, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...formData[name], value],
      });
    } else {
      setFormData({
        ...formData,
        [name]: formData[name].filter((item) => item !== value),
      });
    }
  };

  const handleProjectChange = (index, field, value) => {
    const updatedLinks = [...projectLinks];
    updatedLinks[index][field] = value;
    setProjectLinks(updatedLinks);
  };

  const addProjectLink = () => {
    setProjectLinks([...projectLinks, { title: "", url: "", description: "" }]);
  };

  const removeProjectLink = (index) => {
    const updatedLinks = projectLinks.filter((_, i) => i !== index);
    setProjectLinks(updatedLinks);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);

    // Prepare the final data
    const finalData = {
      ...formData,
      projects: projectLinks.filter(
        (project) => project.title && (project.url || project.description)
      ),
    };

    try {
      const token = Cookies.get("AccessToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${url}/api/resume/details`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save resume details");
      }

      const data = await response.json();
      alert("Resume details saved successfully!");
      router.push("/userdashboard/overview");
    } catch (error) {
      console.error("Error saving resume details:", error);
      alert("Failed to save resume details");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7fe] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with progress */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#322372] mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 mb-6">
            We've analyzed your resume. Now, let's fill in some additional
            details to enhance your profile.
          </p>

          <div className="mb-2 flex justify-between text-sm font-medium">
            <span className="text-[#7657ff]">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-gray-500">{steps[currentStep].title}</span>
          </div>

          <Progress
            value={progress}
            className="h-2 bg-gray-200"
            indicatorClassName="bg-gradient-to-r from-[#7657ff] to-[#322372]"
          />

          <div className="flex justify-center mt-6 space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-[#7657ff] text-white"
                    : index < currentStep
                    ? "bg-[#7657ff]/20 text-[#7657ff]"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Question Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-[#7657ff]/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#322372]">
                  {steps[currentStep].title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Career Information */}
                {currentStep === 0 && (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="jobTitle">
                        Current or Desired Job Title
                      </Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        placeholder="e.g. Frontend Developer"
                        className="border-[#7657ff]/30 focus-visible:ring-[#7657ff]"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="yearsExperience">
                        Years of Experience
                      </Label>
                      <Select
                        value={formData.yearsExperience}
                        onValueChange={(value) =>
                          setFormData({ ...formData, yearsExperience: value })
                        }
                      >
                        <SelectTrigger className="border-[#7657ff]/30 focus:ring-[#7657ff]">
                          <SelectValue placeholder="Select years of experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>What industry do you primarily work in?</Label>
                      <RadioGroup
                        value={formData.industry}
                        onValueChange={(value) =>
                          setFormData({ ...formData, industry: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tech" id="tech" />
                          <Label htmlFor="tech">Technology</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="finance" id="finance" />
                          <Label htmlFor="finance">Finance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="healthcare" id="healthcare" />
                          <Label htmlFor="healthcare">Healthcare</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="education" id="education" />
                          <Label htmlFor="education">Education</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}

                {/* Step 2: Education & Skills */}
                {currentStep === 1 && (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="education">
                        Highest Level of Education
                      </Label>
                      <Select
                        value={formData.education}
                        onValueChange={(value) =>
                          setFormData({ ...formData, education: value })
                        }
                      >
                        <SelectTrigger className="border-[#7657ff]/30 focus:ring-[#7657ff]">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">
                            High School
                          </SelectItem>
                          <SelectItem value="associate">
                            Associate Degree
                          </SelectItem>
                          <SelectItem value="bachelor">
                            Bachelor's Degree
                          </SelectItem>
                          <SelectItem value="master">
                            Master's Degree
                          </SelectItem>
                          <SelectItem value="phd">PhD or Doctorate</SelectItem>
                          <SelectItem value="bootcamp">Bootcamp</SelectItem>
                          <SelectItem value="self-taught">
                            Self-taught
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>What soft skills do you possess?</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Communication",
                          "Leadership",
                          "Problem Solving",
                          "Teamwork",
                          "Time Management",
                          "Adaptability",
                          "Creativity",
                          "Critical Thinking",
                        ].map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={skill.toLowerCase().replace(" ", "-")}
                              checked={formData.skills.includes(skill)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("skills", skill, checked)
                              }
                              className="text-[#7657ff] border-[#7657ff]/50"
                            />
                            <Label
                              htmlFor={skill.toLowerCase().replace(" ", "-")}
                            >
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="certifications">
                        Do you have any certifications?
                      </Label>
                      <Textarea
                        id="certifications"
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleInputChange}
                        placeholder="List any relevant certifications you have"
                        className="border-[#7657ff]/30 focus-visible:ring-[#7657ff]"
                      />
                    </div>
                  </>
                )}

                {/* Step 3: Technical Skills */}
                {currentStep === 2 && (
                  <>
                    <div className="space-y-3">
                      <Label>
                        Which programming languages are you proficient in?
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "JavaScript",
                          "Python",
                          "Java",
                          "C#",
                          "C++",
                          "Ruby",
                          "PHP",
                          "Swift",
                          "Go",
                          "TypeScript",
                          "Kotlin",
                          "Rust",
                        ].map((language) => (
                          <div
                            key={language}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={language.toLowerCase()}
                              checked={formData.languages.includes(language)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "languages",
                                  language,
                                  checked
                                )
                              }
                              className="text-[#7657ff] border-[#7657ff]/50"
                            />
                            <Label htmlFor={language.toLowerCase()}>
                              {language}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Which frameworks or libraries do you use?</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "React",
                          "Angular",
                          "Vue",
                          "Next.js",
                          "Express",
                          "Django",
                          "Flask",
                          "Spring",
                          "Laravel",
                          "ASP.NET",
                          "TensorFlow",
                          "Node.js",
                        ].map((framework) => (
                          <div
                            key={framework}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={framework.toLowerCase().replace(".", "")}
                              checked={formData.frameworks?.includes(framework)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "frameworks",
                                  framework,
                                  checked
                                )
                              }
                              className="text-[#7657ff] border-[#7657ff]/50"
                            />
                            <Label
                              htmlFor={framework.toLowerCase().replace(".", "")}
                            >
                              {framework}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="otherTech">Other Technical Skills</Label>
                      <Textarea
                        id="otherTech"
                        name="otherTech"
                        value={formData.otherTech}
                        onChange={handleInputChange}
                        placeholder="List any other technical skills not mentioned above"
                        className="border-[#7657ff]/30 focus-visible:ring-[#7657ff]"
                      />
                    </div>
                  </>
                )}

                {/* Step 4: Job Preferences */}
                {currentStep === 3 && (
                  <>
                    <div className="space-y-3">
                      <Label>What type of job are you looking for?</Label>
                      <RadioGroup
                        value={formData.jobPreference}
                        onValueChange={(value) =>
                          setFormData({ ...formData, jobPreference: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="full-time" id="full-time" />
                          <Label htmlFor="full-time">Full-time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="part-time" id="part-time" />
                          <Label htmlFor="part-time">Part-time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="contract" id="contract" />
                          <Label htmlFor="contract">Contract</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="freelance" id="freelance" />
                          <Label htmlFor="freelance">Freelance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="internship" id="internship" />
                          <Label htmlFor="internship">Internship</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="availability">
                        When are you available to start?
                      </Label>
                      <Select
                        value={formData.availability}
                        onValueChange={(value) =>
                          setFormData({ ...formData, availability: value })
                        }
                      >
                        <SelectTrigger className="border-[#7657ff]/30 focus:ring-[#7657ff]">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediately">
                            Immediately
                          </SelectItem>
                          <SelectItem value="2-weeks">
                            2 weeks notice
                          </SelectItem>
                          <SelectItem value="1-month">1 month</SelectItem>
                          <SelectItem value="3-months">3+ months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="salaryExpectation">
                        Salary Expectation (Annual)
                      </Label>
                      <Input
                        id="salaryExpectation"
                        name="salaryExpectation"
                        value={formData.salaryExpectation}
                        onChange={handleInputChange}
                        placeholder="e.g. $80,000"
                        className="border-[#7657ff]/30 focus-visible:ring-[#7657ff]"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="relocation"
                        checked={formData.relocation}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, relocation: checked })
                        }
                        className="text-[#7657ff] border-[#7657ff]/50"
                      />
                      <Label htmlFor="relocation">
                        I am willing to relocate for the right opportunity
                      </Label>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="aboutYou">
                        Tell us a bit more about yourself
                      </Label>
                      <Textarea
                        id="aboutYou"
                        name="aboutYou"
                        value={formData.aboutYou}
                        onChange={handleInputChange}
                        placeholder="Share a brief summary about yourself, your career goals, and what you're looking for"
                        className="border-[#7657ff]/30 focus-visible:ring-[#7657ff]"
                        rows={4}
                      />
                    </div>
                  </>
                )}

                {/* Step 5: Projects & Portfolio */}
                {currentStep === 4 && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Add Your Projects</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addProjectLink}
                          className="text-[#7657ff] border-[#7657ff]/30 hover:bg-[#7657ff]/5 hover:border-[#7657ff]/50"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add More
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {projectLinks.map((project, index) => (
                          <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg space-y-4 relative"
                          >
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProjectLink(index)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}

                            <div className="space-y-2">
                              <Label htmlFor={`project-title-${index}`}>
                                Project Title
                              </Label>
                              <Input
                                id={`project-title-${index}`}
                                value={project.title}
                                onChange={(e) =>
                                  handleProjectChange(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. E-commerce Website"
                                className="border-[#7657ff]/30 focus-visible:ring-[#7657ff]"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`project-url-${index}`}>
                                Project URL
                              </Label>
                              <div className="flex">
                                <div className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0 border-gray-200">
                                  {project.url.includes("github.com") ? (
                                    <Github className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <Globe className="h-4 w-4 text-gray-500" />
                                  )}
                                </div>
                                <Input
                                  id={`project-url-${index}`}
                                  value={project.url}
                                  onChange={(e) =>
                                    handleProjectChange(
                                      index,
                                      "url",
                                      e.target.value
                                    )
                                  }
                                  placeholder="https://github.com/yourusername/project"
                                  className="rounded-l-none border-[#7657ff]/30 focus-visible:ring-[#7657ff]"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`project-description-${index}`}>
                                Project Description
                              </Label>
                              <Textarea
                                id={`project-description-${index}`}
                                value={project.description}
                                onChange={(e) =>
                                  handleProjectChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Briefly describe this project, technologies used, and your role"
                                className="border-[#7657ff]/30 focus-visible:ring-[#7657ff]"
                                rows={3}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>

              <CardFooter className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-[#7657ff]/30 hover:bg-[#7657ff]/5 hover:border-[#7657ff]/50"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#7657ff] hover:bg-[#7657ff]/90"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleFinish}
                    className="bg-gradient-to-r from-[#7657ff] to-[#322372] hover:from-[#322372] hover:to-[#7657ff]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Finish
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
