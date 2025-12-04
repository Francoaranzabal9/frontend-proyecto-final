import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav>
      <Link to="/">Nuestros productos</Link>
      <Link to="/sobre-nosotros">Sobre nosotros</Link>
      {
        !user ? <>
          <Link to="/login">Login</Link>
          <Link to="/registro">Registro</Link>
        </> : <>
          <Link to="/agregar-producto">Agregar producto</Link>
          <Link to="/contacto">Contacto</Link>
          <button>Cerrar sesion</button>
        </>

      }
    </nav>
  );
};

export default Header;