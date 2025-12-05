import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Filters } from "../components/FiltersForm";
import { UpdatePerfume } from "../components/UpdatePerfume";
import ToastMessage from "../components/ToastMessage";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate()

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
  const location = useLocation()

  const fetchPerfumes = async (query = "") => {
    setServerResponse({
      ...serverResponse,
      error: {
        ...serverResponse.error,
        fetch: null,
      }
    })
    try {
      const response = await fetch(`http://localhost:2222/perfumes?${query}`)
      const dataPerfumes = await response.json()
      setPerfumes(dataPerfumes.data.reverse())
    } catch (error) {
      setServerResponse({
        ...serverResponse,
        success: false,
        notification: "Error al obtener los perfumes",
        error: {
          ...serverResponse.error,
          fetch: false
        }
      })
    }
  }

  useEffect(() => {
    fetchPerfumes()
    if (location.state?.notification) {
      setServerResponse({
        success: location.state.success,
        notification: location.state.notification,
        error: { ...serverResponse.error }
      })
      window.history.replaceState({}, document.title)
    }
  }, [])

  const deletePerfume = async (idPerfume) => {
    setServerResponse({
      ...serverResponse,
      error: {
        ...serverResponse.error,
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
        setServerResponse({
          ...serverResponse,
          success: false,
          notification: dataResponse.error,
        })
        return
      }

      setPerfumes(perfumes.filter((p => p._id !== idPerfume)))

      setServerResponse({
        ...serverResponse,
        success: true,
        notification: "Perfume eliminado correctamente",
      })
    } catch (error) {
      setServerResponse({
        ...serverResponse,
        success: false,
        notification: "Error al eliminar el perfume",
        error: {
          ...serverResponse.error,
          delete: false
        }
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

  const inStockPerfumes = perfumes.filter((p) => p.stock === true);
  const outOfStockPerfumes = perfumes.filter((p) => p.stock === false);

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

        {
          selectedPerfume && (
            <UpdatePerfume
              perfume={selectedPerfume}
              onClose={() => setSelectedPerfume(null)}
              onUpdate={(success, msg) => {
                if (success) fetchPerfumes()
                if (msg) setServerResponse({
                  success,
                  notification: msg,
                  error: { ...serverResponse.error }
                })
              }}
            />
          )
        }

        <section className="perfumes-grid">
          {perfumes.length > 0 ? (
            <>
              {inStockPerfumes.map((p, i) => (<div key={p._id} className="perfume-card">
                <div className="card-image-container" onClick={() => navigate(`/get-perfume/${p._id}`)}>
                  <img src={p.image} alt={`Imagen de ${p.name}`} className="perfume-image" />
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
              </div>))}
              {user && outOfStockPerfumes.map((p, i) => (<div key={p._id} className="perfume-card">
                <div className="card-image-container">
                  <img src={p.image} alt={`Imagen de ${p.name}`} className="perfume-image" />
                </div>
                <div className="card-content">
                  <h2 className="card-title">{p.name}</h2>
                  <p className="card-brand">{p.brand}</p>
                  <div className="card-details">
                    <span className="card-tag">{p.concentration}</span>
                    <span className="card-tag">{p.genre}</span>
                    <span className="card-tag">{p.volumeMl}ml</span>
                  </div>
                  <div className="card-details">
                    <p className="card-price">${p.price}</p>
                    <p className="out-of-stock">Agotado</p>
                  </div>
                  {
                    user && (
                      <div className="card-actions">
                        <button onClick={() => handleUpdatePerfume(p)} className="btn btn-primary">Actualizar</button>
                        <button onClick={() => deletePerfume(p._id)} className="btn btn-danger">Eliminar</button>
                      </div>
                    )
                  }
                </div>
              </div>))}
            </>
          ) : (
            <p>No hay perfumes disponibles</p>
          )}
        </section>
      </div>
      {serverResponse.notification && (
        <ToastMessage
          message={serverResponse.notification}
          type={serverResponse.success ? "green" : "red"}
          onClose={() => setServerResponse({ ...serverResponse, notification: null })}
        />
      )}
    </Layout>
  );
};

export default Home;