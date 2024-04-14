import "../styles/GameBoard.css";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient.jsx";

function GameBoard() {
  const [gameBoard, setGameBoard] = useOutletContext();
  // This state indicates whether or not it is the human's turn to play
  const [humanIsNext, setHumanIsNext] = useState(true);
  //This state indicates if the game isn't finished (0) has been won(1), lost(2), or if it's a draw(3).
  const [gameState, setGameState] = useState(0);

  // These states are linked to supabase
  const [fetchError, setFetchError] = useState(null);
  const [weights, setWeigths] = useState(null);

  function handleClick(index) {
    // update the gameboard only if the square hasn't already been played.
    if (humanIsNext && gameBoard[index] === " ") {
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
    // this function is used to fecth data from the backend
    const fetchWeights = async (id) => {
      const { data, error } = await supabase
        .from("knownMoves")
        .select()
        .eq("id", id);

      if (error) {
        setFetchError(() => "Couldnt fetch");
        setWeigths(() => null);
        console.log(error);
      }
      if (data) {
        setWeigths(() => data);
        setFetchError(() => null);
      }
      console.log(data);
    };

    // Check wether or not it is the human's turn to play
    if (!humanIsNext) {
      // check if the game ended
      if (hasTheGameEnded(gameBoard) === 0) {
        // fetch db to see if there is an avalaible response to the current situation
        fetchWeights(toId(gameBoard));

        // if not, just make a random move, with a little timeout.
        setTimeout(() => makeRandomMove(gameBoard), 1000);
      }
    }
  }, [gameBoard]);


  function toId(gameBoard) {
    let gameBoardCopy = [...gameBoard];
    let gameBoardMapped = gameBoardCopy.map((el) => {
      if (el === " ") {
        return "_";
      } else {
        return el;
      }
    });
    return gameBoardMapped.join("");
  }

  function makeRandomMove(gameBoard) {
    setGameBoard((prevGameBoard) => {
      const newGameBoard = [...prevGameBoard];
      newGameBoard[randomMove(gameBoard)] = "O";
      return newGameBoard;
    });
    setHumanIsNext(() => !humanIsNext);
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
        setGameState(() => 1);
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
        setGameState(() => 2);
        return 2;
      }
    }
    // Check for a Draw
    let numberOfMoves = 0;
    for (let i = 0; i < 9; i++) {
      if (gameBoard[i] != " ") {
        numberOfMoves += 1;
      }
    }
    if (numberOfMoves >= 9) {
      setGameState(() => 3);
      return 3;
    }

    // If no end game condition is met, the game continues, NO NEED TO CHANGE THE STATE
    return 0;
  }

  function newGame() {
    console.log("newgame");
    const newBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    setGameBoard(()=>newBoard)
    setGameState(()=>0)
  }

  return (
    <>
      <ul className="gameboard">
        {gameBoard.map((square, index) => (
          <li key={index}>
            {/* This class is used to make sure that the user gets a feeling for which square is clickable and which isn't */}
            <button
              className={humanIsNext && square == " " ? "clickable" : ""}
              onClick={() => handleClick(index)}
            >
              {square}
            </button>
          </li>
        ))}
      </ul>
      {gameState ? <button onClick={newGame}>Rematch</button> : null}
    </>
  );
}

export default GameBoard;

function randomMove(gameBoard) {
  let moveIndex = Math.floor(Math.random() * 8);
  while (gameBoard[moveIndex] != " ") {
    moveIndex = Math.floor(Math.random() * 8);
  }
  return moveIndex;
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
