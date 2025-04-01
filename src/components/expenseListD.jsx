import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

export default function ExpenseList() {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Expense Categories</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition" 
            onClick={() => navigate('/officeExpenseD')}>
            Office Expense
          </button>
          <button 
            className="py-2 px-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
            onClick={() => navigate('/staffWelfareD')}>
            Staff Welfare
          </button>
          <button 
            className="py-2 px-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
            onClick={() => navigate('/electricityD')}>
            Electricity
          </button>
          <button 
            className="py-2 px-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
            onClick={() => navigate('/fuelD')}>
            Fuel
          </button><button 
            className="py-2 px-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
            onClick={() => navigate('/transportD')}>
            Transport
          </button><button 
            className="py-2 px-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
            onClick={() => navigate('/labourD')}>
            Labour & Wages
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-3 text-gray-700">Repair And Maintenance</h3>

        <div className="grid grid-cols-2 gap-4">
          <button 
            className="py-2 px-4 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition"
            onClick={() => navigate('/plantD')}>
            Plant and Machinery
          </button>
          <button 
            className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
            onClick={() => navigate('/furnitureD')}>
            Furniture And Fixtures
          </button>
          <button 
            className="py-2 px-4 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition"
            onClick={() => navigate('/motorD')}>
            Motors and Vehicle
          </button>
        </div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Monthly Expense</h3>


        <div className="grid grid-cols-2 gap-4">
            <button 
              className="py-2 px-6 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition"
              onClick={() => navigate('/monthlyExpenseD')}>
              Monthly Expense
            </button>
          </div>
      </div>
    </div>
    </Layout>
    
  );
}
