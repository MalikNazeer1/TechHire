import Link from "next/link";
import { Icons } from "@/components/icons"; // Adjust the import path as necessary

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Icons;
  color: string;
}

interface FeatureItemProps {
  title: string;
  description: string;
  icon: keyof typeof Icons;
  color: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  title,
  description,
  icon,
  color,
}) => {
  const IconComponent = Icons[icon];
  return (
    <div
      className={`flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg space-y-3 shadow-lg transition-transform duration-300 hover:shadow-xl`}
    >
      <span className={`p-3 flex w-max rounded-full text-white ${color}`}>
        <IconComponent className="w-8 h-8 transition-transform duration-300 hover:scale-110" />
      </span>
      <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 hover:text-sky-600 text-center">
        {title}
      </h1>
      <p className="text-md font-normal text-gray-700 dark:text-gray-300 text-center">
        {description}
      </p>
    </div>
  );
};

const features: Feature[] = [
  {
    id: 1,
    title: "Automation",
    description:
      "Manage resume screening, interest checks, assessment workflow, scheduling, and follow-up/reminders.",
    icon: "kanban",
    color: "bg-sky-600",
  },
  {
    id: 2,
    title: "Interviewers",
    description:
      "Hand-picked and validated 5,500+ expert freelance interviewers proficient in a diverse array of technical and non-technical skills.",
    icon: "user",
    color: "bg-indigo-600",
  },
  {
    id: 3,
    title: "24/7 Support",
    description:
      "Around-the-clock support from your account managers and customer service representatives available through email, chat, call, and WhatsApp.",
    icon: "help",
    color: "bg-orange-600",
  },
  {
    id: 4,
    title: "Structuring",
    description:
      "Achieve 70%+ next round conversions with Interview Structuring and Standardization, ensuring fairness and consistency.",
    icon: "settings",
    color: "bg-rose-600",
  },
  {
    id: 5,
    title: "Online Video Interviews & Code Editor",
    description:
      "Conduct seamless online video interviews and utilize our built-in code editor for live coding assessments, providing a real-time coding environment for candidates.",
    icon: "laptop",
    color: "bg-emerald-600",
  },
  {
    id: 6,
    title: "Analytics & Reporting",
    description:
      "Track and monitor key hiring metrics with a customizable dashboard. Rectify sourcing gaps and improve hiring productivity.",
    icon: "barChart",
    color: "bg-pink-600",
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
          Key Features of Our Platform
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureItem key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;