import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './PurchaseList.css';

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [filters, setFilters] = useState({ search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch('https://temp-gst.onrender.com/api/purchase-list/', {
          method: 'GET',
          credentials: 'include',
        });
        const result = await res.json();
        if (res.ok && result.status === 'success') {
          setPurchases(result.purchases);
        } else {
          alert(result.message || 'Failed to load purchases');
        }
      } catch (err) {
        console.error('Error fetching purchases:', err);
        alert('Network error');
      }
    };

    fetchPurchases();
  }, []);

  const filtered = purchases.filter(p =>
    p.purchaseNo.toLowerCase().includes(filters.search.toLowerCase()) ||
    p.supplierName.toLowerCase().includes(filters.search.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <Layout title="Purchase List">
      <div className="invoice-list">
        <div className="list-header">
          <div className="filters">
            <input
              type="text"
              placeholder="Search purchases..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
            />
          </div>
          <div className="list-actions">
            <button className="export-btn">📊 Export</button>
            <button className="create-btn" onClick={() => window.location.href = '/purchase/create'}>
              ➕ Create Purchase
            </button>
          </div>
        </div>

        <div className="invoices-table">
          <div className="table-header">
            <span>Purchase No</span>
            <span>Date</span>
            <span>Supplier</span>
            <span>Amount</span>
            <span>GST</span>
            <span>Description</span>
          </div>
          {paginated.map(purchase => (
            <div key={purchase.id} className="table-row">
              <span className="invoice-no">{purchase.purchaseNo}</span>
              <span>{purchase.date}</span>
              <span>{purchase.supplierName}</span>
              <span className="amount">₹{purchase.amount.toLocaleString()}</span>
              <span className="gst">₹{purchase.gst.toLocaleString()}</span>
              <span>{purchase.description}</span>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="pagination-btn">
            Previous
          </button>
          <span className="pagination-info">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="pagination-btn">
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PurchaseList;
