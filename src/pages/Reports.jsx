import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReports, generateReport } from '../api/reports';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getReports();
      setReports(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(toDate.getDate() - 7);
      const formatDate = (date) => date.toISOString().split('T')[0];
      await generateReport({
        from: formatDate(fromDate),
        to: formatDate(toDate)
      });
      await fetchReports();
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    title: {
      margin: 0,
      fontSize: '24px',
      color: '#2c3e50'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.2s'
    },
    buttonDisabled: {
      backgroundColor: '#95a5a6',
      cursor: 'not-allowed'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left'
    },
    th: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderBottom: '2px solid #dee2e6',
      color: '#495057',
      fontWeight: '600'
    },
    td: {
      padding: '15px',
      borderBottom: '1px solid #dee2e6',
      color: '#212529'
    },
    viewButton: {
      padding: '6px 12px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    loading: {
      textAlign: 'center',
      padding: '50px',
      fontSize: '18px',
      color: '#7f8c8d'
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '20px',
      border: '1px solid #f5c6cb'
    },
    navButtons: {
        display: 'flex',
        gap: '10px'
    },
    navButton: {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>AI Reports</h1>
        <div style={styles.navButtons}>
            <button 
                style={styles.navButton}
                onClick={() => navigate('/')}
            >
                Dashboard
            </button>
            <button 
                style={{
                    ...styles.button,
                    ...(generating ? styles.buttonDisabled : {})
                }}
                onClick={handleGenerateReport}
                disabled={generating}
            >
                {generating ? 'Generating...' : 'Generate Weekly Report'}
            </button>
        </div>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Loading reports...</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Report ID</th>
                <th style={styles.th}>Period Start</th>
                <th style={styles.th}>Period End</th>
                <th style={styles.th}>Generated At</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ ...styles.td, textAlign: 'center' }}>
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id}>
                    <td style={styles.td}>{report.id}</td>
                    <td style={styles.td}>{report.period_start ? new Date(report.period_start).toLocaleDateString() : 'N/A'}</td>
                    <td style={styles.td}>{report.period_end ? new Date(report.period_end).toLocaleDateString() : 'N/A'}</td>
                    <td style={styles.td}>{new Date(report.generated_at || report.timestamp).toLocaleString()}</td>
                    <td style={styles.td}>
                      <button 
                        style={styles.viewButton}
                        onClick={() => navigate(`/reports/${report.id}`)}
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
