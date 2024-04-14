import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import "./styles/App.css";

function App() {
  const newBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  const [gameBoard, setGameBoard] = useState(newBoard);
  const [history, setHistory] = useState({moves:[],outcome:0});

  // history= {
  //   'moves': [{
  //     'player':'AI',
  //     'gameBoard':[],
  //     'move':1
  //   }],
  //   'outcome':0
  // }

  return (
    <>
      <NavBar />
      <Outlet context={[gameBoard, setGameBoard, history, setHistory]} />
    </>
  );
}

export default App;
