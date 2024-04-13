import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
  return (
    <>
      <nav>
        <h2>Train Tac Toe</h2>
        <ul>
          <li>
            <NavLink to="">Home</NavLink>
          </li>
          <li>
            <NavLink to="play">Play</NavLink>
          </li>
          <li>
            <NavLink to="database">Database</NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default NavBar;
