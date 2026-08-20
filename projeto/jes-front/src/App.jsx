import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './Login/Login'
import Pag from './Home/Paginicial.jsx'
import Aluno from './Aluno/alu.jsx'
function App() {
  

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pag />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Aluno" element={<Aluno />} />
      
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
