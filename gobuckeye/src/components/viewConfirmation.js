import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ViewConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Read data passed via navigate(..., { state }) and fall back to sessionStorage when possible
  const confirmationNumber = state?.confirmationNumber || sessionStorage.getItem("lastConfirmationNumber") || null;

  // These may or may not be present depending on how you navigated here; render conditionally
  const cartItems = state?.cartItems || JSON.parse(sessionStorage.getItem("cartItems") || "[]");
  const paymentInfo = state?.paymentInfo || JSON.parse(sessionStorage.getItem("paymentInfo") || "{}");
  const shippingInfo = state?.shippingInfo || JSON.parse(sessionStorage.getItem("shippingInfo") || "{}");

  // Persist confirmation number so a refresh doesn't lose it
  useEffect(() => {
    if (confirmationNumber) {
      sessionStorage.setItem("lastConfirmationNumber", confirmationNumber);
    }
  }, [confirmationNumber]);

  const formatCurrency = (n) => `$${Number(n).toFixed(2)}`;
  const total = Array.isArray(cartItems) ? cartItems.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0) : 0;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h2 className="card-title h3 mb-2">Thank you for your order!</h2>
              <div className="text-muted">
                {confirmationNumber ? (
                  <>Confirmation #: <span className="fw-semibold">{confirmationNumber}</span></>
                ) : (
                  <>
                    <span className="text-danger">No confirmation number found.</span>
                    <button className="btn btn-link p-0 ms-2" onClick={() => navigate('/purchase')}>Back to Shop</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {Array.isArray(cartItems) && cartItems.length > 0 && (
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
                          <td className="text-end fw-semibold">{formatCurrency((item.price || 0) * (item.quantity || 0))}</td>
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
          )}

          {(paymentInfo && Object.keys(paymentInfo).length > 0) || (shippingInfo && Object.keys(shippingInfo).length > 0) ? (
            <div className="row g-3">
              {paymentInfo && Object.keys(paymentInfo).length > 0 && (
                <div className="col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-header bg-white">
                      <h6 className="mb-0">Payment</h6>
                    </div>
                    <div className="card-body">
                      <div className="small text-muted">Cardholder</div>
                      <div className="mb-2">{paymentInfo?.cardHolderName || '—'}</div>
                      <div className="small text-muted">Card</div>
                      <div>{(paymentInfo?.cardNumber || '').replace(/\s+/g, '').slice(-4) ? `**** **** **** ${(paymentInfo.cardNumber || '').replace(/\s+/g, '').slice(-4)}` : '—'}</div>
                    </div>
                  </div>
                </div>
              )}
              {shippingInfo && Object.keys(shippingInfo).length > 0 && (
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
              )}
            </div>
          ) : null}

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