import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Layout from "./layout/Layout";
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
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/college" element={<College />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/purchase/viewOrder" element={<ViewOrder />} />
              <Route path="/purchase/paymentEntry" element={<PaymentEntry />} />
              <Route path="/purchase/shippingEntry" element={<ShippingEntry />} />
              <Route path="/purchase/viewConfirmation" element={<ViewConfirmation />} />
              <Route path="/about" element={<AboutUs />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
