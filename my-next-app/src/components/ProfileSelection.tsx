"use client";

import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";

const profiles = [
  { id: "adobe", name: "Adobe", icon: "📄" },
  { id: "android", name: "Android", icon: "📱" },
  { id: "architect", name: "Architect", icon: "🏗️" },
  { id: "automation", name: "Automation Engineering", icon: "⚙️" },
  { id: "backend", name: "Backend", icon: "💻" },
  { id: "business-analyst", name: "Business Analyst", icon: "📊" },
  { id: "business-intelligence", name: "Business Intelligence", icon: "🧠" },
  { id: "computer-networks", name: "Computer Networks", icon: "🌐" },
  { id: "cyber-security", name: "Cyber Security", icon: "🔒" },
  { id: "data-analyst", name: "Data Analyst", icon: "📈" },
  { id: "data-engineering", name: "Data Engineering", icon: "🔧" },
  { id: "data-science", name: "Data Science", icon: "🔬" },
  { id: "frontend", name: "Frontend", icon: "🎨" },
  { id: "devops", name: "DevOps", icon: "🔄" },
  { id: "flutter", name: "Flutter", icon: "💎" },
  { id: "ios", name: "iOS", icon: "🍎" },
];

const MotionCard = motion(Card);

interface ProfileSelectionProps {
  onSelect: (profile: string) => void;
}

export default function ProfileSelection({ onSelect }: ProfileSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Select profile to request interviewer
        </h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search profile..."
            className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProfiles.map((profile, index) => (
            <MotionCard
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 hover:shadow-md"
              onClick={() => onSelect(profile.id)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-4xl">{profile.icon}</div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.name}
                </span>
              </div>
            </MotionCard>
          ))}
        </div>
      </div>
    </div>
  );
}
