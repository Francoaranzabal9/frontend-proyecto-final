import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="nav-container">
        <Link to="/" className="logo">El sello dorado</Link>
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Productos</Link>
          <Link to="/sobre-nosotros" className="nav-link">Nosotros</Link>
          {
            !user ? (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/registro" className="nav-link">Registro</Link>
              </>
            ) : (
              <>
                <Link to="/agregar-producto" className="nav-link">Agregar</Link>
                <Link to="/contacto" className="nav-link">Contacto</Link>
                <button onClick={logout} className="btn-logout">Cerrar sesión</button>
              </>
            )
          }
        </nav>
      </div>
    </header>
  );
};

export default Header;