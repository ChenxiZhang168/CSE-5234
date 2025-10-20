import React from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="py-4">
        <div className="container container-narrow">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
