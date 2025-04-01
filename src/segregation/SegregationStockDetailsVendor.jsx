import React from 'react';
import { useNavigate } from 'react-router-dom';

const SegregationStockDetailsVendor = ({ stockData }) => {
    console.log(stockData)
    const navigate = useNavigate();

    const handleExpand = (stock) => {
      const vendorFormId = stock._id;
      const stockObject = encodeURIComponent(JSON.stringify(stock));

      if (vendorFormId) {
          navigate(`/segregation-table-vendor?vendorFormId=${vendorFormId}&stockData=${stockObject}`);
      } else {
          console.error("vendorFormId is missing");
      }
  };
    return (
    <div style={styles.container}>
      <h3>Stock Details</h3>
      {stockData && stockData.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Particular</th>
              <th>Price/kg</th>
              <th>Total Bag Weight</th>
              <th>Total Purch. Rate</th>
              <th>Total Value</th>
              <th>Actual Value</th>
              <th>Diff. Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{stock.particular || "N/A"}</td>
                <td>₹{stock.pricePerKgBag || "N/A"}</td>
                <td>{stock.totalBagWeight ? stock.totalBagWeight.toFixed(2) : "N/A"}kg</td>
                <td>₹{stock.totalPurchaseRate ? stock.totalPurchaseRate.toFixed(2) : "N/A"}</td>
                <td>₹{stock.totalValue ? stock.totalValue.toFixed(2) : "N/A"}</td>
                <td>₹{stock.actualValue ? stock.actualValue.toFixed(2) : "N/A"}</td>
                <td>₹{stock.valueDiff ? stock.valueDiff.toFixed(2) : "N/A"}</td>
                <td>
                    <button style={styles.expandButton} onClick={() => handleExpand(stock)}>
                        Segregate
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No stock information available.</p>
      )}
      
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    width:'950px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    border: '1px solid #ddd',
  },
  error: {
    color: 'red',
  },
  expandButton: {
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
  },
};

export default SegregationStockDetailsVendor;
