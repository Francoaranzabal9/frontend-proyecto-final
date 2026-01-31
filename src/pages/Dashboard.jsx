import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { FaBoxOpen, FaCheckCircle, FaClock, FaTimesCircle, FaSearch, FaShippingFast } from "react-icons/fa";
import ToastMessage from "../components/ToastMessage";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // States for UI feedback
  const [toast, setToast] = useState({ message: null, type: null });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    orderId: null,
    newStatus: null
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:2222/payment/orders");
      if (!response.ok) {
        throw new Error("No se pudieron cargar las órdenes");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar el historial de pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setConfirmModal({
      isOpen: true,
      orderId,
      newStatus
    });
  };

  const handleConfirmAction = async () => {
    const { orderId, newStatus } = confirmModal;
    setConfirmModal({ ...confirmModal, isOpen: false });

    try {
      // Usar endpoint PATCH para actualizar estado
      const response = await fetch(`http://localhost:2222/payment/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la orden");
      }

      // Actualizar estado local
      setOrders(prevOrders =>
        prevOrders.map(order => order._id === orderId ? { ...order, status: newStatus } : order)
      );

      setToast({
        message: `Orden actualizada a: ${getStatusLabel(newStatus)}`,
        type: "green"
      });

    } catch (err) {
      console.error(err);
      setToast({
        message: "No se pudo actualizar el estado de la orden.",
        type: "red"
      });
    }
  };

  const closeToast = () => {
    setToast({ message: null, type: null });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="status-icon-sm success" />;
      case "pending":
      case "in_process":
        return <FaClock className="status-icon-sm pending" />;
      case "rejected":
        return <FaTimesCircle className="status-icon-sm error" />;
      case "shipped":
        return <FaShippingFast className="status-icon-sm shipped" />; // Assuming 'shipped' class exists or will default
      default:
        return <FaBoxOpen className="status-icon-sm" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved": return "Aprobado";
      case "pending": return "Pendiente";
      case "in_process": return "En Proceso";
      case "rejected": return "Rechazado";
      case "shipped": return "Enviado";
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "all" || order.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Panel de Órdenes</h1>
          <p>Gestiona y visualiza el historial de pedidos.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por ID, nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
            <option value="shipped">Enviados</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando órdenes...</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order._id} className="order-card-dashboard">
                  <div className="order-card-header">
                    <span className="order-id-chip">#{order._id.substring(0, 8)}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="order-card-body">
                    <div className="client-data">
                      <strong>{order.buyer.name}</strong>
                      <span className="email">{order.buyer.email}</span>
                    </div>
                    <div className="order-summary-row">
                      <span>{order.items.length} items</span>
                      <strong className="total-amount">${order.total.toLocaleString()}</strong>
                    </div>
                    <span className={`method-badge ${order.paymentMethod}`}>
                      {order.paymentMethod === 'mp' ? 'Mercado Pago' :
                        order.paymentMethod === 'transfer' ? 'Transferencia' : 'Tarjeta'}
                    </span>
                  </div>

                  <div className="order-card-footer">
                    <div className={`status-badge ${order.status}`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusLabel(order.status)}</span>
                    </div>

                    <div className="card-actions-row">
                      <Link to={`/orders/${order._id}`} className="btn-details-link">
                        Ver Detalle
                      </Link>

                      {/* Action Buttons for Pending */}
                      <div className="action-buttons">
                        {order.status === 'pending' && (
                          <>
                            <button
                              className="btn-icon btn-approve"
                              title="Aprobar"
                              onClick={(e) => {
                                e.preventDefault();
                                updateOrderStatus(order._id, 'approved');
                              }}
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              className="btn-icon btn-reject"
                              title="Rechazar"
                              onClick={(e) => {
                                e.preventDefault();
                                updateOrderStatus(order._id, 'rejected');
                              }}
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                        {order.status === 'approved' && (
                          <button
                            className="btn-icon btn-ship"
                            title="Marcar como Enviado"
                            onClick={(e) => {
                              e.preventDefault();
                              updateOrderStatus(order._id, 'shipped');
                            }}
                          >
                            <FaShippingFast />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results" style={{ gridColumn: "1 / -1" }}>
                <FaBoxOpen className="no-results-icon" />
                <h3>No se encontraron órdenes</h3>
                <p>Intenta cambiar los filtros de búsqueda.</p>
              </div>
            )}
          </div>
        )}
        {/* Confirmation Modal */}
        {confirmModal.isOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirmar Acción</h2>
              <p>
                ¿Estás seguro de cambiar el estado de la orden a <strong>{getStatusLabel(confirmModal.newStatus)}</strong>?
              </p>
              <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                >
                  Cancelar
                </button>
                <button
                  className={`btn ${confirmModal.newStatus === 'approved' ? 'btn-primary' : 'btn-danger'}`}
                  onClick={handleConfirmAction}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast.message && (
          <ToastMessage
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
