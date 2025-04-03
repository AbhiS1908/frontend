import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

export default function FurnitureD() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('https://ane-production.up.railway.app/api/v1/auth/expenseDo');
        const filteredExpenses = response.data.filter(expense => expense.subField === 'Furniture And Fixtures');
        setExpenses(filteredExpenses.map(exp => ({ ...exp, date: formatDate(exp.date) })));
      } catch (err) {
        setError('Failed to fetch expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Formats to DD/MM/YYYY
  };

  const parseDateForInput = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`; // Formats to YYYY-MM-DD for input
  };

  const handleEdit = (expense) => {
    setEditingExpense({ ...expense, date: parseDateForInput(expense.date) });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://ane-production.up.railway.app/api/v1/auth/expenseD/${editingExpense._id}`, editingExpense);
      setExpenses(expenses.map(exp => exp._id === editingExpense._id ? { ...editingExpense, date: formatDate(editingExpense.date) } : exp));
      setEditingExpense(null);
    } catch (err) {
      alert('Failed to update expense');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`https://ane-production.up.railway.app/api/v1/auth/expenseD/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      alert('Failed to delete expense');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout>
      <div>
        <h2>Furniture Expenses</h2>
        <table border="1" width='150%'>
          <thead>
            <tr>
            <th>S.No</th>
              <th>Date</th>
              <th>Particular</th>
              <th>Details</th>
              <th>Receipt</th>
              <th>Amount Paid</th>
              <th>Balance</th>
              <th>Paid To</th>
              <th>Approved By</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.sNo}</td>
                <td>{expense.date}</td>
                <td>{expense.particular}</td>
                <td>{expense.details}</td>
                <td>{expense.receipt}</td>
                <td>{expense.amountPaid}</td>
                <td>{expense.balance}</td>
                <td>{expense.paidTo}</td>
                <td>{expense.approvedBy}</td>
                <td>{expense.remarks}</td>
                <td>
                  <button onClick={() => handleEdit(expense)}>Edit</button>
                  <button onClick={() => handleDelete(expense._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editingExpense && (
          <div>
            <h3>Edit Expense</h3>
            <input type="date" value={editingExpense.date} onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })} />
            <input type="text" value={editingExpense.particular} onChange={(e) => setEditingExpense({ ...editingExpense, particular: e.target.value })} />
            <input type="text" value={editingExpense.details} onChange={(e) => setEditingExpense({ ...editingExpense, details: e.target.value })} />
            <input type="number" value={editingExpense.receipt} onChange={(e) => setEditingExpense({ ...editingExpense, receipt: e.target.value })} />
            <input type="number" value={editingExpense.amountPaid} onChange={(e) => setEditingExpense({ ...editingExpense, amountPaid: e.target.value })} />
            <input type="number" value={editingExpense.balance} onChange={(e) => setEditingExpense({ ...editingExpense, balance: e.target.value })} />
            <input type="text" value={editingExpense.paidTo} onChange={(e) => setEditingExpense({ ...editingExpense, paidTo: e.target.value })} />
            <input type="text" value={editingExpense.approvedBy} onChange={(e) => setEditingExpense({ ...editingExpense, approvedBy: e.target.value })} />
            <input type="text" value={editingExpense.remarks} onChange={(e) => setEditingExpense({ ...editingExpense, remarks: e.target.value })} />
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setEditingExpense(null)}>Cancel</button>
          </div>
        )}
      </div>
    </Layout>
  );
}
