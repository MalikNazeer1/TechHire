"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, Building2, Briefcase } from 'lucide-react'
import { motion } from "framer-motion"

// Mock data for results
const results = [
  {
    id: 1,
    company: "TechCorp",
    position: "Software Engineer",
    status: "Shortlisted",
    feedback: "Excellent technical skills and problem-solving abilities. Great cultural fit.",
    nextSteps: "Prepare for the final round of interviews. We'll be in touch with the details soon.",
    date: "2024-03-15"
  },
  {
    id: 2,
    company: "DataSystems Inc.",
    position: "Data Analyst",
    status: "Under Review",
    feedback: "Strong analytical skills demonstrated. Need to improve on communication of complex ideas.",
    nextSteps: "Wait for the final decision. We'll inform you within a week.",
    date: "2024-03-14"
  },
  // Add more mock results as needed
]

export default function Results() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              Interview Results
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Track your interview outcomes and feedback
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid gap-6">
            {results.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
                  <CardHeader className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-blue-500" />
                          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                            {result.company}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-gray-500" />
                          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                            {result.position}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={result.status === "Shortlisted" ? "default" : "secondary"}
                        className={`${result.status === "Shortlisted"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                          }`}
                      >
                        {result.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              Feedback
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {result.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <ClockIcon className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              Next Steps
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {result.nextSteps}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Interview Date: {result.date}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}

