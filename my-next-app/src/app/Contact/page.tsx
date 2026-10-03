"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar/page";
import { Footer } from "@/components/footer/page";
import { Modal } from "@/components/ui/modal";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useLoading } from '@/context/loading-context';

export default function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500/90 via-green-400/90 to-blue-500/90 py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Get in Touch</h1>
            <Text className="text-xl text-white/90">
              We'd love to hear from you! Let's discuss how we can help transform your hiring process.
            </Text>
          </div>
        </Container>
      </div>

      <Container className="flex-grow py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-blue-50 dark:border-blue-900/50">
              <h2 className="text-2xl font-semibold mb-6 text-blue-500 dark:text-blue-400">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 p-4 rounded-lg transition-colors">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-colors">
                    <FaEnvelope className="text-blue-500 dark:text-blue-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">support@TechHire.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group hover:bg-green-50/50 dark:hover:bg-green-900/10 p-4 rounded-lg transition-colors">
                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-800/50 transition-colors">
                    <FaPhone className="text-green-500 dark:text-green-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">+44 20 7946 0958</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 p-4 rounded-lg transition-colors">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-colors">
                    <FaMapMarkerAlt className="text-blue-500 dark:text-blue-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Address</h3>
                    <p className="text-gray-600 dark:text-gray-300">6 Pancras Square, London N1C 4AG (King's Cross) and 1-13 St Giles High St, London WC2H 8AG (Central Saint Giles)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50/50 to-green-50/50 dark:from-blue-900/10 dark:to-green-900/10 rounded-xl p-8 border border-blue-50 dark:border-blue-900/50">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-400">Business Hours</h2>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p className="flex justify-between">
                  <span className="font-medium">Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Sunday:</span>
                  <span className="text-red-400">Closed</span>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-blue-50 dark:border-blue-900/50">
            <h2 className="text-2xl font-semibold mb-6 text-blue-500 dark:text-blue-400">Send us a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <Input 
                  id="name" 
                  name="name" 
                  type="text" 
                  required 
                  className="w-full px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors" 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  name="message" 
                  rows={4} 
                  required 
                  className="w-full px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors" 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </Container>

      <Footer />
      
      <Modal
        title="Message Sent"
        description="Thank you for getting in touch with us. We will get back to you shortly."
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <div className="mt-4">
          <Button 
            onClick={handleCloseModal}
            className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}