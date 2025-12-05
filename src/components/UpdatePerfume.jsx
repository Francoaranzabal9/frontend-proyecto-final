import { useAuth } from "../context/AuthContext"
import { useState } from "react"

export const UpdateProduct = ({ perfume, onClose, onUpdate }) => {
  const [loader, setLoader] = useState(null)
  const [formData, setFormData] = useState({
    name: perfume.name,
    brand: perfume.brand,
    genre: perfume.genre,
    concentration: perfume.concentration,
    stock: perfume.stock,
    volumeMl: perfume.volumeMl,
    price: perfume.price,
    description: perfume.description,
    image: perfume.image,
  })
  const { token } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("brand", formData.brand);
    dataToSend.append("genre", formData.genre);
    dataToSend.append("concentration", formData.concentration);
    dataToSend.append("stock", formData.stock);
    dataToSend.append("volumeMl", formData.volumeMl);
    dataToSend.append("price", formData.price);
    dataToSend.append("description", formData.description);

    if (formData.image instanceof File) {
      dataToSend.append("image", formData.image, formData.image.name);
    }

    try {
      const response = await fetch(`http://localhost:2222/perfumes/${perfume._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      })
      if (!response.ok) {
        console.error("Error al actualizar el producto")
      }
      onClose()
      onUpdate()
    } catch (error) {
      console.log("Error al actualizar el producto")
    } finally {
      setLoader(null)
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
    <section className="modal-overlay">
      <div className="modal">
        <h2>Actualizar Producto</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          >
            <option value="">Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Unisex">Unisex</option>
          </select>
          <select
            name="concentration"
            value={formData.concentration}
            onChange={handleChange}
          >
            <option value="">Concentración</option>
            <option value="EDP">EDP</option>
            <option value="EDT">EDT</option>
            <option value="Parfum">Parfum</option>
            <option value="EDC">EDC</option>
            <option value="Extrait">Extrait</option>
          </select>
          <select
            name="stock"
            value={formData.stock}
            onChange={handleChange}
          >
            <option value="">Stock</option>
            <option value="true">Disponible</option>
            <option value="false">No disponible</option>
          </select>
          <input
            type="text"
            name="volumeMl"
            value={formData.volumeMl}
            onChange={handleChange}
          />
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}>

          </textarea>
          <input
            type="file"
            name="image"
            accept=".jpg, .jpeg, .png"
            onChange={handleChange}
          />
          <button className="btn btn-primary" type="submit">Actualizar</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </section>
  )
}