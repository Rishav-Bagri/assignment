import express from "express"
import prisma from "../db/db.js"

const hotspotRouter = express.Router()



/*
/hotspot/upload
{
  "questionId": "question-uuid",
  "imageUrl": "https://example.com/heart.png",
  "zones": [
    { "x": 120, "y": 80, "radius": 20 },
    { "x": 200, "y": 150, "radius": 25 }
  ],
  "correctFeedback": "correct area",
  "incorrectFeedback": "try again"
}

/hotspot/upload/bulk
{
  "hotspots": [
    {
      "questionId": "q1",
      "imageUrl": "https://example.com/img1.png",
      "zones": [{ "x": 10, "y": 20, "radius": 15 }]
    },
    {
      "questionId": "q2",
      "imageUrl": "https://example.com/img2.png",
      "zones": [{ "x": 50, "y": 60, "radius": 18 }],
      "correctFeedback": "nice",
      "incorrectFeedback": "nope"
    }
  ]
}

*/

// =====================
// UPLOAD hotspot question
// POST /hotspot/upload
// =====================
hotspotRouter.post("/upload", async (req, res) => {
  const {
    questionId,
    imageUrl,
    zones,
    correctFeedback,
    incorrectFeedback,
  } = req.body

  if (!questionId || !imageUrl || !zones) {
    return res.status(400).json({
      msg: "questionId, imageUrl and zones are required",
    })
  }

  const hotspot = await prisma.hotspotQuestion.create({
    data: {
      questionId,
      imageUrl,
      zones,
      correctFeedback,
      incorrectFeedback,
    },
  })

  res.status(201).json(hotspot)
})


// =====================
// BULK upload hotspot questions
// POST /hotspot/upload/bulk
// =====================
hotspotRouter.post("/upload/bulk", async (req, res) => {
  const { hotspots } = req.body

  if (!Array.isArray(hotspots) || hotspots.length === 0) {
    return res.status(400).json({
      msg: "hotspots array required",
    })
  }

  const created = await prisma.hotspotQuestion.createMany({
    data: hotspots.map((h) => ({
      questionId: h.questionId,
      imageUrl: h.imageUrl,
      zones: h.zones,
      correctFeedback: h.correctFeedback,
      incorrectFeedback: h.incorrectFeedback,
    })),
  })

  res.status(201).json({
    count: created.count,
  })
})


// =====================
// GET hotspot by questionId
// GET /hotspot/:id
// =====================
hotspotRouter.get("/:id", async (req, res) => {
  const { id } = req.params

  const hotspot = await prisma.hotspotQuestion.findUnique({
    where: { questionId: id },
  })

  if (!hotspot) {
    return res.status(404).json({ msg: "hotspot question not found" })
  }

  res.json(hotspot)
})


// =====================
// GET hotspots in bulk
// GET /hotspot/bulk?questionIds=id1,id2
// =====================
hotspotRouter.get("/bulk", async (req, res) => {
  const { questionIds } = req.query

  if (!questionIds) {
    return res.status(400).json({
      msg: "questionIds query param required",
    })
  }

  const ids = questionIds.split(",")

  const hotspots = await prisma.hotspotQuestion.findMany({
    where: {
      questionId: {
        in: ids,
      },
    },
  })

  res.json({
    count: hotspots.length,
    hotspots,
  })
})

export default hotspotRouter
