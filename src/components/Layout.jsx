import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  const { isSessionExpired, closeSessionExpiredModal } = useAuth();

  return (
    <>
      <Header />
      <main className="main-layout">{children}</main>
      <Footer />

      {isSessionExpired && (
        <div className="modal-overlay session-expired-overlay">
          <div className="modal session-expired-modal">
            <h2 className="session-expired-title">Sesión Expirada</h2>
            <p className="session-expired-message">Tu sesión ha caducado por seguridad. Por favor, inicia sesión nuevamente para continuar.</p>
            <div className="session-expired-actions">
              <Link to="/login" className="btn btn-primary" onClick={closeSessionExpiredModal}>
                Iniciar Sesión
              </Link>
              <button className="btn btn-secondary" onClick={closeSessionExpiredModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;