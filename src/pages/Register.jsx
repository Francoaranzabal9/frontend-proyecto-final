import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:2222/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const responseData = await response.json()

      if (responseData.error) {
        alert(responseData.error)
      }

      alert("Usuario registrado exitosamente")

      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <div className="auth-container">
        <h1>Registrate</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <button className="btn btn-primary" type="submit">Registrarse</button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;