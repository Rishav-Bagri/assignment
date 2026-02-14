import { useEffect, useState } from "react"

export default function AttemptQuestion({
  questions = [],
  formative = false
}) {
  const [openId, setOpenId] = useState(null)
  const [expandedData, setExpandedData] = useState({})

  const handleOpen = async (id) => {
    if (openId === id) {
      setOpenId(null)
      return
    }

    setOpenId(id)

    if (expandedData[id]) return

    try {
      const res = await fetch(
        `http://localhost:3000/question/${id}`
      )
      const data = await res.json()

      setExpandedData((prev) => ({
        ...prev,
        [id]: data
      }))
    } catch (err) {
      console.error("Error fetching question:", err)
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
              hover:shadow-md hover:border-black
              transition-all duration-150
            "
          >
            {/* HEADER */}
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
                    {!formative && (
                      <>
                        {q.bloomsLevel && <span>• {q.bloomsLevel}</span>}
                        
                      </>
                    )}
                  </div>
                </div>
                <div>

                  <span className="text-xs px-3 py-1  rounded-full bg-gray-100 border border-gray-300 capitalize">
                    {q.questionType}
                  </span>
                  
                  
                </div>
              </div>
            </div>

            {/* EXPANDED SECTION */}
            {openId === q.id && fullData && (
              <div className="mt-4 border-t border-gray-200 space-y-4 pt-3">

                {/* SUMMATIVE INFO */}
                {!formative && (
                  <div className="p-3 text-sm text-blue-800 space-y-1">



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

                  </div>
                )}

                {/* MCQ */}
                {fullData.questionType === "mcq" && (
                  <MCQAttempt
                    data={fullData}
                    formative={formative}
                  />
                )}

                {/* ORDERING */}
                {fullData.questionType === "ordering" && (
                  <OrderingAttempt
                    data={fullData}
                    formative={formative}
                  />
                )}

              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}


function MCQAttempt({ data, formative }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const correctIndex = data.mcq.options.findIndex(
    (opt) => opt.correct
  )

  const isCorrect = selected === correctIndex

  return (
  <div className="space-y-5">

    {data.mcq.options.map((opt, i) => {
      let classes =
        "border px-4 py-3 -lg cursor-pointer transition-all duration-150"

      if (!submitted) {
        classes +=
          selected === i
            ? " border-black bg-gray-100 shadow-sm"
            : " border-gray-300 hover:border-black hover:bg-gray-50"
      }

      if (submitted) {
        if (i === correctIndex) {
          classes += " border-green-500 bg-green-50"
        } else if (i === selected) {
          classes += " border-red-500 bg-red-50"
        } else {
          classes += " border-gray-200"
        }
      }

      return (
        <div
          key={i}
          onClick={() => !submitted && setSelected(i)}
          className={classes}
        >
          <div className="flex items-center justify-between">
            <span>{opt.text}</span>

            {/* subtle indicator */}
            {submitted && i === correctIndex && (
              <span className="text-green-600 font-semibold">✓</span>
            )}

            {submitted && i === selected && i !== correctIndex && (
              <span className="text-red-600 font-semibold">✕</span>
            )}
          </div>
        </div>
      )
    })}

    {!submitted && (
      <button
        onClick={() => setSubmitted(true)}
        disabled={selected === null}
        className="
          border border-gray-400 bg-gray-50
          px-5 py-2 -lg
          hover:bg-gray-100
          disabled:opacity-50 disabled:cursor-not-allowed
          transition
        "
      >
        Check Answer
      </button>
    )}

    {submitted && selected !== null && (
      <div
        className={`
          p-3 -lg text-sm
          ${
            isCorrect
              ? "text-green-700"
              : "text-red-700"
          }
        `}
      > 
        Feedback:{' '}
        {formative&&data.mcq.options[selected]?.feedback ||
          (isCorrect ? "Correct!" : "Incorrect")}
      </div>
    )}

  </div>
)

}

function OrderingAttempt({ data, formative }) {

  const shuffle = (array) => {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const [items, setItems] = useState(() =>
    shuffle(data.ordering.items)
  )

  const [submitted, setSubmitted] = useState(false)

  const correctOrder = data.ordering.correctOrder

  const isCorrect =
    JSON.stringify(items) === JSON.stringify(correctOrder)

  // 👇 reset + reshuffle when question changes
  useEffect(() => {
    setItems(shuffle(data.ordering.items))
    setSubmitted(false)
  }, [data])

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
    <div className="space-y-4">

      {items.map((item, i) => (
        <div
          key={i}
          className={`
            flex items-center gap-3 border p-3 
            ${
              submitted
                ? isCorrect
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
                : "border-gray-300"
            }
          `}
        >
          <span className="text-gray-500 w-6">
            {i + 1}.
          </span>

          <div className="flex-1">{item}</div>

          {!submitted && (
            <div className="flex flex-col">
              <button onClick={() => moveUp(i)} className="text-xs px-2 py-1 border ">
                ↑
              </button>
              <button onClick={() => moveDown(i)} className="text-xs px-2 py-1 border ">
                ↓
              </button>
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          className="border border-gray-400 bg-gray-50 px-4 py-2 "
        >
          Check Answer
        </button>
      )}

      {submitted && formative && (
        <div className="text-sm pt-2">
          {isCorrect ? "Correct order!" : "Incorrect order"}
        </div>
      )}

    </div>
  )
} 
