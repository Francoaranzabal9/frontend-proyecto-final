import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { FaArrowLeft, FaBoxOpen, FaUser, FaMapMarkerAlt, FaCreditCard, FaPrint } from "react-icons/fa";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:2222/payment/orders/${id}`);
      if (!response.ok) {
        throw new Error("No se pudo cargar la orden");
      }
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los detalles del pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-state" style={{ minHeight: "60vh" }}>
          <div className="spinner"></div>
          <p>Cargando detalles...</p>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="error-container" style={{ textAlign: "center", padding: "4rem" }}>
          <h2>Error</h2>
          <p>{error || "Orden no encontrada"}</p>
          <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Volver al Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  const { buyer, items, total, status, paymentMethod, createdAt } = order;

  return (
    <Layout>
      <div className="order-detail-container">
        <div className="detail-header">
          <Link to="/dashboard" className="back-link">
            <FaArrowLeft /> Volver al Dashboard
          </Link>
          <div className="header-actions">
            <h1>Orden #{id.substring(0, 8)}</h1>
            <button className="btn btn-secondary btn-print" onClick={() => window.print()}>
              <FaPrint /> Imprimir
            </button>
          </div>
          <span className={`status-badge-lg ${status}`}>
            {status === "approved" ? "Aprobado" : status === "rejected" ? "Rechazado" : "Pendiente"}
          </span>
        </div>

        <div className="detail-grid">
          {/* Card: Información de Envío/Cliente */}
          <div className="detail-card client-card">
            <h3><FaUser className="card-icon" /> Datos del Cliente</h3>
            <div className="info-row">
              <span className="label">Nombre:</span>
              <span className="value">{buyer.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{buyer.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Teléfono:</span>
              <span className="value">{buyer.phone}</span>
            </div>
          </div>

          <div className="detail-card shipping-card">
            <h3><FaMapMarkerAlt className="card-icon" /> Dirección de Envío</h3>
            <div className="info-row">
              <span className="label">Dirección:</span>
              <span className="value">{buyer.address || "-"}</span>
            </div>
            <div className="info-row">
              <span className="label">Ciudad:</span>
              <span className="value">{buyer.city || "-"}</span>
            </div>
            <div className="info-row">
              <span className="label">Código Postal:</span>
              <span className="value">{buyer.zip || "-"}</span>
            </div>
          </div>

          {/* Card: Items del Pedido */}
          <div className="detail-card items-card">
            <h3><FaBoxOpen className="card-icon" /> Productos ({items.length})</h3>
            <ul className="items-list">
              {items.map((item, index) => (
                <li key={index} className="order-item">
                  <div className="item-details">
                    <span className="item-name">{item.title}</span>
                    <span className="item-qty">Cant: {item.quantity}</span>
                  </div>
                  <span className="item-price">${Number(item.unit_price).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="order-total-row">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          {/* Card: Info de Pago */}
          <div className="detail-card payment-card">
            <h3><FaCreditCard className="card-icon" /> Información de Pago</h3>
            <div className="info-row">
              <span className="label">Método:</span>
              <span className="value uppercase">
                {paymentMethod === 'mp' ? 'Mercado Pago' : paymentMethod === 'transfer' ? 'Transferencia' : paymentMethod}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Fecha:</span>
              <span className="value">{new Date(createdAt).toLocaleString()}</span>
            </div>
            {order.paymentId && (
              <div className="info-row">
                <span className="label">ID Pago (MP):</span>
                <span className="value mono">{order.paymentId}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
