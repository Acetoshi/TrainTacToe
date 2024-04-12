import { createBrowserRouter } from "react-router-dom";
import App from './App.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
    {
    path :'',
    element:<h1>Home</h1>
    },
     {
    path :'play',
    element:<h1>Play</h1>
    }
    ]
  }
]);

export default router;