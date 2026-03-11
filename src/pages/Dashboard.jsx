import React, { useState, useEffect, useCallback } from 'react';
import {
  getEvents,
  getStats,
  getRiskOverTime,
  getRiskDistribution,
  getEventsPerClient
} from '../api/dashboard';
import Stats from '../components/Stats';
import Filters from '../components/Filters';
import EventsTable from '../components/EventsTable';
import Pagination from '../components/Pagination';
import RiskOverTimeChart from '../components/charts/RiskOverTimeChart';
import RiskDistributionChart from '../components/charts/RiskDistributionChart';
import EventsPerClientChart from '../components/charts/EventsPerClientChart';
import './Dashboard.css';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [riskOverTime, setRiskOverTime] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [eventsPerClient, setEventsPerClient] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    client_id: '',
    min_score: '',
    from: '',
    to: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page,
        limit: 50,
      };
      
      const response = await getEvents(params);
      setEvents(response.data.data || []);
      setTotalPages(response.data.total_pages || 1);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await getStats(filters);
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [filters]);

  const fetchCharts = useCallback(async () => {
    setChartsLoading(true);
    setChartsError(null);
    try {
      const [overTimeRes, distributionRes, perClientRes] = await Promise.all([
        getRiskOverTime(filters),
        getRiskDistribution(filters),
        getEventsPerClient(filters)
      ]);
      setRiskOverTime(Array.isArray(overTimeRes.data.data) ? overTimeRes.data.data : []);
      setRiskDistribution(Array.isArray(distributionRes.data.data) ? distributionRes.data.data : []);
      setEventsPerClient(Array.isArray(perClientRes.data.data) ? perClientRes.data.data : []);
    } catch (err) {
      setChartsError('Failed to fetch chart data. Please try again later.');
      console.error('Failed to fetch charts:', err);
    } finally {
      setChartsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on new filter
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Risk Monitoring Dashboard</h1>
      </header>
      
      <main className="dashboard-content">
        <Stats stats={stats} loading={statsLoading} />
        
        <section className="filters-section">
          <h2>Filters</h2>
          <Filters onApply={handleApplyFilters} />
        </section>

        <section className="charts-section">
          <RiskOverTimeChart 
            data={riskOverTime} 
            loading={chartsLoading} 
            error={chartsError} 
          />
          <div className="charts-grid">
            <RiskDistributionChart 
              data={riskDistribution} 
              loading={chartsLoading} 
              error={chartsError} 
            />
            <EventsPerClientChart 
              data={eventsPerClient} 
              loading={chartsLoading} 
              error={chartsError} 
            />
          </div>
        </section>

        <section className="table-section">
          <div className="section-header">
            <h2>Recent Events</h2>
            {loading && <span className="refreshing-indicator">Refreshing...</span>}
          </div>
          <EventsTable 
            events={events} 
            loading={loading && events.length === 0} 
            error={error} 
          />
          <Pagination 
            page={page} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
