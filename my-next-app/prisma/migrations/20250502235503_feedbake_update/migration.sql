/*
  Warnings:

  - You are about to drop the column `communicationScore` on the `InterviewFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `feedbackText` on the `InterviewFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `givenById` on the `InterviewFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `problemSolvingScore` on the `InterviewFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `qAndAWithScore` on the `InterviewFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `skillRatings` on the `InterviewFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Interviewee` table. All the data in the column will be lost.
  - Added the required column `candidateInfo` to the `InterviewFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailedAssessment` to the `InterviewFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interviewQuestions` to the `InterviewFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technicalSkills` to the `InterviewFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InterviewFeedback" DROP COLUMN "communicationScore",
DROP COLUMN "feedbackText",
DROP COLUMN "givenById",
DROP COLUMN "problemSolvingScore",
DROP COLUMN "qAndAWithScore",
DROP COLUMN "skillRatings",
ADD COLUMN     "candidateInfo" JSONB NOT NULL,
ADD COLUMN     "detailedAssessment" JSONB NOT NULL,
ADD COLUMN     "interviewQuestions" JSONB NOT NULL,
ADD COLUMN     "technicalSkills" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Interviewee" DROP COLUMN "description";
