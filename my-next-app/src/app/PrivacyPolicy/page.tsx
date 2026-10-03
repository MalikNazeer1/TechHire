"use client";

import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Navbar } from "@/components/navbar/page";
import { Footer } from "@/components/footer/page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { FaLock, FaDatabase, FaUserShield, FaShieldAlt, FaChartBar} from "react-icons/fa";
import { useEffect } from 'react';
import { useLoading } from '@/context/loading-context';

export default function PrivacyPolicy() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <PageHero 
        title="Privacy Policy"
        description="At TechHire, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information."
      />
      
      <Container className="flex-grow py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated Card */}
          <Card className="mb-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-blue-50 dark:border-blue-900/50">
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                  <FaLock className="text-blue-500 dark:text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-400">Last Updated: May 1, 2025</h2>
                  <Text className="text-gray-600 dark:text-gray-400">
                    This policy was last updated to reflect our current practices.
                  </Text>
                </div>
              </div>
              <Text className="mb-4">
                This Privacy Policy describes how TechHire ("we", "us", or "our") collects, uses, and discloses 
                your personal information when you use our platform, website, and services (collectively, the "Services").
              </Text>
              <Text>
                By accessing or using our Services, you agree to the collection and use of information in 
                accordance with this policy. We take your privacy seriously and are committed to protecting 
                your personal information.
              </Text>
            </CardContent>
          </Card>

          {/* Privacy Sections */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center space-x-3">
                    <FaDatabase className="text-blue-500 dark:text-blue-400 w-5 h-5" />
                    <span>Information We Collect</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                  <div className="space-y-6">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-500 dark:text-blue-400 mb-2">Personal Information</h3>
                      <Text>
                        We collect personal information that you provide to us directly, such as:
                      </Text>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Name, email address, and contact information</li>
                        <li>Account credentials and profile information</li>
                        <li>Professional experience, skills, and education</li>
                        <li>Information you provide during technical interviews</li>
                        <li>Payment information when applicable</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-500 dark:text-green-400 mb-2">Automatically Collected Information</h3>
                      <Text>
                        When you use our Services, we automatically collect certain information, including:
                      </Text>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>IP address and device information</li>
                        <li>Browser type and settings</li>
                        <li>Usage data and interactions with our platform</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center space-x-3">
                    <FaChartBar className="text-green-500 dark:text-green-400 w-5 h-5" />
                    <span>How We Use Your Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                  <div className="space-y-6">
                    <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-lg">
                      <Text>
                        We use the information we collect for various purposes, including:
                      </Text>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>
                          <span className="font-medium">Providing our Services:</span> To operate our platform, facilitate technical interviews, and deliver the functionality you request.
                        </li>
                        <li>
                          <span className="font-medium">Improvement and Development:</span> To analyze usage patterns, troubleshoot issues, and develop new features.
                        </li>
                        <li>
                          <span className="font-medium">Communication:</span> To send you important updates, notifications, and respond to your inquiries.
                        </li>
                        <li>
                          <span className="font-medium">Security and Fraud Prevention:</span> To detect and prevent unauthorized access and protect our users.
                        </li>
                        <li>
                          <span className="font-medium">Legal Compliance:</span> To comply with applicable laws, regulations, and legal processes.
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center space-x-3">
                    <FaShieldAlt className="text-purple-500 dark:text-purple-400 w-5 h-5" />
                    <span>Information Sharing and Disclosure</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                  <div className="space-y-6">
                    <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-lg">
                      <Text>
                        We are committed to protecting your privacy and do not sell your personal information. However, we may share your information in the following circumstances:
                      </Text>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>
                          <span className="font-medium">With Your Consent:</span> When you explicitly authorize us to share your information with third parties.
                        </li>
                        <li>
                          <span className="font-medium">Service Providers:</span> With trusted third-party service providers who assist us in operating our platform.
                        </li>
                        <li>
                          <span className="font-medium">Business Partners:</span> With companies we partner with to offer integrated services.
                        </li>
                        <li>
                          <span className="font-medium">Legal Requirements:</span> When required by law, regulation, or governmental request.
                        </li>
                        <li>
                          <span className="font-medium">Business Transfers:</span> In connection with a merger, acquisition, or sale of assets.
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center space-x-3">
                    <FaUserShield className="text-blue-500 dark:text-blue-400 w-5 h-5" />
                    <span>Your Privacy Rights</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                  <div className="space-y-6">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
                      <Text>
                        Depending on your location, you may have certain rights regarding your personal information:
                      </Text>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>
                          <span className="font-medium">Access and Portability:</span> Request a copy of your personal information.
                        </li>
                        <li>
                          <span className="font-medium">Correction:</span> Correct inaccurate or incomplete information.
                        </li>
                        <li>
                          <span className="font-medium">Deletion:</span> Request deletion of your personal information.
                        </li>
                        <li>
                          <span className="font-medium">Restriction:</span> Limit the processing of your information.
                        </li>
                        <li>
                          <span className="font-medium">Objection:</span> Object to the processing of your information.
                        </li>
                      </ul>
                      <Text className="mt-4">
                        To exercise these rights, please contact us at <span className="text-primary font-medium">privacy@TechHire.com</span>.
                      </Text>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center space-x-3">
                    <FaLock className="text-red-500 dark:text-red-400 w-5 h-5" />
                    <span>Data Security and Retention</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                  <div className="space-y-6">
                    <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-lg">
                      <Text>
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                      </Text>
                      <Text className="mt-4">
                        We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                      </Text>
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