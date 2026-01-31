import Layout from "../components/Layout";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  return (
    <Layout>
      <div className="cart-container">
        <h1>Tu Carrito</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío.</p>
            <Link to="/" className="btn btn-primary">Ver Productos</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img
                      src={item.image ? item.image : "/placeholder.png"}
                      alt={item.name}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="item-brand">{item.brand}</p>
                    <p className="item-price">${item.price}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn-remove"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Resumen de Compra</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${getCartTotal()}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${getCartTotal()}</span>
              </div>
              <div className="cart-summary-actions">
                <Link to="/checkout" className="btn btn-primary btn-checkout">Finalizar Compra</Link>
                <button onClick={clearCart} className="btn btn-secondary btn-clear">Vaciar Carrito</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
