import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ToastMessage from "../components/ToastMessage";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [serverResponse, setServerResponse] = useState({
    success: null,
    notification: null,
  })

  const [error, setError] = useState(null)

  const { login } = useAuth()

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
      const response = await fetch(`https://api-sello-dorado.onrender.com/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const responseData = await response.json()
      if (responseData.error) {
        setError(responseData.error)
        return
      }

      setServerResponse({
        success: true,
        notification: "Inicio de sesión exitoso"
      })

      login(responseData.data.token)

      setTimeout(() => {
        navigate("/")
      }, 700)

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
        <h1>Iniciar sesión</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button className=" btn btn-primary" type="submit">Iniciar sesión</button>

          <div className="auth-footer">
            <p>¿No tenés una cuenta?</p>
            <Link to="/registro" className="nav-link">Registrate</Link>
          </div>
        </form>
      </div>
      {serverResponse.success && (
        <ToastMessage
          message={serverResponse.notification}
          type={serverResponse.success ? "green" : "red"}
          onClose={() => setServerResponse({ ...serverResponse, notification: null })}
        />
      )}
    </Layout>
  );
};

export default Login;