import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons from react-icons
import axios from 'axios';
import EditComponentPLSDCash from '../Edit-delete/EditComponentPLSDCash';

const StockSumDetails = ({ stockData, setStockData }) => {
    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [editStock, setEditStock] = useState(null);

    const handleExpand = (stock) => {
      const cashFormId = stock._id;
      const stockObject = encodeURIComponent(JSON.stringify(stock));

      if (cashFormId) {
          navigate(`/detail-log-per-bag?cashFormId=${cashFormId}&stockData=${stockObject}`);
      } else {
          console.error("cashFormId is missing");
      }
  };

  const handleDeleteClick = async (stockId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this stock entry?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
        await axios.delete(`https://ane-production.up.railway.app/api/v1/auth/cash-stock/${stockId}`);
        alert("Stock deleted successfully");

        // Update UI by removing the deleted item
        if (setStockData){
          setStockData(prevStockData => prevStockData.filter(stock => stock._id !== stockId));
        }
    } catch (error) {
        console.error("Error deleting stock:", error);
        alert("Failed to delete stock");
    } finally {
        setLoading(false);
    }
};
    const handleEditClick = (stock) => {
    setEditStock(stock); // Set the stock to be edited
  };

  const handleUpdateStock = (updatedStock) => {
    try {
      console.log('Updating stock data with:', updatedStock); // Log the updated data

      // Ensure updatedStock has a valid _id
      if (!updatedStock._id) {
        throw new Error('Successfully updated stock data ');
      }

      // Log the current state before updating
      console.log('Current stockData:', stockData);

      // Update the state
      setStockData((prevStockData) => {
        const updatedData = prevStockData.map((stock) =>
          stock._id === updatedStock._id ? updatedStock : stock
        );
        console.log('Updated stockData:', updatedData); // Log the updated state
        return updatedData;
      });

      console.log('Parent state updated successfully'); // Log success
      setEditStock(null); // Close the modal
    } catch (error) {
      console.error('Error updating parent state:', error); // Log the error
      alert('' + error.message);
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
              <th>Quantity (Bag)</th>
              <th>Rate Paid</th>
              <th>Total Cost</th>
              <th>Price/kg</th>
              <th>Amount Paid</th>
              <th>Amount Left</th>
              <th>Status</th>
              <th>Action</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{stock.particular || "N/A"}</td>
                <td>{stock.quantity || "N/A"}</td>
                <td>₹{stock.rate || "N/A"}</td>
                <td>₹{stock.amount ? stock.amount.toFixed(2) : "N/A"}</td>
                <td>₹{stock.pricePerKgBag || "N/A"}</td>
                <td>₹{stock.amountPaid || "N/A"}</td>
                <td>₹{stock.amountLeft || "N/A"}</td>
                <td>{stock.status || "N/A"}</td>
                <td>
                    <button style={styles.expandButton} onClick={() => handleExpand(stock)}>
                        Expand
                    </button>
                </td>
                <td>
                <FaEdit style={styles.icon} onClick={() => handleEditClick(stock)} />
                  <FaTrash
                    style={{
                        ...styles.icon,
                        color: 'red',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1
                    }}
                    onClick={!loading ? () => handleDeleteClick(stock._id) : undefined}
                />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No stock information available.</p>
      )}
      {editStock && (
        <EditComponentPLSDCash
          stock={editStock}
          onClose={() => setEditStock(null)}
          onUpdateSuccess={handleUpdateStock}
        />
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
    width: '950px',
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
  icon: {
    cursor: 'pointer',
    marginLeft: '10px', // Add margin to separate icons
    color: '#2c3e50', // Icon color
  },
  modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '5px' }
};

export default StockSumDetails;
