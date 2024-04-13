import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import "./styles/App.css";

function App() {
  const newBoard = ["", "", "", "", "", "", "", "", ""];
  const [gameBoard, setGameBoard] = useState(newBoard);

  return (
    <>
      <NavBar />
      <Outlet context={[gameBoard, setGameBoard]} />
    </>
  );
}

export default App;
