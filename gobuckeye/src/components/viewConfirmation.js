import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ViewConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const cartItems = state?.cartItems || [];
  const paymentInfo = state?.paymentInfo || {};
  const shippingInfo = state?.shippingInfo || {};
  const confirmationNumber = "12345";

  const formatCurrency = (n) => `$${Number(n).toFixed(2)}`;
  const total = cartItems.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h2 className="card-title h3 mb-2">Thank you for your order!</h2>
              <div className="text-muted">
                Confirmation #: <span className="fw-semibold">{confirmationNumber}</span>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Item</th>
                      <th scope="col" className="text-center">Qty</th>
                      <th scope="col" className="text-end">Price</th>
                      <th scope="col" className="text-end">Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">{formatCurrency(item.price)}</td>
                        <td className="text-end fw-semibold">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-white d-flex justify-content-end">
              <div className="fw-semibold">Total: {formatCurrency(total)}</div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-white">
                  <h6 className="mb-0">Payment</h6>
                </div>
                <div className="card-body">
                  <div className="small text-muted">Cardholder</div>
                  <div className="mb-2">{paymentInfo?.cardHolder || '—'}</div>
                  <div className="small text-muted">Card</div>
                  <div>{(paymentInfo?.cardNumber || '').replace(/\s+/g, '').slice(-4) ? `**** **** **** ${(paymentInfo.cardNumber || '').replace(/\s+/g, '').slice(-4)}` : '—'}</div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-white">
                  <h6 className="mb-0">Shipping</h6>
                </div>
                <div className="card-body">
                  <div>{shippingInfo?.name}</div>
                  <div>{shippingInfo?.addressLine1}</div>
                  {shippingInfo?.addressLine2 ? (<div>{shippingInfo.addressLine2}</div>) : null}
                  <div>{[shippingInfo?.city, shippingInfo?.state, shippingInfo?.zip].filter(Boolean).join(', ')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between pt-3">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/purchase')}>
              Back to Shop
            </button>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>Go to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewConfirmation;