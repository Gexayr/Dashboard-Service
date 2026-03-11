import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const RiskOverTimeChart = ({ data, loading, error }) => {
  if (loading) return <div className="chart-loading">Loading Risk Over Time...</div>;
  if (error) return <div className="chart-error">{error}</div>;
  if (!Array.isArray(data) || data.length === 0) return <div className="chart-empty">No data available for Risk Over Time.</div>;

  return (
    <div className="chart-container">
      <h3>Risk Over Time</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="avg_risk"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Average Risk"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskOverTimeChart;
