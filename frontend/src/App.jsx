import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import CreateAssessment from "./pages/CreateAssessment"
import EditAssessment from "./pages/EditAssessment"
import Question from "./components/CreateQuestion"
import AttemptQuestion from "./components/AttemptQuestion"
import SolveAssessment from "./pages/SolveAssessment"

function App() {
  const navigate=useNavigate()
  return (
    // <AttemptQuestion ></AttemptQuestion>
    <div>
      <div onClick={()=>{
        navigate("/")
      }}
      className="px-10 ml-10 w-fit bg-red-100 cursor-pointer uppercase font-bold"
      >
        home
      </div>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/assessment/new" element={<CreateAssessment />} />
        <Route path="/assessment/:id/edit" element={<EditAssessment />} />
        <Route path="/assessment/:id/solve" element={<SolveAssessment></SolveAssessment>}/>

      </Routes>
    </div>
  )
}
export default App
