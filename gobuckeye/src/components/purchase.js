import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import jacket from "../images/jacket.png";
import jersey from "../images/jersey.png";
import polo from "../images/polo.png";
import sweatshirt from "../images/sweatshirt.png";
import tshirt from "../images/t-shirt.png";

const INVENTORY_BASE = process.env.REACT_APP_INVENTORY_API_BASE || "http://localhost:8082";

function pickImageForItem(item) {
  const n = (item?.name || "").toLowerCase();
  if (n.includes("jacket")) return jacket;
  if (n.includes("jersey")) return jersey;
  if (n.includes("polo")) return polo;
  if (n.includes("sweatshirt") || n.includes("hoodie")) return sweatshirt;
  if (n.includes("t-shirt") || n.includes("tee") || n.includes("shirt")) return tshirt;
  // fallback by id to keep UI stable
  switch (item?.id) {
    case 1: return jacket;
    case 2: return jersey;
    case 3: return sweatshirt;
    case 4: return polo;
    default: return tshirt;
  }
}

function Purchase() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${INVENTORY_BASE}/inventory/items`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setErr("Unable to load items. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const maxById = Object.fromEntries((items || []).map(i => [i.id, i.availableQty ?? 0]));

  // State for quantities and cart
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);

  // Handle quantity change
  const handleQuantityChange = (productId, value) => {
    const v = Math.max(0, parseInt(value) || 0);
    const max = maxById[productId] ?? v;
    const clamped = Math.min(v, max);
    setQuantities({
      ...quantities,
      [productId]: clamped
    });
  };

  // Add item to cart
  const addToCart = (product) => {
    const quantity = quantities[product.id] || 0;
    const available = maxById[product.id] ?? 0;
    if (quantity > 0 && quantity <= available) {
      const existingItem = cart.find(item => item.id === product.id);
      const nextQty = (existingItem?.quantity || 0) + quantity;
      if (nextQty > available) {
        alert(`Only ${available} in stock for ${product.name}.`);
        return;
      }
      const cartShape = { id: product.id, name: product.name, price: product.price, quantity: quantity, availableQty: available, image: pickImageForItem(product) };
      if (existingItem) {
        setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
      } else {
        setCart([...cart, cartShape]);
      }
      setQuantities({ ...quantities, [product.id]: 0 });
    }
  };

  // Update cart item quantity
  const updateCartQuantity = (productId, newQuantity) => {
    const available = maxById[productId] ?? newQuantity;
    const q = Math.max(0, Math.min(parseInt(newQuantity) || 0, available));
    if (q <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => item.id === productId ? { ...item, quantity: q } : item));
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
            {loading ? (
              <div className="text-muted">Loading items…</div>
            ) : err ? (
              <div className="alert alert-danger">{err}</div>
            ) : (
              items.map((product) => (
                <div key={product.id} className="col-md-6">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={pickImageForItem(product)}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted small">Available: {product.availableQty}</p>
                      <p className="card-text fw-bold text-danger fs-5">
                        {formatCurrency(product.price)}
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="number"
                          className="form-control"
                          style={{ width: "80px" }}
                          min="0"
                          max={product.availableQty}
                          value={quantities[product.id] || 0}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                          placeholder="Qty"
                        />
                        <button
                          className="btn btn-danger flex-grow-1"
                          onClick={() => addToCart(product)}
                          disabled={!quantities[product.id] || quantities[product.id] <= 0 || (quantities[product.id] > (product.availableQty || 0))}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
                          <small className="text-muted">{formatCurrency(item.price)} each • In stock: {item.availableQty ?? maxById[item.id] ?? 0}</small>
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
                        <span className="ms-auto fw-semibold">{formatCurrency((item.price || 0) * (item.quantity || 0))}</span>
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