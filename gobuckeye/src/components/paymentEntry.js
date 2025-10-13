// src/paymentEntry.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentEntry() {
  const navigate = useNavigate();
  const location = useLocation();

  // If you passed cart/items from /purchase via navigate(..., { state })
  // they will be available here as location.state?.cart
  const cart =
    location.state?.cart || JSON.parse(sessionStorage.getItem("cart")) || [];

  const [form, setForm] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiration: "", // MM/YY
    cvvCode: "",
  });

  // Load any existing payment info (so it's “saved” if they come back)
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem("paymentInfo"));
    if (saved) setForm(saved);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    // Light input constraints/formatting
    if (name === "cardNumber") {
      // digits only, max 19 (to allow 16 + spaces if needed)
      const digitsOnly = value.replace(/\D/g, "").slice(0, 19);
      setForm((f) => ({ ...f, [name]: digitsOnly }));
      return;
    }

    if (name === "expiration") {
      // Force MM/YY pattern while typing
      let v = value.replace(/\D/g, "").slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
      setForm((f) => ({ ...f, [name]: v }));
      return;
    }

    if (name === "cvvCode") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 4); // 3 or 4
      setForm((f) => ({ ...f, [name]: digitsOnly }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  // Optional: simple Luhn check for card number validity
  const luhnValid = (num) => {
    const s = num.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(s)) return false;
    let sum = 0,
      dbl = false;
    for (let i = s.length - 1; i >= 0; i--) {
      let d = parseInt(s[i], 10);
      if (dbl) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      dbl = !dbl;
    }
    return sum % 10 === 0;
  };

  const validate = () => {
    const errors = [];

    if (!form.cardHolderName.trim())
      errors.push("Card holder name is required.");

    if (!form.cardNumber || !luhnValid(form.cardNumber)) {
      errors.push("Enter a valid credit card number.");
    }

    // MM/YY validation
    if (!/^\d{2}\/\d{2}$/.test(form.expiration)) {
      errors.push("Expiration must be in MM/YY format.");
    } else {
      const [mm, yy] = form.expiration.split("/").map((x) => parseInt(x, 10));
      if (mm < 1 || mm > 12) errors.push("Expiration month must be 01–12.");

      // Expired check (naive, fine for lab)
      const now = new Date();
      const curYY = now.getFullYear() % 100;
      const curMM = now.getMonth() + 1;
      if (yy < curYY || (yy === curYY && mm < curMM)) {
        errors.push("Card is expired.");
      }
    }

    if (!/^\d{3,4}$/.test(form.cvvCode)) {
      errors.push("CVV must be 3 or 4 digits.");
    }

    if (errors.length) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // “Save it” (per lab). Using sessionStorage is perfect for this lab.
    sessionStorage.setItem("paymentInfo", JSON.stringify(form));
    if (cart?.length) sessionStorage.setItem("cart", JSON.stringify(cart));

    // Move to shipping page with state preserved as well (either way is fine)
    navigate("/purchase/shippingEntry", {
      state: {
        cart,
        paymentInfo: form,
      },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: 16 }}>Payment Information</h2>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>
            Card Holder Name
            <input
              style={styles.input}
              type="text"
              name="cardHolderName"
              value={form.cardHolderName}
              onChange={onChange}
              placeholder="Jane Q. Buckeye"
              required
            />
          </label>

          <label style={styles.label}>
            Card Number
            <input
              style={styles.input}
              type="text"
              name="cardNumber"
              inputMode="numeric"
              value={form.cardNumber}
              onChange={onChange}
              placeholder="4111111111111111"
              required
            />
          </label>

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1, marginRight: 8 }}>
              Expiration (MM/YY)
              <input
                style={styles.input}
                type="text"
                name="expiration"
                inputMode="numeric"
                value={form.expiration}
                onChange={onChange}
                placeholder="09/27"
                required
              />
            </label>

            <label style={{ ...styles.label, flex: 1, marginLeft: 8 }}>
              CVV
              <input
                style={styles.input}
                type="password"
                name="cvvCode"
                inputMode="numeric"
                value={form.cvvCode}
                onChange={onChange}
                placeholder="123"
                required
              />
            </label>
          </div>

          <button type="submit" style={styles.button}>
            Save & Continue to Shipping
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

export default PaymentEntry;
