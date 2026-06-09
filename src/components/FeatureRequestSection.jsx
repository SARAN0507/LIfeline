import React from 'react';
import { Check, Flame, MessageSquare } from 'lucide-react';

export default function FeatureRequestSection({ criticalRequest, matchingDonors, onContactDonor }) {
  // Use default fallback if criticalRequest or matchingDonors are not loaded yet
  const request = criticalRequest || {
    id: "r1",
    patientName: "Aarav Mehta (Trauma Patient)",
    bloodGroup: "O-",
    units: 2,
    hospital: "Apollo Hospital",
    city: "Bengaluru",
    description: "Severe road accident victim. Immediate transfusion required within hours. Please contact urgently.",
    createdAt: new Date().toISOString()
  };

  const donors = matchingDonors && matchingDonors.length > 0 ? matchingDonors.slice(0, 3) : [
    { id: "d1", name: "Ravi Kumar", bloodGroup: "O-", city: "Bengaluru", available: true, distance: "2 km" },
    { id: "d2", name: "Anita Sharma", bloodGroup: "O-", city: "Bengaluru", available: true, distance: "3 km" }
  ];

  return (
    <section className="features-section" id="features">
      <div className="container features-grid">
        {/* Left Column: Platform features checklist */}
        <div className="feat-left">
          <span className="section-label">Engineering Details</span>
          <h3>Advanced Donor Network</h3>
          <p className="feat-desc">
            Designed for sub-second responses and high reliability in emergency medical situations. 
            The system tracks eligibility metrics to protect donors while routing requests to active responders.
          </p>
          
          <div className="checklist">
            <div className="checklist-item">
              <span className="check-icon">
                <Check />
              </span>
              <span className="check-text">Donor profiles with eligibility tracking (last donation date)</span>
            </div>
            
            <div className="checklist-item">
              <span className="check-icon">
                <Check />
              </span>
              <span className="check-text">City + blood group search with availability filter</span>
            </div>
            
            <div className="checklist-item">
              <span className="check-icon">
                <Check />
              </span>
              <span className="check-text">Emergency request feed sorted by urgency</span>
            </div>
            
            <div className="checklist-item">
              <span className="check-icon">
                <Check />
              </span>
              <span className="check-text">Role-based access controls and Row-Level Security</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live mock component of a Critical request */}
        <div className="feat-right">
          <div className="active-request-card">
            <div className="req-header">
              <span className="badge-critical">
                Critical Urgency
              </span>
              <span className="req-time">Live feed</span>
            </div>
            
            <div className="req-main-info">
              <div className="req-group-circle">
                {request.bloodGroup}
              </div>
              <div className="req-details-title">
                <h4 className="req-title-txt">{request.units} Units Needed</h4>
                <p className="req-subtitle-txt">{request.patientName}</p>
                <p className="req-subtitle-txt" style={{ fontSize: '0.8rem', color: '#888' }}>
                  {request.hospital}, {request.city}
                </p>
              </div>
            </div>
            
            <p className="req-desc-text">
              "{request.description}"
            </p>
            
            <h4 className="matching-donors-title">
              Nearby Matching Donors
            </h4>
            
            <div className="matching-donors-list">
              {donors.map((donor) => {
                // Get initials
                const initials = donor.name.split(' ').map(n => n[0]).join('');
                return (
                  <div key={donor.id} className="donor-avatar-card">
                    <div className="dac-left">
                      <div className="dac-avatar">
                        {initials}
                      </div>
                      <div className="dac-info">
                        <span className="dac-name">{donor.name}</span>
                        <span className="dac-dist">{donor.distance} away</span>
                      </div>
                    </div>
                    
                    <div className="dac-right">
                      {donor.available && (
                        <span className="badge-available">Available</span>
                      )}
                      <button 
                        className="btn-contact"
                        onClick={() => onContactDonor(donor)}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ✦ Live distance computed based on real-time location.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
