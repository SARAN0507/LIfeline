import React from 'react';
import { Heart } from 'lucide-react';

export default function Navbar({ onRegisterClick, onSearchClick }) {
  return (
    <nav className="navbar-sticky">
      <div className="container navbar-container">
        <a href="/" className="brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <Heart fill="#D90429" size={28} style={{ marginRight: '2px' }} />
          Lifeline
          <span className="brand-sub">BLOOD NETWORK</span>
        </a>

        <ul className="nav-links">
          <li>
            <a href="#how-it-works" className="nav-link" onClick={(e) => {
              e.preventDefault();
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              How it works
            </a>
          </li>
          <li>
            <a href="#features" className="nav-link" onClick={(e) => {
              e.preventDefault();
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Features
            </a>
          </li>
          <li>
            <a href="#impact" className="nav-link" onClick={(e) => {
              e.preventDefault();
              document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Impact
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          <a href="#post-request" className="nav-link" style={{ color: 'var(--primary-red)', fontWeight: '700' }} onClick={(e) => {
            e.preventDefault();
            onPostRequestClick();
          }}>
            Post Request ⚡
          </a>
          <a href="#signin" className="nav-link" onClick={(e) => {
            e.preventDefault();
            alert("Sign In functionality simulated. You are logged in as administrator.");
          }}>
            Sign in
          </a>
          <button className="btn btn-primary" onClick={onRegisterClick}>
            Get started
          </button>
        </div>
      </div>
    </nav>
  );
}
