import { useEffect, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useCart } from "../context/CartContext";
import { FaCheckCircle, FaExclamationTriangle, FaHourglassHalf } from "react-icons/fa";

const Success = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const location = useLocation();
  const [status, setStatus] = useState("loading"); // loading, approved, pending, rejected, transfer
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // 1. Revisar si venimos de Mercado Pago (Parametros de URL)
    const mpStatus = searchParams.get("collection_status");
    const mpPaymentId = searchParams.get("payment_id");
    const externalRef = searchParams.get("external_reference");

    // 2. Revisar si venimos del Checkout interno (State de React Router)
    const stateOrderId = location.state?.orderId;

    if (mpStatus) {
      // Flujo Mercado Pago
      if (mpStatus === "approved") {
        setStatus("approved");
        setOrderId(mpPaymentId || externalRef); // Preferimos mostrar ID de pago
        clearCart(); // ¡IMPORTANTE! Vaciar carrito al volver exitoso de MP

        // Disparar envío de email de confirmación
        if (externalRef) {
          console.log("Enviando request de confirmación a localhost para order:", externalRef);
          fetch(`http://localhost:2222/payment/confirm-email/${externalRef}`, { method: 'POST' })
            .then(res => {
              if (res.ok) console.log("Email de confirmación enviado");
              else console.error("Error al enviar email de confirmación");
            })
            .catch(err => console.error("Error en petición de email", err));
        }

      } else if (mpStatus === "pending" || mpStatus === "in_process") {
        setStatus("pending");
        setOrderId(externalRef);
        clearCart();
      } else {
        setStatus("rejected");
      }
    } else if (stateOrderId) {
      // Flujo Interno (Transferencia o Tarjeta Mock)
      // Asumimos aprobado porque el checkout ya validó antes de redirigir
      setStatus("approved");
      setOrderId(stateOrderId);
      // El carrito ya se limpió en el Checkout, pero por seguridad no está de más:
      clearCart();
    } else {
      // 3. Fallback basado en la URL (si no hay params)
      if (location.pathname.includes("/failure")) {
        setStatus("rejected");
      } else if (location.pathname.includes("/pending")) {
        setStatus("pending");
        clearCart(); // Opcional: limpiar si es pending
      } else {
        // Si alguien entra directo a /success sin datos
        setStatus("error");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Renderizado condicional según el estado
  const renderContent = () => {
    switch (status) {
      case "approved":
        return (
          <div className="status-card success">
            <FaCheckCircle className="status-icon success-icon" />
            <h2>¡Pago Exitoso!</h2>
            <p>Muchas gracias por tu compra. Tu pedido ha sido procesado correctamente.</p>
            {orderId && <div className="order-id">ID de Operación: <span>{orderId}</span></div>}
            <div className="actions">
              <Link to="/" className="btn btn-primary">Volver a la Tienda</Link>
            </div>
          </div>
        );

      case "pending":
        return (
          <div className="status-card pending">
            <FaHourglassHalf className="status-icon pending-icon" />
            <h2>Pago Pendiente</h2>
            <p>Estamos procesando tu pago. Te avisaremos cuando se confirme.</p>
            {orderId && <div className="order-id">Referencia: <span>{orderId}</span></div>}
            <div className="actions">
              <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
            </div>
          </div>
        );

      case "rejected":
        return (
          <div className="status-card error">
            <FaExclamationTriangle className="status-icon error-icon" />
            <h2>Pago Rechazado</h2>
            <p>Hubo un problema con el pago. Por favor intenta nuevamente.</p>
            <div className="actions">
              <Link to="/checkout" className="btn btn-primary">Intentar de nuevo</Link>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="status-card error">
            <FaExclamationTriangle className="status-icon error-icon" />
            <h2>Algo salió mal</h2>
            <p>No pudimos verificar el estado de tu pago. Por favor contacta a soporte si tienes dudas.</p>
            <div className="actions">
              <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
            </div>
          </div>
        );

      default:
        return (
          <div className="status-card">
            <h2>Cargando resultado...</h2>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="success-page-container">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default Success;