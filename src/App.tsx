import './App.css'
import { Routes, Route } from 'react-router-dom'
import Professor from './pages/Professor'
import Homepage from './pages/Homepage'

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="professor" element={<Professor />} />
        <Route path="student" element={<br />} />
        <Route path="admin" element={<br />} />
      </Routes>
    </div>
  )
}

export default App
