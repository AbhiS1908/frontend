import React, { useState } from 'react';
import axios from 'axios';

const EditComponentPLSDKGVendor = ({ stock, onClose, onUpdateSuccess }) => {
  if (!stock) return null; // Prevent crashes

  // Initialize state with stock data
  const [formData, setFormData] = useState({
    product: stock.product || '', // Changed from 'particular' to 'product'
    quantity: stock.quantity || '',
    rate: stock.rate || '',
    amount: stock.amount || '',
    pricePerKgBag: stock.pricePerKgBag || '',
    amountPaid: stock.amountPaid || '',
    amountLeft: stock.amountLeft || '',
    status: stock.status || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // Automatically calculate amount when pricePerKgBag or quantity changes
    if (name === 'pricePerKgBag' || name === 'quantity') {
      const pricePerKg = parseFloat(updatedFormData.pricePerKgBag) || 0;
      const quantity = parseFloat(updatedFormData.quantity) || 0;
      updatedFormData.amount = (pricePerKg * quantity).toFixed(2); // Ensure 2 decimal places
    }

    setFormData(updatedFormData);
  };

  const handleSave = async () => {
    try {
      console.log('Sending update request with data:', formData); // Log the data being sent
  
      const response = await axios.put(
        `https://ane-production.up.railway.app/api/v1/auth/vendor-stock/${stock._id}`,
        formData
      );
  
      console.log('API Response:', response); // Log the full response
  
      // Ensure the response has a valid status code (2xx)
      if (response.status >= 200 && response.status < 300) {
        console.log('Update successful:', response.data); // Log success
        onUpdateSuccess(response.data); // Update parent state
        onClose(); // Close the modal
      } else {
        console.error('Unexpected response status:', response.status); // Log unexpected status
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating stock:', error); // Log the full error
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server responded with:', error.response.data); // Log server response
        alert(`Failed to update stock: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        alert('Failed to update stock: No response from server');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        alert(`Failed to update stock: ${error.message}`);
      }
    }
  };
  

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2 style={modalStyles.heading}>Edit Stock</h2>

        {/* Form Fields */}
        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Product:</label>
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
            style={modalStyles.input}
          >
            <option value="">Select Product</option>
            <option value="6 Suta">6 Suta</option>
            <option value="5 Suta">5 Suta</option>
            <option value="4 Suta">4 Suta</option>
            <option value="3 Suta">3 Suta</option>
            <option value="Others">Hand Picked</option>
            <option value="Waste">Waste</option>
          </select>
        </div>

        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={modalStyles.input}
          />
        </div>

        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Rate Paid:</label>
          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            style={modalStyles.input}
          />
        </div>

        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            style={modalStyles.input}
          />
        </div>

        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Price/kg:</label>
          <input
            type="number"
            name="pricePerKgBag"
            value={formData.pricePerKgBag}
            onChange={handleChange}
            style={modalStyles.input}
          />
        </div>

        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Amount Paid:</label>
          <input
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            style={modalStyles.input}
          />
        </div>

        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Amount Left:</label>
          <input
            type="number"
            name="amountLeft"
            value={formData.amountLeft}
            onChange={handleChange}
            style={modalStyles.input}
          />
        </div>

        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Status:</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={modalStyles.input}
          />
        </div>

        <div style={modalStyles.buttonGroup}>
          <button onClick={handleSave} style={modalStyles.saveButton}>
            Save
          </button>
          <button onClick={onClose} style={modalStyles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: '60px',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    textAlign: 'center',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
    height: '90%',
    overflow: 'auto',
  },
  heading: {
    marginBottom: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  buttonGroup: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
  },
  saveButton: {
    padding: '10px 15px',
    marginRight: '10px',
    backgroundColor: '#2c3e50',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#ccc',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

export default EditComponentPLSDKGVendor;