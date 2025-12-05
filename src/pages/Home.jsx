import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Filters } from "../components/FiltersForm";

const Home = () => {

  const [perfumes, setPerfumes] = useState([])
  const [selectedPerfume, setSelectedPerfume] = useState(null)
  const [filters, setFilters] = useState({
    name: "",
    brand: "",
    concentration: "",
    genre: "",
    stock: true,
    volumeMl: "",
    price: "",
    description: "",
    image: "",
  })

  const [serverResponse, setServerResponse] = useState({
    success: null,
    notification: null,
    error: {
      fetch: null,
      delete: null,
    }
  })

  const { user, token } = useAuth()

  const fetchPerfumes = async (query = "") => {
    setServerResponse({
      ...serverResponse,
      error: {
        fetch: null,
      }
    })
    try {
      const response = await fetch(`http://localhost:2222/perfumes?${query}`)
      const dataPerfumes = await response.json()
      setPerfumes(dataPerfumes.data.reverse())
      console.log(user)
    } catch (error) {
      setServerResponse({
        success: false,
        notification: "Error al obtener los perfumes",
        ...serverResponse.error, fetch: false
      })
    }
  }

  useEffect(() => {
    fetchPerfumes()
  }, [])

  const deletePerfume = async (idPerfume) => {
    setServerResponse({
      ...serverResponse,
      error: {
        delete: null,
      }
    })

    if (!confirm("Estas seguro de eliminar este perfume?")) return

    try {
      const response = await fetch(`http://localhost:2222/perfumes/${idPerfume}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const dataResponse = await response.json()

      if (dataResponse.error) {
        alert(dataResponse.error)
      }

      setPerfumes(perfumes.filter((p => p._id !== idPerfume)))

      setServerResponse({
        success: true,
        notification: "Perfume eliminado correctamente",
        ...serverResponse.error
      })
    } catch (error) {
      setServerResponse({
        success: false,
        notification: "Error al eliminar el perfume",
        ...serverResponse.error, delete: false
      })
    }
  }

  const handleUpdatePerfume = (p) => {
    setSelectedPerfume(p)
  }

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const query = new URLSearchParams()

    if (filters.name) query.set("name", filters.name)
    if (filters.brand) query.set("brand", filters.brand)
    if (filters.concentration) query.set("concentration", filters.concentration)
    if (filters.genre) query.set("genre", filters.genre)
    if (filters.volumeMl) query.set("volumeMl", filters.volumeMl)
    if (filters.minPrice) query.set("minPrice", filters.minPrice)
    if (filters.maxPrice) query.set("maxPrice", filters.maxPrice)
    if (filters.description) query.set("description", filters.description)
    if (filters.image) query.set("image", filters.image)

    fetchPerfumes(query.toString())
  }

  const handleResetFilters = () => {
    setFilters({
      name: "",
      brand: "",
      concentration: "",
      genre: "",
      stock: true,
      volumeMl: "",
      minPrice: "",
      maxPrice: "",
      description: "",
      image: "",
    })
    fetchPerfumes()
  }

  return (
    <Layout>
      <h1 className="page-banner">Nuestros productos</h1>

      <section className="page-section">
        <p>Bienvenido a nuestra tienda. Aquí encontrarás una amplia variedad de productos diseñados para satisfacer
          tus necesidades. Nuestro compromiso es ofrecer calidad y confianza.
        </p>
      </section>

      <div className="main-content">

        <Filters filters={filters} handleChange={handleChange} handleSubmit={handleSubmit} handleResetFilters={handleResetFilters} />

        <section className="perfumes-grid">
          {
            perfumes.map((p) => (
              <div key={p._id} className="perfume-card">
                <div className="card-image-container">
                  <img src={`http://localhost:2222/perfumes/${p.image}`} alt={`Imagen de ${p.name}`} className="perfume-image" />
                </div>
                <div className="card-content">
                  <h2 className="card-title">{p.name}</h2>
                  <p className="card-brand">{p.brand}</p>
                  <div className="card-details">
                    <span className="card-tag">{p.concentration}</span>
                    <span className="card-tag">{p.genre}</span>
                    <span className="card-tag">{p.volumeMl}ml</span>
                  </div>
                  <p className="card-price">${p.price}</p>
                  {
                    user && (
                      <div className="card-actions">
                        <button onClick={() => handleUpdatePerfume(p)} className="btn btn-primary">Actualizar</button>
                        <button onClick={() => deletePerfume(p._id)} className="btn btn-danger">Eliminar</button>
                      </div>
                    )
                  }
                </div>
              </div>
            ))
          }
        </section>
      </div>
    </Layout>
  );
};

export default Home;