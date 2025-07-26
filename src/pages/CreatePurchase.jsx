import React, { useState } from 'react';
import Layout from './Layout';
import './CreatePurchase.css';

const CreatePurchase = () => {
  const [purchase, setPurchase] = useState({
    purchaseNo: '',
    date: '',
    gstin: '',
    supplierName: '',
    supplierAddress: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalAmount: 0
  });

  const addItem = () => {
    setPurchase(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    const updatedItems = purchase.items.filter((_, i) => i !== index);
    calculateTotals(updatedItems);
    setPurchase(prev => ({ ...prev, items: updatedItems }));
  };

  const updateItem = (index, field, value) => {
    const items = [...purchase.items];
    items[index][field] = field === 'description' ? value : parseFloat(value) || 0;

    if (field === 'quantity' || field === 'rate') {
      const qty = parseFloat(items[index].quantity) || 0;
      const rate = parseFloat(items[index].rate) || 0;
      items[index].amount = qty * rate;
    }

    calculateTotals(items);
    setPurchase(prev => ({ ...prev, items }));
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const igst = 0;
    const totalAmount = subtotal + cgst + sgst;

    setPurchase(prev => ({
      ...prev,
      cgst,
      sgst,
      igst,
      totalAmount
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://temp-gst.onrender.com/api/purchase-create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(purchase)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        alert('✅ Purchase created successfully!');
        window.location.reload();
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <Layout title="Create Purchase">
      <div className="purchase-form">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Purchase Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Purchase No</label>
                <input
                  type="text"
                  value={purchase.purchaseNo}
                  onChange={(e) => setPurchase({ ...purchase, purchaseNo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={purchase.date}
                  onChange={(e) => setPurchase({ ...purchase, date: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Supplier Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>GSTIN</label>
                <input
                  type="text"
                  value={purchase.gstin}
                  onChange={(e) => setPurchase({ ...purchase, gstin: e.target.value })}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div className="form-group">
                <label>Supplier Name</label>
                <input
                  type="text"
                  value={purchase.supplierName}
                  onChange={(e) => setPurchase({ ...purchase, supplierName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Supplier Address</label>
              <textarea
                value={purchase.supplierAddress}
                onChange={(e) => setPurchase({ ...purchase, supplierAddress: e.target.value })}
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Items</h3>
            <div className="items-table">
              <div className="table-header">
                <span>Description</span>
                <span>Qty</span>
                <span>Rate</span>
                <span>Amount</span>
                <span>Action</span>
              </div>
              {purchase.items.map((item, index) => (
                <div key={index} className="table-row">
                  <input
                    type="text"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', e.target.value)}
                  />
                  <span className="amount">₹{item.amount.toFixed(2)}</span>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(index)}
                    disabled={purchase.items.length === 1}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="add-item-btn" onClick={addItem}>
              + Add Item
            </button>
          </div>

          <div className="form-section">
            <h3>Tax Summary</h3>
            <div className="tax-summary">
              <div className="tax-row">
                <span>Subtotal:</span>
                <span>₹{(purchase.totalAmount - purchase.cgst - purchase.sgst).toFixed(2)}</span>
              </div>
              <div className="tax-row">
                <span>CGST (9%):</span>
                <span>₹{purchase.cgst.toFixed(2)}</span>
              </div>
              <div className="tax-row">
                <span>SGST (9%):</span>
                <span>₹{purchase.sgst.toFixed(2)}</span>
              </div>
              <div className="tax-row total">
                <span>Total Amount:</span>
                <span>₹{purchase.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Create Purchase</button>
            <button type="button" className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePurchase;
