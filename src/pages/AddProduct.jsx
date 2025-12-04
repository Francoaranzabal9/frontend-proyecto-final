import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

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
    image: "",
  })

  const { token } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      volumeMl: Number(formData.volumeMl),
    }
    try {
      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      })
      if (!response.ok) {
        alert("Error al agregar el producto")
        return
      }
      alert("Producto agregado correctamente")

      setFormData({
        name: "",
        brand: "",
        genre: "",
        concentration: "",
        stock: "",
        volumeMl: "",
        price: "",
        description: "",
        image: "",
      })
      navigate("/")

    } catch (error) {
      alert("Error al agregar el producto")
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (

    <Layout>
      <div>
        Agregar Producto
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="brand"
          placeholder="Marca"
          value={formData.brand}
          onChange={handleChange}
        />
        <input
          type="text"
          name="genre"
          placeholder="Genero"
          value={formData.genre}
          onChange={handleChange}
        />
        <input
          type="text"
          name="concentration"
          placeholder="Concentracion"
          value={formData.concentration}
          onChange={handleChange}
        />
        <input
          type="text"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
        />
        <input
          type="text"
          name="volumeMl"
          placeholder="Volumen en ml"
          value={formData.volumeMl}
          onChange={handleChange}
        />
        <input
          type="text"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Descripcion"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Imagen"
          value={formData.image}
          onChange={handleChange}
        />
        <button type="submit">Agregar Producto</button>
      </form>
    </Layout>
  );
};

export default AddProduct;