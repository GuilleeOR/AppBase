import { Link } from "react-router-dom";

interface HeaderProps {
    className?: string
}

const Header: React.FC<HeaderProps> = ({className}) => {
  return (
    <header className={className}>
      <nav className="nav">
        <ul className="nav-list">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/creacioncomprimido">Creacion Comprimido</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
