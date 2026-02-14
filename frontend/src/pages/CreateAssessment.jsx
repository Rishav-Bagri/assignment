import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CreateAssessment() {
  const [title, setTitle] = useState("")
  const [mode, setMode] = useState("formative")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const createAssessment = async () => {
    if (!title.trim()) {
      setError("assessment title is required")
      return
    }

    setError("")

    const res = await fetch("http://localhost:3000/assessment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, mode }),
    })

    const assessment = await res.json()
    navigate(`/assessment/${assessment.assessmentId}/edit`)
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">create assessment</h1>

      <form
        onSubmit={e => {
          e.preventDefault()
          createAssessment()
        }}
        className="space-y-4"
      >
        {/* title input */}
        <div>
          <input
            className={`border px-3 py-2  w-full focus:outline-none focus:ring-2 focus:ring-black transition ${error ? "border-red-500 focus:ring-red-500" : ""
              }`}
            placeholder="assessment title"
            value={title}
            onChange={e => {
              setTitle(e.target.value)
              if (error) setError("")
            }}
          />

          {error && (
            <p className="text-red-500 text-sm mt-1">
              {error}
            </p>
          )}
        </div>



        {/* submit */}
        <button
          type="submit"
          // disabled={!title.trim()}
          className="
            bg-black text-white px-4 py-2  w-full
            hover:bg-gray-800
            focus-visible:bg-gray-800
            active:scale-[0.98]
            disabled:bg-gray-400 disabled:cursor-not-allowed
            transition
          "
        >
          create assessment
        </button>
      </form>
      

    </div>
  )
}
