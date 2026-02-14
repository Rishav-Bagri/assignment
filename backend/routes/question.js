import express from "express"
import prisma from "../db/db.js"

const questionRouter = express.Router()

// =====================
// CREATE single question
// POST /questions/create
// =====================
questionRouter.post("/create", async (req, res) => {
  const {
    assessmentId,
    questionType,
    stem,
    marks,
    difficulty,
    bloomsLevel,
    learningObjective,
  } = req.body

  if (!assessmentId || !questionType || !stem) {
    return res.status(400).json({
      msg: "assessmentId, questionType and stem are required",
    })
  }

  const question = await prisma.assessmentQuestion.create({
    data: {
      assessmentId,
      questionType,
      stem,
      marks: marks ?? 1,
      difficulty,
      bloomsLevel,
      learningObjective,
    },
  })

  res.status(201).json(question)
})


questionRouter.post("/create-full", async (req, res) => {
  const {
    assessmentId,
    questionType,
    stem,
    marks,
    difficulty,
    bloomsLevel,
    learningObjective,
    content,
  } = req.body

  if (!assessmentId || !questionType || !stem) {
    return res.status(400).json({
      msg: "missing required fields",
    })
  }

  try {
    const result = await prisma.$transaction(async (tx) => {

      const question = await tx.assessmentQuestion.create({
        data: {
          assessmentId,
          questionType,
          stem,
          marks: marks ?? 1,
          difficulty,
          bloomsLevel,
          learningObjective,
        },
      })

      if (questionType === "mcq") {
        await tx.mcqQuestion.create({
          data: {
            questionId: question.id,
            options: content.options ?? [],
          },
        })
      }

      if (questionType === "ordering") {
        await tx.orderingQuestion.create({
          data: {
            questionId: question.id,
            items: content.items ?? [],
            correctOrder: content.correctOrder ?? content.items ?? [],
          },
        })
      }

      if (questionType === "hotspot") {
        await tx.hotspotQuestion.create({
          data: {
            questionId: question.id,
            imageUrl: content.imageUrl ?? "",
            zones: content.zones ?? [],
          },
        })
      }

      return question
    })

    res.status(201).json(result)

  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "something went wrong" })
  }
})



// =====================
// BULK create questions
// POST /questions/bulk
// =====================
questionRouter.post("create/bulk", async (req, res) => {
  const { questions } = req.body

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ msg: "questions array required" })
  }

  const created = await prisma.assessmentQuestion.createMany({
    data: questions.map((q) => ({
      assessmentId: q.assessmentId,
      questionType: q.questionType,
      stem: q.stem,
      marks: q.marks ?? 1,
      difficulty: q.difficulty,
      bloomsLevel: q.bloomsLevel,
      learningObjective: q.learningObjective,
    })),
  })

  res.status(201).json({
    count: created.count,
  })
})

questionRouter.get("/bulk", async (req, res) => {
  const { assessmentId } = req.query

  if (!assessmentId) {
    return res.status(400).json({
      msg: "assessmentId query param required",
    })
  }

  const questions = await prisma.assessmentQuestion.findMany({
    where: {
      assessmentId,
    },
    select: {
      id: true,
      stem: true,
      questionType: true,
      marks: true,
      difficulty:true,
      bloomsLevel:true
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  res.json({
    count: questions.length,
    questions,
  })
})

// =====================
// GET question by id
// GET /questions/:id
// =====================
questionRouter.get("/:id", async (req, res) => {
  const { id } = req.params

  const question = await prisma.assessmentQuestion.findUnique({
    where: { id },
    include: {
      mcq: true,
      ordering: true,
      hotspot: true,
    },
  })

  if (!question) {
    return res.status(404).json({ msg: "question not found" })
  }

  res.json(question)
})

export default questionRouter
