"use client";

import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Navbar } from "@/components/navbar/page";
import { Footer } from "@/components/footer/page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { FaBriefcase, FaUsers, FaHeart, FaRocket } from "react-icons/fa";
import { useEffect } from 'react';
import { useLoading } from '@/context/loading-context';

export default function Careers() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Join Our Team</h1>
            <Text className="text-xl text-white/90">
              Help us transform the future of technical interviews and skill assessment.
            </Text>
          </div>
        </Container>
      </div>

      <Container className="flex-grow py-12">
        {/* Why Join Us Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-blue-50 dark:border-blue-900/50">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-6 text-blue-500 dark:text-blue-400">Why Join TechHire?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4 group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 p-4 rounded-lg transition-colors">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-colors">
                    <FaRocket className="text-blue-500 dark:text-blue-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Innovation</h3>
                    <p className="text-gray-600 dark:text-gray-300">Work on cutting-edge technology and shape the future of hiring.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group hover:bg-green-50/50 dark:hover:bg-green-900/10 p-4 rounded-lg transition-colors">
                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-800/50 transition-colors">
                    <FaUsers className="text-green-500 dark:text-green-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Great Team</h3>
                    <p className="text-gray-600 dark:text-gray-300">Collaborate with talented individuals who share your passion.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 p-4 rounded-lg transition-colors">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-colors">
                    <FaBriefcase className="text-blue-500 dark:text-blue-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Growth</h3>
                    <p className="text-gray-600 dark:text-gray-300">Continuous learning and career development opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group hover:bg-green-50/50 dark:hover:bg-green-900/10 p-4 rounded-lg transition-colors">
                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-800/50 transition-colors">
                    <FaHeart className="text-green-500 dark:text-green-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Culture</h3>
                    <p className="text-gray-600 dark:text-gray-300">A supportive and inclusive work environment.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Open Positions Section */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="openings" className="border rounded-lg px-6 bg-white dark:bg-gray-900 shadow-sm">
              <AccordionTrigger className="text-lg font-medium py-4">
                Current Openings
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-blue-500 dark:text-blue-400 mb-2">Senior Software Engineer</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">Remote / Hybrid</span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">Full-time</span>
                    </div>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <li>5+ years of experience in software development</li>
                      <li>Strong expertise in React, Node.js, and TypeScript</li>
                      <li>Experience with real-time applications and WebRTC</li>
                    </ul>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-blue-500 dark:text-blue-400 mb-2">Product Manager</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">Remote / Hybrid</span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">Full-time</span>
                    </div>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <li>3+ years of product management experience</li>
                      <li>Strong analytical and problem-solving skills</li>
                      <li>Experience in HR Tech or EdTech preferred</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="benefits" className="border rounded-lg px-6 bg-white dark:bg-gray-900 shadow-sm">
              <AccordionTrigger className="text-lg font-medium py-4">
                Benefits & Perks
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Competitive salary and equity packages</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Flexible work arrangements</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Health, dental, and vision insurance</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Professional development budget</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Regular team events and retreats</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Unlimited PTO</span>
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="culture" className="border rounded-lg px-6 bg-white dark:bg-gray-900 shadow-sm">
              <AccordionTrigger className="text-lg font-medium py-4">
                Our Culture
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                <div className="space-y-4">
                  <Text className="text-gray-600 dark:text-gray-400">
                    At TechHire, we believe in:
                  </Text>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Innovation and continuous learning</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Collaboration and open communication</span>
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Work-life balance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Diversity and inclusion</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="process" className="border rounded-lg px-6 bg-white dark:bg-gray-900 shadow-sm">
              <AccordionTrigger className="text-lg font-medium py-4">
                Application Process
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                <div className="space-y-4">
                  <ol className="space-y-4">
                    {[
                      "Submit your application and resume",
                      "Initial screening call with our HR team",
                      "Technical assessment or case study",
                      "Team interviews",
                      "Final interview with leadership",
                      "Offer and onboarding"
                    ].map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <Text className="mt-6">
                    To apply, please send your resume to{" "}
                    <span className="text-blue-500 dark:text-blue-400 font-medium">careers@TechHire.com</span>
                  </Text>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
}