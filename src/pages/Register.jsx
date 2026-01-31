import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../components/ToastMessage";

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [serverResponse, setServerResponse] = useState({
    success: null,
    notification: null,
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

    if (formData.name.length < 3) {
      setServerResponse({
        success: false,
        notification: "El nombre debe tener al menos 3 caracteres"
      })
      return
    }

    if (formData.password.length < 6) {
      setServerResponse({
        success: false,
        notification: "La contraseña debe tener al menos 6 caracteres"
      })
      return
    }

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
        setServerResponse({
          success: false,
          notification: responseData.error
        })
        return
      }

      setServerResponse({
        success: true,
        notification: "Usuario registrado exitosamente"
      })

      setTimeout(() => {
        navigate("/login")
      }, 2000)

    } catch (error) {
      console.log(error)
      setServerResponse({
        success: false,
        notification: "Error de conexión"
      })
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

export default Register;