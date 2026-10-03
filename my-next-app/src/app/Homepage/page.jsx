"use client";
import HeroSection from "@/components/homepage/heroSection";
import { Process } from "@/components/homepage/process";
import Features from "@/components/homepage/feature";
import FAQs from "@/components/homepage/faqs";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";
import InterviewForm from "@/components/reports/InterviewForm";
import PdfDownloadButton from "@/components/reports/PdfDownloadButton";
import { useLoading } from '@/context/loading-context';

export default function Homepage() {
  const [isMounted, setIsMounted] = useState(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    setIsMounted(true);
    setLoading(false);
  }, []);

  if (!isMounted) {
    return null; // Avoid rendering mismatched HTML during hydration
  }

  return (
    <>
      {/* <PdfDownloadButton interviewId={4} /> */}
      <HeroSection />
      <div id="process">
        <Process />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="faqs">
        <FAQs />
      </div>
      <div className="fixed bottom-4 right-4">
        <Button
          asChild
          href="https://api.whatsapp.com/send/?phone=923132135384&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
        >
          <a>
            <FontAwesomeIcon icon={faWhatsapp} className="w-10 h-10" />
          </a>
        </Button>
      </div>
    </>
  );
}
