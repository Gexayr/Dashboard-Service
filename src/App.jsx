import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import ReportDetails from './pages/ReportDetails';
import Rules from './pages/Rules';
import Clients from './pages/Clients';
import ClientProfile from './pages/ClientProfile';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:id" element={<ReportDetails />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
