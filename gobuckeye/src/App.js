import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Purchase from './components/purchase';
import ViewOrder from './components/viewOrder';
import ViewConfirmation from './components/viewConfirmation';
import PaymentEntry from "./components/paymentEntry";
import ShippingEntry from "./components/shippingEntry";

function App() {
  return (
    <div className="App">
      <Router>
        <div className='content'>
          <Routes>
            {/* Redirect root to purchase page */}
            <Route path='/' element={<Navigate to='/purchase' replace />} />
            
            {/* Main purchase/catalog page */}
            <Route path='/purchase' element={<Purchase />} />
            
            {/* Order review page */}
            <Route path='/purchase/viewOrder' element={<ViewOrder />} />
            {/* Payment entry page */}
            <Route path="/purchase/paymentEntry" element={<PaymentEntry />} />

            {/* Shipping entry page */}
            <Route path="/purchase/shippingEntry" element={<ShippingEntry />} />
            
            {/* Order confirmation page */}
            <Route path='/purchase/viewConfirmation' element={<ViewConfirmation />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
