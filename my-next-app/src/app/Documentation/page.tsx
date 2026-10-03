"use client";

import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Navbar } from "@/components/navbar/page";
import { Footer } from "@/components/footer/page";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FaBook, FaCode, FaUsers, FaVideo, FaChartBar, FaCog } from "react-icons/fa";
import { StillHaveQuestions } from "@/components/StillHaveQuestions";
import { useEffect } from 'react';
import { useLoading } from '@/context/loading-context';

export default function Documentation() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500/90 via-green-400/90 to-blue-500/90 py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Documentation</h1>
            <Text className="text-xl text-white/90">
              Comprehensive guides and resources to help you get the most out of TechHire
            </Text>
          </div>
        </Container>
      </div>

      <Container className="flex-grow py-12">
        {/* Quick Links */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-50 dark:border-blue-900/50 hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center text-center">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                  <FaUsers className="text-blue-500 dark:text-blue-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">For Companies</h3>
                <Text className="text-gray-600 dark:text-gray-400">
                  Learn how to set up and manage your hiring process
                </Text>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-50 dark:border-green-900/50 hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center text-center">
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-full mb-4">
                  <FaCode className="text-green-500 dark:text-green-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">For Developers</h3>
                <Text className="text-gray-600 dark:text-gray-400">
                  Technical documentation and API references
                </Text>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-50 dark:border-blue-900/50 hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center text-center">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                  <FaBook className="text-blue-500 dark:text-blue-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Guides</h3>
                <Text className="text-gray-600 dark:text-gray-400">
                  Step-by-step tutorials and best practices
                </Text>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-blue-50 dark:border-blue-900/50">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-6 text-blue-500 dark:text-blue-400">Getting Started</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="setup" className="border rounded-lg px-6 bg-white dark:bg-gray-900 shadow-sm">
                  <AccordionTrigger className="text-lg font-medium py-4">
                    Setting Up Your Account
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                    <div className="space-y-4">
                      <Text>
                        Learn how to create and configure your TechHire account for optimal use.
                      </Text>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Creating your account</li>
                        <li>Setting up your profile</li>
                        <li>Configuring preferences</li>
                        <li>Team management</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="features" className="border rounded-lg px-6 bg-white dark:bg-gray-900 shadow-sm">
                  <AccordionTrigger className="text-lg font-medium py-4">
                    Core Features
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                    <div className="space-y-6">
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-500 dark:text-blue-400 mb-2">Interview Management</h3>
                        <Text>
                          Schedule, conduct, and manage technical interviews efficiently.
                        </Text>
                      </div>
                      
                      <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-500 dark:text-green-400 mb-2">Assessment Tools</h3>
                        <Text>
                          Create and manage technical assessments and coding challenges.
                        </Text>
                      </div>
                      
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-500 dark:text-blue-400 mb-2">Analytics</h3>
                        <Text>
                          Track and analyze interview performance and candidate data.
                        </Text>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-blue-50 dark:border-blue-900/50">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-6 text-blue-500 dark:text-blue-400">Advanced Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                      <FaVideo className="text-blue-500 dark:text-blue-400 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Video Interviews</h3>
                      <Text className="text-gray-600 dark:text-gray-400">
                        Best practices for conducting video interviews
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                      <FaChartBar className="text-green-500 dark:text-green-400 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Analytics & Reporting</h3>
                      <Text className="text-gray-600 dark:text-gray-400">
                        Understanding and using interview analytics
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                      <FaCog className="text-blue-500 dark:text-blue-400 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Integration</h3>
                      <Text className="text-gray-600 dark:text-gray-400">
                        Connecting with your existing tools
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                      <FaUsers className="text-green-500 dark:text-green-400 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Team Collaboration</h3>
                      <Text className="text-gray-600 dark:text-gray-400">
                        Working together effectively
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <StillHaveQuestions />
        </div>
      </Container>
      
      <Footer />
    </div>
  );
}