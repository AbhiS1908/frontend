import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import * as XLSX from 'xlsx';

export default function MonthlyReport() {
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const month = queryParams.get('month');
  const year = queryParams.get('year');

  useEffect(() => {
    if (month && year) {
      fetchMonthlyExpenses(month, year);
    }
  }, [month, year]);

  const fetchMonthlyExpenses = async (month, year) => {
    try {
      const response = await fetch(`https://ane-production.up.railway.app/api/v1/auth/expense`);
      const data = await response.json();
      
      const filteredData = data.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === new Date(`${month} 1, ${year}`).getMonth() &&
               expenseDate.getFullYear() === parseInt(year);
      });
      
      setExpenses(filteredData);
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
    }
  };

  const handleEdit = (expense) => {
    setEditExpense({ ...expense });
  };

  const handleUpdate = async () => {
    try {
      await fetch(`https://ane-production.up.railway.app/api/v1/auth/expense/${editExpense._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editExpense),
      });
      fetchMonthlyExpenses(month, year);
      setEditExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`https://ane-production.up.railway.app/api/v1/auth/expense/${deleteId}`, { method: 'DELETE' });
      fetchMonthlyExpenses(month, year);
      setShowDeletePopup(false);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleDownloadExcel = () => {
    // Map expenses to match Excel columns
    const dataForExcel = expenses.map(expense => ({
      "S.No": expense.sNo,
      "Date": new Date(expense.date).toLocaleDateString(),
      "Particular": expense.particular,
      "Sub Field": expense.subField,
      "Details": expense.details,
      "Receipt": expense.receipt,
      "Amount Paid": expense.amountPaid,
      "Balance": expense.balance,
      "Paid To": expense.paidTo,
      "Approved By": expense.approvedBy,
      "Remarks": expense.remarks
    }));
  
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Report");
    
    // Save the file
    XLSX.writeFile(workbook, `MonthlyReport_${month}_${year}.xlsx`);
  };

  return (
    <Layout>
    <div>
      <h2>Monthly Report - {month} {year}</h2>
      <button onClick={handleDownloadExcel}>Download Excel</button>
      <table border="1">
        <thead>
          <tr>
          <th>S.No</th>
              <th>Date</th>
              <th>Particular</th>
              <th>Sub Field</th>
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
              <td>
                {editExpense && editExpense._id === expense._id ? (
                  <input type="date" value={editExpense.date.split('T')[0]} onChange={(e) => setEditExpense({ ...editExpense, date: e.target.value })} />
                ) : (
                  new Date(expense.date).toLocaleDateString()
                )}
              </td>
              <td>
                {editExpense && editExpense._id === expense._id ? (
                  <input value={editExpense.particular} onChange={(e) => setEditExpense({ ...editExpense, particular: e.target.value })} />
                ) : (
                  expense.particular
                )}
              </td>
              <td>
                {editExpense && editExpense._id === expense._id ? (
                  <input value={editExpense.subField} onChange={(e) => setEditExpense({ ...editExpense, subField: e.target.value })} />
                ) : (
                  expense.subField
                )}
              </td>
              <td>
                {editExpense && editExpense._id === expense._id ? (
                  <input value={editExpense.details} onChange={(e) => setEditExpense({ ...editExpense, details: e.target.value })} />
                ) : (
                  expense.details
                )}
              </td>
              <td>
                {editExpense && editExpense._id === expense._id ? (
                  <input type="number" value={editExpense.receipt} onChange={(e) => setEditExpense({ ...editExpense, receipt: e.target.value })} />
                ) : (
                  expense.receipt
                )}
              </td>
              <td>
                {editExpense && editExpense._id === expense._id ? (
                  <input type="number" value={editExpense.amountPaid} onChange={(e) => setEditExpense({ ...editExpense, amountPaid: e.target.value })} />
                ) : (
                  expense.amountPaid
                )}
              </td>
              <td>
                {editExpense && editExpense._id === expense._id ? (
                  <input type="number" value={editExpense.balance} onChange={(e) => setEditExpense({ ...editExpense, balance: e.target.value })} />
                ) : (
                  expense.balance
                )}
              </td>
              <td>
                {editExpense && editExpense._id === expense._id ? (
                  <input value={editExpense.paidTo} onChange={(e) => setEditExpense({ ...editExpense, paidTo: e.target.value })} />
                ) : (
                  expense.paidTo
                )}
              </td>
              <td>
                {editExpense && editExpense._id === expense._id ? (
                  <input value={editExpense.approvedBy} onChange={(e) => setEditExpense({ ...editExpense, approvedBy: e.target.value })} />
                ) : (
                  expense.approvedBy
                )}
              </td>
              <td>
                {editExpense && editExpense._id === expense._id ? (
                  <input value={editExpense.remarks} onChange={(e) => setEditExpense({ ...editExpense, remarks: e.target.value })} />
                ) : (
                  expense.remarks
                )}
              </td>
              
              <td>
                {editExpense && editExpense._id === expense._id ? (
                  <button onClick={handleUpdate}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(expense)}>Edit</button>
                )}
                <button onClick={() => { setDeleteId(expense._id); setShowDeletePopup(true); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeletePopup && (
        <div className="popup">
          <p>Are you sure you want to delete this expense?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={() => setShowDeletePopup(false)}>No</button>
        </div>
      )}
    </div>
    </Layout>
  );
}
