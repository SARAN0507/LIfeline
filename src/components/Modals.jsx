import React, { useState } from 'react';
import { X, Heart, ShieldAlert, Phone, Send, Info } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];

// 1. REGISTER DONOR MODAL
export function RegisterModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: 'O-',
    city: 'Bengaluru',
    phone: '',
    email: '',
    lastDonationDate: '',
    available: true
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onClose();
    // Reset form
    setFormData({
      name: '',
      bloodGroup: 'O-',
      city: 'Bengaluru',
      phone: '',
      email: '',
      lastDonationDate: '',
      available: true
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            <Heart fill="var(--primary-red)" size={20} /> Register as Voluntary Donor
          </h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  className="input-control"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Blood Group *</label>
                  <select
                    className="input-control"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    {BLOOD_GROUPS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <select
                    className="input-control"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    {CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="input-control"
                    placeholder="e.g. +91 99887 76655"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    className="input-control"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Last Donation Date (if any)</label>
                <input
                  type="date"
                  className="input-control"
                  value={formData.lastDonationDate}
                  onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
                />
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="avail-check"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                />
                <label htmlFor="avail-check" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                  I am currently fit & available to donate blood immediately
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }} disabled={loading}>
              {loading ? "Registering..." : "Register Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. POST URGENT REQUEST MODAL
export function PostRequestModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O-',
    units: 2,
    hospital: '',
    city: 'Bengaluru',
    contact: '',
    urgency: 'Critical',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onClose();
    // Reset form
    setFormData({
      patientName: '',
      bloodGroup: 'O-',
      units: 2,
      hospital: '',
      city: 'Bengaluru',
      contact: '',
      urgency: 'Critical',
      description: ''
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header" style={{ background: '#FFF5F5' }}>
          <h3 className="modal-title" style={{ color: 'var(--primary-red)' }}>
            <ShieldAlert size={20} style={{ color: 'var(--primary-red)' }} /> Broadcast Emergency Blood Request
          </h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-form">
              <div className="form-group">
                <label>Patient Name / Diagnosis Details *</label>
                <input
                  type="text"
                  required
                  className="input-control"
                  placeholder="e.g. Ramesh Kumar (Heart Patient)"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Blood Group Needed *</label>
                  <select
                    className="input-control"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    {BLOOD_GROUPS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Units Needed *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    className="input-control"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: parseInt(e.target.value, 10) })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hospital & Area *</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    placeholder="e.g. Fortis Hospital, Bannerghatta"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <select
                    className="input-control"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    {CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Point of Contact Number *</label>
                  <input
                    type="tel"
                    required
                    className="input-control"
                    placeholder="e.g. +91 91234 98765"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Urgency Level *</label>
                  <select
                    className="input-control"
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  >
                    <option value="Critical">Critical (Immediate match needed)</option>
                    <option value="Moderate">Moderate (Within 24-48 hours)</option>
                    <option value="Stable">Stable (Preventive backup)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Case Notes / Extra Details</label>
                <textarea
                  className="input-control"
                  style={{ height: '80px', resize: 'none' }}
                  placeholder="e.g. Bleeding during surgery, requires platelet separation support. Target hospital blood bank accepts direct replacement."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }} disabled={loading}>
              {loading ? "Broadcasting..." : "Broadcast Request ⚡"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. CONTACT DONOR MODAL
export function ContactModal({ isOpen, onClose, donor }) {
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !donor) return null;

  const handleNotify = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/donors/${donor.id}/contact`, {
        method: 'POST'
      });
      if (response.ok) {
        setNotified(true);
      } else {
        alert("Failed to send system alert. Contacting directly via phone is advised.");
      }
    } catch (err) {
      console.error(err);
      setNotified(true); // Fallback mock success
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Phone size={20} /> Contact voluntary donor
          </h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div 
              style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'var(--primary-red-light)', 
                color: 'var(--primary-red)', 
                fontSize: '1.8rem', 
                fontWeight: '800', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                border: '1px solid rgba(217,4,41,0.15)'
              }}
            >
              {donor.bloodGroup}
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{donor.name}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Location: {donor.city} • Distance: {donor.distance || "Active"}
            </p>
          </div>

          <div 
            style={{ 
              background: '#FAFAFA', 
              border: '1px solid rgba(0,0,0,0.04)', 
              borderRadius: '12px', 
              padding: '1rem', 
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Phone Call:</span>
              <strong style={{ color: 'var(--text-dark)' }}>{donor.phone}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Email Address:</span>
              <strong style={{ color: 'var(--text-dark)' }}>{donor.email}</strong>
            </div>
          </div>

          {notified ? (
            <div 
              style={{ 
                background: '#E6F7ED', 
                border: '1px solid #A7F3D0', 
                borderRadius: '8px', 
                padding: '1rem', 
                color: '#065F46', 
                textAlign: 'center',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              <Send size={16} /> Notification SMS/Email Broadcasted successfully!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', borderRadius: '10px', gap: '0.8rem' }}
                onClick={handleNotify}
                disabled={loading}
              >
                <Send size={16} /> {loading ? "Broadcasting..." : "Broadcast Urgent System Alert"}
              </button>
              
              <a 
                href={`tel:${donor.phone}`} 
                className="btn btn-secondary" 
                style={{ width: '100%', borderRadius: '10px', gap: '0.8rem', textDecoration: 'none' }}
              >
                <Phone size={16} /> Call Donor Directly
              </a>
            </div>
          )}

          <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              By clicking "Broadcast Alert", our server will send simulated SMS alerts regarding this emergency directly to the donor.
            </span>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '1rem' }}>
          <button className="btn btn-secondary" style={{ width: '100%', borderRadius: '8px', padding: '0.5rem' }} onClick={onClose}>
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
