import Layout from "../components/Layout";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    subject: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://api-sello-dorado.onrender.com/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })
      const dataResponse = await response.json()



      setForm({
        subject: "",
        email: "",
        message: ""
      })

    } catch (error) {
      console.log(error)
    }
  };


  return (
    <Layout>
      <div className="contact-container">
        <h1>Contacto</h1>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            className="auth-input"
            onChange={handleChange}
          />
          <label>Asunto</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            className="auth-input"
            onChange={handleChange}
          />
          <label>Mensaje</label>
          <textarea
            name="message"
            rows="4"
            value={form.message}
            className="auth-input"
            onChange={handleChange}
          />
          <button className="btn btn-primary" type="submit">Enviar</button>
        </form>
      </div>
    </Layout>
  );
};

export default Contact;