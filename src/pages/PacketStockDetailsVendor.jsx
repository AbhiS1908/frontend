import React from 'react';
import { useNavigate } from 'react-router-dom';

const PacketStockDetailsVendor = ({ stockData }) => {
    console.log(stockData)
    const navigate = useNavigate();

    const handleExpand = (stock) => {
      const vendorFormId = stock._id;
      const stockObject = encodeURIComponent(JSON.stringify(stock));

      if (vendorFormId) {
          navigate(`/packet-table-vendor?vendorFormId=${vendorFormId}&stockData=${stockObject}`);
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
              <th>Final Total Weight</th>
              <th>Total Final Price</th>
              <th>Final Total St. Price</th>
              <th>Final Total St. Final</th>
              <th>Profit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{stock.particular || "N/A"}</td>
                <td>{stock.pricePerKgBag || 0}</td>
                <td>{stock.finalTotalWeight ? stock.finalTotalWeight.toFixed(2) : 0}</td>
                <td>{stock.totalFinalPrice ? stock.totalFinalPrice.toFixed(2) : 0}</td>
                <td>{stock.finalTotalPriceStandard ? stock.finalTotalPriceStandard.toFixed(2) : 0}</td>
                <td>{stock.finalTotalPriceFinal ? stock.finalTotalPriceFinal.toFixed(2) : 0}</td>
                <td>{stock.profit ? stock.profit.toFixed(2) :0}</td>
                <td>
                    <button style={styles.expandButton} onClick={() => handleExpand(stock)}>
                    Packaging
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

export default PacketStockDetailsVendor;
