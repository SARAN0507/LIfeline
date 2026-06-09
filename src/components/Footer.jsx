import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer({ onRegisterClick }) {
  return (
    <footer>
      {/* Red Banner Call to Action */}
      <section className="cta-banner-section">
        <div className="container cta-banner-content">
          <h2 className="cta-banner-title">
            Your blood type is<br />
            someone's lifeline.
          </h2>
          <p className="cta-banner-sub">
            Join thousands of voluntary donors making a difference, one unit at a time.
          </p>
          <button className="btn-cta-white" onClick={onRegisterClick}>
            Register as a donor
          </button>
        </div>
      </section>

      {/* Dark Footer */}
      <div className="main-footer">
        <div className="container footer-container">
          <div className="footer-brand">
            <Heart fill="var(--primary-red)" size={20} />
            Lifeline <span>NETWORK</span>
          </div>
          
          <p style={{ fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} Lifeline. Project designed for emergency blood matching. All rights reserved.
          </p>
          
          <ul className="footer-links">
            <li>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy simulated."); }}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service simulated."); }}>
                Terms of Use
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => { e.preventDefault(); alert("Help desk: support@lifelineblood.org"); }}>
                Contact Support
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
