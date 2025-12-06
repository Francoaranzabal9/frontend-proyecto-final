import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ToastMessage from "../components/ToastMessage";

const AddProduct = () => {

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    genre: "",
    concentration: "",
    stock: "",
    volumeMl: "",
    price: "",
    description: "",
    image: null,
  })

  const [serverResponse, setServerResponse] = useState({
    success: null,
    notification: null,
  })

  const { token } = useAuth()

  const navigate = useNavigate()

  // Maneja el envío del formulario utilizando FormData para soportar la subida de imágenes
  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("brand", formData.brand);
    dataToSend.append("genre", formData.genre);
    dataToSend.append("concentration", formData.concentration);
    dataToSend.append("stock", formData.stock);
    dataToSend.append("volumeMl", Number(formData.volumeMl));
    dataToSend.append("price", Number(formData.price));
    dataToSend.append("description", formData.description);

    if (formData.image) {
      dataToSend.append("image", formData.image || "");
    }

    try {
      const response = await fetch("https://api-sello-dorado.onrender.com/perfumes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setServerResponse({
          success: false,
          notification: errorData.error || "Error al agregar el producto"
        })
        return
      }

      setFormData({
        name: "",
        brand: "",
        genre: "",
        concentration: "",
        stock: "",
        volumeMl: "",
        price: "",
        description: "",
        image: null,
      })
      navigate("/", { state: { notification: "Producto agregado correctamente", success: true } })

    } catch (error) {
      console.error(error)
      setServerResponse({
        success: false,
        notification: "Error de conexión al agregar el producto"
      })
    }
  }

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  return (
    <Layout>
      <div className="add-product-container">
        <h1>Agregar Producto</h1>
        <form className="add-product-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="auth-input"
          />
          <input
            type="text"
            name="brand"
            placeholder="Marca"
            value={formData.brand}
            onChange={handleChange}
            className="auth-input"
          />
          <select
            placeholder="Género"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="auth-input"
          >
            <option value="">Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Unisex">Unisex</option>
          </select>
          <select
            placeholder="Concentración"
            name="concentration"
            value={formData.concentration}
            onChange={handleChange}
            className="auth-input"
          >
            <option value="">Concentración</option>
            <option value="EDP">EDP</option>
            <option value="EDT">EDT</option>
            <option value="Parfum">Parfum</option>
            <option value="EDC">EDC</option>
            <option value="Extrait">Extrait</option>
          </select>
          <select
            type="text"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="auth-input"
          >
            <option value="">Stock</option>
            <option value="true">Disponible</option>
            <option value="false">No disponible</option>
          </select>
          <input
            type="text"
            name="volumeMl"
            placeholder="Volumen en ml"
            value={formData.volumeMl}
            onChange={handleChange}
            className="auth-input"
          />
          <input
            type="text"
            name="price"
            placeholder="Precio"
            value={formData.price}
            onChange={handleChange}
            className="auth-input"
          />
          <textarea
            type="text"
            name="description"
            placeholder="Descripcion"
            value={formData.description}
            onChange={handleChange}
            className="auth-input"
          />
          <input
            type="file"
            name="image"
            accept=".jpg, .jpeg, .png"
            onChange={handleChange}
            className="auth-input"
          />
          <button className="btn btn-primary" type="submit">Agregar Producto</button>
        </form>
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

export default AddProduct;