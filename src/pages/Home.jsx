import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

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

  const deleteProduct = async (idPerfume) => {
    setSrverResponse({
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const query = new URLSearchParams()

    if (filters.name) query.set("name", filters.name)
    if (filters.brand) query.set("brand", filters.brand)
    if (filters.concentration) query.set("concentration", filters.concentration)
    if (filters.genre) query.set("genre", filters.genre)
    if (filters.stock) query.set("stock", filters.stock)
    if (filters.volumeMl) query.set("volumeMl", filters.volumeMl)
    if (filters.price) query.set("price", filters.price)
    if (filters.description) query.set("description", filters.description)
    if (filters.image) query.set("image", filters.image)

    fetchPerfumes(query.toString())

  }

  handleResetFilters = () => {
    setFilters({
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
  }

  return (
    <Layout>
      <h1>Home</h1>
    </Layout>
  );
};

export default Home;