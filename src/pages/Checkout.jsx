
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { FaCreditCard, FaUniversity } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
  });
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mp");
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    initMercadoPago(import.meta.env.MP_PUBLIC_KEY);
  }, []);

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="empty-cart-container" style={{ textAlign: "center", padding: "4rem" }}>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos para proceder al pago.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
            Volver a la Tienda
          </Link>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const formattedItems = cart.map(item => ({
        id: item.id,
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const orderPayload = {
        buyer: formData,
        items: formattedItems,
        total: getCartTotal(),
        paymentMethod: paymentMethod
      };

      const response = await fetch('http://localhost:2222/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al procesar el pedido");
      }

      if (paymentMethod === 'mp') {
        if (data.init_point) {
          window.location.href = data.init_point;
        }
      } else {

        clearCart();
        navigate("/pending", { state: { orderId: data.orderId } });
      }

    } catch (err) {
      console.error(err);
      setError("Hubo un problema procesando tu pedido. Intenta nuevamente.");
      alert("Error al procesar el pedido");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="checkout-container">
        <h1 className="page-banner">Finalizar Compra</h1>

        <div className="checkout-grid">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">

              <div className="form-section">
                <h3><MdLocalShipping className="icon" /> Datos de Envío</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="auth-input"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="auth-input"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Dirección</label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="auth-input"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder=""
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="auth-input"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Código Postal</label>
                    <input
                      type="text"
                      name="zip"
                      required
                      className="auth-input"
                      value={formData.zip}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="auth-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+54 9 11 ..."
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Medios de Pago</h3>
                <div className="payment-methods">
                  <div
                    className={`payment-option ${paymentMethod === 'mp' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('mp')}
                  >
                    {/* Using a placeholder icon or text for MP */}
                    <span className="payment-icon-text">MP</span>
                    <span>Mercado Pago</span>
                  </div>
                  <div
                    className={`payment-option ${paymentMethod === 'transfer' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <FaUniversity className="payment-icon" />
                    <span>Transferencia Bancaria</span>
                  </div>
                </div>

                <div className="payment-details">

                  {paymentMethod === 'mp' && (
                    <div className="mp-details">
                      <p>Serás redirigido a Mercado Pago para completar tu compra de forma segura.</p>
                    </div>
                  )}

                  {paymentMethod === 'transfer' && (
                    <div className="transfer-details">
                      <p>Realiza la transferencia a la siguiente cuenta:</p>
                      <div className="bank-info">
                        <p><strong>Cuenta:</strong> Pedro Sarobe</p>
                        <p><strong>CBU:</strong> 0000003100088897765228</p>
                        <p><strong>Alias:</strong> elsellodorado.mp</p>
                        <p>Envía el comprobante a elsellodorado25@gmail.com</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary submit-btn" disabled={isProcessing}>
                {isProcessing
                  ? "Procesando..."
                  : paymentMethod === 'mp'
                    ? "Continuar a Mercado Pago"
                    : `Finalizar Pedido ($${getCartTotal()})`
                }
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary-section">
            <div className="checkout-summary-card">
              <h3>Resumen del Pedido</h3>
              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </div>
                    <span className="item-price">${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Total a Pagar</span>
                <span className="total-amount">${getCartTotal()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
