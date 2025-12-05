import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

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
                <Link to="/agregar-producto" className="nav-link">Agregar Producto</Link>
                <Link to="/contacto" className="nav-link">Contacto</Link>
                <Link to="/carrito" className="nav-link cart-link">
                  <FaShoppingCart />
                  {getCartCount() > 0 && (
                    <span className="cart-badge">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
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