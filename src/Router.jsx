import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GameBoard from "./components/GameBoard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <h1>Home</h1>,
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
