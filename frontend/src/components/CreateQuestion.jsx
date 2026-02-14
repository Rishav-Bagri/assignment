import { useState } from "react"

export default function Question({ addQuestion, setRefetch }) {
  const [questionType, setQuestionType] = useState("mcq")
  const [stem, setStem] = useState("")
  const [marks, setMarks] = useState(1)
  const [difficulty, setDifficulty] = useState("easy")
  const [bloomLevel, setBloomLevel] = useState("Remember")
  const [learningObjective, setLearningObjective] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  // 🔥 LIFTED STATES
  const [mcqOptions, setMcqOptions] = useState([
    { text: "", correct: false, feedback: "" },
    { text: "", correct: false, feedback: "" }
  ])

  const [orderingItems, setOrderingItems] = useState(["", ""])

  const [hostspotsItems, setHotspotsItems] = useState(["", ""])
  const initialMcqOptions = [
    { text: "", correct: false, feedback: "" },
    { text: "", correct: false, feedback: "" }
  ]

  const initialOrderingItems = ["", ""]

  const handleGenerateAI = async () => {
    if (!stem.trim()) return alert("Enter topic first")

    try {
      setAiLoading(true)

      const response = await fetch("http://localhost:3000/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: stem,
          questionType,
          difficulty,
          bloomLevel
        })
      })
      console.log(response);
      
      if (!response.ok) {
  const errorData = await response.json()
  console.error("Backend Error:", errorData)
  alert(errorData.error || "AI failed")
  return
}
      const data = await response.json()
      // populate common fields
      setStem(data.stem)
      setLearningObjective(data.learningObjective || "")

      if (questionType === "mcq") {
        setMcqOptions(data.options)
      }

      if (questionType === "ordering") {
        setOrderingItems(data.items)
      }

    } catch (err) {
      console.error(err)
      alert("AI generation failed")
    } finally {
      setAiLoading(false)
    }
  }


  const resetForm = () => {
    setQuestionType("mcq")
    setStem("")
    setMarks(1)
    setDifficulty("easy")
    setBloomLevel("remember")
    setLearningObjective("")
    setMcqOptions(initialMcqOptions)
    setOrderingItems(initialOrderingItems)
  }


  const handleSubmit = () => {
    const payload = {
      questionType,
      stem,
      marks,
      content: {}
    }

    if (questionType === "mcq") {
      payload.content.options = mcqOptions
    }

    if (questionType === "ordering") {
      payload.content.items = orderingItems
    }

    addQuestion(payload)
    setRefetch(true)
  }

  return (
    <div className="border border-black -xl p-6 bg-white shadow-sm">
      <div className="grid grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="col-span-1 space-y-2 border-r border-gray-400 pr-6">

          <div>
            <label className="font-bold capital text-black-500">
              question stem
            </label>
            <textarea
              className="border bg-gray-50 border-gray-400 mt-2 px-3  w-full resize-none focus:ring-2 focus:ring-black"
              rows="4"
              value={stem}
              onChange={(e) => setStem(e.target.value)}
            />
          </div>
          <div>
            <label className="font-bold capital text-black-500">
              learning Objective
            </label>
            <textarea
              className="border bg-gray-50 border-gray-400 mt-2 px-3  w-full resize-none focus:ring-2 focus:ring-black"
              rows="1"
              value={learningObjective}
              onChange={(e) => setLearningObjective(e.target.value)}
            />
          </div>
          <div className="flex gap-5">

            <div className="w-full">
              <label className="text-sm text-black font-semibold">type</label>
              <select
                className="border bg-gray-50 border-gray-400 mt-2  py-1  w-full focus:ring-2 focus:ring-black"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
              >
                <option value="mcq">mcq</option>
                <option value="ordering">ordering</option>
                <option value="hotspot">hotspot</option>
              </select>
            </div>
            <div className="w-full">
              <label className="text-sm text-black font-semibold">difficulty</label>
              <select
                className="border bg-gray-50 border-gray-400 mt-2  py-1  w-full focus:ring-2 focus:ring-black"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>
          </div>
          <div className="flex gap-5">

            <div className="w-full">
              <label className="font-semibold">marks</label>
              <div className="flex justify-between">
                <input
                  type="number"
                  min="1"
                  className="border border-gray-400 bg-gray-50 mt-2  py-1  w-full focus:ring-2 focus:ring-black"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="font-semibold">
                bloom
              </label>
              <select
                className="border flex bg-gray-50 border-gray-400 mt-2  py-1  w-full focus:ring-2 focus:ring-black"
                value={bloomLevel}
                onChange={(e) => setBloomLevel(e.target.value)}
              >
                <option value="remember">remember</option>
                <option value="understand">understand</option>
                <option value="apply">apply</option>
                <option value="analyze">analyze</option>
                <option value="evaluate">evaluate</option>
                <option value="create">create</option>
              </select>
            </div>

          </div>
          <div>
            <button
              onClick={handleGenerateAI}
              disabled={aiLoading}
              className="border border-gray-400 bg-gray-50 mt-2 px-3 py-1 rounded-md w-full hover:bg-gray-100 disabled:opacity-50"
            >
              {aiLoading ? "Generating..." : "⚡ Generate with AI"}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-2 space-y-4 flex flex-col">

          {questionType === "mcq" && (
            <MCQ options={mcqOptions} setOptions={setMcqOptions} />
          )}

          {questionType === "ordering" && (
            <Ordering items={orderingItems} setItems={setOrderingItems} />
          )}

          {questionType === "hotspot" && <Hotspot />}

          <div className="flex justify-end ">
            <button
              onClick={() => {
                const payload = {
                  questionType,
                  stem,
                  marks,
                  difficulty,
                  bloomsLevel: bloomLevel,
                  learningObjective,
                  content: {}
                }

                if (questionType === "mcq") {
                  payload.content = {
                    options: mcqOptions
                  }
                }

                if (questionType === "ordering") {
                  payload.content = {
                    items: orderingItems,
                    correctOrder: orderingItems // default
                  }
                }

                if (questionType === "hotspot") {
                  payload.content = {
                    imageUrl: "",   // when implemented
                    zones: []       // when implemented
                  }
                }

                addQuestion(payload)
                setRefetch(true)
                resetForm()
              }}
              className="border border-gray-400 bg-gray-50 mt-2 px-3 py-1  w-1/4 focus:ring-2 focus:ring-black"
            >
              Add Question
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

/* ================================================= */
/* ================= MCQ COMPONENT ================= */
/* ================================================= */

function MCQ({ options, setOptions }) {

  const updateOptionText = (index, value) => {
    const updated = [...options]
    updated[index].text = value
    setOptions(updated)
  }

  const updateFeedback = (index, value) => {
    const updated = [...options]
    updated[index].feedback = value
    setOptions(updated)
  }

  const selectCorrect = (index) => {
    setOptions(
      options.map((opt, i) => ({
        ...opt,
        correct: i === index
      }))
    )
  }

  const addOption = () => {
    setOptions([
      ...options,
      { text: "", correct: false, feedback: "" }
    ])
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">mcq options</h3>
      
      {options.map((opt, i) => (
        <div key={i} className="space-y-2 border p-3 ">

          <div className="flex gap-3 items-center">
            <input
              className="border border-gray-400 px-3 py-2  w-full focus:ring-2 focus:ring-black"
              placeholder={`option ${i + 1}`}
              value={opt.text}
              onChange={(e) => updateOptionText(i, e.target.value)}
            />

            <input
              type="radio"
              checked={opt.correct}
              onChange={() => selectCorrect(i)}
            />
          </div>

          <input
            className="border border-gray-300 px-3 py-1  w-full text-sm"
            placeholder="feedback for this option"
            value={opt.feedback}
            onChange={(e) => updateFeedback(i, e.target.value)}
          />

        </div>
      ))}

      <button
        onClick={addOption}
        className="text-sm border-gray-400 border px-3 py-1  hover:bg-gray-100 transition"
      >
        + add option
      </button>
    </div>
  )
}


/* ================================================= */
/* =============== ORDERING COMPONENT ============= */
/* ================================================= */

function Ordering({ items=[], setItems }) {

  const updateItem = (index, value) => {
    const updated = [...items]
    updated[index] = value
    setItems(updated)
  }

  const addItem = () => {
    setItems([...items, ""])
  }

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
    <div className="space-y-1">
      <h3 className="font-semibold text-lg">ordering items</h3>

      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">

          <div className="w-8 text-center font-medium text-gray-600">
            {i + 1}.
          </div>

          <input
            className="border border-gray-400 px-3 py-2  w-full focus:ring-2 focus:ring-black"
            placeholder={`item ${i + 1}`}
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
          />

          <div className="flex flex-col">
            <button
              onClick={() => moveUp(i)}
              className="text-xs px-2 py-1 border  hover:bg-gray-100"
            >
              ↑
            </button>
            <button
              onClick={() => moveDown(i)}
              className="text-xs px-2 py-1 border  hover:bg-gray-100"
            >
              ↓
            </button>
          </div>

        </div>
      ))}

      <button
        onClick={addItem}
        className="text-sm border-gray-400 border px-3 py-1  hover:bg-gray-100 transition"
      >
        + add item
      </button>
    </div>
  )
}

/* ================================================= */
/* =============== HOTSPOT COMPONENT ============== */
/* ================================================= */

function Hotspot() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">hotspot</h3>

      <div className="border border-gray-400  h-48 flex items-center justify-center text-gray-400">
        image placeholder
      </div>

      <p className="text-sm text-gray-500">
        clickable coordinate zones will be implemented later
      </p>
    </div>
  )
}
