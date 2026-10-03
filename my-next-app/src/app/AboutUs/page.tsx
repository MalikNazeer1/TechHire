"use client";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Navbar } from "@/components/navbar/page";
import { Footer } from "@/components/footer/page";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { useEffect } from 'react';
import { useLoading } from '@/context/loading-context';

import missionImage from "@/app/assets/homepage/mission-image.png";
import techHireBrandMark from "@/app/assets/TechHire.PNG";
import { FileText, UsersIcon } from "lucide-react";

const Mission = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-16">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
        <Text className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          At TechHire, our mission is to revolutionize the technical interview process. We believe that 
          finding the right talent shouldn't be a game of chance, but a thoughtful, data-driven process
          that benefits both companies and candidates.
        </Text>
        <Text className="text-lg text-gray-700 dark:text-gray-300">
          We are committed to creating a platform that provides fair, consistent, and effective 
          technical assessments for candidates, while giving companies the insights they need to
          make informed hiring decisions.
        </Text>
      </div>
      <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-xl bg-white dark:bg-gray-900 flex items-center justify-center p-6">
        <Image
          src={techHireBrandMark}
          alt="TechHire logo"
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
};

const Values = () => {
  const values = [
    {
      icon: "check" as keyof typeof Icons,
      title: "Fairness",
      description: "We ensure every candidate has an equal opportunity to showcase their skills."
    },
    {
      icon: "user" as keyof typeof Icons,
      title: "Human Experience",
      description: "We believe in the power of human interaction in the interview process."
    },
    {
      icon: "dashboard" as keyof typeof Icons,
      title: "Data-Driven",
      description: "Our assessments are based on metrics and standards that predict success."
    },
    {
      icon: "settings" as keyof typeof Icons,
      title: "Continuous Improvement",
      description: "We constantly refine our platform based on feedback and results."
    }
  ];

  return (
    <div className="my-16">
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">Our Core Values</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((value, index) => {
          const IconComponent = Icons[value.icon];
          return (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text>{value.description}</Text>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const Story = () => {
  return (
    <Card className="my-16 overflow-hidden bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl shadow-lg border border-blue-50 dark:border-blue-900/50">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-500/10 dark:bg-blue-400/10 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-blue-500 dark:text-blue-400">Our Story</h2>
          </div>
          <Text className="mb-6 text-gray-700 dark:text-gray-300">
            TechHire was founded in 2025 by a team of students who experienced firsthand 
            the challenges of the technical hiring process. After countless hours spent taking and conducting interviews
            that didn't effectively evaluate candidates' skills, they decided to build a better solution.
          </Text>
          <Text className="text-gray-700 dark:text-gray-300">
            Today, TechHire partners with companies of all sizes to transform their technical hiring
            processes. Our platform wants to help organizations find the right talent more
            efficiently, while providing candidates with a fair and enjoyable interview experience.
          </Text>
        </div>
        <div className="relative min-h-[300px] md:min-h-full bg-white dark:bg-gray-800 flex items-center justify-center p-8">
          <div className="relative w-full h-full">
            <Image 
              src={missionImage} 
              alt="TechHire Story" 
              fill
              className="object-contain transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};


// Update the main component
export default function AboutUs() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <PageHero 
        title="About TechHire"
        description="We're transforming technical interviews to help companies find the right talent and provide candidates with a fair, predictive, and enjoyable interview experience."
      />
      
      <Container className="flex-grow">
        <Mission />
        <Values />
        <Story />
      </Container>
      
      <Footer />
    </div>
  );
}