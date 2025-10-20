import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-buckeye"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container container-narrow">
        <NavLink to="/" className="navbar-brand fw-bold">
          Buckeye Shop
        </NavLink>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="mainNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Homepage
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/college" className="nav-link">
                College
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/purchase" className="nav-link">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/shipping" className="nav-link">
                Shipping
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/payment" className="nav-link">
                Payment
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/order" className="nav-link">
                Order Summary
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
