import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

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
        alert(responseData.error)
      }



      login(responseData.data.token)


      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <div className="auth-container">
        <h1>Iniciar sesión</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
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
        </form>
      </div>
    </Layout>
  );
};

export default Login;