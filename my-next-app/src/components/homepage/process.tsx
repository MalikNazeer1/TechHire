import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import screenCandidatesImage from "../../app/assets/homepage/processscreencandidates.jpg";
import automateInsightsImage from "../../app/assets/homepage/processautomate.jpg";
import scheduleInterviewsImage from "../../app/assets/homepage/processschedule.jpg";
import interviewCandidatesImage from "../../app/assets/homepage/processinterviewcandidates.jpg";
import reportImage from "../../app/assets/homepage/report.png";

export function Process() {
  const data = [
    {
      title: "Create Account",
      content: (
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <div className="md:w-1/2">
            <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-4">
              Create an account with TechHire to get started. Our platform is designed to be user-friendly and intuitive, making it easy for you to navigate through the hiring process.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src={screenCandidatesImage}
              alt="Screen Candidates"
              width={500}
              height={500}
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Upload Job Description",
      content: (
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <div className="md:w-1/2">
            <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-4">
            Upload your job description to TechHire and let us do the rest. Our platform analyzes the job requirements and matches them with the best candidates.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src={automateInsightsImage}
              alt="Automate Insights"
              width={500}
              height={500}
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Schedule Interviews",
      content: (
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <div className="md:w-1/2">
            <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-4">
              Reduce no-shows with TechHire’s automated scheduling and candidate reminders. Our platform ensures that interviews are scheduled efficiently and candidates are reminded in advance.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src={scheduleInterviewsImage}
              alt="Schedule Interviews"
              width={500}
              height={500}
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Interview Candidates",
      content: (
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <div className="md:w-1/2">
            <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-4">
              With no downloads or logins, TechHire removes friction from the interview process. Conduct seamless interviews with our user-friendly platform.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src={interviewCandidatesImage}
              alt="Interview Candidates"
              width={500}
              height={500}
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Report and Feedback",
      content: (
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <div className="md:w-1/2">
            <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-4">
              TechHire’s reporting and feedback features allow you to gather insights from your team and make data-driven decisions. Our platform provides comprehensive reports to help you evaluate candidates effectively.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src={reportImage}
              alt="Interview Candidates"
              width={500}
              height={500}
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}