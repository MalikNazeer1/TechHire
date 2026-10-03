"use client";

import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Navbar } from "@/components/navbar/page";
import { Footer } from "@/components/footer/page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { FaCookie, FaShieldAlt, FaUserShield, FaClock } from "react-icons/fa";
import { useEffect } from 'react';
import { useLoading } from '@/context/loading-context';

export default function CookiePolicy() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Cookie Policy</h1>
            <Text className="text-xl text-white/90">
              Learn about how we use cookies and similar technologies to enhance your experience on TechHire.
            </Text>
          </div>
        </Container>
      </div>
      
      <Container className="flex-grow py-12">
        {/* Last Updated Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-blue-50 dark:border-blue-900/50">
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                  <FaClock className="text-blue-500 dark:text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-400">Last Updated: May 1, 2025</h2>
                  <Text className="text-gray-600 dark:text-gray-400">
                    This policy was last updated to reflect our current practices.
                  </Text>
                </div>
              </div>
              <Text className="mb-4">
                This Cookie Policy explains how TechHire uses cookies and similar technologies to recognize you 
                when you visit our website and use our services.
              </Text>
              <Text>
                By using our website and services, you consent to the use of cookies in accordance with this policy.
              </Text>
            </CardContent>
          </Card>
        </div>

        {/* Policy Overview */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-50 dark:border-blue-900/50 hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center text-center">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                  <FaCookie className="text-blue-500 dark:text-blue-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">What Are Cookies?</h3>
                <Text className="text-gray-600 dark:text-gray-400">
                  Small text files that help us provide you with a better experience
                </Text>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-50 dark:border-green-900/50 hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center text-center">
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-full mb-4">
                  <FaShieldAlt className="text-green-500 dark:text-green-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">How We Use Them</h3>
                <Text className="text-gray-600 dark:text-gray-400">
                  To improve functionality and provide personalized content
                </Text>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-50 dark:border-blue-900/50 hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center text-center">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                  <FaUserShield className="text-blue-500 dark:text-blue-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Your Control</h3>
                <Text className="text-gray-600 dark:text-gray-400">
                  Manage your cookie preferences at any time
                </Text>
              </CardContent>
            </Card>
          </div>
        </div>
          
        {/* Detailed Policy */}
        <div className="max-w-4xl mx-auto space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="text-lg font-medium py-4">
                What Are Cookies?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                <div className="space-y-4">
                  <Text>
                    Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                    They are widely used to make websites work more efficiently and provide useful information to website owners.
                  </Text>
                  <Text>
                    We use both session cookies (which expire when you close your browser) and persistent cookies 
                    (which stay on your device for a set period of time).
                  </Text>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="text-lg font-medium py-4">
                Types of Cookies We Use
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                <div className="space-y-6">
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-500 dark:text-blue-400 mb-2">Essential Cookies</h3>
                    <Text>
                      Required for the website to function properly. They enable basic functions like page navigation 
                      and access to secure areas.
                    </Text>
                  </div>
                  
                  <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-500 dark:text-green-400 mb-2">Analytics Cookies</h3>
                    <Text>
                      Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </Text>
                  </div>
                  
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-500 dark:text-blue-400 mb-2">Functionality Cookies</h3>
                    <Text>
                      Allow the website to remember choices you make and provide enhanced features.
                    </Text>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="text-lg font-medium py-4">
                Managing Cookies
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                <div className="space-y-4">
                  <Text>
                    You can control and/or delete cookies as you wish. You can delete all cookies that are already 
                    on your computer and you can set most browsers to prevent them from being placed.
                  </Text>
                  <Text>
                    To manage cookies, you can:
                  </Text>
                  <ul className="list-disc pl-6 space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Use your browser settings to manage cookie preferences</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Use our cookie consent tool to manage preferences</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Delete cookies through your browser's settings</span>
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border rounded-lg px-6 mb-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="text-lg font-medium py-4">
                Contact Us
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                <div className="space-y-4">
                  <Text>
                    If you have any questions about our Cookie Policy, please contact us at:
                  </Text>
                  <div className="mt-4 bg-gradient-to-br from-blue-50/50 to-green-50/50 dark:from-blue-900/10 dark:to-green-900/10 p-6 rounded-lg">
                    <p className="font-medium text-blue-500 dark:text-blue-400">TechHire Support Team</p>
                    <p className="text-gray-600 dark:text-gray-400">Email: privacy@TechHire.com</p>
                  </div>
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