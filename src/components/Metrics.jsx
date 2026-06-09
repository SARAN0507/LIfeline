import React from 'react';

export default function Metrics({ stats }) {
  return (
    <section className="container metrics-section" id="impact">
      <div className="metrics-bar">
        <div className="metric-item">
          <span className="metric-val">{stats.annualUnitsNeeded || "14.6M"}</span>
          <span className="metric-lbl">Units needed annually in India</span>
        </div>
        
        <div className="metric-item">
          <span className="metric-val">{stats.shelfLifeDays || "35–42"}</span>
          <span className="metric-lbl">Day shelf life of donated blood</span>
        </div>
        
        <div className="metric-item">
          <span className="metric-val">{stats.livesSavedPerDonation || "3"}</span>
          <span className="metric-lbl">Lives saved per single donation</span>
        </div>
        
        <div className="metric-item">
          <span className="metric-val">{stats.donationFrequency || "every 3mo"}</span>
          <span className="metric-lbl">Healthy adults can donate</span>
        </div>
      </div>
    </section>
  );
}
