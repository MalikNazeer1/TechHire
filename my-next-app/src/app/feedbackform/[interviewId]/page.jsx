"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
/**
 * Dynamic Technical Interview Form Component
 *
 * This component allows interviewers to input assessment details for candidates,
 * dynamically loading skills from JobDescription and interview data from Interview table.
 * Enhanced with predefined rating options for each skill category.
 */
export default function InterviewForm() {
  const params = useParams();
  const interviewId = params.interviewId;

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jobDescription, setJobDescription] = useState(null);
  const [interview, setInterview] = useState(null);
  const [formData, setFormData] = useState({
    interviewId: interviewId,
    candidateInfo: {
      name: "",
      position: "",
      interviewerCredentials: "",
      interviewDate: "",
      interviewerDecision: "NO", // Default value
      totalTimeSpent: "",
      roundName: "",
    },
    ratings: {},
    questionsAsked: [
      "Started with Brief anonymous Introduction and Coding environment walk-through.",
    ],
    evaluations: [],
  });

  // Rating options by skill category
  const ratingOptionsBySkill = {
    // HTML/CSS rating options
    html_css: [
      "Strong command of HTML/CSS fundamentals with extensive practical experience. Demonstrates proper usage of semantic HTML and CSS best practices.",
      "Good understanding of HTML/CSS fundamentals with adequate practical experience. May require occasional guidance for complex implementations.",
      "Basic theoretical knowledge of HTML/CSS but limited practical experience. Requires significant guidance for implementation.",
      "Insufficient knowledge of HTML/CSS fundamentals for the position requirements.",
    ],
    // JavaScript rating options
    javascript: [
      "Advanced knowledge of JavaScript including ES6+ features. Demonstrates strong understanding of asynchronous programming, closures, and design patterns with relevant practical examples.",
      "Solid knowledge of JavaScript fundamentals with some understanding of modern features. Can implement practical solutions with occasional guidance.",
      "Basic theoretical knowledge of JavaScript but struggles with practical implementation. Limited understanding of advanced concepts.",
      "Insufficient knowledge of JavaScript fundamentals for the position requirements.",
    ],
    // TypeScript rating options
    typescript: [
      "Extensive knowledge of TypeScript including advanced typing, generics, and utility types. Consistently applies best practices for type safety.",
      "Good understanding of TypeScript fundamentals and commonly used features. Creates proper interfaces and uses type annotations appropriately.",
      "Basic knowledge of TypeScript with limited experience in practical implementation. Needs guidance for proper type definitions.",
      "Minimal understanding of TypeScript concepts and benefits. Struggles with basic type annotations.",
    ],
    // React Core rating options
    react: [
      "Strong knowledge of React core concepts and knows practical application of most of them.",
      "Good knowledge of React core concepts and knows practical application of some of them after giving some hints.",
      "Only theoretical knowledge of some of the react core concepts with no practical exposure.",
      "No knowledge of React core concepts.",
    ],
    // React Advanced rating options
    react_advanced: [
      "Strong knowledge of concepts like portals, fragments & other concepts with good practical examples.",
      "Good knowledge of concepts like portals, fragments & other concepts with good practical examples after some hand-holding.",
      "Only theoretical knowledge of concepts like portals & other concepts but no practical experience.",
      "No knowledge of portals or fragments.",
    ],
    // Angular rating options
    angular: [
      "Expert in Angular framework with deep understanding of reactivity, services, and dependency injection. Implements advanced patterns and optimizations.",
      "Solid understanding of Angular core concepts and structure. Can create robust applications with appropriate architecture.",
      "Basic familiarity with Angular components and templates but limited experience with advanced features.",
      "Minimal knowledge of Angular framework fundamentals.",
    ],
    // Vue rating options
    vue: [
      "Expert in Vue.js with strong understanding of reactivity, composition API, and advanced patterns. Creates optimized component structures.",
      "Solid understanding of Vue.js core concepts. Can implement components, directives, and understands the Vue lifecycle.",
      "Basic familiarity with Vue.js syntax and component structure but limited practical experience.",
      "Minimal knowledge of Vue.js framework fundamentals.",
    ],
    // Node.js rating options
    node: [
      "Expert in Node.js with deep understanding of event loop, streams, and async patterns. Creates scalable server architectures.",
      "Solid understanding of Node.js core concepts and common modules. Can build robust server applications.",
      "Basic familiarity with Node.js but limited understanding of core concepts and practical applications.",
      "Minimal knowledge of Node.js fundamentals.",
    ],
    // Data Structure & Algorithms
    dsa: [
      "Expert in algorithm design and optimization. Demonstrates excellent problem-solving skills with optimal solutions.",
      "Good understanding of common data structures and algorithms. Can analyze time/space complexity and optimize solutions.",
      "Basic understanding of fundamental data structures but struggles with complex algorithm design.",
      "Limited knowledge of data structures and algorithms. Has difficulty solving even basic problems.",
    ],
    // System Design
    system_design: [
      "Expert in architectural patterns and system design principles. Creates scalable, maintainable solutions considering all factors.",
      "Good understanding of system components and how they interact. Can design solutions for moderately complex problems.",
      "Basic understanding of system components but struggles with designing complete, scalable solutions.",
      "Limited knowledge of system design principles. Has difficulty breaking down problems into components.",
    ],
    // Machine Coding
    machine_coding: [
      "Excellent at translating requirements into well-structured, maintainable code with proper patterns and best practices.",
      "Good at implementing requirements with clean code organization. Considers edge cases and error handling.",
      "Can implement basic functionality but struggles with structure, patterns, and comprehensive solutions.",
      "Difficulty in translating requirements into working code. Code lacks organization and robustness.",
    ],
    // Default rating options for any other skill
    default: [
      "Demonstrates expert-level knowledge and practical application of concepts. Shows deep understanding of best practices.",
      "Shows solid understanding of core concepts with good practical experience. Can implement solutions with minimal guidance.",
      "Has basic theoretical knowledge but limited practical experience. Requires guidance for implementation.",
      "Insufficient knowledge and experience for the position requirements.",
    ],
  };

  // Fetch interview data, job description data, and existing feedback if available
  useEffect(() => {
    if (interviewId) {
      fetchData();
    }
  }, [interviewId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch the interview data
      const interviewResponse = await fetch(
        `/api/interviews/details?id=${interviewId}`
      );

      if (!interviewResponse.ok) {
        throw new Error("Failed to fetch interview data");
      }

      const interviewData = await interviewResponse.json();
      setInterview(interviewData);

      // Fetch job description data to get skills and questions
      if (interviewData.jobId) {
        const jobDescResponse = await fetch(
          `/api/company/jobDescriptions?id=${interviewData.jobId}`
        );

        if (!jobDescResponse.ok) {
          throw new Error("Failed to fetch job description data");
        }

        const jobDescData = await jobDescResponse.json();
        setJobDescription(jobDescData);

        // Initialize the form with skills from job description
        initializeFormWithSkills(jobDescData, interviewData);
      }

      // // Check if there's existing feedback for this interview
      // const feedbackResponse = await fetch(`/api/interviews?id=${interviewId}`);

      // if (feedbackResponse.ok) {
      //   const feedbackData = await feedbackResponse.json();

      //   if (feedbackData && Object.keys(feedbackData).length > 0) {
      //     populateFormWithFeedback(feedbackData, interviewData);
      //   }
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get rating options for a specific skill
  const getRatingOptionsForSkill = (skill) => {
    // Normalize skill name to match keys in ratingOptionsBySkill
    const normalizedSkill = normalizeSkillName(skill);

    // Map common skill names to our defined keys
    let skillKey = normalizedSkill;

    if (normalizedSkill.includes("html") || normalizedSkill.includes("css")) {
      skillKey = "html_css";
    } else if (
      normalizedSkill.includes("react") &&
      (normalizedSkill.includes("advanced") ||
        normalizedSkill.includes("portal") ||
        normalizedSkill.includes("fragment"))
    ) {
      skillKey = "react_advanced";
    } else if (normalizedSkill.includes("react")) {
      skillKey = "react";
    } else if (normalizedSkill.includes("javascript")) {
      skillKey = "javascript";
    } else if (normalizedSkill.includes("typescript")) {
      skillKey = "typescript";
    } else if (normalizedSkill.includes("angular")) {
      skillKey = "angular";
    } else if (normalizedSkill.includes("vue")) {
      skillKey = "vue";
    } else if (normalizedSkill.includes("node")) {
      skillKey = "node";
    } else if (
      normalizedSkill.includes("dsa") ||
      normalizedSkill.includes("data_structure") ||
      normalizedSkill.includes("algorithm")
    ) {
      skillKey = "dsa";
    } else if (normalizedSkill.includes("system_design")) {
      skillKey = "system_design";
    } else if (normalizedSkill.includes("machine_coding")) {
      skillKey = "machine_coding";
    }

    // Return the appropriate rating options or default if not found
    return ratingOptionsBySkill[skillKey] || ratingOptionsBySkill.default;
  };

  // Initialize form with skills from job description
  const initializeFormWithSkills = (jobDesc, interviewData) => {
    // Extract skills from job description
    const skills = jobDesc.skills;
    const skillsArray = Array.isArray(skills) ? skills : Object.keys(skills);

    // Initialize ratings object with all skills set to 5 (default)
    const initialRatings = {};
    skillsArray.forEach((skill) => {
      initialRatings[normalizeSkillName(skill)] = 5;
    });

    // Initialize questions sections based on skill categories
    const initialQuestions = [
      "Started with Brief anonymous Introduction and Coding environment walk-through.",
    ];

    skillsArray.forEach((skill) => {
      initialQuestions.push({
        section: skill,
        questions: [""],
      });
    });

    // Initialize evaluations based on skill categories
    const initialEvaluations = skillsArray.map((skill) => {
      // Check if it's React and might need subsections
      return {
        section: skill,
        rating: "",
        strengths: "",
        areasOfImprovement: "",
        ratingOptions: getRatingOptionsForSkill(skill),
        selectedRating: null,
      };
    });

    // Get candidate name from interview data
    const candidateName = interviewData.intervieweeEmail.split("@")[0] || ""; // Basic fallback if no name is available

    // Update form data with initialized values
    setFormData({
      interviewId: interviewId,
      candidateInfo: {
        name: candidateName,
        position: jobDesc.title || "",
        interviewerCredentials: "",
        interviewDate: interviewData.scheduledAt || "",
        interviewerDecision: "NO", // Default value
        totalTimeSpent: `${interviewData.durationInMinutes || 45} minutes`,
        roundName: interviewData.status || "",
      },
      ratings: initialRatings,
      questionsAsked: initialQuestions,
      evaluations: initialEvaluations,
    });
  };

  // Populate form with existing feedback data
  const populateFormWithFeedback = (feedbackData, interviewData) => {
    // Transform the detailed assessment to include rating options
    const evaluationsWithOptions = feedbackData.detailedAssessment.map(
      (assessment) => {
        const transformedAssessment =
          transformAssessmentToEvaluation(assessment);

        // Add rating options based on skill
        if (transformedAssessment.subSections) {
          transformedAssessment.subSections.forEach((subsection, index) => {
            const skillType = index === 0 ? "react" : "react_advanced";
            subsection.ratingOptions = getRatingOptionsForSkill(skillType);
            subsection.selectedRating = null; // Will be determined based on score or description
          });
        } else {
          transformedAssessment.ratingOptions = getRatingOptionsForSkill(
            transformedAssessment.section
          );
          transformedAssessment.selectedRating = null; // Will be determined based on score or description
        }

        return transformedAssessment;
      }
    );

    setFormData({
      interviewId: interviewId,
      candidateInfo: {
        ...feedbackData.candidateInfo,
        interviewerDecision: feedbackData.hiringDecision,
      },
      ratings: feedbackData.technicalSkills,
      questionsAsked: [
        "Started with Brief anonymous Introduction and Coding environment walk-through.",
        ...feedbackData.interviewQuestions.map((section) => ({
          section: section.category,
          questions: section.questions.length > 0 ? section.questions : [""],
        })),
      ],
      evaluations: evaluationsWithOptions,
    });
  };

  // Transform a single assessment item to evaluation format
  const transformAssessmentToEvaluation = (assessment) => {
    if (assessment.subsections) {
      // Handle React JS with subsections
      return {
        section: assessment.category,
        subSections: assessment.subsections.map((subsection) => ({
          title: `${subsection.title} (${subsection.score}/10)`,
          strengths: subsection.strengths,
          areasOfImprovement: subsection.areasForImprovement,
          selectedRating: null, // Will be determined based on score or description
        })),
      };
    } else {
      // Handle regular evaluations
      return {
        section: assessment.category,
        rating: assessment.description || `${assessment.score}/10`,
        strengths: assessment.strengths,
        areasOfImprovement: assessment.areasForImprovement,
        selectedRating: null, // Will be determined based on score or description
      };
    }
  };

  // Transform detailedAssessment back to evaluations format
  const transformAssessmentToEvaluations = (detailedAssessment) => {
    return detailedAssessment.map((assessment) =>
      transformAssessmentToEvaluation(assessment)
    );
  };

  // Helper function to normalize skill names for use as object keys
  const normalizeSkillName = (skill) => {
    return skill.replace(/\s+/g, "_").toLowerCase();
  };

  // Handle form input changes for candidateInfo
  const handleCandidateInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      candidateInfo: {
        ...formData.candidateInfo,
        [name]: value,
      },
    });
  };

  // Handle ratings changes
  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      ratings: {
        ...formData.ratings,
        [name]: parseInt(value, 10),
      },
    });
  };

  // Handle radio button selection for regular evaluations
  const handleEvaluationRatingChange = (evalIndex, ratingIndex, ratingText) => {
    const updatedEvaluations = [...formData.evaluations];
    updatedEvaluations[evalIndex].selectedRating = ratingIndex;

    // You can also store the rating text
    updatedEvaluations[evalIndex].ratingDescription = ratingText;

    setFormData({
      ...formData,
      evaluations: updatedEvaluations,
    });
  };

  // Handle radio button selection for subsection evaluations
  const handleSubsectionRatingChange = (
    evalIndex,
    subIndex,
    ratingIndex,
    ratingText
  ) => {
    const updatedEvaluations = [...formData.evaluations];
    updatedEvaluations[evalIndex].subSections[subIndex].selectedRating =
      ratingIndex;

    // You can also store the rating text if needed
    updatedEvaluations[evalIndex].subSections[subIndex].ratingDescription =
      ratingText;

    setFormData({
      ...formData,
      evaluations: updatedEvaluations,
    });
  };

  // Handle changes to questions
  const handleQuestionChange = (sectionIndex, questionIndex, value) => {
    const updatedQuestions = [...formData.questionsAsked];

    // Handle the introduction section separately (it's a string, not an object)
    if (sectionIndex === 0) {
      updatedQuestions[0] = value;
    } else {
      // For other sections, update the specific question
      updatedQuestions[sectionIndex].questions[questionIndex] = value;
    }

    setFormData({
      ...formData,
      questionsAsked: updatedQuestions,
    });
  };

  // Add a new question to a section
  const addQuestion = (sectionIndex) => {
    if (sectionIndex === 0) return; // Can't add questions to intro section

    const updatedQuestions = [...formData.questionsAsked];
    updatedQuestions[sectionIndex].questions.push("");

    setFormData({
      ...formData,
      questionsAsked: updatedQuestions,
    });
  };

  // Remove a question from a section
  const removeQuestion = (sectionIndex, questionIndex) => {
    if (sectionIndex === 0) return; // Can't remove from intro section

    const updatedQuestions = [...formData.questionsAsked];
    updatedQuestions[sectionIndex].questions.splice(questionIndex, 1);

    // Always keep at least one question field
    if (updatedQuestions[sectionIndex].questions.length === 0) {
      updatedQuestions[sectionIndex].questions.push("");
    }

    setFormData({
      ...formData,
      questionsAsked: updatedQuestions,
    });
  };

  // Handle changes to evaluations
  const handleEvaluationChange = (evalIndex, field, value) => {
    const updatedEvaluations = [...formData.evaluations];
    updatedEvaluations[evalIndex][field] = value;

    setFormData({
      ...formData,
      evaluations: updatedEvaluations,
    });
  };

  // Handle changes to React subsections
  const handleSubsectionChange = (evalIndex, subIndex, field, value) => {
    const updatedEvaluations = [...formData.evaluations];
    updatedEvaluations[evalIndex].subSections[subIndex][field] = value;

    setFormData({
      ...formData,
      evaluations: updatedEvaluations,
    });
  };

  // Format ratings for display in the report
  const formatRating = (section, rating) => {
    return `${section} (${rating}/10)`;
  };

  // Update formatted ratings before submission
  const updateFormattedRatings = () => {
    const updated = { ...formData };

    // Update each evaluation's rating
    updated.evaluations.forEach((evaluation, index) => {
      if (evaluation.subSections) {
        // Handle evaluations with subsections (like React)
        evaluation.subSections.forEach((subsection, subIndex) => {
          // Extract skill name from section title
          const skillKey = normalizeSkillName(
            evaluation.section + (subIndex === 0 ? "_main" : "_advanced")
          );
          const rating = formData.ratings[skillKey] || 5;

          subsection.title = formatRating(
            subsection.title.replace(/\s\(\d+\/10\).*$/, ""),
            rating
          );
        });
      } else {
        // Handle regular evaluations
        const skillKey = normalizeSkillName(evaluation.section);
        const rating = formData.ratings[skillKey] || 5;

        evaluation.rating = formatRating(evaluation.section, rating);
      }
    });

    return updated;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format ratings before submission
      const formattedData = updateFormattedRatings();
      console.log("Formatted Data:", formattedData);
      // Send data to API
      const response = await fetch("/api/interviews/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error("Failed to save interview data");
      }

      const result = await response.json();

      // Show success and redirect
      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save interview data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render rating options based on the rating value
  const getRatingText = (rating) => {
    if (rating >= 8) return "Strong yes";
    if (rating >= 6) return "Yes";
    if (rating >= 4) return "No";
    return "Strong no";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <p className="text-lg">Loading interview data...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-6 text-green-800">
            Assessment Submitted Successfully!
          </h1>
          <p className="text-lg">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">
        Technical Interview Assessment Form
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Candidate Information Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Candidate Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.candidateInfo.name}
                onChange={handleCandidateInfoChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                name="position"
                value={formData.candidateInfo.position}
                onChange={handleCandidateInfoChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interviewer
              </label>
              <input
                type="text"
                name="interviewerCredentials"
                value={formData.candidateInfo.interviewerCredentials}
                onChange={handleCandidateInfoChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Date & Time
              </label>
              <input
                type="datetime-local"
                name="interviewDate"
                value={formData.candidateInfo.interviewDate}
                onChange={handleCandidateInfoChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Time Spent
              </label>
              <input
                type="text"
                name="totalTimeSpent"
                value={formData.candidateInfo.totalTimeSpent}
                onChange={handleCandidateInfoChange}
                placeholder="e.g. 45 minutes"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Round
              </label>
              <input
                type="text"
                name="roundName"
                value={formData.candidateInfo.roundName}
                onChange={handleCandidateInfoChange}
                placeholder="e.g. Technical Round 1"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Final Decision
            </label>
            <select
              name="interviewerDecision"
              value={formData.candidateInfo.interviewerDecision}
              onChange={handleCandidateInfoChange}
              className="w-full p-2 border rounded-md bg-white"
              required
            >
              <option value="STRONG_YES">Strong yes</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
              <option value="STRONG_NO">Strong no</option>
            </select>
          </div>
        </section>

        {/* Technical Skills Assessment Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Technical Skills Assessment
          </h2>

          <div className="space-y-6">
            {/* Dynamically render skill ratings based on available skills */}
            {Object.entries(formData.ratings).map(([skillKey, rating]) => {
              // Format the skill name for display
              const displayName = skillKey
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());

              return (
                <div className="rating-group" key={skillKey}>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {displayName}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="radio-option">
                        <input
                          type="radio"
                          id={`${skillKey}-strong-no`}
                          name={skillKey}
                          value="2"
                          checked={rating <= 3}
                          onChange={handleRatingChange}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`${skillKey}-strong-no`}
                          className="text-sm"
                        >
                          Strong No (1-3)
                        </label>
                      </div>
                      <div className="radio-option">
                        <input
                          type="radio"
                          id={`${skillKey}-no`}
                          name={skillKey}
                          value="4"
                          checked={rating >= 4 && rating <= 5}
                          onChange={handleRatingChange}
                          className="mr-2"
                        />
                        <label htmlFor={`${skillKey}-no`} className="text-sm">
                          No (4-5)
                        </label>
                      </div>
                      <div className="radio-option">
                        <input
                          type="radio"
                          id={`${skillKey}-yes`}
                          name={skillKey}
                          value="6"
                          checked={rating >= 6 && rating <= 7}
                          onChange={handleRatingChange}
                          className="mr-2"
                        />
                        <label htmlFor={`${skillKey}-yes`} className="text-sm">
                          Yes (6-7)
                        </label>
                      </div>
                      <div className="radio-option">
                        <input
                          type="radio"
                          id={`${skillKey}-strong-yes`}
                          name={skillKey}
                          value="9"
                          checked={rating >= 8}
                          onChange={handleRatingChange}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`${skillKey}-strong-yes`}
                          className="text-sm"
                        >
                          Strong Yes (8-10)
                        </label>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        Current: {rating}/10 - {getRatingText(rating)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Questions Asked Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Interview Questions
          </h2>

          <div className="space-y-6">
            {/* Introduction field */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Introduction
              </label>
              <input
                type="text"
                value={formData.questionsAsked[0]}
                onChange={(e) => handleQuestionChange(0, 0, e.target.value)}
                placeholder="Brief introduction and setup details"
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Dynamic question sections */}
            {formData.questionsAsked.slice(1).map((section, sectionIndex) => {
              // Convert to actual index in the array (adding 1 since we skip the intro)
              const actualSectionIndex = sectionIndex + 1;

              return (
                <div key={actualSectionIndex} className="p-4 border rounded-md">
                  <h3 className="font-medium text-gray-800 mb-3">
                    {section.section}
                  </h3>

                  {/* Questions Asked Section - Continues from where the file cuts off */}
                  {section.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) =>
                          handleQuestionChange(
                            actualSectionIndex,
                            questionIndex,
                            e.target.value
                          )
                        }
                        placeholder="Enter question asked"
                        className="flex-grow p-2 border rounded-md mr-2"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeQuestion(actualSectionIndex, questionIndex)
                        }
                        className="text-red-500 hover:text-red-700"
                        title="Remove question"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addQuestion(actualSectionIndex)}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Question
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Detailed Assessment Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Detailed Assessment
          </h2>

          <div className="space-y-8">
            {formData.evaluations.map((evaluation, evalIndex) => (
              <div key={evalIndex} className="p-4 border rounded-md">
                <h3 className="font-medium text-gray-800 mb-3">
                  {evaluation.section}
                </h3>

                {/* For React with subsections */}
                {evaluation.subSections ? (
                  evaluation.subSections.map((subsection, subIndex) => (
                    <div
                      key={subIndex}
                      className="mb-6 pl-4 border-l-2 border-blue-200"
                    >
                      <h4 className="font-medium mb-2">{subsection.title}</h4>

                      {/* Rating options as radio buttons */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Rating Assessment:
                        </label>
                        <div className="space-y-2 mt-2">
                          {subsection.ratingOptions.map(
                            (option, ratingIndex) => (
                              <div
                                key={ratingIndex}
                                className="flex items-start"
                              >
                                <input
                                  type="radio"
                                  id={`subsection-${evalIndex}-${subIndex}-rating-${ratingIndex}`}
                                  name={`subsection-${evalIndex}-${subIndex}-rating`}
                                  checked={
                                    subsection.selectedRating === ratingIndex
                                  }
                                  onChange={() =>
                                    handleSubsectionRatingChange(
                                      evalIndex,
                                      subIndex,
                                      ratingIndex,
                                      option
                                    )
                                  }
                                  className="mt-1 mr-2"
                                />
                                <label
                                  htmlFor={`subsection-${evalIndex}-${subIndex}-rating-${ratingIndex}`}
                                  className="text-sm text-gray-700"
                                >
                                  {option}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Strengths
                        </label>
                        <textarea
                          value={subsection.strengths}
                          onChange={(e) =>
                            handleSubsectionChange(
                              evalIndex,
                              subIndex,
                              "strengths",
                              e.target.value
                            )
                          }
                          rows={3}
                          className="w-full p-2 border rounded-md"
                          placeholder="Candidate's strengths in this area"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Areas of Improvement
                        </label>
                        <textarea
                          value={subsection.areasOfImprovement}
                          onChange={(e) =>
                            handleSubsectionChange(
                              evalIndex,
                              subIndex,
                              "areasOfImprovement",
                              e.target.value
                            )
                          }
                          rows={3}
                          className="w-full p-2 border rounded-md"
                          placeholder="Areas where candidate can improve"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  /* For regular evaluations */
                  <>
                    {/* Rating options as radio buttons */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Rating Assessment:
                      </label>
                      <div className="space-y-2 mt-2">
                        {evaluation.ratingOptions.map((option, ratingIndex) => (
                          <div key={ratingIndex} className="flex items-start">
                            <input
                              type="radio"
                              id={`eval-${evalIndex}-rating-${ratingIndex}`}
                              name={`eval-${evalIndex}-rating`}
                              checked={
                                evaluation.selectedRating === ratingIndex
                              }
                              onChange={() =>
                                handleEvaluationRatingChange(
                                  evalIndex,
                                  ratingIndex,
                                  option
                                )
                              }
                              className="mt-1 mr-2"
                            />
                            <label
                              htmlFor={`eval-${evalIndex}-rating-${ratingIndex}`}
                              className="text-sm text-gray-700"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Strengths
                      </label>
                      <textarea
                        value={evaluation.strengths}
                        onChange={(e) =>
                          handleEvaluationChange(
                            evalIndex,
                            "strengths",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full p-2 border rounded-md"
                        placeholder="Candidate's strengths in this area"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Areas of Improvement
                      </label>
                      <textarea
                        value={evaluation.areasOfImprovement}
                        onChange={(e) =>
                          handleEvaluationChange(
                            evalIndex,
                            "areasOfImprovement",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full p-2 border rounded-md"
                        placeholder="Areas where candidate can improve"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md text-white font-medium 
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSubmitting ? "Submitting..." : "Generate Assessment Report"}
          </button>
        </div>
      </form>
    </div>
  );
}
