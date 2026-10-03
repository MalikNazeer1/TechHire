"use client";

import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Plus,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import CandidateUpload from "./CandidateUpload";

// Define types for rubrics
interface RubricTopic {
  id: string;
  name: string;
  description: string;
}

interface RubricCategory {
  id: string;
  name: string;
  topics: RubricTopic[];
}

// Define a mapping of profile to rubrics
export const profileRubrics: Record<string, RubricCategory[]> = {
  javascript: [
    {
      id: "javascript",
      name: "JavaScript",
      topics: [
        {
          id: "async",
          name: "Asynchronous programming",
          description:
            "Promises, Async/await, Callbacks, Observables, Generators etc.",
        },
        {
          id: "redux",
          name: "Redux",
          description: "Understanding of Redux Fundamentals",
        },
        {
          id: "browser",
          name: "Browser, Documents, Events and Interfaces",
          description:
            "Browser APIs, Events & event loops, DOM manipulation & tree, Forms",
        },
        {
          id: "fundamentals",
          name: "JavaScript fundamentals",
          description:
            "Operators, Objects, Data types, Advanced working with functions, Variable scope, Closures, Hoisting, ES7/ES8 etc.",
        },
      ],
    },
  ],
  react: [
    {
      id: "react",
      name: "React",
      topics: [
        {
          id: "react-hooks",
          name: "React Hooks",
          description:
            "useState, useEffect, useContext, useReducer, custom hooks",
        },
        {
          id: "state-management",
          name: "State Management",
          description: "Redux, Context API, Zustand, Recoil, etc.",
        },
        {
          id: "react-router",
          name: "React Router",
          description:
            "Navigation, Route params, Nested routes, Protected routes",
        },
        {
          id: "react-performance",
          name: "Performance Optimization",
          description: "Memo, useMemo, useCallback, React.lazy, code splitting",
        },
      ],
    },
  ],
  typescript: [
    {
      id: "typescript",
      name: "TypeScript",
      topics: [
        {
          id: "ts-types",
          name: "Type System",
          description:
            "Basic types, Interfaces, Type Aliases, Union types, Generics",
        },
        {
          id: "ts-advanced",
          name: "Advanced Types",
          description:
            "Conditional types, Mapped types, Utility types, Type guards",
        },
        {
          id: "ts-config",
          name: "Configuration & Tooling",
          description:
            "tsconfig.json, Compiler options, Integration with build tools",
        },
        {
          id: "ts-patterns",
          name: "TypeScript Patterns",
          description:
            "OOP in TypeScript, Decorators, Design patterns with types",
        },
      ],
    },
  ],
  node: [
    {
      id: "node",
      name: "Node.js",
      topics: [
        {
          id: "node-core",
          name: "Node.js Fundamentals",
          description: "Event loop, Streams, Buffers, File system, Modules",
        },
        {
          id: "express",
          name: "Express.js",
          description: "Routing, Middleware, Error handling, REST API design",
        },
        {
          id: "node-database",
          name: "Database Integration",
          description:
            "MongoDB, SQL databases, ORMs like Mongoose or Sequelize",
        },
        {
          id: "node-security",
          name: "Security Best Practices",
          description: "Authentication, Authorization, Input validation, CORS",
        },
      ],
    },
  ],
  python: [
    {
      id: "python",
      name: "Python",
      topics: [
        {
          id: "python-core",
          name: "Python Fundamentals",
          description:
            "Data structures, List comprehensions, Generators, Decorators",
        },
        {
          id: "python-oop",
          name: "Object-Oriented Python",
          description: "Classes, Inheritance, Magic methods, Properties",
        },
        {
          id: "python-modules",
          name: "Standard Library",
          description:
            "Collections, Itertools, Datetime, JSON, Regular expressions",
        },
        {
          id: "python-advanced",
          name: "Advanced Python",
          description:
            "Concurrency, Context managers, Metaclasses, Descriptors",
        },
      ],
    },
  ],
  java: [
    {
      id: "java",
      name: "Java",
      topics: [
        {
          id: "java-core",
          name: "Core Java",
          description:
            "OOP principles, Collections, Generics, Exception handling",
        },
        {
          id: "java-concurrency",
          name: "Concurrency",
          description: "Threads, Executors, CompletableFuture, Synchronization",
        },
        {
          id: "java-spring",
          name: "Spring Framework",
          description:
            "Spring Boot, Spring MVC, Spring Data, Dependency Injection",
        },
        {
          id: "java-testing",
          name: "Testing",
          description: "JUnit, Mockito, TestNG, Integration testing",
        },
      ],
    },
  ],
  kubernetes: [
    {
      id: "kubernetes",
      name: "Kubernetes",
      topics: [
        {
          id: "k8s-core",
          name: "Core Concepts",
          description: "Pods, Services, Deployments, ConfigMaps, Secrets",
        },
        {
          id: "k8s-networking",
          name: "Networking",
          description: "Service discovery, Ingress, Network policies",
        },
        {
          id: "k8s-security",
          name: "Security",
          description: "RBAC, Security contexts, Pod security policies",
        },
        {
          id: "k8s-operators",
          name: "Operators & CRDs",
          description: "Custom Resource Definitions, Operator pattern",
        },
      ],
    },
  ],
  default: [
    {
      id: "general",
      name: "General Assessment",
      topics: [
        {
          id: "problem-solving",
          name: "Problem Solving",
          description: "Analytical thinking, Algorithms, Data structures",
        },
        {
          id: "system-design",
          name: "System Design",
          description:
            "Architecture patterns, Scalability, Performance considerations",
        },
        {
          id: "communication",
          name: "Communication Skills",
          description:
            "Technical communication, Documentation, Team collaboration",
        },
        {
          id: "best-practices",
          name: "Best Practices",
          description: "Code quality, Testing strategies, Code reviews",
        },
      ],
    },
  ],
};

interface Candidate {
  name: string;
  phoneNumber: string;
  experienceInYears: number;
  email: string;
  resumeLink?: string;
  availability?: string;
}

interface CustomizeInterviewProps {
  onBack: () => void;
  selectedRubrics: string[];
  setSelectedRubrics: (rubrics: string[]) => void;
  selectedSeniority: string | null;
  selectedSkills: string[];
  selectedProfile: string | null; // Added prop for selectedProfile
  onSubmit: (candidates: Candidate[]) => void;
  isSubmitting: boolean;
}

export default function CustomizeInterview({
  onBack,
  selectedRubrics,
  setSelectedRubrics,
  selectedSeniority,
  selectedSkills,
  selectedProfile, // Received prop for selectedProfile
  onSubmit,
  isSubmitting,
}: CustomizeInterviewProps) {
  const [duration, setDuration] = useState("1 hr");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Custom rubrics state
  const [customRubrics, setCustomRubrics] = useState<RubricCategory[]>([
    {
      id: "custom",
      name: "Custom Rubrics",
      topics: [],
    },
  ]);
  const [showAddRubric, setShowAddRubric] = useState(false);
  const [newRubricName, setNewRubricName] = useState("");
  const [newRubricDescription, setNewRubricDescription] = useState("");

  // Select rubrics based on the selected skills, fallback to default if not found
  const predefinedRubrics =
    selectedSkills && selectedSkills.length > 0
      ? selectedSkills.flatMap((skill) =>
          profileRubrics[skill] ? profileRubrics[skill] : profileRubrics.default
        )
      : profileRubrics.default;

  // Combine predefined rubrics with custom rubrics
  const rubrics = [
    ...predefinedRubrics,
    ...customRubrics.filter((category) => category.topics.length > 0),
  ];

  // For displaying the profile name (capitalize first letter)
  const getProfileDisplayName = () => {
    if (!selectedProfile) return "Frontend"; // Default fallback
    return selectedProfile.charAt(0).toUpperCase() + selectedProfile.slice(1);
  };

  const toggleRubric = (rubricId: string) => {
    if (selectedRubrics.includes(rubricId)) {
      setSelectedRubrics(selectedRubrics.filter((id) => id !== rubricId));
    } else {
      setSelectedRubrics([...selectedRubrics, rubricId]);
    }
  };

  // Add a new custom rubric
  const addCustomRubric = () => {
    if (!newRubricName.trim()) return;

    const newId = `custom-${Date.now()}`;
    const updatedCustomRubrics = [...customRubrics];

    // Add to the first custom category
    updatedCustomRubrics[0].topics.push({
      id: newRubricName,
      name: newRubricName,
      description: newRubricDescription || "Custom rubric",
    });

    setCustomRubrics(updatedCustomRubrics);
    setNewRubricName("");
    setNewRubricDescription("");
    setShowAddRubric(false);

    // Automatically select the new rubric
    setSelectedRubrics([...selectedRubrics, newRubricName]);
  };

  // Remove a custom rubric
  const removeCustomRubric = (rubricId: string) => {
    const updatedCustomRubrics = customRubrics.map((category) => ({
      ...category,
      topics: category.topics.filter((topic) => topic.id !== rubricId),
    }));

    setCustomRubrics(updatedCustomRubrics);

    // Also remove from selected rubrics if selected
    if (selectedRubrics.includes(rubricId)) {
      setSelectedRubrics(selectedRubrics.filter((id) => id !== rubricId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={onBack}
            >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
            <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Customize Interview</h1>
          <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
                {getProfileDisplayName()}
              </div>
            </div>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Interview Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Profile Info */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Selected Profile</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getProfileDisplayName()}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300">
                    {selectedSeniority}
                  </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                </Button>
              </div>
            </div>

            {/* Duration Selection */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Interview Duration</h3>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                    className="bg-transparent border-0 text-lg font-semibold text-gray-900 dark:text-white focus:ring-0"
                >
                  <option>30 min</option>
                  <option>1 hr</option>
                  <option>1.5 hr</option>
                  <option>2 hr</option>
                </select>
              </div>
            </div>
                </div>
              </div>

            {/* Submit Button */}
          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {uploadComplete ? (
                <span className="text-green-600 dark:text-green-400">
                    Candidates uploaded successfully
                  </span>
                ) : (
                  `Selected ${selectedRubrics.length} rubrics`
                )}
              </div>
              <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                disabled={selectedRubrics.length === 0}
                onClick={() => setShowUpload(true)}
              >
              Submit & Add Candidates
              </Button>
            </div>
          </div>

          {/* Right Panel - Rubrics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Must Have Rubrics</h3>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => setShowAddRubric(true)}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Custom
              </Button>
            </div>

            {/* Add Custom Rubric Form */}
            {showAddRubric && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Add Custom Rubric</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                    onClick={() => setShowAddRubric(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rubric Name*
                    </label>
                    <input
                      type="text"
                      value={newRubricName}
                      onChange={(e) => setNewRubricName(e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., System Architecture"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newRubricDescription}
                      onChange={(e) => setNewRubricDescription(e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Distributed systems, microservices, etc."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => setShowAddRubric(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!newRubricName.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={addCustomRubric}
                    >
                      Add Rubric
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Rubrics List */}
            <div className="space-y-4">
            {rubrics.map((category) => (
              <div key={category.id} className="space-y-3">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</span>
                  {category.id === "custom" && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs text-blue-600 dark:text-blue-400">
                      custom
                      </span>
                  )}
                </div>
                {category.topics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedRubrics.includes(topic.id)
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                    }`}
                  >
                      <div 
                        className="flex items-start space-x-3 cursor-pointer"
                        onClick={() => toggleRubric(topic.id)}
                      >
                      <input
                        type="checkbox"
                        checked={selectedRubrics.includes(topic.id)}
                        onChange={() => toggleRubric(topic.id)}
                          className="mt-1 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-grow">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">{topic.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{topic.description}</p>
                      </div>
                      {topic.id.startsWith("custom-") && (
                        <Button
                          variant="ghost"
                          size="sm"
                            className="text-gray-400 hover:text-red-500 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCustomRubric(topic.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {showUpload && <CandidateUpload onComplete={onSubmit} />}
    </div>
  );
}
