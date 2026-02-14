

import { useState } from "react"

export default function ShowQuestion({ questions = [] }) {
  const [openId, setOpenId] = useState(null)
  const [expandedData, setExpandedData] = useState({})
  const [loadingId, setLoadingId] = useState(null)

  const handleOpen = async (id) => {
    if (openId === id) {
      setOpenId(null)
      return
    }

    setOpenId(id)

    // already fetched
    if (expandedData[id]) return

    try {
      setLoadingId(id)

      const res = await fetch(`http://localhost:3000/question/${id}`)
      const data = await res.json()

      setExpandedData((prev) => ({
        ...prev,
        [id]: data
      }))
    } catch (err) {
      console.error("Error fetching question:", err)
    } finally {
      setLoadingId(null)
    }
  }

  if (!questions.length) {
    return (
      <div className="text-gray-500 text-center py-6">
        no questions yet
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((q, index) => {
        const fullData = expandedData[q.id]

        return (
          <div
            key={q.id}
            className="
              border border-gray-300 -lg p-4  
              hover:shadow-md hover:border-black hover:bg-gray-50
              transition-all duration-150
            "
          >
            {/* Header */}
            <div
              onClick={() => handleOpen(q.id)}
              className="cursor-pointer"
            >
              <div className="flex justify-between items-start">

                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">
                    <span className="text-gray-400 mr-2">
                      Q{index + 1}.
                    </span>
                    {q.stem}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{q.marks} marks</span>
                    {q.difficulty && <span>• {q.difficulty}</span>}
                    {q.bloomsLevel && <span>• {q.bloomsLevel}</span>}
                  </div>
                </div>

                <span
                  className="
                    text-xs px-3 py-1 -full
                    bg-gray-100 border border-gray-300
                    capitalize
                  "
                >
                  {q.questionType}
                </span>
              </div>
            </div>

            {/* Expand */}
            {openId === q.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">

                {loadingId === q.id && (
                  <div className="text-gray-500">loading...</div>
                )}{fullData&&
                <div className="p-3 mb-4 pb-4 text-sm text-blue-800 space-y-1">
                  {fullData.learningObjective && (
                    <div>
                      <span className="font-medium">
                        Learning Outcome:
                      </span>
                      <span className="px-2">
                        {fullData.learningObjective}
                      </span>
                    </div>
                  )}

                </div>}
                {fullData && fullData.questionType === "mcq" && (
                  <MCQAttempt data={fullData.mcq} />
                )}

                {fullData && fullData.questionType === "ordering" && (
                  <OrderingAttempt data={fullData.ordering} />
                )}

                {fullData && fullData.questionType === "hotspot" && (
                  <div className="text-gray-500">
                    hotspot attempt coming soon
                  </div>
                )}

              </div>
            )}

          </div>
        )
      })}

    </div>
  )
}

function MCQAttempt({ data }) {
  const [selected, setSelected] = useState(null)

  if (!data) return null

  return (
    <div className="space-y-3">
      {data.options.map((opt, i) => (
        <div
          key={i}
          onClick={() => setSelected(i)}
          className={`
            border px-4 py-2  cursor-pointer
            ${selected === i ? "border-black bg-gray-100" : "border-gray-300"}
          `}
        >
          {opt.text}
        </div>
      ))}
    </div>
  )
}
function OrderingAttempt({ data }) {
  const [items, setItems] = useState(data?.items || [])

  if (!data) return null

  const moveUp = (index) => {
    if (index === 0) return
    const updated = [...items]
      ;[updated[index - 1], updated[index]] =
        [updated[index], updated[index - 1]]
    setItems(updated)
  }

  const moveDown = (index) => {
    if (index === items.length - 1) return
    const updated = [...items]
      ;[updated[index + 1], updated[index]] =
        [updated[index], updated[index + 1]]
    setItems(updated)
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 border p-3 ">
          <span className="text-gray-500 w-6">{i + 1}.</span>
          <div className="flex-1">{item}</div>
          <div className="flex flex-col">
            <button onClick={() => moveUp(i)} className="text-xs px-2 py-1 border ">↑</button>
            <button onClick={() => moveDown(i)} className="text-xs px-2 py-1 border ">↓</button>
          </div>
        </div>
      ))}
    </div>
  )
}
