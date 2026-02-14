import express from "express"
import prisma from "../db/db.js"

const assessmentRouter=express.Router()



assessmentRouter.get("/",async(req,res)=>{
    const data=await prisma.assessment.findMany()

    res.json(data)
})
assessmentRouter.get("/:id",async(req,res)=>{
    const id=req.params.id
    const assessment=await prisma.assessment.findUnique({
        where:{
            assessmentId:id,
        },include:{
            questions:{
                include:{
                    mcq:true,
                    ordering:true,
                    hotspot:true

                }
            }
        }
    })
    if(!assessment.assessmentId){
        res.status(404).json({msg:"no assessmant with that name"})
    }

    res.json(assessment)
})
assessmentRouter.post("/create",async(req,res)=>{
    
    const { title, mode } =await req.body


    if(!mode||!title){
        res.status(400).json({
            msg:"wither mode or title empty"
        })
    }
    const assessment=await prisma.assessment.create({
        data:{
            title,
            mode
        }
    })


    res.status(201).json(assessment)
})



export default assessmentRouter