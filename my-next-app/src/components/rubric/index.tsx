// components/Rubric.tsx
import { useEffect, useState } from "react";
import { profileRubrics } from "@/components/CustomizeInterview";
import { Loader2 } from "lucide-react";
interface Topic {
  id: string;
  name: string;
  description: string;
}

interface RubricProps {
  roomId: string;
}

const Rubric = ({ roomId }: RubricProps) => {
  const [rubricTopics, setRubricTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const res = await fetch(`/api/interview/${roomId}`);
        const interview = await res.json();

        const questions: string[] = interview?.jobDescription?.questions || [];

        const matchedTopics: Topic[] = [];

        Object.values(profileRubrics).forEach((categoryArr) => {
          categoryArr.forEach((category) => {
            category.topics.forEach((topic) => {
              if (questions.includes(topic.id)) {
                matchedTopics.push(topic);
              }
            });
          });
        });

        setRubricTopics(matchedTopics);
      } catch (err) {
        console.error("Failed to load rubric topics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRubrics();
  }, [roomId]);

  return (
    <div className="flex-1 overflow-y-auto pr-6">
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : rubricTopics.length === 0 ? (
        <p className="text-center py-4">
          No rubric topics matched for this interview.
        </p>
      ) : (
        <ul className="space-y-4">
          {rubricTopics.map((topic) => (
            <li
              key={topic.id}
              className="border border-gray-700 p-3 rounded-lg bg-[#262f38]"
            >
              <h3 className="font-medium text-lg text-gray-200">
                {topic.name}
              </h3>
              <p className="text-sm text-gray-400">{topic.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Rubric;
