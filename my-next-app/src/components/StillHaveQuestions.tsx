"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

interface StillHaveQuestionsProps {
  helpCenterLink?: string;
  contactLink?: string;
  className?: string;
}

export function StillHaveQuestions({
  helpCenterLink = "/HelpCenter",
  contactLink = "/Contact",
  className = "",
}: StillHaveQuestionsProps) {
  return (
    <Card className={`max-w-2xl mx-auto mt-12 bg-gradient-to-br from-blue-50/50 to-green-50/50 dark:from-blue-900/10 dark:to-green-900/10 rounded-xl p-8 border border-blue-50 dark:border-blue-900/50 ${className}`}>
      <CardContent>
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-400">Still Have Questions?</h2>
        <Text className="mb-6 text-gray-600 dark:text-gray-400">
          Can't find what you're looking for? Our support team is here to help.
        </Text>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={helpCenterLink}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Visit Help Center
          </a>
          <a
            href={contactLink}
            className="inline-flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
          >
            Contact Support
          </a>
        </div>
      </CardContent>
    </Card>
  );
}