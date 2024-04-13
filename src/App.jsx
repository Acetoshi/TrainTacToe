import { useState } from 'react'
import { Outlet } from "react-router-dom";
import NavBar from './components/NavBar.jsx'
import './styles/App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

export default App
