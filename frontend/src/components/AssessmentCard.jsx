import { useNavigate } from "react-router-dom"

export default function AssessmentCard({ assessment }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/assessment/${assessment.assessmentId}/solve`)}
      className="border rounded p-4 cursor-pointer hover:shadow"
    >
      <h2 className="font-semibold rounded-sm text-lg">{assessment.title}</h2>
    </div>
  )
}
