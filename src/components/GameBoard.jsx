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
    };

    // Check wether or not it is the human's turn to play
    if (!humanIsNext) {
      // fetch db to see if there is an avalaible response to the current situation
      fetchWeights(toId(gameBoard));
      // the rest is handled in the next hook
    }
  }, [gameBoard]);

  // This hook triggers when the weights are fetched
  useEffect(() => {
    // make sure to make a move only when the game isn't finished (ie gameState is 0)
    if (!humanIsNext && !gameState) {
      if (weights.length === 0) {
        // if the situation isn't known to the database, just make a random move, with a little timeout.
        setTimeout(() => makeRandomMove(gameBoard), 600);
      } else {
        // else if there are weights, take them into account.
        setTimeout(() => makeMoveBasedOnWeights(weights), 600);
      }
    }
  }, [weights]);

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

  function makeMoveBasedOnWeights(weights) {
    // if the situation is know to the database, sum all of the weigths
    let sumOfWeigths = 0;
    for (let i = 0; i < 9; i++) {
      sumOfWeigths += weights[0][`w${i}`];
    }

    //TODO what happens if the sum is O ??

    // then get a random number between 0 and the sum of all weights
    let randomNumber = Math.floor(Math.random() * sumOfWeigths);

    // then find the matching move to play
    console.log(`somme : ${sumOfWeigths} et le random :${randomNumber}`);
    let nextMoveIndex = 0;
    let lowerBound = 0;
    let upperBound = 0;

    for (let i = 0; i < 9; i++) {
      upperBound += weights[0][`w${nextMoveIndex}`];
      if (lowerBound <= randomNumber && upperBound >= randomNumber) {
        break;
      }
      lowerBound += weights[0][`w${nextMoveIndex}`];
      nextMoveIndex++;
    }
    setGameBoard((prevGameBoard) => {
      const newGameBoard = [...prevGameBoard];
      newGameBoard[nextMoveIndex] = "O";
      return newGameBoard;
    });
    setHumanIsNext(() => !humanIsNext);
  }

  // This hooks checks wether or not the game has ended, it is triggered everytime gameBoard changes
  useEffect(() => {
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
    // Same thing for the computer
    let computerMoves = getMoves(gameBoard, "O");

    for (const winCondition of winConditions) {
      // Check if player has met any win condition
      if (
        playerMoves.includes(String(winCondition[0])) &&
        playerMoves.includes(String(winCondition[1])) &&
        playerMoves.includes(String(winCondition[2]))
      ) {
        // TODO apply 'winning-cell' to all win conditions that were met
        setGameState(() => 1);
      }
      // Check if the computer has met any win condition
      if (
        computerMoves.includes(String(winCondition[0])) &&
        computerMoves.includes(String(winCondition[1])) &&
        computerMoves.includes(String(winCondition[2]))
      ) {
        // TODO apply 'winning-cell' or give visual feedback
        setGameState(() => 2);
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
    }

    // If no end game condition is met, the game continues, NO NEED TO CHANGE THE STATE
  }, [gameBoard]);

  function newGame() {
    const newBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    setGameBoard(() => newBoard);
    setGameState(() => 0);
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
      <p>{gameState}</p>
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
