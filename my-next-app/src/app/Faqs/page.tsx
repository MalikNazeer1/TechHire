"use client";

import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Navbar } from "@/components/navbar/page";
import { Footer } from "@/components/footer/page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { StillHaveQuestions } from "@/components/StillHaveQuestions";
import { useLoading } from '@/context/loading-context';

export default function FAQs() {
  const { setLoading } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(false);
  }, []);

  const faqCategories = [
    {
      title: "Getting Started",
      questions: [
        {
          question: "What is TechHire?",
          answer: "TechHire is a platform that revolutionizes technical interviews by providing a comprehensive solution for conducting, managing, and evaluating technical assessments. We help companies find the right talent and candidates showcase their skills effectively."
        },
        {
          question: "How do I create an account?",
          answer: "To create an account, click on the 'Sign Up' button in the top right corner. You can sign up using your email address or through your Google account. Follow the simple registration process to get started."
        },
        {
          question: "What types of interviews does TechHire support?",
          answer: "TechHire supports various types of technical interviews including coding assessments, system design discussions, behavioral interviews, and more. Our platform is flexible and can be customized to meet your specific hiring needs."
        }
      ]
    },
    {
      title: "For Companies",
      questions: [
        {
          question: "How can I schedule interviews?",
          answer: "To schedule interviews, log in to your company dashboard and click on 'Schedule Interview'. You can select the candidate, choose the interview type, set the date and time, and customize the assessment parameters."
        },
        {
          question: "What features are available for interviewers?",
          answer: "Interviewers have access to features like real-time coding environment, video conferencing, assessment templates, feedback forms, and detailed candidate evaluation reports."
        },
        {
          question: "How do I evaluate candidates?",
          answer: "Our platform provides comprehensive evaluation tools including skill assessment metrics, behavioral evaluation forms, and detailed feedback templates. You can also record the entire interview for later review."
        }
      ]
    },
    {
      title: "For Candidates",
      questions: [
        {
          question: "How do I prepare for an interview?",
          answer: "You can prepare by reviewing the job description, practicing coding problems, and familiarizing yourself with our platform. We also provide practice interviews and sample questions to help you get comfortable with the process."
        },
        {
          question: "What should I expect during the interview?",
          answer: "During the interview, you'll have access to a coding environment, video chat with the interviewer, and real-time collaboration tools. The interview format will depend on the type of assessment chosen by the company."
        },
        {
          question: "How do I receive feedback?",
          answer: "After the interview, you'll receive detailed feedback through your candidate dashboard. This includes technical assessment results, behavioral feedback, and any specific areas for improvement."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500/90 via-green-400/90 to-blue-500/90 py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Frequently Asked Questions</h1>
            <Text className="text-xl text-white/90">
              Find answers to common questions about TechHire
            </Text>
          </div>
        </Container>
      </div>

      <Container className="flex-grow py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-blue-100 dark:border-blue-800/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredCategories.map((category, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-50 dark:border-blue-900/50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6 text-blue-500 dark:text-blue-400">{category.title}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`item-${index}-${faqIndex}`}
                      className="border rounded-lg px-6 bg-white dark:bg-gray-900 shadow-sm"
                    >
                      <AccordionTrigger className="text-lg font-medium py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 dark:text-gray-300 pb-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Have Questions */}
        <StillHaveQuestions />
      </Container>
      
      <Footer />
    </div>
  );
}