import logo from "./logo.svg";
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout";

// Import components
import Purchase from "./components/purchase";
import ViewOrder from "./components/viewOrder";
import ViewConfirmation from "./components/viewConfirmation";
import PaymentEntry from "./components/paymentEntry";
import ShippingEntry from "./components/shippingEntry";
import Home from "./components/home";
import College from "./components/college";
import ContactUs from "./components/contactUs";
import AboutUs from "./components/aboutUs";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="content">
          {/* direct the routes for website */}
          <Routes>
            {/* Redirect root to home page */}
            {/* <Route path='/' element={<Navigate to='/home' replace />} /> */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/college" element={<College />} />

              {/* Contact Us page */}
              <Route path="/contact" element={<ContactUs />} />

              {/* Main purchase/catalog page */}
              <Route path="/purchase" element={<Purchase />} />

              {/* Order review page */}
              <Route path="/order" element={<ViewOrder />} />

              {/* Payment entry page */}
              <Route path="/payment" element={<PaymentEntry />} />

              {/* Shipping entry page */}
              <Route path="/shipping" element={<ShippingEntry />} />

              {/* Order confirmation page */}
              <Route
                path="/purchase/viewConfirmation"
                element={<ViewConfirmation />}
              />

              {/* About page */}
              <Route path="/about" element={<AboutUs />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
