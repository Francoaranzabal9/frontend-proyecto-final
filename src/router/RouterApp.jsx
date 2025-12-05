import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddProduct from "../pages/AddProduct";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import { PrivateRoute } from "../components/PrivateRoute";
import { GetPerfume } from "../pages/GetPerfume";

const RouterApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-nosotros" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/agregar-producto" element={
          <PrivateRoute>
            <AddProduct />
          </PrivateRoute>
        }
        />
        <Route path="/get-perfume/:id" element={<GetPerfume />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/carrito" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  )
};

export default RouterApp;
