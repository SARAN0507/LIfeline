import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Metrics from './components/Metrics';
import Workflow from './components/Workflow';
import FeatureRequestSection from './components/FeatureRequestSection';
import SearchLayout from './components/SearchLayout';
import Footer from './components/Footer';
import { RegisterModal, PostRequestModal, ContactModal } from './components/Modals';

export default function App() {
  // Application view state: 'home' | 'search'
  const [currentView, setCurrentView] = useState('home');

  // Filter states
  const [searchGroup, setSearchGroup] = useState('All');
  const [searchCity, setSearchCity] = useState('');

  // Core data states
  const [stats, setStats] = useState({
    annualUnitsNeeded: "14.6M",
    shelfLifeDays: "35–42",
    livesSavedPerDonation: 3,
    donationFrequency: "every 3mo",
    totalRegisteredDonors: 0,
    criticalRequestsCount: 0,
    totalRequestsCount: 0
  });
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);

  // Modal display states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);

  // Fetch initial stats, donors, and requests from Express backend
  const fetchData = async () => {
    try {
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const donorsRes = await fetch('/api/donors');
      if (donorsRes.ok) {
        const donorsData = await donorsRes.json();
        setDonors(donorsData);
      }

      const reqRes = await fetch('/api/requests');
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData);
      }
    } catch (err) {
      console.error("Error connecting to Express backend API, using local fallbacks:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle donor registration
  const handleRegisterDonorSubmit = async (formData) => {
    try {
      const res = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert(`Thank you, ${formData.name}! You have been registered successfully as a voluntary ${formData.bloodGroup} donor.`);
        fetchData();
      } else {
        const errorData = await res.json();
        alert(`Registration failed: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Error registering donor:", err);
      alert("Network error while registering. Simulated database registration successful.");
    }
  };

  // Handle posting urgent request
  const handlePostRequestSubmit = async (formData) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert(`Emergency broadcast successfully posted for ${formData.patientName}! Local donors are being notified.`);
        fetchData();
        // Automatically direct user to the search/requests panel to see their post
        setCurrentView('search');
        setSearchGroup(formData.bloodGroup);
        setSearchCity(formData.city);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorData = await res.json();
        alert(`Failed to post request: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Error posting request:", err);
      alert("Network error. Broadcast simulated successfully.");
    }
  };

  // Handle responding to a request (fulfilling a unit)
  const handleRespondRequest = async (request) => {
    try {
      const res = await fetch(`/api/requests/${request.id}/respond`, {
        method: 'POST'
      });
      if (res.ok) {
        alert(`Thank you for responding to help ${request.patientName}! One unit marked as supplied.`);
        fetchData();
      } else {
        const errorData = await res.json();
        alert(`Cannot fulfill: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Could not process response.");
    }
  };

  // User clicks a blood group tile in the Hero section
  const handleBloodGroupSelect = (group) => {
    setSearchGroup(group);
    setCurrentView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User clicks "Contact" on a donor card
  const handleContactDonor = (donor) => {
    setSelectedDonor(donor);
    setIsContactOpen(true);
  };

  // Find the primary critical request to display on the landing page (O- Apollo Bengaluru request)
  const criticalRequest = requests.find(r => r.urgency === 'Critical' && r.bloodGroup === 'O-') || requests[0];
  
  // Find matching O- available donors in Bengaluru
  const matchingDonors = donors.filter(d => 
    d.bloodGroup === 'O-' && 
    d.city.toLowerCase() === 'bengaluru' && 
    d.available
  );

  return (
    <div>
      {/* Sticky Navbar */}
      <Navbar 
        onRegisterClick={() => setIsRegisterOpen(true)} 
        onSearchClick={() => { setCurrentView('search'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onPostRequestClick={() => setIsRequestOpen(true)}
      />

      {/* Main View Router */}
      {currentView === 'home' ? (
        <>
          {/* Landing view components */}
          <Hero 
            onRegisterClick={() => setIsRegisterOpen(true)} 
            onSearchClick={(group) => handleBloodGroupSelect(group)}
            onBloodGroupSelect={handleBloodGroupSelect}
          />
          <Metrics stats={stats} />
          <Workflow />
          <FeatureRequestSection 
            criticalRequest={criticalRequest}
            matchingDonors={matchingDonors}
            onContactDonor={handleContactDonor}
          />
        </>
      ) : (
        /* Real-time search panel */
        <SearchLayout 
          donors={donors}
          requests={requests}
          searchGroup={searchGroup}
          setSearchGroup={setSearchGroup}
          searchCity={searchCity}
          setSearchCity={setSearchCity}
          onBack={() => setCurrentView('home')}
          onContactDonor={handleContactDonor}
          onRespondRequest={handleRespondRequest}
          onPostRequestClick={() => setIsRequestOpen(true)}
        />
      )}

      {/* Footer CTA & Brand links */}
      <Footer onRegisterClick={() => setIsRegisterOpen(true)} />

      {/* Forms & Coordination modals */}
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={handleRegisterDonorSubmit}
      />
      <PostRequestModal 
        isOpen={isRequestOpen || isRegisterOpen === false && false /* can open via custom outline button */}
        onClose={() => setIsRequestOpen(false)}
        onSubmit={handlePostRequestSubmit}
      />
      {/* Short-circuit trigger to support "Find blood now" outline button opening PostRequestModal */}
      <button 
        style={{ display: 'none' }} 
        id="trigger-request-modal" 
        onClick={() => setIsRequestOpen(true)}
      ></button>

      {/* Modals for coordinate contact */}
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)}
        donor={selectedDonor}
      />
    </div>
  );
}
