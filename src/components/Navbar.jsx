import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-content">
        <Link to="/" className="brand"><span className="brand-icon">C</span><span>CINEMA</span></Link>
        <nav>
          <NavLink to="/" end>Главная</NavLink>
          <a href="/#movies">Фильмы</a>
        </nav>
        <span className="nav-note">YOUR MOVIE GUIDE</span>
      </div>
    </header>
  );
}