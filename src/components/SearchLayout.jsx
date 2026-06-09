import React from 'react';
import { ArrowLeft, Search, User, MapPin, Calendar, Heart, Phone, HelpCircle } from 'lucide-react';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function SearchLayout({
  donors,
  requests,
  searchGroup,
  setSearchGroup,
  searchCity,
  setSearchCity,
  onBack,
  onContactDonor,
  onRespondRequest,
  onPostRequestClick
}) {
  
  // Client side filtering for visual speed
  const filteredDonors = donors.filter(donor => {
    const matchGroup = searchGroup === 'All' || donor.bloodGroup === searchGroup;
    const matchCity = !searchCity || donor.city.toLowerCase().includes(searchCity.toLowerCase());
    return matchGroup && matchCity;
  });

  const filteredRequests = requests.filter(req => {
    const matchGroup = searchGroup === 'All' || req.bloodGroup === searchGroup;
    const matchCity = !searchCity || req.city.toLowerCase().includes(searchCity.toLowerCase());
    return matchGroup && matchCity;
  });

  return (
    <div className="container search-layout-container">
      {/* Header controls with Back link */}
      <div className="search-controls">
        <div className="search-title-section">
          <div>
            <span className="section-label">Real-time Search</span>
            <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Match Donors & Requests</h2>
          </div>
          <button className="btn-back-home" onClick={onBack}>
            <ArrowLeft size={16} /> Back to Homepage
          </button>
        </div>

        <div className="search-grid">
          <div className="form-group">
            <label htmlFor="search-group">Blood Group Needed</label>
            <select
              id="search-group"
              className="input-control"
              value={searchGroup}
              onChange={(e) => setSearchGroup(e.target.value)}
            >
              {BLOOD_GROUPS.map(g => (
                <option key={g} value={g}>{g === 'All' ? 'All Blood Groups' : g}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="search-city">City Name</label>
            <input
              id="search-city"
              type="text"
              className="input-control"
              placeholder="e.g. Bengaluru, Delhi, Mumbai"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>

          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Showing {filteredDonors.length} donors & {filteredRequests.length} requests
            </p>
            <button className="btn btn-primary" style={{ width: '100%', borderRadius: '10px', height: '45px' }}>
              <Search size={16} /> Filter Results
            </button>
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="results-columns-container">
        {/* Left Column: Available Donors */}
        <div className="results-column">
          <h3>
            <User size={20} style={{ color: 'var(--primary-red)' }} />
            Available Voluntary Donors ({filteredDonors.length})
          </h3>

          {filteredDonors.length === 0 ? (
            <div className="no-results">
              <p>No matching voluntary donors registered in this location yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Be the first to register as a donor!</p>
            </div>
          ) : (
            <div className="results-list">
              {filteredDonors.map(donor => (
                <div key={donor.id} className="donor-card-extended">
                  <div className="dce-left">
                    <div className="dce-group-circle">
                      {donor.bloodGroup}
                    </div>
                    <div className="dce-info">
                      <h4>{donor.name}</h4>
                      <div className="dce-sub-info">
                        <span><MapPin size={12} /> {donor.city} ({donor.distance || "N/A"})</span>
                        {donor.lastDonationDate && (
                          <span><Calendar size={12} /> Last: {donor.lastDonationDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {donor.available ? (
                      <span className="badge-available">Active</span>
                    ) : (
                      <span className="badge-available" style={{ background: '#E5E7EB', color: '#6B7280' }}>Busy</span>
                    )}
                    <button className="btn-contact" onClick={() => onContactDonor(donor)}>
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Emergency Requests */}
        <div className="results-column">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid rgba(217, 4, 41, 0.08)', paddingBottom: '0.5rem' }}>
            <h3 style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Heart size={20} style={{ color: 'var(--primary-red)' }} />
              Urgent Blood Demands ({filteredRequests.length})
            </h3>
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px' }}
              onClick={onPostRequestClick}
            >
              Post Request ⚡
            </button>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="no-results">
              <p>No active emergency blood requests fit your filters.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Post a request if there's an emergency.</p>
            </div>
          ) : (
            <div className="results-list">
              {filteredRequests.map(req => (
                <div key={req.id} className="request-card-extended">
                  <div className="rce-top">
                    <span className={`rce-badge-urgency urg-${req.urgency.toLowerCase()}`}>
                      {req.urgency} Urgency
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="rce-middle">
                    <div className="rce-group">
                      {req.bloodGroup}
                    </div>
                    <div className="rce-patient">
                      <h4>{req.units} Units Needed</h4>
                      <p>{req.patientName}</p>
                      <p style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={10} /> {req.hospital}, {req.city}
                      </p>
                    </div>
                  </div>

                  <p className="rce-desc">
                    "{req.description}"
                  </p>

                  <div className="rce-bottom">
                    <span className="rce-units">
                      Fulfilled: <span>{req.unitsFulfilled} / {req.units} units</span>
                    </span>
                    {req.unitsFulfilled >= req.units ? (
                      <span className="badge-available" style={{ background: '#E6F7ED', color: '#10B981', padding: '6px 12px' }}>
                        Met Successfully
                      </span>
                    ) : (
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }}
                        onClick={() => onRespondRequest(req)}
                      >
                        Help Supply
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
