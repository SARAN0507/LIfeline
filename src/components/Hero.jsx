import React from 'react';
import { ShieldCheck, Bell, ArrowRight } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Hero({ onRegisterClick, onSearchClick, onBloodGroupSelect }) {
  return (
    <section className="container hero-section">
      {/* Left Column: Headline and actions */}
      <div className="hero-left">
        <div className="pill-badge">
          <span className="pill-dot"></span>
          Live across India
        </div>
        
        <h1 className="hero-title">
          When seconds matter,<br />
          <span>find blood faster.</span>
        </h1>
        
        <p className="hero-sub">
          Connecting voluntary donors with emergency requests in real-time. 
          A centralized, direct donor matching network optimized for critical care. 
          Zero cost. Zero delay.
        </p>
        
        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={onRegisterClick}>
            Become a donor <ArrowRight size={18} style={{ marginLeft: '4px' }} />
          </button>
          <button className="btn btn-secondary" onClick={() => onSearchClick('All')}>
            Find blood now
          </button>
        </div>
        
        <div className="hero-features">
          <div className="hero-feat-item">
            <ShieldCheck size={20} />
            <span>Verified profiles</span>
          </div>
          <div className="hero-feat-item">
            <Bell size={20} />
            <span>Real-time alerts</span>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Search-by-Group Grid Card */}
      <div className="hero-right-card">
        <div className="card-title-bar">
          <div className="card-subtitle">Search by group</div>
          <h2 className="card-main-title">All blood groups</h2>
        </div>
        
        <div className="blood-grid">
          {BLOOD_GROUPS.map((group) => (
            <div 
              key={group} 
              className="blood-tile"
              onClick={() => onBloodGroupSelect(group)}
              title={`Find ${group} donors and requests`}
            >
              {group}
            </div>
          ))}
        </div>
        
        <div className="emergency-banner">
          <div className="eb-left">
            <span className="eb-label">1 unit = 3 lives</span>
            <span className="eb-desc">Plasma • Platelets • RBC</span>
          </div>
          <span className="eb-indicator">
            Emergency Network
          </span>
        </div>
      </div>
    </section>
  );
}
