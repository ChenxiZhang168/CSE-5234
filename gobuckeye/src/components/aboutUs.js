import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import polo from "../images/polo.png";
import member1 from "../images/member1.jpg";
import member2 from "../images/member2.jpg";
import member3 from "../images/member3.jpg";



export default function AboutUs() {
  const executives = [
    {
      name: 'Caleb Su',
      title: 'Co‑Founder & CEO',
      education: 'M.S. Computer Science, The Ohio State University',
      experience: 'Built and led cross‑functional teams; launched campus rental logistics and partner onboarding; managed early P&L and investor outreach.',
      passion: 'Scaling a student‑first, circular‑economy brand—balancing growth, service quality, and real savings for fans.',
      photo: member1,
    },
    {
      name: 'Chenxi Zhang',
      title: 'Co‑Founder & CTO',
      education: 'B.S. Industrial & Systems Engineering, The Ohio State University',
      experience: 'Architected the booking/inventory platform (React/Node); implemented locker/return flows, pricing engine, and data pipelines.',
      passion: 'Designing reliable, scalable systems that keep jerseys available, affordable, and traceable from pickup to cleaning.',
      photo: member2,
    },
    {
      name: 'Zeyu Huang',
      title: 'Co‑Founder & CFO',
      education: 'B.A. Marketing, Fisher College of Business (OSU)',
      experience: 'Owns unit economics, deposits, and tier pricing; built forecasting and cohort dashboards; set loss/late/cleaning policies.',
      passion: 'Disciplined, data‑driven growth—fair pricing for students while sustaining healthy margins and reinvestment.',
      photo: member3,
    }
  ];

  return (
    <div className="container-lg py-5">
      {/* Hero / Header */}
      <section className="bg-light rounded-3 p-4 p-md-5 mb-5">
        <div className="col-lg-10 mx-auto text-center">
          <h1 className="fw-bold display-5 mb-2">About GoBuckeye Jerseys</h1>
          <p className="lead text-muted mb-3">Affordable pride. Smarter re‑use.</p>
          <span className="badge bg-danger">Currently serving OSU team only</span>
        </div>
      </section>

      {/* Intro */}
      <section className="text-center mb-5">
        <div className="col-lg-9 mx-auto">
          <p className="lead text-muted">
            Fans love to show their Buckeye pride but hesitate to spend over $100 on a jersey they'll wear once.
            GoBuckeye Jerseys offers a smarter alternative — rent or buy quality pre-owned jerseys for game days,
            handled with professional care and delivered with convenience. It’s pride made practical and sustainable.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white"><h5 className="mb-0">Mission</h5></div>
            <div className="card-body">
              <p className="mb-0">
                Our mission is to make showing Buckeye spirit simple, affordable, and sustainable for students. We provide 24–72 hour rentals and curated resale of quality‑checked, pre‑owned OSU jerseys with transparent pricing and reliable availability. Fans reserve online and pick up near campus; returns are streamlined via lockers or drop boxes, with next‑day cleaning handled by us. By maximizing reuse and minimizing waste, we help students look game‑day ready without committing to a $100+ purchase—while turning idle closets into inventory that benefits the campus community.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white"><h5 className="mb-0">Vision</h5></div>
            <div className="card-body">
              <p className="mb-0">
                We envision a campus‑wide circular wardrobe that pairs convenience with impact. Every jersey is tracked, cared for, and recirculated so fans spend less and the community wastes less. As we refine operations—inventory tiers, data‑driven pricing, and frictionless pickup/returns—we aim to partner with student organizations and campus venues to meet peak game‑day demand. Success looks like measurable dollars saved by students and garments diverted from landfills. We will grow responsibly, proving our model with OSU first and expanding only when unit economics and service quality stay exceptional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white d-flex align-items-center justify-content-between">
          <h5 className="mb-0">Strategy</h5>
          <div>
            <span className="badge bg-secondary me-2">Operational Excellence</span>
            <span className="badge bg-secondary me-2">Student Value</span>
            <span className="badge bg-secondary">Sustainability</span>
          </div>
        </div>
        <div className="card-body">
          <p className="mb-0">
            GoBuckeye Jerseys’ strategy is to achieve affordable fanwear sustainability through operational focus and data-backed decisions.
            We begin by concentrating solely on the OSU market—allowing tight control of inventory quality, pricing, and logistics.
            By combining locker-based pickup and returns, transparent quality tiers, and resale-driven supply, we ensure a scalable model
            that balances student convenience, profitability, and environmental responsibility. Once proven locally, this framework can be
            expanded to other campuses with minimal overhead and strong community partnerships.
          </p>
        </div>
      </div>

      {/* Meet our Executives */}
      <div className="mb-4">
        <h3 className="mb-3">Meet Our Executives</h3>
      </div>
      <div className="row g-4 justify-content-center">
        {executives.map((e, idx) => (
          <div className="col-md-6 col-lg-4" key={idx}>
            <div className="card h-100 shadow-sm">
              <img
                src={e.photo}
                alt={`${e.name}`}
                className="card-img-top"
                style={{
                  objectFit: "contain",
                  height: "260px",
                  padding: "10px",
                  backgroundColor: "#f8f9fa"
                }}
              />
              <div className="card-body text-center">
                <h5 className="card-title mb-1">{e.name}</h5>
                <div className="text-muted mb-2">{e.title}</div>
                <div className="mb-2">
                  <span className="badge bg-secondary me-2">OSU</span>
                  <span className="badge bg-light text-dark border">Leadership</span>
                </div>
                <ul className="list-unstyled small mb-0">
                  <li><strong>Education:</strong> {e.education}</li>
                  <li><strong>Experience:</strong> {e.experience}</li>
                  <li><strong>Passion:</strong> {e.passion}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Investor‑friendly closing */}
      <div className="card shadow-sm mt-5">
        <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between">
          <div className="text-start">
            <h5 className="mb-1">Why now?</h5>
            <p className="mb-0 text-muted">High fan demand, clear willingness to rent, and growing sustainability expectations on campus.</p>
          </div>
          <a href="/purchase" className="btn btn-danger mt-3 mt-md-0">Explore Jerseys</a>
        </div>
      </div>
    </div>
  );
}