import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './InvoiceList.css';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch('https://temp-gst.onrender.com/api/invoice-list/', {
          method: 'GET',
          credentials: 'include',
        });
        const result = await res.json();
        if (res.ok && result.status === 'success') {
          setInvoices(result.invoices);
        } else {
          alert(result.message || 'Failed to load invoices');
        }
      } catch (err) {
        console.error('Error fetching invoices:', err);
        alert('Network error');
      }
    };

    fetchInvoices();
  }, []);

  const updateItcStatus = async (invoiceNo, date, action) => {
    try {
      const res = await fetch('http://localhost:8000/api/status-update/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice: invoiceNo,
          date: date,
          action: action
        })
      });

      const result = await res.json();

      if (res.ok && result.status === 'success') {
        alert(`ITC ${action === 'claim' ? 'claimed' : 'reversed'} successfully!`);

        // Update the local invoice state dynamically
        setInvoices(prevInvoices =>
          prevInvoices.map(inv =>
            inv.invoiceNo === invoiceNo && inv.date === date
              ? { ...inv, itc_status: result.new_status }
              : inv
          )
        );
      } else {
        alert(result.error || 'Failed to update ITC status');
      }
    } catch (err) {
      console.error('Error updating ITC:', err);
      alert('Network error');
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNo.toLowerCase().includes(filters.search.toLowerCase()) ||
                          invoice.customerName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || invoice.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'status-paid';
      case 'pending': return 'status-pending';
      case 'overdue': return 'status-overdue';
      default: return '';
    }
  };

  return (
    <Layout title="Invoice List">
      <div className="invoice-list">
        <div className="list-header">
          <div className="filters">
            <input
              type="text"
              placeholder="Search invoices..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="list-actions">
            <button className="export-btn">📊 Export</button>
            <button className="create-btn" onClick={() => window.location.href = '/invoice/create'}>
              ➕ Create Invoice
            </button>
          </div>
        </div>

        <div className="invoices-table">
          <div className="table-header">
            <span>Invoice No</span>
            <span>Date</span>
            <span>Customer</span>
            <span>Amount</span>
            <span>GST</span>
            <span>Status</span>
            <span>ITC</span>
            <span>Actions</span>
          </div>
          {paginatedInvoices.map(invoice => (
            <div key={invoice.id} className="table-row">
              <span className="invoice-no">{invoice.invoiceNo}</span>
              <span>{invoice.date}</span>
              <span>{invoice.customerName}</span>
              <span className="amount">₹{invoice.amount.toLocaleString()}</span>
              <span className="gst">₹{invoice.gst.toLocaleString()}</span>
              <span className={`status ${getStatusColor(invoice.status)}`}>
  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
</span>
<span className={`itc-status ${invoice.itc_status}`}>
  {invoice.itc_status ? invoice.itc_status.toUpperCase() : 'N/A'}
</span>

              <div className="actions">
               
                <button
                  className="action-btn"
                  onClick={() => updateItcStatus(invoice.invoiceNo, invoice.date, 'claim')}
                >
                  ✅ Claim ITC
                </button>
                <button
                  className="action-btn"
                  onClick={() => updateItcStatus(invoice.invoiceNo, invoice.date, 'reverse')}
                >
                  ❌ Reverse ITC
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceList;
