import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import Layout from './Layout';
import './MonthlySummary.css';

const getLastThreeMonths = () => {
  const now = new Date();
  const months = [];

  for (let i = 0; i < 3; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.unshift({
      label: date.toLocaleString('default', { month: 'long' }),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
  }

  return months;
};

const MonthlySummary = () => {
  const [summaryData, setSummaryData] = useState([]);

  const fetchMonthlySummary = async (month, year) => {
    try {
      const res = await fetch('https://temp-gst.onrender.com/api/monthly/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month, year }),
      });

      const result = await res.json();
      if (result.status === 'success') {
        return {
          ...result.summary,
          label: `${result.month}/${result.year}`
        };
      } else {
        return {
          label: `${month}/${year}`,
          sales: 0, tax: 0, itc: 0, gstPayable: 0,
          error: true
        };
      }
    } catch (error) {
      return {
        label: `${month}/${year}`,
        sales: 0, tax: 0, itc: 0, gstPayable: 0,
        error: true
      };
    }
  };

  useEffect(() => {
    const months = getLastThreeMonths();
    Promise.all(months.map(({ month, year }) => fetchMonthlySummary(month, year)))
      .then(data => setSummaryData(data));
  }, []);

  return (
    <Layout title="Last 3 Months GST Summary">
      <div className="monthly-summary-container">
        <div className="summary-metrics">
          {summaryData.map((item, idx) => (
            <div key={idx} className="metric-group">
              <h4>{item.label}</h4>
              {item.error ? (
                <p className="error">Failed to fetch</p>
              ) : (
                <>
                  <div className="metric-card"><h5>Sales</h5><p>₹ {item.sales.toLocaleString()}</p></div>
                  <div className="metric-card"><h5>Tax</h5><p>₹ {item.tax.toLocaleString()}</p></div>
                  <div className="metric-card"><h5>ITC</h5><p>₹ {item.itc.toLocaleString()}</p></div>
                  <div className="metric-card"><h5>GST Payable</h5><p>₹ {item.gstPayable.toLocaleString()}</p></div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="chart-section">
          <h3>📊 Comparative Sales & Tax</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summaryData.filter(d => !d.error)}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
              <Bar dataKey="tax" fill="#06b6d4" name="Tax" />
              <Bar dataKey="gstPayable" fill="#facc15" name="GST Payable" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default MonthlySummary;
