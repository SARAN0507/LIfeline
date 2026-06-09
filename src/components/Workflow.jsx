import React from 'react';

export default function Workflow() {
  return (
    <section className="container workflow-section" id="how-it-works">
      <div className="section-header">
        <span className="section-label">Core Process</span>
        <h2 className="section-title">A simple flow, in an emergency</h2>
      </div>

      <div className="workflow-grid">
        <div className="workflow-card">
          <div className="wf-num">01 /</div>
          <h3 className="wf-title">Search by group & city</h3>
          <p className="wf-desc">
            Instantly view matching voluntary donors and nearby active supply indicators. Filter by blood group and location.
          </p>
        </div>

        <div className="workflow-card">
          <div className="wf-num">02 /</div>
          <h3 className="wf-title">Post an urgent request</h3>
          <p className="wf-desc">
            Submit critical blood needs including units required, target hospital, city, and patient description to broadcast to nearby donors.
          </p>
        </div>

        <div className="workflow-card">
          <div className="wf-num">03 /</div>
          <h3 className="wf-title">Connect & save lives</h3>
          <p className="wf-desc">
            Communicate directly with registered donors via telephone or secure alerts. Coordinate logistics and complete the donation.
          </p>
        </div>
      </div>
    </section>
  );
}
