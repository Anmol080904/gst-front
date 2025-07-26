import React, { useState } from 'react';
import Layout from './Layout';
import './InvoiceForm.css';

const InvoiceForm = () => {
  const [invoice, setInvoice] = useState({
    invoiceNo: '',
    date: '',
    gstin: '',
    customerName: '',
    customerAddress: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalAmount: 0
  });

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: newItems });
    calculateTotals(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = value;

    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }

    setInvoice({ ...invoice, items: newItems });
    calculateTotals(newItems);
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const totalAmount = subtotal + cgst + sgst;

    setInvoice((prev) => ({
      ...prev,
      cgst,
      sgst,
      totalAmount
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://temp-gst.onrender.com/api/create-invoice/', {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoice)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        alert('✅ Invoice created successfully!');
      } else {
        alert('❌ Failed to create invoice: ' + data.message);
      }
    } catch (error) {
      alert('❌ An error occurred: ' + error.message);
    }
  };

  return (
    <Layout title="Create Invoice">
      <div className="invoice-form">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Invoice Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Invoice Number</label>
                <input
                  type="text"
                  value={invoice.invoiceNo}
                  onChange={(e) => setInvoice({ ...invoice, invoiceNo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Customer Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>GSTIN</label>
                <input
                  type="text"
                  value={invoice.gstin}
                  onChange={(e) => setInvoice({ ...invoice, gstin: e.target.value })}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  value={invoice.customerName}
                  onChange={(e) => setInvoice({ ...invoice, customerName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Customer Address</label>
              <textarea
                value={invoice.customerAddress}
                onChange={(e) => setInvoice({ ...invoice, customerAddress: e.target.value })}
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
              {invoice.items.map((item, index) => (
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
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                  />
                  <span className="amount">₹{item.amount.toFixed(2)}</span>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(index)}
                    disabled={invoice.items.length === 1}
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
            <h3>Tax Calculation</h3>
            <div className="tax-summary">
              <div className="tax-row">
                <span>Subtotal:</span>
                <span>₹{(invoice.totalAmount - invoice.cgst - invoice.sgst).toFixed(2)}</span>
              </div>
              <div className="tax-row">
                <span>CGST (9%):</span>
                <span>₹{invoice.cgst.toFixed(2)}</span>
              </div>
              <div className="tax-row">
                <span>SGST (9%):</span>
                <span>₹{invoice.sgst.toFixed(2)}</span>
              </div>
              <div className="tax-row total">
                <span>Total Amount:</span>
                <span>₹{invoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Create Invoice</button>
            <button type="button" className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default InvoiceForm;
