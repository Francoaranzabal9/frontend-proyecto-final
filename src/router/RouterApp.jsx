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
import NotFound from "../pages/NotFound";
import Checkout from "../pages/Checkout";
import Success from "../pages/Success";
import Dashboard from "../pages/Dashboard";
import OrderDetail from "../pages/OrderDetail";
import AdminRoute from "../components/AdminRoute";

const RouterApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-nosotros" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/agregar-producto" element={
          <AdminRoute>
            <AddProduct />
          </AdminRoute>
        }
        />
        <Route path="/get-perfume/:id" element={<GetPerfume />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        } />
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Success />} />
        <Route path="/pending" element={<Success />} />
        <Route path="/dashboard" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
        <Route path="/orders/:id" element={
          <AdminRoute>
            <OrderDetail />
          </AdminRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
};

export default RouterApp;
