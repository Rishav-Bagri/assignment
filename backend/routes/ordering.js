import express from "express"
import prisma from "../db/db.js"

const orderingRouter = express.Router()

/*
{
  "questionId": "question-uuid",
  "items": ["evaporation", "condensation", "precipitation"],
  "correctOrder": [0, 1, 2],
  "feedback": "water cycle steps"
}
 */


// =====================
// UPLOAD ordering question
// POST /ordering/upload
// =====================
orderingRouter.post("/upload", async (req, res) => {
  const { questionId, items, correctOrder, feedback } = req.body

  if (!questionId || !items || !correctOrder) {
    return res.status(400).json({
      msg: "questionId, items and correctOrder are required",
    })
  }

  const ordering = await prisma.orderingQuestion.create({
    data: {
      questionId,
      items,
      correctOrder,
      feedback,
    },
  })

  res.status(201).json(ordering)
})


// =====================
// BULK upload ordering questions
// POST /ordering/upload/bulk
// =====================
orderingRouter.post("/upload/bulk", async (req, res) => {
  const { orderings } = req.body

  if (!Array.isArray(orderings) || orderings.length === 0) {
    return res.status(400).json({
      msg: "orderings array required",
    })
  }

  const created = await prisma.orderingQuestion.createMany({
    data: orderings.map((o) => ({
      questionId: o.questionId,
      items: o.items,
      correctOrder: o.correctOrder,
      feedback: o.feedback,
    })),
  })

  res.status(201).json({
    count: created.count,
  })
})


// =====================
// GET ordering question by questionId
// GET /ordering/:id
// =====================
orderingRouter.get("/:id", async (req, res) => {
  const { id } = req.params

  const ordering = await prisma.orderingQuestion.findUnique({
    where: { questionId: id },
  })

  if (!ordering) {
    return res.status(404).json({ msg: "ordering question not found" })
  }

  res.json(ordering)
})


// =====================
// GET ordering questions in bulk
// GET /ordering/bulk?questionIds=id1,id2
// =====================
orderingRouter.get("/bulk", async (req, res) => {
  const { questionIds } = req.query

  if (!questionIds) {
    return res.status(400).json({
      msg: "questionIds query param required",
    })
  }

  const ids = questionIds.split(",")

  const orderings = await prisma.orderingQuestion.findMany({
    where: {
      questionId: {
        in: ids,
      },
    },
  })

  res.json({
    count: orderings.length,
    orderings,
  })
})

export default orderingRouter
