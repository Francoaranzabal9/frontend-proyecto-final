import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="not-found-container">
        <img src="/sellodorado.webp" alt="logo de la tienda" className="logo-large" />
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe.</p>
        <Link to="/" className="btn btn-primary">
          Volver al Inicio
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
