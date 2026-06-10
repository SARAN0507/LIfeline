import React from 'react';
import { ArrowLeft, Search, User, MapPin, Calendar, Heart, Phone, HelpCircle } from 'lucide-react';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const TAMIL_NADU_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivagangai', 'Tenkasi', 
  'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 
  'Vellore', 'Viluppuram', 'Virudhunagar'
];

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
    const matchCity = !searchCity || searchCity === 'All' || donor.city.toLowerCase() === searchCity.toLowerCase();
    return matchGroup && matchCity;
  });

  const filteredRequests = requests.filter(req => {
    const matchGroup = searchGroup === 'All' || req.bloodGroup === searchGroup;
    const matchCity = !searchCity || searchCity === 'All' || req.city.toLowerCase() === searchCity.toLowerCase();
    return matchGroup && matchCity;
  });

  // Extract blood groups with active "Critical" urgency requests
  const criticalGroups = Array.from(
    new Set(
      requests
        .filter(r => r.urgency === 'Critical' && r.unitsFulfilled < r.units)
        .map(r => r.bloodGroup)
    )
  );

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
            <label htmlFor="search-city">District (Tamil Nadu)</label>
            <select
              id="search-city"
              className="input-control"
              value={searchCity || 'All'}
              onChange={(e) => setSearchCity(e.target.value)}
            >
              <option value="All">All Districts</option>
              {TAMIL_NADU_DISTRICTS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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

      {criticalGroups.length > 0 && (
        <div 
          style={{
            background: 'linear-gradient(135deg, #FFEBEB 0%, #FFF0F0 100%)',
            border: '1px solid rgba(217, 4, 41, 0.15)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(217, 4, 41, 0.05)'
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>⚠️</span>
          <div>
            <strong style={{ color: 'var(--primary-red)', fontSize: '0.95rem', display: 'block', marginBottom: '2px' }}>
              Critical Blood Shortage Alert
            </strong>
            <span style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>
              Blood group{criticalGroups.length > 1 ? 's' : ''} <strong>{criticalGroups.join(', ')}</strong> {criticalGroups.length > 1 ? 'are' : 'is'} currently in critical shortage in Tamil Nadu. Voluntary donors of these groups are requested to step forward.
            </span>
          </div>
        </div>
      )}

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

                  <div className="rce-bottom" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="rce-units">
                        Fulfilled: <span>{req.unitsFulfilled} / {req.units} units</span>
                      </span>
                      {req.unitsFulfilled >= req.units && (
                        <span className="badge-available" style={{ background: '#E6F7ED', color: '#10B981', padding: '6px 12px' }}>
                          Met Successfully
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ 
                          flex: 1,
                          padding: '0.5rem 1rem', 
                          fontSize: '0.8rem', 
                          borderRadius: '8px',
                          background: '#25D366',
                          color: '#FFFFFF',
                          borderColor: '#25D366',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          const message = `🚨 *URGENT BLOOD DEMAND* 🚨\n\n` +
                            `Patient: *${req.patientName}*\n` +
                            `Blood Group: *${req.bloodGroup}*\n` +
                            `Units Required: *${req.units}*\n` +
                            `Hospital: *${req.hospital}, ${req.city}*\n` +
                            `Urgency: *${req.urgency}*\n` +
                            `Notes: "${req.description}"\n\n` +
                            `Please contact: *${req.contact}*\n\n` +
                            `Shared via Lifeline Blood App. Every second counts! Pls forward.`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.488 1.45 5.41 1.451 5.328 0 9.667-4.33 9.67-9.643.001-2.574-1.002-4.993-2.825-6.817a9.55 9.55 0 0 0-6.83-2.828c-5.336 0-9.674 4.332-9.677 9.648-.001 1.983.517 3.926 1.498 5.632l-.982 3.58 3.682-.966zm10.907-5.493c-.278-.139-1.643-.811-1.897-.904-.253-.093-.438-.139-.623.139-.185.278-.717.904-.878 1.09-.161.185-.322.208-.6.069-.278-.139-1.176-.434-2.24-1.384-.828-.739-1.387-1.652-1.55-1.93-.161-.278-.017-.428.122-.567.125-.125.278-.324.417-.486.139-.162.185-.278.278-.463.093-.185.046-.347-.023-.486-.069-.139-.623-1.503-.853-2.059-.224-.543-.47-.468-.644-.477-.166-.008-.357-.01-.548-.01-.191 0-.501.072-.763.36-.262.288-1.002.979-1.002 2.388 0 1.41 1.028 2.77 1.17 2.956.143.185 2.024 3.09 4.904 4.333.685.296 1.22.473 1.637.606.688.218 1.313.187 1.808.113.552-.083 1.643-.671 1.874-1.32.23-.649.23-1.205.161-1.32-.069-.116-.253-.185-.53-.324z"/>
                        </svg>
                        Share
                      </button>
                      
                      {req.unitsFulfilled < req.units && (
                        <button 
                          className="btn btn-primary" 
                          style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }}
                          onClick={() => onRespondRequest(req)}
                        >
                          Help Supply
                        </button>
                      )}
                    </div>
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
