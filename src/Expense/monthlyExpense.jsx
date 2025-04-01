import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function MonthlyExpense() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('https://ane-production.up.railway.app/api/v1/auth/expense');
      const data = await response.json();
      processExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const processExpenses = (data) => {
    const monthlyData = {};
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    data.forEach((expense) => {
      const date = new Date(expense.date);
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const key = `${month}-${year}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { month, year, receipt: 0, amountPaid: 0, balance: 0 };
      }

      monthlyData[key].receipt += expense.receipt || 0;
      monthlyData[key].amountPaid += expense.amountPaid || 0;
      monthlyData[key].balance += expense.balance || 0;
    });

    setExpenses(Object.values(monthlyData));
  };

  const handleMonthReport = (month, year) => {
    navigate(`/monthReport?month=${month}&year=${year}`);
  };

  return (
    <Layout>
    <div>
      <h2>Monthly Expenses</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Month</th>
            <th>Year</th>
            <th>Total Receipt Amount</th>
            <th>Total Amount Paid</th>
            <th>Total Balance Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.month}</td>
              <td>{expense.year}</td>
              <td>{expense.receipt}</td>
              <td>{expense.amountPaid}</td>
              <td>{expense.balance}</td>
              <td>
                <button onClick={() => handleMonthReport(expense.month, expense.year)}>
                  Month Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </Layout>
  );
}
