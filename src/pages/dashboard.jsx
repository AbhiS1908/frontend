import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stocks, setStocks] = useState({
    cash: [],
    farmer: [],
    vendor: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cashRes, farmerRes, vendorRes] = await Promise.all([
          fetch('https://ane-production.up.railway.app/api/v1/auth/cash-stock'),
          fetch('https://ane-production.up.railway.app/api/v1/auth/farmer-stock'),
          fetch('https://ane-production.up.railway.app/api/v1/auth/vendor-stock')
        ]);
        
        const [cashData, farmerData, vendorData] = await Promise.all([
          cashRes.json(),
          farmerRes.json(),
          vendorRes.json()
        ]);

        setStocks({
          cash: cashData,
          farmer: farmerData,
          vendor: vendorData
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTotals = (data) => ({
    totalValue: data.reduce((sum, item) => sum + (item.totalValue || 0), 0),
    actualValue: data.reduce((sum, item) => sum + (item.actualValue || 0), 0),
    profit: data.reduce((sum, item) => sum + (item.profit || 0), 0),
    transportationCost: data.reduce((sum, item) => sum + (item.transportationCost || 0), 0)
  });

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '10px',
    minWidth: '300px'
  };

  const chartContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '10px',
    height: '400px'
  };

  if (loading) return <Layout><div style={{ padding: '20px' }}>Loading...</div></Layout>;
  if (error) return <Layout><div style={{ padding: '20px', color: 'red' }}>Error: {error}</div></Layout>;

  return (
    <Layout>
      <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>Stock Dashboard</h1>
        
        {/* Summary Cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
          {['cash', 'farmer', 'vendor'].map((type) => {
            const totals = calculateTotals(stocks[type]);
            return (
              <div key={type} style={cardStyle}>
                <h3 style={{ color: '#34495e', marginBottom: '15px', textTransform: 'capitalize' }}>
                  {type} Stock Summary
                </h3>
                <div style={{ lineHeight: '1.6' }}>
                  <p>Total Value: ₹{totals.totalValue.toLocaleString()}</p>
                  <p>Actual Value: ₹{totals.actualValue.toLocaleString()}</p>
                  <p style={{ color: totals.profit >= 0 ? 'green' : 'red' }}>
  {totals.profit >= 0 ? 'Profit' : 'Loss'}: ₹{Math.abs(totals.profit).toLocaleString()}
</p>                  <p>Transport Cost: ₹{totals.transportationCost.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {/* Value Comparison Chart */}
          <div style={chartContainerStyle}>
            <h3 style={{ color: '#34495e', marginBottom: '20px' }}>Value Comparison</h3>
            <ResponsiveContainer width="100%" height="90%">
  <BarChart
    data={Object.entries(stocks).flatMap(([type, data]) =>
      data.map(item => ({
        ...item,
        type
      }))
    )}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="eDate" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="totalValue" fill="#3498db" name="Total Value" />
    <Bar dataKey="actualValue" fill="#2ecc71" name="Actual Value" />
  </BarChart>
</ResponsiveContainer>

          </div>

          {/* Profit Distribution */}
          <div style={chartContainerStyle}>
            <h3 style={{ color: '#34495e', marginBottom: '20px' }}>Profit Distribution</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={Object.entries(stocks).map(([type, data]) => ({
                    type,
                    value: data.reduce((sum, item) => sum + (item.profit || 0), 0)
                  }))}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Analysis */}
          <div style={chartContainerStyle}>
            <h3 style={{ color: '#34495e', marginBottom: '20px' }}>Value Trend Analysis</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={stocks.cash}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="eDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalValue"
                  stroke="#e74c3c"
                  name="Cash Stock Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;