import React, { useState } from 'react';
import axios from 'axios';

const EditComponentMLCash = ({ item, onClose, onUpdateSuccess }) => {
  if (!item) return null; // Prevent crashes
  
  const [name, setName] = useState(item?.name || '');
  const [address, setAddress] = useState(item?.address || '');

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/auth/cash/${item._id}`, {
        name,
        address
      });

      onUpdateSuccess(response.data); // Update parent state
      onClose(); // Close modal after saving
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2 style={modalStyles.heading}>Edit Cash Entry</h2>

        {/* Name Field */}
        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={modalStyles.input} 
          />
        </div>

        {/* Address Field */}
        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Address:</label>
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            style={modalStyles.input} 
          />
        </div>

        <div style={modalStyles.buttonGroup}>
          <button onClick={handleSave} style={modalStyles.saveButton}>Save</button>
          <button onClick={onClose} style={modalStyles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '350px',
    textAlign: 'center',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
  },
  heading: {
    marginBottom: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '12px', // Space between input fields
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
    justifyContent: 'center' 
  },
  saveButton: { 
    padding: '10px 15px', 
    marginRight: '10px', 
    backgroundColor: '#2c3e50', 
    color: '#fff', 
    border: 'none', 
    cursor: 'pointer', 
    borderRadius: '5px' 
  },
  cancelButton: { 
    padding: '10px 15px', 
    backgroundColor: '#ccc', 
    border: 'none', 
    cursor: 'pointer', 
    borderRadius: '5px' 
  },
};

export default EditComponentMLCash;
