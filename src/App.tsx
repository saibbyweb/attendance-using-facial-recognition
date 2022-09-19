import './App.css'
import { Routes, Route } from 'react-router-dom'
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@mui/material/styles";

import Faculty from '@/pages/Faculty'
import Homepage from '@/pages/Homepage'
import ResponsiveAppBar from '@/components/AppBar'
import Student from '@/pages/Student'
import Admin from '@/pages/Admin'

export const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#4e6b8d',
      dark: '#1e1e1e',
      contrastText: '#fff',
    },
    secondary: {
      light: '#4c6fed',
      main: '#0a1338',
      dark: '#495c4f',
      contrastText: '#e5e0e0',
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="student" element={<Student />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
    </div>
    </ThemeProvider>
    
  )
}

export default App
