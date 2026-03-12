import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReportDetails } from '../api/reports';

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getReportDetails(id);
        setReport(response.data.data || response.data);
      } catch (err) {
        console.error('Error fetching report details:', err);
        setError('Failed to load report details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      borderBottom: '1px solid #eee',
      paddingBottom: '20px'
    },
    title: {
      margin: 0,
      fontSize: '24px',
      color: '#2c3e50'
    },
    backButton: {
      padding: '8px 16px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    content: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      overflowX: 'auto'
    },
    pre: {
      margin: 0,
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#333'
    },
    meta: {
      marginBottom: '20px',
      fontSize: '14px',
      color: '#6c757d'
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
      border: '1px solid #f5c6cb'
    }
  };

  if (loading) return <div style={styles.loading}>Loading report...</div>;
  if (error) return <div style={styles.container}><div style={styles.error}>{error}</div><button style={{...styles.backButton, marginTop: '20px'}} onClick={() => navigate('/reports')}>Back to Reports</button></div>;
  if (!report) return <div style={styles.container}><div>Report not found.</div><button style={{...styles.backButton, marginTop: '20px'}} onClick={() => navigate('/reports')}>Back to Reports</button></div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Report Details</h1>
        <button style={styles.backButton} onClick={() => navigate('/reports')}>
          Back to Reports
        </button>
      </header>

      <div style={styles.meta}>
        <p><strong>Report ID:</strong> {report.id}</p>
        <p><strong>Generated At:</strong> {new Date(report.generated_at || report.timestamp).toLocaleString()}</p>
        {(report.period_start && report.period_end) && (
          <p><strong>Period:</strong> {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}</p>
        )}
      </div>

      <div style={styles.content}>
        <pre style={styles.pre}>
          {report.content || report.report_text || 'No content available for this report.'}
        </pre>
      </div>
    </div>
  );
};

export default ReportDetails;
