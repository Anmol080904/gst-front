import React, { useState } from 'react';
import Layout from './Layout';
import './GSTRReport.css';

const GSTRReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-06');
  const [reportType, setReportType] = useState('GSTR1');
  const [reportData, setReportData] = useState(null);

  const generateReport = async () => {
    try {
      const response = await fetch('https://temp-gst.onrender.com/api/gstr-repo/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gstr_type: reportType.toLowerCase(),
          month: selectedPeriod
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setReportData(data.data);
      } else {
        alert('Error: ' + (data.error || 'Unable to fetch report'));
      }
    } catch (err) {
      alert('Error fetching report: ' + err.message);
    }
  };

  return (
    <Layout title="GSTR Reports">
      <div className="gstr-report">
        <div className="report-controls">
          <label>Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="GSTR1">GSTR-1</option>
            <option value="GSTR2">GSTR-2</option>
            <option value="GSTR3B">GSTR-3B</option>
          </select>

          <label>Period</label>
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          />
          <button onClick={generateReport}>Generate Report</button>
        </div>

        {reportData && (
          <div className="report-output">
            <h3>{reportType} Report</h3>

            {reportType === 'GSTR3B' && (
              <ul>
                <li>Outward Supplies: ₹{reportData.outwardSupplies}</li>
                <li>Inward Supplies: ₹{reportData.inwardSupplies}</li>
                <li>Net Tax: ₹{reportData.netTax}</li>
                <li>Interest: ₹{reportData.interest}</li>
                <li>Penalty: ₹{reportData.penalty}</li>
                <li>Total Payable: ₹{reportData.totalPayable}</li>
              </ul>
            )}

            {reportType === 'GSTR1' && (
              <table>
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>GSTIN</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>IGST</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, i) => (
                    <tr key={i}>
                      <td>{item.invoice_no}</td>
                      <td>{item.date}</td>
                      <td>{item.customer}</td>
                      <td>₹{item.amount}</td>
                      <td>{item.gstin}</td>
                      <td>₹{item.cgst}</td>
                      <td>₹{item.sgst}</td>
                      <td>₹{item.igst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'GSTR2' && (
              <table>
                <thead>
                  <tr>
                    <th>Purchase No</th>
                    <th>Date</th>
                    <th>Supplier</th>
                    <th>Amount</th>
                    <th>GSTIN</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>IGST</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, i) => (
                    <tr key={i}>
                      <td>{item.purchase_no}</td>
                      <td>{item.date}</td>
                      <td>{item.supplier}</td>
                      <td>₹{item.amount}</td>
                      <td>{item.gstin}</td>
                      <td>₹{item.cgst}</td>
                      <td>₹{item.sgst}</td>
                      <td>₹{item.igst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GSTRReport;
