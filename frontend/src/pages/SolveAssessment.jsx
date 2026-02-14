import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AttemptQuestion from "../components/AttemptQuestion"

export default function SolveAssessment() {
  const { id } = useParams()

  const [assessment, setAssessment] = useState(null)
  const [questions, setQuestions] = useState([])
  const [formative, setFormative] = useState(true)

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
  }, [id])

  if (!assessment) {
    return <div className="p-6">loading...</div>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            {assessment.title}
          </h1>
          <p className="text-gray-500 mt-1">
            Solve Assessment
          </p>
        </div>

        {/* MODE TOGGLE */}
        <div className="flex rounded items-center gap-3">

          <span className="rounded text-sm text-gray-600">
            {formative ? "Formative" : "Summative"}
          </span>

          <button
            onClick={() => setFormative(!formative)}
            className={`
              w-14 h-7 flex rounded-full items-center -full p-1
              transition
              ${formative ? "bg-blue-500" : "bg-gray-400"}
            `}
          >
            <div
              className={`
                bg-white rounded-full w-5 h-5 -full shadow
                transform transition
                ${formative ? "translate-x-7" : ""}
              `}
            />
          </button>

        </div>

      </div>

      {/* QUESTIONS */}
      {questions.length === 0 ? (
        <div className="text-gray-500 text-center">
          no questions available
        </div>
      ) : (
        <AttemptQuestion
          questions={questions}
          formative={formative}
        />
      )}

    </div>
  )
}
