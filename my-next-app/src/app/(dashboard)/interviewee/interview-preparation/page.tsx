// app/IntervieweeDashboard/interview-preparation.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

// Simplified tips data structure
const tips = [
  {
    id: 1,
    title: "Research the Company",
    content: "Learn about the company's mission, values, and recent projects. This will help you tailor your answers and show that you're genuinely interested in the company.",
    category: "Preparation",
    duration: "15 min",
    resources: [
      { 
        title: "Company Research Guide", 
        link: "https://www.indeed.com/career-advice/finding-a-job/the-complete-guide-to-researching-a-company" 
      },
      { 
        title: "How to Research Companies", 
        link: "https://www.glassdoor.com/employers/resources/compete-with-big-companies-for-top-talent/" 
      }
    ]
  },
  {
    id: 2,
    title: "Practice Common Interview Questions",
    content: "Prepare answers for common interview questions such as 'Tell me about yourself,' 'What are your strengths and weaknesses?' and 'Why do you want to work here?'",
    category: "Questions",
    duration: "30 min",
    resources: [
      { 
        title: "Top 50 Interview Questions", 
        link: "https://www.glassdoor.com/blog/common-interview-questions/"
      },
      { 
        title: "Answering Tough Questions", 
        link: "https://www.indeed.com/career-advice/interviewing/tough-interview-questions-and-answers" 
      }
    ]
  },
  {
    id: 3,
    title: "Dress Appropriately",
    content: "Choose an outfit that is professional and appropriate for the company's culture. When in doubt, it's better to be slightly overdressed than underdressed.",
    category: "Appearance",
    duration: "10 min",
    resources: [
      { 
        title: "Interview Attire Guide", 
        link: "https://www.indeed.com/career-advice/interviewing/how-to-dress-for-a-job-interview" 
      },
      { 
        title: "Professional Dressing Tips", 
        link: "https://www.indeed.com/career-advice/starting-new-job/guide-to-business-attire"
      }
    ]
  },
  {
    id: 4,
    title: "Technical Interview Preparation",
    content: "Prepare for technical interviews by practicing coding problems, system design questions, and understanding core computer science concepts. Focus on problem-solving approaches and clear communication of your thought process.",
    category: "Technical",
    duration: "60 min",
    resources: [
      { 
        title: "LeetCode - Practice Coding Problems", 
        link: "https://leetcode.com/problemset/all/" 
      },
      { 
        title: "System Design Primer", 
        link: "https://github.com/donnemartin/system-design-primer" 
      },
      {
        title: "Tech Interview Handbook",
        link: "https://www.techinterviewhandbook.org/"
      }
    ]
  },
  {
    id: 5,
    title: "Behavioral Interview Questions",
    content: "Prepare for behavioral questions using the STAR method (Situation, Task, Action, Result). Focus on specific examples that demonstrate your skills, problem-solving abilities, and how you handle challenges.",
    category: "Behavioral",
    duration: "45 min",
    resources: [
      {
        title: "STAR Method Guide",
        link: "https://www.themuse.com/advice/star-interview-method"
      },
      {
        title: "Common Behavioral Questions",
        link: "https://www.indeed.com/career-advice/interviewing/behavioral-interview-questions"
      }
    ]
  },
  {
    id: 6,
    title: "System Design Interview",
    content: "Learn how to approach system design interviews by understanding scalability, reliability, and performance considerations. Practice designing distributed systems and explaining your design decisions clearly.",
    category: "Technical",
    duration: "90 min",
    resources: [
      {
        title: "System Design Course",
        link: "https://www.educative.io/courses/grokking-the-system-design-interview"
      },
      {
        title: "System Design Interview Questions",
        link: "https://github.com/checkcheckzz/system-design-interview"
      }
    ]
  },
  {
    id: 7,
    title: "Problem-Solving Framework",
    content: "Develop a structured approach to solving technical problems. Learn how to break down complex problems, identify edge cases, and communicate your solution effectively.",
    category: "Technical",
    duration: "30 min",
    resources: [
      {
        title: "Problem Solving Techniques",
        link: "https://www.hackerrank.com/domains/tutorials/10-days-of-statistics"
      },
      {
        title: "Algorithm Visualization",
        link: "https://visualgo.net/en"
      }
    ]
  },
  {
    id: 8,
    title: "Leadership and Teamwork",
    content: "Prepare examples that demonstrate your leadership skills, ability to work in teams, and how you handle conflicts. Focus on specific situations where you made a positive impact.",
    category: "Behavioral",
    duration: "30 min",
    resources: [
      {
        title: "Leadership Interview Questions",
        link: "https://www.thebalancecareers.com/leadership-interview-questions-2061205"
      },
      {
        title: "Teamwork Examples",
        link: "https://www.indeed.com/career-advice/interviewing/teamwork-interview-questions"
      }
    ]
  },
  {
    id: 9,
    title: "Coding Best Practices",
    content: "Learn and practice writing clean, efficient, and maintainable code. Understand common design patterns, testing practices, and code organization principles.",
    category: "Technical",
    duration: "45 min",
    resources: [
      {
        title: "Clean Code Principles",
        link: "https://github.com/ryanmcdermott/clean-code-javascript"
      },
      {
        title: "Design Patterns",
        link: "https://refactoring.guru/design-patterns"
      }
    ]
  },
  {
    id: 10,
    title: "Conflict Resolution",
    content: "Prepare examples of how you've handled conflicts in the workplace. Focus on your approach to resolving disagreements and maintaining professional relationships.",
    category: "Behavioral",
    duration: "30 min",
    resources: [
      {
        title: "Conflict Resolution Guide",
        link: "https://www.mindtools.com/pages/article/newLDR_81.htm"
      },
      {
        title: "Workplace Conflict Examples",
        link: "https://www.thebalancecareers.com/how-to-answer-conflict-interview-questions-2061207"
      }
    ]
  }
];

const categories = ["All", "Preparation", "Questions", "Appearance", "Technical", "Behavioral"];

export default function InterviewPreparation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-3">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              Interview Preparation
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Essential tips and resources for your interview success
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <Input
              placeholder="Search tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
          <div className="grid gap-6">
          {filteredTips.map((tip) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800">
                <CardHeader className="space-y-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {tip.title}
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className="flex items-center gap-1 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      <Clock className="w-3 h-3" />
                      {tip.duration}
                    </Badge>
                  </div>
                  <Badge 
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  >
                    {tip.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {tip.content}
                  </p>
                  
                  {/* Resources Section */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Related Resources
                    </h4>
                    <div className="space-y-2">
                      {tip.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                        >
                          <BookOpen className="w-4 h-4 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                            {resource.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))}
          </div>
      </main>
    </div>
  );
}