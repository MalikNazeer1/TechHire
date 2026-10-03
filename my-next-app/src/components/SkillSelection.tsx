"use client";

import { ArrowLeft, Code, Database, Server, Shield, Cloud, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Define types for the skill item
interface SkillItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Define the type for profile skills structure
interface ProfileSkills {
  skillBased: SkillItem[];
  roundBased: SkillItem[];
  experienceBased: SkillItem[];
}

// Type for the entire profileSkills object
interface ProfileSkillsMap {
  [key: string]: ProfileSkills;
}

// Dynamic skills data based on selected profile
const profileSkills: ProfileSkillsMap = {
  frontend: {
    skillBased: [
      { id: "angular", name: "Angular JS", icon: <Code className="w-6 h-6" /> },
      { id: "react", name: "React JS", icon: <Code className="w-6 h-6" /> },
      { id: "vue", name: "Vue JS", icon: <Code className="w-6 h-6" /> },
      { id: "javascript", name: "JavaScript", icon: <Code className="w-6 h-6" /> },
      { id: "html", name: "HTML/CSS", icon: <Code className="w-6 h-6" /> },
      { id: "typescript", name: "TypeScript", icon: <Code className="w-6 h-6" /> },
    ],
    roundBased: [
      { id: "machine-coding", name: "Machine Coding", icon: <Code className="w-6 h-6" /> },
      { id: "dsa", name: "Data Structure & Algorithms", icon: <Code className="w-6 h-6" /> },
    ],
    experienceBased: [
      { id: "frontend-architect", name: "Frontend Architect", icon: <Code className="w-6 h-6" /> },
    ],
  },

  android: {
    skillBased: [
      { id: "kotlin", name: "Kotlin", icon: <Code className="w-6 h-6" /> },
      { id: "java", name: "Java", icon: <Code className="w-6 h-6" /> },
      { id: "flutter", name: "Flutter", icon: <Code className="w-6 h-6" /> },
      { id: "react-native", name: "React Native", icon: <Code className="w-6 h-6" /> },
      { id: "android-sdk", name: "Android SDK", icon: <Code className="w-6 h-6" /> },
    ],
    roundBased: [
      { id: "mobile-coding", name: "Mobile App Coding", icon: <Code className="w-6 h-6" /> },
      { id: "dsa", name: "Data Structure & Algorithms", icon: <Code className="w-6 h-6" /> },
    ],
    experienceBased: [
      { id: "android-architect", name: "Android Architect", icon: <Code className="w-6 h-6" /> },
      { id: "mobile-ux", name: "Mobile UX", icon: <Code className="w-6 h-6" /> },
    ],
  },

  backend: {
    skillBased: [
      { id: "node", name: "Node.js", icon: <Server className="w-6 h-6" /> },
      { id: "java-spring", name: "Java Spring", icon: <Server className="w-6 h-6" /> },
      { id: "python-django", name: "Python Django", icon: <Server className="w-6 h-6" /> },
      { id: "dotnet", name: ".NET", icon: <Server className="w-6 h-6" /> },
      { id: "golang", name: "Go", icon: <Server className="w-6 h-6" /> },
    ],
    roundBased: [
      { id: "api-design", name: "API Design", icon: <Code className="w-6 h-6" /> },
      { id: "dsa", name: "Data Structure & Algorithms", icon: <Code className="w-6 h-6" /> },
      { id: "system-design", name: "System Design", icon: <Server className="w-6 h-6" /> },
    ],
    experienceBased: [
      { id: "backend-architect", name: "Backend Architect", icon: <Server className="w-6 h-6" /> },
      { id: "database-expert", name: "Database Expert", icon: <Database className="w-6 h-6" /> },
    ],
  },

  "data-science": {
    skillBased: [
      { id: "python", name: "Python", icon: <Code className="w-6 h-6" /> },
      { id: "r", name: "R", icon: <Code className="w-6 h-6" /> },
      { id: "machine-learning", name: "Machine Learning", icon: <Code className="w-6 h-6" /> },
      { id: "sql", name: "SQL", icon: <Database className="w-6 h-6" /> },
      { id: "tableau", name: "Tableau", icon: <Code className="w-6 h-6" /> },
    ],
    roundBased: [
      { id: "data-modeling", name: "Data Modeling", icon: <Database className="w-6 h-6" /> },
      { id: "statistics", name: "Statistics", icon: <Code className="w-6 h-6" /> },
      { id: "case-study", name: "Case Study", icon: <Code className="w-6 h-6" /> },
    ],
    experienceBased: [
      { id: "data-science-lead", name: "Data Science Lead", icon: <Code className="w-6 h-6" /> },
      { id: "ml-engineer", name: "ML Engineer", icon: <Code className="w-6 h-6" /> },
    ],
  },

  "cyber-security": {
    skillBased: [
      { id: "network-security", name: "Network Security", icon: <Shield className="w-6 h-6" /> },
      { id: "penetration-testing", name: "Penetration Testing", icon: <Shield className="w-6 h-6" /> },
      { id: "cryptography", name: "Cryptography", icon: <Shield className="w-6 h-6" /> },
      { id: "security-auditing", name: "Security Auditing", icon: <Shield className="w-6 h-6" /> },
    ],
    roundBased: [
      { id: "vulnerability-assessment", name: "Vulnerability Assessment", icon: <Shield className="w-6 h-6" /> },
      { id: "threat-modeling", name: "Threat Modeling", icon: <Shield className="w-6 h-6" /> },
    ],
    experienceBased: [
      { id: "security-architect", name: "Security Architect", icon: <Shield className="w-6 h-6" /> },
      { id: "ciso", name: "CISO", icon: <Shield className="w-6 h-6" /> },
    ],
  },

  devops: {
    skillBased: [
      { id: "docker", name: "Docker", icon: <Cloud className="w-6 h-6" /> },
      { id: "kubernetes", name: "Kubernetes", icon: <Cloud className="w-6 h-6" /> },
      { id: "aws", name: "AWS", icon: <Cloud className="w-6 h-6" /> },
      { id: "terraform", name: "Terraform", icon: <Cloud className="w-6 h-6" /> },
      { id: "ci-cd", name: "CI/CD", icon: <Cloud className="w-6 h-6" /> },
    ],
    roundBased: [
      { id: "infrastructure-as-code", name: "Infrastructure as Code", icon: <Cloud className="w-6 h-6" /> },
      { id: "system-design", name: "System Design", icon: <Server className="w-6 h-6" /> },
    ],
    experienceBased: [
      { id: "devops-lead", name: "DevOps Lead", icon: <Cloud className="w-6 h-6" /> },
      { id: "platform-engineer", name: "Platform Engineer", icon: <Cloud className="w-6 h-6" /> },
    ],
  },

  ios: {
    skillBased: [
      { id: "swift", name: "Swift", icon: <Smartphone className="w-6 h-6" /> },
      { id: "objective-c", name: "Objective-C", icon: <Smartphone className="w-6 h-6" /> },
      { id: "uikit", name: "UIKit", icon: <Smartphone className="w-6 h-6" /> },
      { id: "swiftui", name: "SwiftUI", icon: <Smartphone className="w-6 h-6" /> },
    ],
    roundBased: [
      { id: "mobile-coding", name: "Mobile App Coding", icon: <Code className="w-6 h-6" /> },
      { id: "dsa", name: "Data Structure & Algorithms", icon: <Code className="w-6 h-6" /> },
    ],
    experienceBased: [
      { id: "ios-architect", name: "iOS Architect", icon: <Smartphone className="w-6 h-6" /> },
      { id: "mobile-ux", name: "Mobile UX", icon: <Smartphone className="w-6 h-6" /> },
    ],
  },

  // Default fallback for any other profile
  default: {
    skillBased: [
      { id: "general-skill", name: "General Skills", icon: <Code className="w-6 h-6" /> },
      { id: "domain-knowledge", name: "Domain Knowledge", icon: <Code className="w-6 h-6" /> },
    ],
    roundBased: [
      { id: "problem-solving", name: "Problem Solving", icon: <Code className="w-6 h-6" /> },
      { id: "dsa", name: "Data Structure & Algorithms", icon: <Code className="w-6 h-6" /> },
    ],
    experienceBased: [
      { id: "leadership", name: "Leadership", icon: <Code className="w-6 h-6" /> },
      { id: "project-management", name: "Project Management", icon: <Code className="w-6 h-6" /> },
    ],
  },
};

// Helper array for profile names - this should match the profileSkills keys
interface ProfileType {
  id: string;
  name: string;
}

const profiles: ProfileType[] = [
  { id: "frontend", name: "Frontend" },
  { id: "android", name: "Android" },
  { id: "backend", name: "Backend" },
  { id: "data-science", name: "Data Science" },
  { id: "cyber-security", name: "Cyber Security" },
  { id: "devops", name: "DevOps" },
  { id: "ios", name: "iOS" },
];

interface SkillSelectionProps {
  onBack: () => void;
  onNext: () => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  selectedProfile: string | null;
}

export default function SkillSelection({
  onBack,
  onNext,
  selectedSkills,
  setSelectedSkills,
  selectedProfile,
}: SkillSelectionProps) {
  const [skills, setSkills] = useState<ProfileSkills>(profileSkills.default);

  useEffect(() => {
    // Set skills based on selected profile or use default if not found
    if (selectedProfile && profileSkills[selectedProfile]) {
      setSkills(profileSkills[selectedProfile]);
    } else {
      setSkills(profileSkills.default);
    }

    // Clear previously selected skills when profile changes
    setSelectedSkills([]);
  }, [selectedProfile, setSelectedSkills]);

  const profileDisplayName = selectedProfile
    ? profiles.find((p) => p.id === selectedProfile)?.name || selectedProfile
    : "Selected Profile";

  const toggleSkill = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {profileDisplayName}
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 relative">
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div className="h-full w-1/3 bg-blue-500 rounded-full" />
        </div>
      </div>

      {/* Skill Categories */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedProfile || 'default'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {/* Skill Based */}
          {skills.skillBased && skills.skillBased.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Skill based</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {skills.skillBased.map((skill) => (
                  <Card
                    key={skill.id}
                    className={`p-6 cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 hover:shadow-md ${
                      selectedSkills.includes(skill.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                    onClick={() => toggleSkill(skill.id)}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        {skill.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Round Based */}
          {skills.roundBased && skills.roundBased.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Round based</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {skills.roundBased.map((skill) => (
                  <Card
                    key={skill.id}
                    className={`p-6 cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 hover:shadow-md ${
                      selectedSkills.includes(skill.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                    onClick={() => toggleSkill(skill.id)}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        {skill.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Experience Based */}
          {skills.experienceBased && skills.experienceBased.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Experience based</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {skills.experienceBased.map((skill) => (
                  <Card
                    key={skill.id}
                    className={`p-6 cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 hover:shadow-md ${
                      selectedSkills.includes(skill.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                    onClick={() => toggleSkill(skill.id)}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        {skill.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Next Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg"
          disabled={selectedSkills.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}