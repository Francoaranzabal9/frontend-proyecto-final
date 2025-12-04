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

  return (
    <Layout>
      <h1>Home</h1>
    </Layout>
  );
};

export default Home;