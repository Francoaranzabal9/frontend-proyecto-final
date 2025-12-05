import Layout from "../components/Layout";

const AboutUs = () => {
  return (
    <Layout>
      <h1 className="page-banner">Sobre Nosotros</h1>

      <section className="page-section">
        <p>
          Somos un emprendimiento joven apasionado por el mundo de las fragancias.
          Nos dedicamos a traer los mejores perfumes importados, seleccionados cuidadosamente
          para ofrecerte calidad, distinción y precios competitivos.
        </p>
      </section>

      <div className="about-grid">

        <div className="about-card">
          <h3 className="about-card-title">Nuestra Pasión</h3>
          <p className="about-card-text">
            Nacimos del amor por los aromas únicos. Creemos que un perfume es la firma invisible de cada persona,
            y trabajamos para ayudarte a encontrar el tuyo.
          </p>
        </div>

        <div className="about-card">
          <h3 className="about-card-title">Calidad Importada</h3>
          <p className="about-card-text">
            Garantizamos la autenticidad de todos nuestros productos. Trabajamos con proveedores de confianza
            para asegurar que recibas solo lo mejor del mercado internacional.
          </p>
        </div>

        <div className="about-card">
          <h3 className="about-card-title">Espíritu Joven</h3>
          <p className="about-card-text">
            Como equipo joven, entendemos las tendencias actuales y buscamos innovar en tu experiencia de compra,
            haciéndola ágil, segura y personalizada.
          </p>
        </div>

      </div>
    </Layout>
  );
};

export default AboutUs;