import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function College() {
  const navigate = useNavigate();

  const colleges = [
    {
      id: 1,
      name: 'Ohio State University',
      mascot: 'Buckeyes',
      colors: 'Scarlet & Gray',
      emoji: '🌰',
      available: true
    },
    {
      id: 2,
      name: 'University of Michigan',
      mascot: 'Wolverines',
      colors: 'Maize & Blue',
      emoji: '🦡',
      available: false
    },
    {
      id: 3,
      name: 'Penn State University',
      mascot: 'Nittany Lions',
      colors: 'Blue & White',
      emoji: '🦁',
      available: false
    },
    {
      id: 4,
      name: 'University of Alabama',
      mascot: 'Crimson Tide',
      colors: 'Crimson & White',
      emoji: '🌊',
      available: false
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div className="bg-dark text-white py-4 mb-4">
        <div className="container">
          <button 
            className="btn btn-outline-light btn-sm mb-3"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
          <h1 className="display-4 fw-bold">College Merchandise</h1>
          <p className="lead mb-0">Support your favorite college team</p>
        </div>
      </div>

      {/* College Cards */}
      <div className="container pb-5">
        <div className="row g-4">
          {colleges.map((college) => (
            <div key={college.id} className="col-md-6 col-lg-3">
              <div 
                className="card h-100 shadow-sm border-0"
                style={{ 
                  cursor: college.available ? 'pointer' : 'not-allowed',
                  opacity: college.available ? 1 : 0.6
                }}
                onClick={() => college.available && navigate('/purchase')}
              >
                <div 
                  className="card-body text-center p-4"
                  style={{
                    background: college.available 
                      ? 'linear-gradient(135deg, #BB0000 0%, #8B0000 100%)'
                      : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                  }}
                >
                  <div style={{ fontSize: '64px' }}>{college.emoji}</div>
                  <h5 className="text-white fw-bold mt-3">{college.mascot}</h5>
                </div>
                <div className="card-body">
                  <h6 className="card-title fw-bold">{college.name}</h6>
                  <p className="card-text text-muted small mb-2">
                    <strong>Colors:</strong> {college.colors}
                  </p>
                  {college.available ? (
                    <>
                      <span className="badge bg-success mb-3">Available Now</span>
                      <button className="btn btn-danger btn-sm w-100">
                        Shop Now
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="badge bg-warning text-dark mb-3">Coming Soon</span>
                      <button className="btn btn-secondary btn-sm w-100" disabled>
                        Not Available
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default College;