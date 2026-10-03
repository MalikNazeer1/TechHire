"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import heroimage from "../../app/assets/homepage/heroimage.jpg";

export default function HeroSection() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateDarkMode = () => {
      const htmlClass = document.documentElement.className;
      setIsDarkMode(htmlClass.includes("dark"));
    };

    // Initial check
    updateDarkMode();

    // Create an observer to watch for changes in the class attribute of the html element
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  return (
    <div className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
      <div className="relative isolate px-6 pt-12 lg:px-16 mt-8 lg:mt-16">
        {/* Background Design Elements */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className={`relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] ${
              isDarkMode ? "bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" : "bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            } sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]`}
          />
        </div>

        {/* Hero Section with 1 by 2 Grid */}
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text */}
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              Simply the best technical interviews
            </h1>
            <p className="mt-8 text-xl leading-9">
              TechHire conducts live technical assessments as part of our
              clients’ hiring process. It’s our job to give every candidate a
              technical interview that is fair, predictive, enjoyable, and above
              all, human. Unlike take-home coding tests or automated tech
              screens, you will have the live support, guidance, and feedback of
              a professional Interview Engineer (IVE) in a fully-toolled IDE to
              show off your skills!
            </p>
            <div className="mt-6 mb-4 flex flex-col sm:flex-row sm:justify-center md:justify-start gap-x-6 gap-y-4">
              <a
                href="/Contact"
                className="rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 transition duration-200 mr-4"
              >
                Request Demo <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          {/* Right Column: Image */}
          <div className="flex justify-center lg:justify-end items-center">
            <Image
              src={heroimage}
              alt="Hero Image"
              width={600} // Specify the image width
              height={600} // Specify the image height
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Bottom Background Design Elements */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className={`relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 ${
              isDarkMode ? "bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" : "bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            } sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]`}
          />
        </div>
      </div>
    </div>
  );
}