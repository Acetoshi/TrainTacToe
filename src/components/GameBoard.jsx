import "../styles/GameBoard.css";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

function GameBoard() {
  const [gameBoard, setGameBoard] = useOutletContext();
  // This state indicates whether or not it is the human's turn to play
  const [humanIsNext, setHumanIsNext] = useState(true);
  //This state indicates if the game isn't finished (0) has been won(1), lost(2), or if it's a draw(3).
  const [gameState, setGameState] = useState(0);

  function handleClick(index) {
    // update the gameboard only if the square hasn't already been played.
    if (humanIsNext && (gameBoard[index] === "")) {
      // put in memory the move that was made
      setGameBoard((prevGameBoard) => {
        const newGameBoard = [...prevGameBoard]; // Create a copy of the gameBoard array, otherwise the component didn't re-render, can't use splice here.
        newGameBoard[index] = "X";
        return newGameBoard;
      });
      setHumanIsNext(() => !humanIsNext);
    }
  }

  // this function is triggered everytime the component is re-rendered, we'll use it to call the database to fetch a responding move.
  useEffect(() => {
    if (!humanIsNext) {
      // check if the game ended
      if (hasTheGameEnded(gameBoard) === 0) {
        // fetch db to see if there is an avalaible response to the current situation 

        // if not, just make a random move, with a little timeout.
        setTimeout(()=>makeRandomMove(gameBoard),1000);

      } else {
        // TODO find a way to make all buttons unclickable i.e put a space in the gameBoard state.
        // TODO -> maybe make another use effect ? 

      }
      ;
    }
  }, [gameBoard]);

  function makeRandomMove(gameBoard) {
    setGameBoard((prevGameBoard) => {
      const newGameBoard = [...prevGameBoard];
      newGameBoard[randomMove(gameBoard)] = "O";
      return newGameBoard;
    });
    setHumanIsNext(() => !humanIsNext)
  }

  return (
    <ul className="gameboard">
      {gameBoard.map((square, index) => (
        <li key={index}>
          {/* This class is used to make sure that the user gets a feeling for which square is clickable and which isn't */}
          <button
            className={humanIsNext && square == "" ? "clickable" : ""}
            onClick={() => handleClick(index)}
          >
            {square}
          </button>
        </li>
      ))}
    </ul>
  );
}
export default GameBoard;

function randomMove(gameBoard) {
  let moveIndex = Math.floor(Math.random() * 8);
  while (gameBoard[moveIndex] != "") {
    moveIndex = Math.floor(Math.random() * 8);
  }
  return moveIndex;
}

//This function checks if the game isn't finished (0) has been won(1), lost(2), or if it's a draw(3).
function hasTheGameEnded(gameBoard) {
  //  0 1 2
  //  3 4 5
  //  6 7 8

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 6, 4],
  ];

  //First, convert all the moves of the player to a string, made of the indexes of where he/she has played
  let playerMoves = getMoves(gameBoard, "X");

  //Then check for every winning condition if he/she meets it.
  for (let i = 0; i < 8; i++) {
    if (
      playerMoves.includes(String(winConditions[i][0])) &&
      playerMoves.includes(String(winConditions[i][1])) &&
      playerMoves.includes(String(winConditions[i][2]))
    ) {
      // TODO apply 'winning-cell' to all win conditions that were met

      return 1;
    }
  }
  // Same thing for the computer
  let computerMoves = getMoves(gameBoard, "O");

  //Then check for every winning condition if he/she meets it.
  for (let i = 0; i < 8; i++) {
    if (
      computerMoves.includes(String(winConditions[i][0])) &&
      computerMoves.includes(String(winConditions[i][1])) &&
      computerMoves.includes(String(winConditions[i][2]))
    ) {
      // TODO apply 'winning-cell' to all win conditions that were met

      return 2;
    }
  }
  // Check for a Draw
  let numberOfMoves = 0;
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] != "") {
      numberOfMoves += 1;
    }
  }
  if (numberOfMoves >= 9) {
    return 3;
  }

  // If no end game condition is met, the game continues.
  return 0;
}

function getMoves(gameBoard, playerSymbol) {
  let Moves = "";
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] == playerSymbol) {
      Moves += String(i);
    }
  }
  return Moves;
}
