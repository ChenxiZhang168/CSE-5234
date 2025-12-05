import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Footer from "../ui/Footer";

/** Inline Block "O" so you don't need image files */
function BlockO() {
  return (
    <svg className="block-o" viewBox="0 0 64 64" aria-hidden="true">
      <path fill="#bb0000" d="M16 4h32l12 12v32l-12 12H16L4 48V16L16 4z" />
      <path fill="#ffffff" d="M20 10h24l10 10v24l-10 10H20L10 44V20L20 10z" />
      <path fill="#bb0000" d="M24 16h16l8 8v16l-8 8H24l-8-8V24l8-8z" />
    </svg>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const showHero = pathname === "/" || pathname === "/home";

  return (
    <>
      {/* Header */}
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <BlockO />
            <span>Ohio State • Buckeye App</span>
          </div>
          <nav className="nav" aria-label="Primary">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Home
            </NavLink>
            <NavLink
              to="/college"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              College
            </NavLink>
            <NavLink
              to="/purchase"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Purchase
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Contact
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Optional Hero — show only on Home */}
      {showHero && (
        <section className="hero" role="banner" aria-label="Buckeye hero">
          <div className="container">
            <h1 className="hero-title">Welcome to the GameDayShare</h1>
            <div className="btn-row">
              <button className="btn btn-scarlet">Get Started</button>
              <button className="btn btn-ghost">Learn More</button>
            </div>
          </div>
        </section>
      )}

      {/* Page body */}
      <main className="container" role="main">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
