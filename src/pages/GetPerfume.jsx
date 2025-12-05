import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UpdatePerfume } from "../components/UpdatePerfume";
import ToastMessage from "../components/ToastMessage";

export const GetPerfume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPerfume, setSelectedPerfume] = useState(null);

  const { user, token } = useAuth();

  const [serverResponse, setServerResponse] = useState({
    success: null,
    notification: null,
    error: {
      fetch: null,
      delete: null,
    }
  })

  const fetchPerfume = async () => {
    try {
      const response = await fetch(`http://localhost:2222/perfumes/${id}`);
      const data = await response.json();
      setPerfume(data.data || data);
    } catch (error) {
      console.error("Error fetching perfume:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPerfume();
    }
  }, [id]);

  const deletePerfume = async (idPerfume) => {
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
          success: false,
          notification: dataResponse.error,
          error: { ...serverResponse.error }
        })
        return
      }

      navigate("/", { state: { notification: "Perfume eliminado correctamente", success: true } })

    } catch (error) {
      setServerResponse({
        success: false,
        notification: "Error al eliminar el perfume",
        error: { ...serverResponse.error, delete: false }
      })
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <p>Cargando producto...</p>
        </div>
      </Layout>
    );
  }

  if (!perfume) {
    return (
      <Layout>
        <div className="error-container">
          <p>Producto no encontrado</p>
          <button onClick={() => navigate("/")} className="btn btn-primary">Volver al inicio</button>
        </div>
      </Layout>
    );
  }

  const handleUpdate = (perfume) => {
    setSelectedPerfume(perfume);
  }

  return (
    <Layout>

      {
        selectedPerfume && (
          <UpdatePerfume
            perfume={selectedPerfume}
            onClose={() => setSelectedPerfume(null)}
            onUpdate={(success, msg) => {
              if (success) fetchPerfume()
              if (msg) setServerResponse({
                success,
                notification: msg,
                error: { ...serverResponse.error }
              })
            }}
          />
        )
      }

      <div className="get-perfume-container">
        <div className="perfume-detail-image-wrapper">
          <img src={perfume.image} alt={perfume.name} className="perfume-detail-image" />
        </div>

        <div className="perfume-detail-info">
          <span className="detail-brand">{perfume.brand}</span>
          <h1 className="detail-title">{perfume.name}</h1>

          <div className="detail-tags">
            <span className="card-tag">{perfume.concentration}</span>
            <span className="card-tag">{perfume.genre}</span>
            <span className="card-tag">{perfume.volumeMl}ml</span>
          </div>

          <p className="detail-price">${perfume.price}</p>

          <div className="detail-description">
            <h3>Descripción</h3>
            <p>{perfume.description}</p>
          </div>

          <div className="detail-stock">
            <span className={`stock-indicator ${perfume.stock ? 'in-stock' : 'out-of-stock-badge'}`}>
              {perfume.stock ? 'Disponible' : 'Agotado'}
            </span>
          </div>

          <button className="btn btn-primary btn-add-cart" disabled={!perfume.stock}>
            {perfume.stock ? 'Agregar al Carrito' : 'Sin Stock'}
          </button>

          {
            user &&
            <div className="card-actions">
              <button onClick={() => handleUpdate(perfume)} className="btn btn-primary">Actualizar</button>
              <button onClick={() => deletePerfume(perfume._id)} className="btn btn-danger">Eliminar</button>
            </div>

          }
        </div>
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