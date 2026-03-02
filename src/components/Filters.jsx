import React, { useState } from 'react';
import './Filters.css';

const Filters = ({ onApply }) => {
  const [filters, setFilters] = useState({
    clientId: '',
    minRiskScore: '',
    fromDate: '',
    toDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(filters);
  };

  return (
    <form className="filters-form" onSubmit={handleSubmit}>
      <div className="filter-group">
        <label htmlFor="clientId">Client ID</label>
        <input
          type="text"
          id="clientId"
          name="clientId"
          value={filters.clientId}
          onChange={handleChange}
          placeholder="Client ID"
        />
      </div>
      <div className="filter-group">
        <label htmlFor="minRiskScore">Min Risk Score</label>
        <input
          type="number"
          id="minRiskScore"
          name="minRiskScore"
          value={filters.minRiskScore}
          onChange={handleChange}
          min="0"
          max="100"
          placeholder="0-100"
        />
      </div>
      <div className="filter-group">
        <label htmlFor="fromDate">From Date</label>
        <input
          type="date"
          id="fromDate"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="toDate">To Date</label>
        <input
          type="date"
          id="toDate"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="apply-btn">Apply</button>
    </form>
  );
};

export default Filters;
