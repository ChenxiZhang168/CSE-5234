import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ContactUs() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      // Form is valid - simulate submission
      setSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setSubmitted(false);
      }, 3000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container py-5">
        {/* Header */}
        <div className="text-center text-white mb-5">
          <button 
            className="btn btn-outline-light btn-sm mb-3"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
          <h1 className="display-3 fw-bold mb-3">Contact Us</h1>
          <p className="lead">We'd love to hear from you! Send us a message.</p>
        </div>

        <div className="row g-4">
          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                <h3 className="mb-4">Send us a Message</h3>
                
                {submitted && (
                  <div className="alert alert-success" role="alert">
                    <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon!
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label fw-semibold">
                      Subject <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="">Select a subject...</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Question</option>
                      <option value="product">Product Information</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="return">Returns & Exchanges</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <div className="invalid-feedback">{errors.subject}</div>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="mb-4">
                    <label htmlFor="message" className="form-label fw-semibold">
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                    {errors.message && (
                      <div className="invalid-feedback">{errors.message}</div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-danger btn-lg w-100 fw-bold">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body p-4">
                <h4 className="mb-4">Contact Information</h4>
                
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">📍 Address</h6>
                  <p className="text-muted mb-0">
                    2015 Neil Ave<br />
                    Columbus, OH 43210<br />
                    United States
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-2">📧 Email</h6>
                  <p className="text-muted mb-0">
                    <a href="mailto:support@sportsstore.com" className="text-decoration-none">
                      support@sports_store.com
                    </a>
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-2">📞 Phone</h6>
                  <p className="text-muted mb-0">
                    <a href="tel:+16145551234" className="text-decoration-none">
                      (614) 292-2572
                    </a>
                  </p>
                </div>

                <div>
                  <h6 className="fw-bold mb-2">🕐 Business Hours</h6>
                  <p className="text-muted mb-1">Monday - Friday: 10:00 AM - 5:00 PM</p>
                  <p className="text-muted mb-1">Saturday: Closed</p>
                  <p className="text-muted mb-0">Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="card shadow-lg border-0" style={{ background: 'linear-gradient(135deg, #BB0000 0%, #8B0000 100%)' }}>
              <div className="card-body p-4 text-white text-center">
                <h5 className="fw-bold mb-3">Need Immediate Help?</h5>
                <p className="mb-3">Check out our FAQ section for quick answers to common questions.</p>
                <button className="btn btn-light fw-bold" onClick={() => navigate('/')}>
                  Visit FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;