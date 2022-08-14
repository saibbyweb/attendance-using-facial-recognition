import './App.css'
import { Routes, Route } from 'react-router-dom'
import Faculty from '@/pages/Faculty'
import Homepage from '@/pages/Homepage'
import ResponsiveAppBar from '@/components/AppBar'
import Student from '@/pages/Student'
import Admin from '@/pages/Admin'

function App() {

  return (
    <div className="App">
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="student" element={<Student />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App
