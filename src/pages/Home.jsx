import { useEffect, useState } from "react";
import { FaSlidersH, FaChevronDown } from 'react-icons/fa';
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Filters } from "../components/FiltersForm";
import { UpdatePerfume } from "../components/UpdatePerfume";
import ToastMessage from "../components/ToastMessage";
import BannerSection from "../components/BannerSection";
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

  const [priceLimits, setPriceLimits] = useState({ min: 0, max: 1000000 });
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('relevance');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

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
      const response = await fetch(`https://api-sello-dorado.onrender.com/perfumes?${query}`)
      const dataPerfumes = await response.json()
      setPerfumes(dataPerfumes.data.reverse())

      if (!initialLoadDone && query === "") {
        const prices = dataPerfumes.data.map(p => Number(p.price));
        if (prices.length > 0) {
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          setPriceLimits({ min, max });
          setPriceLimits({ min, max });
          setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
        }
        setInitialLoadDone(true);
      }
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
      const response = await fetch(`https://api-sello-dorado.onrender.com/perfumes/${idPerfume}`, {
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

  const handleBannerSearch = (searchCriteria) => {
    const newFilters = {
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
      ...searchCriteria
    };

    setFilters(newFilters);

    const query = new URLSearchParams();
    if (newFilters.name) query.set("name", newFilters.name);
    if (newFilters.genre) query.set("genre", newFilters.genre);
    if (newFilters.brand) query.set("brand", newFilters.brand);
    if (newFilters.concentration) query.set("concentration", newFilters.concentration);
    if (newFilters.volumeMl) query.set("volumeMl", newFilters.volumeMl);
    if (newFilters.minPrice) query.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) query.set("maxPrice", newFilters.maxPrice);
    if (newFilters.description) query.set("description", newFilters.description);

    fetchPerfumes(query.toString());

    fetchPerfumes(query.toString());

    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
  }

  const getSortedPerfumes = (list) => {
    if (sortOrder === 'price_asc') {
      return [...list].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price_desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }

  const inStockPerfumes = getSortedPerfumes(perfumes.filter((p) => p.stock === true));
  const outOfStockPerfumes = getSortedPerfumes(perfumes.filter((p) => p.stock === false));

  return (
    <Layout>
      <h1 className="page-banner">Nuestros productos</h1>

      <section className="page-section">
        <p>Bienvenido a nuestra tienda. Aquí encontrarás una amplia variedad de productos diseñados para satisfacer
          tus necesidades. Nuestro compromiso es ofrecer calidad y confianza.
        </p>
      </section>

      <BannerSection onSearch={handleBannerSearch} />

      <div className="main-content">

        <div className="controls-bar">
          <button className="filter-trigger-btn" onClick={() => setIsFilterOpen(true)}>
            <FaSlidersH /> Filtrar
          </button>

          <div className="sort-container" style={{ position: 'relative' }}>
            <button className="filter-trigger-btn" onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}>
              {sortOrder === 'relevance' && 'Relevancia'}
              {sortOrder === 'price_asc' && 'Precio: Menor a Mayor'}
              {sortOrder === 'price_desc' && 'Precio: Mayor a Menor'}
              <FaChevronDown size={10} />
            </button>
            {isSortMenuOpen && (
              <div className="sort-menu" style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                marginTop: '0.5rem',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '200px',
                overflow: 'hidden'
              }}>
                <div
                  className="sort-option"
                  onClick={() => { setSortOrder('relevance'); setIsSortMenuOpen(false); }}
                  style={{ padding: '0.8rem 1rem', cursor: 'pointer', background: sortOrder === 'relevance' ? '#f5f5f5' : 'white' }}
                >
                  Relevancia
                </div>
                <div
                  className="sort-option"
                  onClick={() => { setSortOrder('price_asc'); setIsSortMenuOpen(false); }}
                  style={{ padding: '0.8rem 1rem', cursor: 'pointer', background: sortOrder === 'price_asc' ? '#f5f5f5' : 'white' }}
                >
                  Precio: Menor a Mayor
                </div>
                <div
                  className="sort-option"
                  onClick={() => { setSortOrder('price_desc'); setIsSortMenuOpen(false); }}
                  style={{ padding: '0.8rem 1rem', cursor: 'pointer', background: sortOrder === 'price_desc' ? '#f5f5f5' : 'white' }}
                >
                  Precio: Mayor a Menor
                </div>
              </div>
            )}
          </div>
        </div>

        <Filters
          filters={filters}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleResetFilters={handleResetFilters}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          priceLimits={priceLimits}
        />

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
                    user?.role === 'admin' && (
                      <div className="card-actions">
                        <button onClick={() => handleUpdatePerfume(p)} className="btn btn-primary">Actualizar</button>
                        <button onClick={() => deletePerfume(p._id)} className="btn btn-danger">Eliminar</button>
                      </div>
                    )
                  }
                </div>
              </div>))}
              {user?.role === 'admin' && outOfStockPerfumes.map((p, i) => (<div key={p._id} className="perfume-card">
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
                    user?.role === 'admin' && (
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