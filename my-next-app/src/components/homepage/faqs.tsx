"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQs() {
  return (
    <div className="py-12">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="max-w-3xl mx-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is TechHire?</AccordionTrigger>
          <AccordionContent>
            TechHire is a platform that conducts live technical assessments as part of our clients’ hiring process, ensuring every candidate has a fair, predictive, enjoyable, and human interview experience.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How does TechHire work?</AccordionTrigger>
          <AccordionContent>
            TechHire offers live support, guidance, and feedback from professional Interview Engineers (IVEs) in a fully-tooled IDE to showcase your skills. Unlike take-home coding tests or automated tech screens, TechHire provides a more interactive and supportive interview process.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What are the benefits of using TechHire?</AccordionTrigger>
          <AccordionContent>
            TechHire helps companies find the right talent by providing a more accurate and enjoyable interview experience. Candidates benefit from live feedback and support, making the interview process more effective and less stressful.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>How can I get started with TechHire?</AccordionTrigger>
          <AccordionContent>
            To get started with TechHire, you can sign up on our website and create an account. Once your account is set up, you can start scheduling interviews and using our platform to conduct technical assessments.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}