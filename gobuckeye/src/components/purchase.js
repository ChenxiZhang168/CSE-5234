import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// import images from local directory
import jacket from '../images/jacket.png';
import jersey from '../images/jersey.png';
import polo from '../images/polo.png';
import sweatshirt from '../images/sweatshirt.png';
import tshirt from '../images/t-shirt.png';

function Purchase() {
  const navigate = useNavigate();

  // Hardcoded product catalog - 5 Ohio State items
  const products = [
    {
      id: 1,
      name: "Ohio State Buckeyes Jacket",
      price: 79.99,
      image: jacket,
      description: "Red and gray pullover jacket"
    },
    {
      id: 2,
      name: "Buckeyes Smith #4 Jersey",
      price: 109.99,
      image: jersey,
      description: "Official replica football jersey"
    },
    {
      id: 3,
      name: "Ohio State Polo Shirt",
      price: 54.99,
      image: polo,
      description: "Classic red polo with embroidered logo"
    },
    {
      id: 4,
      name: "Buckeyes Hoodie",
      price: 64.99,
      image: sweatshirt,
      description: "Long sleeve athletic hoodie"
    },
    {
      id: 5,
      name: "White OSU 1968 Championship T-Shirt",
      price: 29.99,
      image: tshirt,
      description: "Vintage tee"
    }
  ];

  // State for quantities and cart
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);

  // Handle quantity change
  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(value) || 0
    });
  };

  // Add item to cart
  const addToCart = (product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity > 0) {
      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        setCart([...cart, { ...product, quantity }]);
      }
      setQuantities({ ...quantities, [product.id]: 0 });
    }
  };

  // Update cart item quantity
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Proceed to payment
  const proceedToPayment = () => {
    if (cart.length === 0) {
      alert("Please add items to your cart before proceeding.");
      return;
    }
    navigate("/purchase/paymentEntry", { state: { cartItems: cart } });
  };

  const formatCurrency = (n) => `$${Number(n).toFixed(2)}`;

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Ohio State Buckeyes Store</h1>
      <p className="text-center text-muted mb-4">Official merchandise for true fans</p>

      <div className="row g-4">
        {/* Product Catalog - Left Side */}
        <div className="col-lg-8">
          <h3 className="mb-3">Product Catalog</h3>
          <div className="row g-3">
            {products.map((product) => (
              <div key={product.id} className="col-md-6">
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted small">{product.description}</p>
                    <p className="card-text fw-bold text-danger fs-5">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: "80px" }}
                        min="0"
                        value={quantities[product.id] || 0}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        placeholder="Qty"
                      />
                      <button
                        className="btn btn-danger flex-grow-1"
                        onClick={() => addToCart(product)}
                        disabled={!quantities[product.id] || quantities[product.id] <= 0}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart - Right Side */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Shopping Cart ({cart.length})</h5>
            </div>
            <div className="card-body" style={{ maxHeight: "500px", overflowY: "auto" }}>
              {cart.length === 0 ? (
                <p className="text-muted text-center">Your cart is empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.name}</h6>
                          <small className="text-muted">{formatCurrency(item.price)} each</small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          style={{ width: "70px" }}
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value) || 0)}
                        />
                        <span className="text-muted small">×</span>
                        <span className="small">{formatCurrency(item.price)}</span>
                        <span className="ms-auto fw-semibold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between align-items-center pt-2">
                    <h5 className="mb-0">Total:</h5>
                    <h5 className="mb-0 text-danger">{formatCurrency(cartTotal)}</h5>
                  </div>
                </>
              )}
            </div>
            <div className="card-footer bg-white">
              <button
                className="btn btn-danger w-100"
                onClick={proceedToPayment}
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Purchase;