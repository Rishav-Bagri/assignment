import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AssessmentCard from "../components/AssessmentCard"

export default function Home() {
  const [assessments, setAssessments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:3000/assessment/")
      .then(res => res.json())
      .then(data => setAssessments(data))
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">assessments</h1>

        <button
          onClick={() => navigate("/assessment/new")}
          className="bg-black text-white px-4 py-2 "
        >
          + new assessment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map(a => (
          <AssessmentCard key={a.assessmentId} assessment={a} />
        ))}
      </div>
    </div>
  )
}
