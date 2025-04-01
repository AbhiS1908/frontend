import React, { useState } from 'react';
import axios from 'axios';

const DetailsModal = ({ item, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(item || {});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  console.log(item);
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`https://ane-production.up.railway.app/api/v1/auth/cash-form/${item._id}`, formData);
      alert('Save successful');
      setIsEditing(false);
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Failed to save changes');
    }
  };

  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://ane-production.up.railway.app/api/v1/auth/cash-form/${item._id}`);
      alert('Record deleted successfully');
      onClose(); // Close modal after deletion
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      if (name === 'product') {
        updatedData.unitType = value === 'Tauli' ? 'bag' : 'kg';
      }

      return updatedData;
    });
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <span style={styles.close} onClick={onClose}>&larr;</span>
        <h2>Details</h2>
        <div style={styles.form}>
        <div style={styles.field}>
            <label>Product:</label>
            <select name="product" value={formData.product || ''} onChange={handleChange} disabled={!isEditing}>
              <option value="Tauli">Tauli</option>
              <option value="6 Suta">6 Suta</option>
              <option value="5 Suta">5 Suta</option>
              <option value="4 Suta">4 Suta</option>
              <option value="3 Suta">3 Suta</option>
              <option value="Others">Hand Picked</option>
              <option value="Waste">Waste</option>
            </select>
          </div>
          <div style={styles.field}>
            <label>Unit:</label>
            <input type="text" name="unitType" value={formData.unitType || ''} disabled />
          </div>
          <div style={styles.field}>
            <label>Company Name:</label>
            <input type="text" name="companyName" value="Absolute Nuts" disabled />
          </div>
          <div style={styles.field}>
            <label>Company GSTIN:</label>
            <input type="text" name="companyGstin" value="07AAZCA0953A1ZP" disabled />
          </div>
          <div style={styles.field}>
            <label>State Name:</label>
            <input type="text" name="stateName" value="DELHI" disabled />
          </div>
          <div style={styles.field}>
            <label>State Code:</label>
            <input type="text" name="stateCode" value="07" disabled />
          </div>
          <div style={styles.field}>
            <label>Email:</label>
            <input type="text" name="email" value="info@absolutenuts.in" disabled />
          </div>
          <div style={styles.field}>
            <label>Transportation Cost</label>
            <input type="text" name="transportationCost" value={formData.transportationCost} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div style={styles.field}>
            <label>Seller GSTIN:</label>
            <input type="text" name="gstinPurchase" value={formData.gstinPurchase} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div style={styles.field}>
            <label>P/O No.:</label>
            <input type="text" name="poNo" value={formData.poNo} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div style={styles.field}>
            <label>Date:</label>
            <input type="text" name="date" value={formData.date} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div style={styles.field}>
            <label>Remarks:</label>
            <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div style={styles.field}>
            <label>Transport:</label>
            <input type="text" name="transport" value={formData.transport} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div style={styles.field}>
            <label>Vehicle Number:</label>
            <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div style={styles.field}>
            <label>EDOD:</label>
            <input type="text" name="eDate" value={formData.eDate} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div style={styles.field}>
            <label>Invoice Date:</label>
            <input type="text" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div style={styles.field}>
            <label>EWAY Bill No.:</label>
            <input type="text" name="eBill" value={formData.eBill} onChange={handleChange} disabled={!isEditing} />
          </div>
        </div>
        <div style={styles.buttons}>
          <button style={styles.button} onClick={handleEditClick}>Edit</button>
          <button style={styles.button} onClick={handleSaveClick}>Save</button>
          <button style={styles.deleteButton} onClick={handleDeleteClick}>Delete</button>
        </div>
      </div>
      {showDeletePopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <p>Are you sure you want to delete this record?</p>
            <div style={styles.popupButtons}>
              <button style={styles.button} onClick={confirmDelete}>Yes, Delete</button>
              <button style={styles.deleteButton} onClick={() => setShowDeletePopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    width: '80%',
    maxHeight: '80%',
    overflowY: 'auto',
    position: 'relative', // Added to position the close icon
  },
  close: {
    cursor: 'pointer',
    fontSize: '24px',
    position: 'absolute',
    top: '10px',
    left: '10px',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  field: {
    flex: '1 1 calc(50% - 10px)',
    display: 'flex',
    flexDirection: 'column',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    border: 'none',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  popupOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  popupButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
  },
};

export default DetailsModal;
