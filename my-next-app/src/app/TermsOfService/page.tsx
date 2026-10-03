"use client";

import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Navbar } from "@/components/navbar/page";
import { Footer } from "@/components/footer/page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { FaShieldAlt, FaUserShield, FaGavel, FaExclamationTriangle, FaInfoCircle, FaCopyright, FaBan, FaEnvelope } from "react-icons/fa";
import { useEffect } from 'react';
import { useLoading } from '@/context/loading-context';

export default function TermsOfService() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <PageHero 
        title="Terms of Service"
        description="Welcome to TechHire! By using our platform, you agree to comply with and be bound by the following terms and conditions."
      />
      
      <Container className="flex-grow py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated Card */}
          <Card className="mb-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-blue-50 dark:border-blue-900/50">
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                  <FaInfoCircle className="text-blue-500 dark:text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-400">Last Updated: May 1, 2025</h2>
                  <Text className="text-gray-600 dark:text-gray-400">
                    These terms were last updated to reflect our current practices.
                  </Text>
                </div>
              </div>
              <Text className="mb-4">
                These Terms of Service ("Terms") govern your access to and use of the TechHire platform, 
                including our website, technical interview services, and related offerings (collectively, the "Services").
              </Text>
              <Text>
                Please read these Terms carefully before using our Services. By accessing or using our Services, 
                you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
              </Text>
            </CardContent>
          </Card>
          
          {/* Terms Sections */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center space-x-3">
                    <FaUserShield className="text-blue-500 dark:text-blue-400 w-5 h-5" />
                    <span>Account Registration and Security</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                  <div className="space-y-4">
                    <Text>
                      You may need to create an account to access certain features of our Services. When you register, 
                      you agree to provide accurate, current, and complete information about yourself.
                    </Text>
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
                      <Text className="font-medium mb-2">You are responsible for:</Text>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Maintaining the confidentiality of your account credentials</li>
                        <li>All activities that occur under your account</li>
                        <li>Notifying us immediately of any unauthorized use of your account or any other security breach</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center space-x-3">
                    <FaShieldAlt className="text-green-500 dark:text-green-400 w-5 h-5" />
                    <span>Acceptable Use Policy</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                  <div className="space-y-4">
                    <Text>
                      When using our Services, you agree not to:
                    </Text>
                    <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-lg">
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Use the Services for any unlawful purpose or in violation of these Terms</li>
                        <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                        <li>Interfere with or disrupt the integrity or performance of our Services</li>
                        <li>Upload or transmit viruses, malware, or other malicious code</li>
                        <li>Collect or harvest any information from our Services without our consent</li>
                        <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation</li>
                        <li>Post or transmit any content that is harmful, offensive, discriminatory, or otherwise objectionable</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center space-x-3">
                    <FaCopyright className="text-blue-500 dark:text-blue-400 w-5 h-5" />
                    <span>Intellectual Property Rights</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                  <div className="space-y-4">
                    <Text>
                      Our Services and all content, features, and functionality (including but not limited to software, 
                      text, images, videos, and designs) are owned by TechHire or our licensors and are protected by 
                      intellectual property laws.
                    </Text>
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
                      <Text className="font-medium mb-2">Key Points:</Text>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Limited, non-exclusive license for personal or internal business use</li>
                        <li>No transfer of ownership rights</li>
                        <li>Feedback may be used without compensation</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center space-x-3">
                    <FaBan className="text-red-500 dark:text-red-400 w-5 h-5" />
                    <span>Termination of Services</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                  <div className="space-y-4">
                    <Text>
                      We reserve the right to suspend or terminate your access to our Services at any time for any reason.
                    </Text>
                    <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-lg">
                      <Text className="font-medium mb-2">Grounds for Termination:</Text>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Violation of these Terms</li>
                        <li>Conduct that poses a risk to our Services or other users</li>
                        <li>Requests by law enforcement or government agencies</li>
                        <li>Unexpected technical or security issues</li>
                        <li>Extended periods of inactivity</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center space-x-3">
                    <FaExclamationTriangle className="text-yellow-500 dark:text-yellow-400 w-5 h-5" />
                    <span>Disclaimer of Warranties</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                  <div className="space-y-4">
                    <Text>
                      THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
                    </Text>
                    <div className="bg-yellow-50/50 dark:bg-yellow-900/10 p-4 rounded-lg">
                      <Text className="font-medium mb-2">We do not warrant that:</Text>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>The Services will function uninterrupted, secure, or available at any particular time</li>
                        <li>Any errors or defects will be corrected</li>
                        <li>The Services are free of viruses or other harmful components</li>
                        <li>The results of using the Services will meet your requirements</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-blue-500 dark:text-blue-400 w-5 h-5" />
                    <span>Contact Us</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                  <div className="space-y-4">
                    <Text>
                      If you have any questions or concerns about these Terms of Service, please contact us:
                    </Text>
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
                      <p className="font-medium text-primary">TechHire Support Team</p>
                      <p>Email: support@TechHire.com</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
}