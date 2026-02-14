import express from "express"
import prisma from "../db/db.js"

const mcqRouter = express.Router()


/*

{
  "questionId": "question-uuid",
  "options": [
    { "text": "3", "isCorrect": false, "feedback": "wrong" },
    { "text": "4", "isCorrect": true, "feedback": "correct" }
  ]
}


{
  "mcqs": [
    {
      "questionId": "q1",
      "options": [
        { "text": "a", "isCorrect": false },
        { "text": "b", "isCorrect": true }
      ]
    },
    {
      "questionId": "q2",
      "options": [
        { "text": "x", "isCorrect": true },
        { "text": "y", "isCorrect": false }
      ]
    }
  ]
}
 */

// =====================
// UPLOAD MCQ for a question
// POST /mcq/upload
// =====================
mcqRouter.post("/upload", async (req, res) => {
  const { questionId, options } = req.body

  if (!questionId || !Array.isArray(options)) {
    return res.status(400).json({
      msg: "questionId and options array required",
    })
  }

  const mcq = await prisma.mcqQuestion.create({
    data: {
      questionId,
      options,
    },
  })

  res.status(201).json(mcq)
})


// =====================
// BULK upload MCQs
// POST /mcq/upload/bulk
// =====================
mcqRouter.post("/upload/bulk", async (req, res) => {
  const { mcqs } = req.body

  if (!Array.isArray(mcqs) || mcqs.length === 0) {
    return res.status(400).json({
      msg: "mcqs array required",
    })
  }

  const created = await prisma.mcqQuestion.createMany({
    data: mcqs.map((m) => ({
      questionId: m.questionId,
      options: m.options,
    })),
  })

  res.status(201).json({
    count: created.count,
  })
})


// =====================
// GET MCQ by questionId
// GET /mcq/:id
// =====================
mcqRouter.get("/:id", async (req, res) => {
  const { id } = req.params

  const mcq = await prisma.mcqQuestion.findUnique({
    where: { questionId: id },
  })

  if (!mcq) {
    return res.status(404).json({ msg: "mcq not found" })
  }

  res.json(mcq)
})


// =====================
// GET MCQs in bulk
// GET /mcq/bulk?questionIds=id1,id2
// =====================
mcqRouter.get("/bulk", async (req, res) => {
  const { questionIds } = req.query

  if (!questionIds) {
    return res.status(400).json({
      msg: "questionIds query param required",
    })
  }

  const ids = questionIds.split(",")

  const mcqs = await prisma.mcqQuestion.findMany({
    where: {
      questionId: {
        in: ids,
      },
    },
  })

  res.json({
    count: mcqs.length,
    mcqs,
  })
})

export default mcqRouter
