import React, { useState, useEffect } from 'react';
import Layout from './Layout';

export default function CreateExpense() {
  const [expense, setExpense] = useState({
    sNo: '',
    particular: '',
    subField: '',
    receipt: '',
    amountPaid: '',
    balance: '',
    paidTo: '',
    approvedBy: '',
    details: '',
    remarks: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to get prefix based on particular
  const getPrefix = (particular) => {
    switch (particular) {
      case 'Office Expense': return 'OE';
      case 'Staff Welfare': return 'SW';
      case 'Electricity': return 'EL';
      case 'Fuel': return 'FL';
      case 'Transport': return 'TR';
      case 'Labour & Wages': return 'LW';
      case 'Repair And Maintainence': return 'RM';
      default: return '';
    }
  };

  // Auto-generate serial number when particular changes
  useEffect(() => {
    if (expense.particular) {
      const key = `sNo-${expense.particular}`;
      const count = parseInt(localStorage.getItem(key)) || 0;
      const nextCount = count + 1;
      const prefix = getPrefix(expense.particular);
      const sNo = `${prefix}-${nextCount.toString().padStart(3, '0')}`;
      setExpense(prev => ({ ...prev, sNo }));
    } else {
      setExpense(prev => ({ ...prev, sNo: '' }));
    }
  }, [expense.particular]);

  // Auto-calculate balance
  useEffect(() => {
    setExpense((prev) => ({
      ...prev,
      balance: prev.receipt && prev.amountPaid ? prev.receipt - prev.amountPaid : '',
    }));
  }, [expense.receipt, expense.amountPaid]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to submit expense');

      // Increment serial number count in localStorage after successful submission
      const key = `sNo-${expense.particular}`;
      const currentCount = parseInt(localStorage.getItem(key)) || 0;
      localStorage.setItem(key, currentCount + 1);

      setSuccess('Expense submitted successfully!');
      setExpense({
        sNo: '',
        particular: '',
        subField: '',
        receipt: '',
        amountPaid: '',
        balance: '',
        paidTo: '',
        approvedBy: '',
        details: '',
        remarks: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.container}>
          <h2 style={styles.heading}>Create Expense</h2>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date:</label>
              <input
                type="date"
                name="date"
                value={expense.date}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Serial Number:</label>
              <input
                type="text"
                name="sNo"
                value={expense.sNo}
                style={styles.input}
                readOnly
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Particular:</label>
              <select name="particular" value={expense.particular} onChange={handleChange} style={styles.input} required>
                <option value="">Select</option>
                <option value="Office Expense">Office Expense</option>
                <option value="Staff Welfare">Staff Welfare</option>
                <option value="Electricity">Electricity</option>
                <option value="Fuel">Fuel</option>
                <option value="Transport">Transport</option>
                <option value="Labour & Wages">Labour & Wages</option>
                <option value="Repair And Maintainence">Repair And Maintainence</option>
              </select>
            </div>

            {expense.particular === 'Repair And Maintainence' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Sub Field:</label>
                <select name="subField" value={expense.subField} onChange={handleChange} style={styles.input} required>
                  <option value="">Select</option>
                  <option value="Plant and Machinery">Plant and Machinery</option>
                  <option value="Furniture And Fixtures">Furniture And Fixtures</option>
                  <option value="Motors and Vehicle">Motors and Vehicle</option>
                </select>
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Details</label>
              <input type="text" name="details" value={expense.details} onChange={handleChange} style={styles.input} required />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Receipt:</label>
              <input type="number" name="receipt" value={expense.receipt} onChange={handleChange} style={styles.input} required />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Amount Paid:</label>
              <input type="number" name="amountPaid" value={expense.amountPaid} onChange={handleChange} style={styles.input} required />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Balance:</label>
              <input type="number" name="balance" value={expense.balance} style={styles.input} disabled />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Paid To:</label>
              <input type="text" name="paidTo" value={expense.paidTo} onChange={handleChange} style={styles.input} required />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Approved By:</label>
              <input type="text" name="approvedBy" value={expense.approvedBy} onChange={handleChange} style={styles.input} required />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Remarks</label>
              <input type="text" name="remarks" value={expense.remarks} onChange={handleChange} style={styles.input} required />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
// Styles
const styles = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100vh',
    backgroundColor: '#f8f9fa'
  },
  container: {
    width: '100vh',
    height: '100%',
    padding: '20px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#555'
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    width: '100%'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: '0.3s',
    marginTop: '10px'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px'
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: '10px'
  }
};

