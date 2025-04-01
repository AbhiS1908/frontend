import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
export default function Expense() {
  const navigate = useNavigate();

  return (
    <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center text-center">  
        <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
        <div className="flex flex-col space-y-4">
          <button 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            onClick={() => navigate('/createExpense')}
          >
            Create Expense
          </button>
          <button 
            className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
            onClick={() => navigate('/expenseList')}
          >
            Expense List
          </button>
        </div>
      </div>
    </div>
    </Layout>
    
  );
}
