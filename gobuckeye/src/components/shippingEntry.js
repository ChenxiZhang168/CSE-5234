import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export default function ShippingEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart =
    location.state?.cartItems || JSON.parse(sessionStorage.getItem("cartItems")) || [];
  const paymentInfo =
    location.state?.paymentInfo ||
    JSON.parse(sessionStorage.getItem("paymentInfo")) ||
    null;

  const [form, setForm] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
  });

  // Load saved shipping info if it exists
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem("shippingInfo"));
    if (saved) setForm(saved);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      // Enforce 2-letter uppercase state
      const v = value.toUpperCase().slice(0, 2);
      setForm((f) => ({ ...f, state: v }));
      return;
    }

    if (name === "zip") {
      // US ZIP: 5 digits (accepts only digits)
      const v = value.replace(/\D/g, "").slice(0, 5);
      setForm((f) => ({ ...f, zip: v }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = [];
    if (!form.name.trim()) errs.push("Name is required.");
    if (!form.addressLine1.trim()) errs.push("Address Line 1 is required.");
    if (!form.city.trim()) errs.push("City is required.");
    if (!/^[A-Z]{2}$/.test(form.state) || !US_STATES.includes(form.state)) {
      errs.push("State must be a valid 2-letter US code (e.g., OH).");
    }
    if (!/^\d{5}$/.test(form.zip)) {
      errs.push("ZIP must be a 5-digit US code.");
    }

    if (errs.length) {
      alert(errs.join("\n"));
      return false;
    }
    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Save it
    sessionStorage.setItem("shippingInfo", JSON.stringify(form));
    if (cart?.length) sessionStorage.setItem("cartItems", JSON.stringify(cart));
    if (paymentInfo)
      sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

    // Go to order review (adjust the route name if your next page differs)
    navigate("/purchase/viewOrder", {
      state: {
        cart,
        paymentInfo,
        shippingInfo: form,
      },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: 16 }}>Shipping Information</h2>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>
            Name
            <input
              style={styles.input}
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Jane Q. Buckeye"
              required
            />
          </label>

          <label style={styles.label}>
            Address Line 1
            <input
              style={styles.input}
              name="addressLine1"
              value={form.addressLine1}
              onChange={onChange}
              placeholder="1234 High St"
              required
            />
          </label>

          <label style={styles.label}>
            Address Line 2 (optional)
            <input
              style={styles.input}
              name="addressLine2"
              value={form.addressLine2}
              onChange={onChange}
              placeholder="Apt, suite, etc."
            />
          </label>

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1, marginRight: 8 }}>
              City
              <input
                style={styles.input}
                name="city"
                value={form.city}
                onChange={onChange}
                placeholder="Columbus"
                required
              />
            </label>

            <label style={{ ...styles.label, width: 100, marginRight: 8 }}>
              State
              <input
                style={styles.input}
                name="state"
                value={form.state}
                onChange={onChange}
                placeholder="OH"
                required
              />
            </label>

            <label style={{ ...styles.label, width: 120 }}>
              ZIP
              <input
                style={styles.input}
                name="zip"
                inputMode="numeric"
                value={form.zip}
                onChange={onChange}
                placeholder="43210"
                required
              />
            </label>
          </div>

          <button type="submit" style={styles.button}>
            Save & Review Order
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f7fb",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 540,
    background: "white",
    borderRadius: 16,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    padding: 24,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontWeight: 600,
    fontSize: 14,
  },
  input: {
    marginTop: 6,
    borderRadius: 10,
    border: "1px solid #ddd",
    padding: "12px 14px",
    fontSize: 16,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 0,
  },
  button: {
    marginTop: 8,
    padding: "12px 16px",
    fontSize: 16,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#6b46c1",
    color: "white",
    fontWeight: 700,
  },
};
