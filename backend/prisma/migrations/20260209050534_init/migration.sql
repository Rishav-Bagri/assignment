-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('formative', 'summative');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('mcq', 'ordering', 'hotspot');

-- CreateTable
CREATE TABLE "Assessment" (
    "assessmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mode" "Mode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("assessmentId")
);

-- CreateTable
CREATE TABLE "AssessmentQuestion" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "stem" TEXT NOT NULL,
    "marks" INTEGER NOT NULL DEFAULT 1,
    "difficulty" TEXT,
    "bloomsLevel" TEXT,
    "learningObjective" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "McqQuestion" (
    "questionId" TEXT NOT NULL,
    "options" JSONB NOT NULL,

    CONSTRAINT "McqQuestion_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "OrderingQuestion" (
    "questionId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "correctOrder" JSONB NOT NULL,
    "feedback" TEXT,

    CONSTRAINT "OrderingQuestion_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "HotspotQuestion" (
    "questionId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "zones" JSONB NOT NULL,
    "correctFeedback" TEXT,
    "incorrectFeedback" TEXT,

    CONSTRAINT "HotspotQuestion_pkey" PRIMARY KEY ("questionId")
);

-- AddForeignKey
ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("assessmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "McqQuestion" ADD CONSTRAINT "McqQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssessmentQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderingQuestion" ADD CONSTRAINT "OrderingQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssessmentQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotspotQuestion" ADD CONSTRAINT "HotspotQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssessmentQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
