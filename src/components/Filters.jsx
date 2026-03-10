import React, { useState } from 'react';
import './Filters.css';

const Filters = ({ onApply }) => {
  const [filters, setFilters] = useState({
    client_id: '',
    min_score: '',
    from: '',
    to: '',
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
        <label htmlFor="client_id">Client ID</label>
        <input
          type="text"
          id="client_id"
          name="client_id"
          value={filters.client_id}
          onChange={handleChange}
          placeholder="Client ID"
        />
      </div>
      <div className="filter-group">
        <label htmlFor="min_score">Min Risk Score</label>
        <input
          type="number"
          id="min_score"
          name="min_score"
          value={filters.min_score}
          onChange={handleChange}
          min="0"
          max="100"
          placeholder="0-100"
        />
      </div>
      <div className="filter-group">
        <label htmlFor="from">From Date</label>
        <input
          type="date"
          id="from"
          name="from"
          value={filters.from}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="to">To Date</label>
        <input
          type="date"
          id="to"
          name="to"
          value={filters.to}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="apply-btn">Apply</button>
    </form>
  );
};

export default Filters;
