"use client";

import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Navbar } from "@/components/navbar/page";
import { Footer } from "@/components/footer/page";
import { Card, CardContent } from "@/components/ui/card";
import { FaQuestionCircle, FaBook, FaHeadset, FaComments } from "react-icons/fa";
import { useEffect } from 'react';
import { useLoading } from '@/context/loading-context';

export default function HelpCenter() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Help Center</h1>
            <Text className="text-xl text-white/90">
              Find answers to your questions and get the support you need.
            </Text>
          </div>
        </Container>
      </div>

      <Container className="flex-grow py-12">
        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-50 dark:border-blue-900/50 hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                <FaQuestionCircle className="text-blue-500 dark:text-blue-400 w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">FAQs</h3>
              <Text className="text-gray-600 dark:text-gray-400">
                Find answers to frequently asked questions
              </Text>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-50 dark:border-green-900/50 hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-full mb-4">
                <FaBook className="text-green-500 dark:text-green-400 w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Documentation</h3>
              <Text className="text-gray-600 dark:text-gray-400">
                Detailed guides and documentation
              </Text>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-50 dark:border-blue-900/50 hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                <FaHeadset className="text-blue-500 dark:text-blue-400 w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Support</h3>
              <Text className="text-gray-600 dark:text-gray-400">
                Get help from our support team
              </Text>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-50 dark:border-green-900/50 hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-full mb-4">
                <FaComments className="text-green-500 dark:text-green-400 w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Community</h3>
              <Text className="text-gray-600 dark:text-gray-400">
                Connect with other users
              </Text>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50/50 to-green-50/50 dark:from-blue-900/10 dark:to-green-900/10 rounded-xl p-8 border border-blue-50 dark:border-blue-900/50">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-400">Need More Help?</h2>
            <Text className="mb-6 text-gray-600 dark:text-gray-400">
              Our support team is here to help you with any questions or issues you may have.
            </Text>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-400">Email: support@TechHire.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-400">Phone: +92 3267080121</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-400">Hours: Monday - Friday, 9:00 AM - 6:00 PM EST</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
      
      <Footer />
    </div>
  );
}