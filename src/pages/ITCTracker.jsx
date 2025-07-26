import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './ITCTracker.css';

const ITCTracker = () => {
  const [itcData, setItcData] = useState({
    totalEligible: 0,
    claimed: 0,
    remaining: 0,
    reversed: 0
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchITCData = async () => {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      try {
        const res = await fetch('https://temp-gst.onrender.com/api/itc-tracker/', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ month, year })
        });
        const result = await res.json();
        if (result.status === 'success') {
          setItcData(result.itc_data);
          setTransactions(result.transactions);
        } else {
          alert(result.error || 'Failed to fetch ITC data');
        }
      } catch (error) {
        alert('Network error: ' + error.message);
      }
    };

    fetchITCData();
  }, []);

  const handleStatusChange = async (invoice, date, action) => {
    try {
      const res = await fetch('https://temp-gst.onrender.com/api/update-itc-status/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoice, date, action })
      });

      const result = await res.json();
      if (result.status === 'success') {
        setTransactions(prev =>
          prev.map(txn =>
            txn.invoice === invoice && txn.date === date
              ? { ...txn, status: result.new_status }
              : txn
          )
        );
      } else {
        alert(result.error || 'Failed to update status');
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'claimed': return 'status-claimed';
      case 'pending': return 'status-pending';
      case 'reversed': return 'status-reversed';
      default: return '';
    }
  };

  const utilizationPercentage = itcData.totalEligible > 0
    ? ((itcData.claimed / itcData.totalEligible) * 100).toFixed(1)
    : '0.0';

  return (
    <Layout title="ITC Tracker">
      <div className="itc-tracker">
        <div className="itc-overview">
          {/* Overview Cards */}
          <div className="overview-cards">
            <div className="itc-card total"><h3>Total Eligible</h3><p>₹{itcData.totalEligible}</p></div>
            <div className="itc-card claimed"><h3>Claimed</h3><p>₹{itcData.claimed}</p></div>
            <div className="itc-card remaining"><h3>Remaining</h3><p>₹{itcData.remaining}</p></div>
            <div className="itc-card reversed"><h3>Reversed</h3><p>₹{itcData.reversed}</p></div>
          </div>
          {/* Utilization Chart */}
          <div className="utilization-chart">
            <h3>Utilized: {utilizationPercentage}%</h3>
          </div>
        </div>

        <div className="itc-transactions">
          <h2>Transactions</h2>
          <div className="transactions-table">
            <div className="table-header">
              <span>Invoice</span>
              <span>Vendor</span>
              <span>Amount</span>
              <span>ITC</span>
              <span>Status</span>
              <span>Date</span>
              <span>Action</span>
            </div>
            {transactions.map(txn => (
              <div key={txn.id} className="table-row">
                <span>{txn.invoice}</span>
                <span>{txn.vendor}</span>
                <span>₹{txn.amount}</span>
                <span>₹{txn.itc}</span>
                <span className={`status ${getStatusColor(txn.status)}`}>{txn.status}</span>
                <span>{txn.date}</span>
                <span>
                  {txn.status === 'pending' && (
                    <button onClick={() => handleStatusChange(txn.invoice, txn.date, 'claim')}>Claim</button>
                  )}
                  {txn.status === 'claimed' && (
                    <button onClick={() => handleStatusChange(txn.invoice, txn.date, 'reverse')}>Reverse</button>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ITCTracker;
