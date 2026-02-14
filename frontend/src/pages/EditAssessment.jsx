import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Question from "../components/CreateQuestion"
import ShowQuestion from "../components/ShowQuestion"

export default function EditAssessment() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [assessment, setAssessment] = useState(null)
  const [questions, setQuestions] = useState([])
  const [showForm,setShowForm]=useState(0)
  const[refetch,setRefetch]=useState(false)
  // fetch assessment
  useEffect(() => {
    fetch(`http://localhost:3000/assessment/${id}`)
      .then(res => res.json())
      .then(data => setAssessment(data))
  }, [id])

  // fetch bulk questions
  useEffect(() => {
    fetch(`http://localhost:3000/question/bulk?assessmentId=${id}`)
      .then(res => res.json())
      .then(data => setQuestions(data.questions || []))
      setRefetch(false)
  }, [id,refetch])
    
const addQuestion = async (data) => {
  try {
    const payload=JSON.stringify({
        assessmentId: id,
        ...data,
      })
    const res = await fetch("http://localhost:3000/question/create-full", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload 
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.msg || "server error")
    }
    setRefetch(true)
    const result = await res.json()
    console.log(result)

  } catch (err) {
    console.error("Error creating question:", err)
  }
}


  const addForm = async () => {
    setShowForm(true)
  }

  if (!assessment) {
    return <div className="p-6">loading...</div>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{assessment.title}</h1>
      </div>

      {/* DIVIDER + BUTTON */}
      <div className="flex  items-center my-8">
        <div className="flex-1 h-px bg-gray-300" />
        {showForm?<div>
            <Question  addQuestion={addQuestion} setRefetch={setRefetch}/>
        </div>
        :
        <button
            onClick={addForm}
            className="
                mx-4 w-10 h-10 flex items-center justify-center
                border  rounded-full
                text-xl font-semibold
                hover:bg-gray-100
                active:scale-[0.95]
                transition
            "
            >
            +
            </button>
        }   
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* QUESTION LIST */}
      {questions.length === 0 ? (
        <div className="text-gray-500 text-center">
          no questions yet
        </div>
      ) : (
        <ShowQuestion questions={questions}/>
      )}

    </div>
  )
}
