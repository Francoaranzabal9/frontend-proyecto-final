import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="nav-container">
        <Link to="/" onClick={closeMenu}>
          <img src="/sellodorado.webp" alt="logo de la tienda" className="logo" />
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Productos</Link>
          <Link to="/sobre-nosotros" className="nav-link" onClick={closeMenu}>Nosotros</Link>
          {
            !user ? (
              <>
                <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                <Link to="/registro" className="nav-link" onClick={closeMenu}>Registro</Link>
              </>
            ) : (
              <>
                <Link to="/agregar-producto" className="nav-link" onClick={closeMenu}>Agregar Producto</Link>
                <Link to="/contacto" className="nav-link" onClick={closeMenu}>Contacto</Link>
                <Link to="/carrito" className="nav-link cart-link" onClick={closeMenu}>
                  <FaShoppingCart />
                  {getCartCount() > 0 && (
                    <span className="cart-badge">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
                <button onClick={() => { logout(); closeMenu(); }} className="btn-logout">Cerrar sesión</button>
              </>
            )
          }
        </nav>
      </div>
    </header>
  );
};

export default Header;