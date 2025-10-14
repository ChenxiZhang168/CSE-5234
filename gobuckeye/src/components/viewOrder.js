import React from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewOrder () {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {};
    const cartItems = state.cartItems || JSON.parse(sessionStorage.getItem("cartItems")) || [];
    const paymentInfo = state.paymentInfo || JSON.parse(sessionStorage.getItem("paymentInfo")) || {};
    const shippingInfo = state.shippingInfo || JSON.parse(sessionStorage.getItem("shippingInfo")) || {};
    
    const formatCurrency = (n) => `$${Number(n).toFixed(2)}`;
    const last4 = (paymentInfo?.cardNumber || '').replace(/\s+/g, '').slice(-4);

    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return (
        <div className="container py-4">
            <h2 className="mb-4">Order Summary</h2>

            <div className="row g-4">
                {/* Left column: items */}
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Items in Cart</h5>
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
                                        {cartItems.map((item, index) => {
                                            const line = item.price * item.quantity;
                                            return (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td className="text-center">{item.quantity}</td>
                                                    <td className="text-end">{formatCurrency(item.price)}</td>
                                                    <td className="text-end fw-semibold">{formatCurrency(line)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer bg-white d-flex justify-content-end">
                            <div className="text-end">
                                <div className="fw-semibold">Total: {formatCurrency(total)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column: payment & shipping */}
                <div className="col-md-4">
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-white">
                            <h6 className="mb-0">Payment</h6>
                        </div>
                        <div className="card-body">
                            <div className="small text-muted">Cardholder</div>
                            <div className="mb-2">{paymentInfo?.cardHolderName || '—'}</div>
                            <div className="small text-muted">Card</div>
                            <div>{last4 ? `**** **** **** ${last4}` : '—'}</div>
                        </div>
                    </div>

                    <div className="card shadow-sm">
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
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    Back
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                        navigate('/purchase/viewConfirmation', { state: { cartItems, paymentInfo, shippingInfo } })
                    }
                >
                    Confirm Order
                </button>
            </div>
        </div>
    );
}

export default ViewOrder;