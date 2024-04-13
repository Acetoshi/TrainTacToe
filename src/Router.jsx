import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GameBoard from "./components/GameBoard.jsx";

// TODO : Figure this out
// this post implies that regular router won't work with gh pages.
// it suggests to use the hashrouter instead
// https://stackoverflow.com/questions/75967389/react-router-dom-wont-work-when-i-deploy-with-gh-pages

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: (
          <>
            <h1>Play Tic Tac Toe against an AI that learns along</h1>
            <GameBoard />
          </>
        ),
      },
      {
        path: "play",
        element: (
          <>
            <h1>Play</h1>
            <GameBoard />
          </>
        ),
      },
      {
        path: "database",
        element: <h1>Database</h1>,
      },
    ],
  },
]);

export default router;
