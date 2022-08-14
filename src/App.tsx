import './App.css'
import { Routes, Route } from 'react-router-dom'
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@mui/material/styles";

import Faculty from '@/pages/Faculty'
import Homepage from '@/pages/Homepage'
import ResponsiveAppBar from '@/components/AppBar'
import Student from '@/pages/Student'
import Admin from '@/pages/Admin'

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#a38080',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
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
