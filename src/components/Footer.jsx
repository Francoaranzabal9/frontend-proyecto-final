import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-main">

        <div className="footer-column">
          <h3 className="footer-logo">SELLO DORADO</h3>
          <p className="footer-description">
            Descubre la esencia de la elegancia. Ofrecemos una selección curada de las mejores fragancias y decants del mercado.
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/elsellodorado_/" target="_blank" rel="noopener noreferrer" className="social-icon"><FaInstagram /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon"><FaFacebookF /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon"><FaTwitter /></a>
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Explorar</h4>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/sobre-nosotros">Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Contacto</h4>
          <ul className="contact-info">
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>General Belgrano, Pcia. de Buenos Aires, Argentina</span>
            </li>
            <li>
              <FaWhatsapp className="contact-icon" />
              <span>+54 9 2241 60-3694</span>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <span>info@sellodorado.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Sello Dorado. Todos los derechos reservados.</p>
        <div className="footer-creator">
          Sitio creado por <a href="https://github.com/francoaranzabal9" target="_blank" rel="noopener noreferrer">Juan Franco Aranzabal</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;