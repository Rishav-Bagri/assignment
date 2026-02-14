import express from "express"
import assessmentRouter from "./routes/assessment.js"
import questionRouter from "./routes/question.js"
import mcqRouter from "./routes/mcq.js"
import cors from "cors"
import orderingRouter from "./routes/ordering.js"
import hotspotRouter from "./routes/hotspot.js"
import aiRouter from "./routes/ai.js"


const app=express()
app.use(cors())
app.use(express.json())
app.use("/assessment",assessmentRouter)
app.use("/question",questionRouter)
app.use("/mcq",mcqRouter)
app.use("/ordering",orderingRouter)
app.use("/hotspot",hotspotRouter)
app.use("/ai",aiRouter)

app.get("/",(req,res)=>{
    res.json({msg:"hi"})
})

app.listen(3000) 