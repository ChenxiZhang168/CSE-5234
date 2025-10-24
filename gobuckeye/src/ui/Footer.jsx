import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer-buckeye py-4 mt-auto" role="contentinfo">
      <div className="container container-narrow">
        <div className="row gy-3">
          <div className="col-12 col-md-4">
            <h6 className="text-uppercase mb-3">About</h6>
            <p className="mb-2">
              Buckeye Shop — an OSU-themed fan store for course demo.
            </p>
            <small>© {year} Buckeye Shop</small>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-uppercase mb-3">Shop</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="/purchase">Products</a>
              </li>
              <li>
                <a href="/order">Order Summary</a>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="text-uppercase mb-3">Support</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="/shipping">Shipping</a>
              </li>
              <li>
                <a href="/payment">Payment</a>
              </li>
              <li>
                <a href="#">Help Center</a>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h6 className="text-uppercase mb-3">Legal</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="#">Accessibility</a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary my-3" />
        <div className="d-flex justify-content-between">
          <small>All trademarks are property of their owners.</small>
        </div>
      </div>
    </footer>
  );
}
