import React, { useState } from 'react';
import Layout from './Layout';
import './ExportCenter.css';

const ExportCenter = () => {
  const [selectedExport, setSelectedExport] = useState('itc');
  const [selectedGstrType, setSelectedGstrType] = useState('gstr1');

  const handleExport = async (type, format) => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const payload = {
      report: type,
      format,
      month,
      year,
    };

    // Include gstr_type only when exporting GSTR Reports
    if (type === 'gstr') {
      payload.gstr_type = selectedGstrType;
    }

    try {
      const response = await fetch('https://temp-gst.onrender.com/api/export/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok && format !== 'json') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileType = format === 'excel' ? 'csv' : format;
        const suffix = type === 'gstr' ? `_${selectedGstrType}` : '';
        a.download = `${type}${suffix}_report_${month}_${year}.${fileType}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const res = await response.json();
        console.error(res);
        alert('Export failed: ' + (res.error || 'Unknown error'));
      }
    } catch (error) {
      console.error(error);
      alert('Export failed due to a network error.');
    }
  };

  return (
    <Layout title="Export Center">
      <div className="export-center">
        <div className="export-header">
          <div className="export-title-block">
            <h2 className="export-title">📦 Export Center</h2>
            <p className="export-subtitle">
              Choose the data type and format you want to export.
            </p>
          </div>

          <div className="export-select-block">
            <label htmlFor="export-type" className="export-label">Export Type</label>
            <select
              id="export-type"
              value={selectedExport}
              onChange={(e) => setSelectedExport(e.target.value)}
              className="export-select"
            >
              <option value="itc">ITC Tracker</option>
              <option value="invoice">Invoices</option>
              <option value="gstr">GSTR Reports</option>
              <option value="summary">Monthly Summary</option>
            </select>
          </div>

          {/* Show GSTR type dropdown only when GSTR selected */}
          {selectedExport === 'gstr' && (
            <div className="export-select-block">
              <label htmlFor="gstr-type" className="export-label">GSTR Type</label>
              <select
                id="gstr-type"
                value={selectedGstrType}
                onChange={(e) => setSelectedGstrType(e.target.value)}
                className="export-select"
              >
                <option value="gstr1">GSTR-1</option>
                <option value="gstr2">GSTR-2</option>
                <option value="gstr3b">GSTR-3B</option>
              </select>
            </div>
          )}
        </div>

        <div className="export-options">
          <button className="export-btn" onClick={() => handleExport(selectedExport, 'csv')}>
            📁 Export as CSV
          </button>
          <button className="export-btn" onClick={() => handleExport(selectedExport, 'excel')}>
            📊 Export as Excel
          </button>
          <button className="export-btn" onClick={() => handleExport(selectedExport, 'pdf')}>
            🧾 Export as PDF
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ExportCenter;
