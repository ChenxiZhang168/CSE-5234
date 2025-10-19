import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const navigate = useNavigate();

  const handleCollegeClick = () => {
    navigate('/college');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center text-white mb-5 pt-4">
          <div className="d-flex justify-content-end mb-3">
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={() => navigate('/contact')}
            >
              📧 Contact Us
            </button>
          </div>
          <h1 className="display-2 fw-bold mb-3">Sports Merchandise Store</h1>
          <p className="lead fs-4 mb-4">Your one-stop shop for official team gear</p>
        </div>

        {/* Categories */}
        <div className="row g-4">
          {/* College - Active */}
          <div className="col-md-4">
            <div 
              className="card h-100 shadow-lg border-0"
              style={{ cursor: 'pointer' }}
              onClick={handleCollegeClick}
            >
              <div className="card-body text-center p-5" style={{ background: 'linear-gradient(135deg, #BB0000 0%, #8B0000 100%)' }}>
                <div className="text-white mb-4">
                  <div style={{ fontSize: '80px' }}>🎓</div>
                  <h2 className="mt-3 fw-bold">COLLEGE</h2>
                </div>
              </div>
              <div className="card-body text-center p-4">
                <h4 className="card-title mb-3 fw-bold">College Sports</h4>
                <p className="card-text text-muted mb-4">
                  Shop official merchandise from top college teams
                </p>
                <span className="badge bg-success mb-3">Available Now</span>
                <button className="btn btn-danger btn-lg w-100 fw-bold">
                  Shop College →
                </button>
              </div>
            </div>
          </div>

          {/* Professional - Coming Soon */}
          <div className="col-md-4">
            <div className="card h-100 shadow-lg border-0" style={{ opacity: 0.7 }}>
              <div className="card-body text-center p-5" style={{ background: 'linear-gradient(135deg, #2E3B55 0%, #1A1F2E 100%)' }}>
                <div className="text-white mb-4">
                  <div style={{ fontSize: '80px' }}>🏆</div>
                  <h2 className="mt-3 fw-bold">PROFESSIONAL</h2>
                </div>
              </div>
              <div className="card-body text-center p-4">
                <h4 className="card-title mb-3 fw-bold">Pro Sports</h4>
                <p className="card-text text-muted mb-4">
                  NFL, NBA, MLB, NHL merchandise
                </p>
                <span className="badge bg-warning text-dark mb-3">Coming Soon</span>
                <button className="btn btn-secondary btn-lg w-100 fw-bold" disabled>
                  Not Available Yet
                </button>
              </div>
            </div>
          </div>

          {/* International - Coming Soon */}
          <div className="col-md-4">
            <div className="card h-100 shadow-lg border-0" style={{ opacity: 0.7 }}>
              <div className="card-body text-center p-5" style={{ background: 'linear-gradient(135deg, #1E5128 0%, #0D2818 100%)' }}>
                <div className="text-white mb-4">
                  <div style={{ fontSize: '80px' }}>🌍</div>
                  <h2 className="mt-3 fw-bold">INTERNATIONAL</h2>
                </div>
              </div>
              <div className="card-body text-center p-4">
                <h4 className="card-title mb-3 fw-bold">International Sports</h4>
                <p className="card-text text-muted mb-4">
                  Soccer, rugby, cricket and more
                </p>
                <span className="badge bg-warning text-dark mb-3">Coming Soon</span>
                <button className="btn btn-secondary btn-lg w-100 fw-bold" disabled>
                  Not Available Yet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="row g-4 mt-5">
          <div className="col-md-3 text-center text-white">
            <div style={{ fontSize: '48px' }}>✓</div>
            <h5 className="fw-bold mt-3">Authentic Products</h5>
            <p>100% official licensed</p>
          </div>
          <div className="col-md-3 text-center text-white">
            <div style={{ fontSize: '48px' }}>🚚</div>
            <h5 className="fw-bold mt-3">Fast Shipping</h5>
            <p>Quick delivery</p>
          </div>
          <div className="col-md-3 text-center text-white">
            <div style={{ fontSize: '48px' }}>↻</div>
            <h5 className="fw-bold mt-3">Easy Returns</h5>
            <p>30-day policy</p>
          </div>
          <div className="col-md-3 text-center text-white">
            <div style={{ fontSize: '48px' }}>💳</div>
            <h5 className="fw-bold mt-3">Secure Payment</h5>
            <p>Safe checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;