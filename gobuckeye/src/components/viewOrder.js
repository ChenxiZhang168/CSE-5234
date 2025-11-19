import React, { useState } from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ORDER_ENDPOINT = "https://wk0h2hskx1.execute-api.us-east-2.amazonaws.com/dev/order-processing/order";

function ViewOrder () {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {};
    const cartItems = state.cartItems || JSON.parse(sessionStorage.getItem("cartItems")) || [];
    const paymentInfo = state.paymentInfo || JSON.parse(sessionStorage.getItem("paymentInfo")) || {};
    const shippingInfo = state.shippingInfo || JSON.parse(sessionStorage.getItem("shippingInfo")) || {};
    
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const items = (cartItems || []).map(({ id, name, price, quantity }) => ({
        itemId: id,
        itemName: name,
        unitPriceAtPurchase: price,
        quantity
    }));

    const formatCurrency = (n) => `$${Number(n).toFixed(2)}`;
    const last4 = (paymentInfo?.cardNumber || '').replace(/\s+/g, '').slice(-4);

    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    async function onConfirm() {
        setSubmitting(true);
        setError(null);
        try {
            // Derive customer info (fallbacks if not explicitly collected)
            const customerName = shippingInfo?.name || paymentInfo?.cardHolderName || "";
            const customerEmail = shippingInfo?.email || "";

            // Build paymentInfo object expected by backend
            const paymentPayload = {
                holderName: paymentInfo?.cardHolderName || "",
                cardNum: (paymentInfo?.cardNumber || "").replace(/\s+/g, ""),
                expDate: paymentInfo?.expiry || "",
                cvv: paymentInfo?.cvv || ""
            };

            // Build shippingInfo object expected by backend
            const shippingPayload = {
                address1: shippingInfo?.addressLine1 || "",
                address2: shippingInfo?.addressLine2 || "",
                city: shippingInfo?.city || "",
                state: shippingInfo?.state || "",
                country: "USA",
                postalCode: shippingInfo?.zip || "",
                email: customerEmail
            };

            const res = await fetch(ORDER_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName,
                    customerEmail,
                    shippingInfo: shippingPayload,
                    items,
                    paymentInfo: paymentPayload
                })
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                // 200 ACCEPTED → go to confirmation with the number
                navigate('/purchase/viewConfirmation', { state: { confirmationNumber: data.confirmationNumber } });
                return;
            }
            if (res.status === 409 && data?.reason === "INSUFFICIENT_INVENTORY") {
                // Prompt user to adjust quantities back on purchase page
                navigate('/purchase', { state: { inventoryConflict: data.missing } });
                return;
            }
            setError("Could not place order. Please try again.");
        } catch (e) {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

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

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}

            <div className="d-flex justify-content-between pt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    Back
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onConfirm}
                    disabled={submitting}
                >
                    {submitting ? "Placing…" : "Confirm Order"}
                </button>
            </div>
        </div>
    );
}

export default ViewOrder;