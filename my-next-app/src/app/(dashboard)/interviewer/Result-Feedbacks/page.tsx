'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';

// Mock data for results
const results = [
  {
    id: 1,
    company: "TechCorp",
    position: "Software Engineer",
    score: 8,
    comment: "Excellent technical skills and problem-solving abilities. Great cultural fit.",
  },
  {
    id: 2,
    company: "DataSystems Inc.",
    position: "Data Analyst",
    score: 6,
    comment: "Strong analytical skills demonstrated. Need to improve on communication of complex ideas.",
  },
  // Add more mock results as needed
];

export default function ResultFeedbacks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900">Interview Results</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="grid gap-6">
            {results.map((result) => (
              <Card key={result.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{result.company}</CardTitle>
                  <Badge 
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Score: {result.score}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-500 mb-4">{result.position}</CardDescription>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-blue-600 mb-2 flex items-center">
                        <CheckCircleIcon className="mr-2 h-4 w-4" /> Comment
                      </h3>
                      <p className="text-gray-700">{result.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}