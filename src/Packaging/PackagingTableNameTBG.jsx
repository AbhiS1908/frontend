import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Layout from '../components/Layout';
import axios from 'axios';

export default function PackagingTableNameTBG() {
  const [rows, setRows] = useState([
    { id: 1, quantity: '', rate: '', count: '', totalCost: '', isDisabled: false }
  ]);
  const [table2Rows, setTable2Rows] = useState([
    { id: 1, quantity: '', ratePerKg: '', count: '', totalCost: '' }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Extract cashStockId from URL
  const queryParams = new URLSearchParams(window.location.search);
  const cashStockId = queryParams.get('cashFormId');

  // Function to handle input change
  const handleChange = (id, field, value) => {
    setTable2Rows(table2Rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleChangeAdd = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  // Function to handle Save and make POST request
  const handleSave = async (id) => {
    const row = rows.find(row => row.id === id);
    if (!row.quantity || !row.count) {
      alert('Please fill all fields before saving.');
      return;
    }

    try {
      // Convert quantity to x/1000 before saving
      const quantityToSave = parseFloat(row.quantity) / 1000;
      
      const response = await axios.post('https://ane-production.up.railway.app/api/v1/auth/sutta-cash-one', {
        cashStockId: cashStockId,
        quantity: quantityToSave,
        count: row.count,
      });

      alert('Data saved successfully!');
      setRows(rows.map(row => row.id === id ? { ...row, isDisabled: true } : row));
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleUpdate = async (id) => {
    const row = table2Rows.find(row => row.id === id);
    if (!row.quantity || !row.count || !row.ratePerKg) {
      alert('Please fill all fields before updating.');
      return;
    }

    try {
      // Convert quantity to x/1000 before updating
      const quantityToUpdate = parseFloat(row.quantity) / 1000;
      
      const response = await axios.put(`https://ane-production.up.railway.app/api/v1/auth/sutta-cash-one/${id}`, {
        quantity: quantityToUpdate,
        ratePerKg: row.ratePerKg,
        count: row.count,
      });

      alert('Data updated successfully!');
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Failed to update data.');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://ane-production.up.railway.app/api/v1/auth/sutta-cash-one/${deleteId}`);
      alert('Data deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete data.');
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleStockOut = async (id) => {
    try {
      await axios.put(`https://ane-production.up.railway.app/api/v1/auth/sutta-cash-stock-out-one/${id}`);
      alert(`Stock Out successful for row ID: ${id}`);
      setTable2Rows(prevRows =>
        prevRows.map(row => row.id === id ? { ...row, isStockedOut: true } : row)
      );
      fetchData();
    } catch (error) {
      console.error('Error in Stock Out:', error);
      alert('Failed to initiate Stock Out.');
    }
  };

  const fetchData = async () => {
    if (!cashStockId) return;
    try {
      const response = await axios.get(`https://ane-production.up.railway.app/api/v1/auth/sutta-cash-one/${cashStockId}`);
      if (response.data) {
        setTable2Rows(response.data.map((item, index) => ({
          id: item._id || index,
          // Multiply by 1000 for display purposes
          quantity: item.quantity ? (parseFloat(item.quantity) * 1000).toString() : '',
          ratePerKg: item.ratePerKg,
          count: item.count,
          totalCost: item.totalCost,
          isStockedOut: item.isStockedOut || false
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cashStockId]);

  return (
    <Layout>
      <div>
        {/* Inline CSS */}
        <style>{`
          .container {
            padding: 16px;
          }

          .table {
            width: 110%;
            border-collapse: collapse;
          }

          .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
          }

          .table th {
            background-color: #f4f4f4;
          }

          .input-field {
            width: 90%;
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .btn {
            padding: 6px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 2px;
          }

          .save-btn {
            background-color: #007bff;
            color: white;
          }

          .update-btn {
            background-color: #28a745;
            color: white;
          }

          .stock-btn {
            background-color: #ffc107;
            color: white;
          }

          .edit-btn {
            background-color: #17a2b8;
            color: white;
          }

          .delete-btn {
            background-color: #dc3545;
            color: white;
          }

          .action-buttons {
            display: flex;
            gap: 8px;
            justify-content: center;
          }

          .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            width: 300px;
          }

          .modal-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }

          .modal-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .modal-btn-confirm {
            background-color: #dc3545;
            color: white;
          }

          .modal-btn-cancel {
            background-color: #6c757d;
            color: white;
          }
        `}</style>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this record?</p>
              <div className="modal-buttons">
                <button 
                  className="modal-btn modal-btn-confirm"
                  onClick={handleDeleteConfirm}
                >
                  Yes
                </button>
                <button 
                  className="modal-btn modal-btn-cancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="container">
          {/* Table 1 */}
          <h2>Table 1 - Add Data</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Count</th>
                <th>Save</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => handleChangeAdd(row.id, 'quantity', e.target.value)}
                        className="input-field"
                        style={{ marginRight: "5px" }}
                      />
                       <span>gm</span>
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.count}
                      onChange={(e) => handleChangeAdd(row.id, 'count', e.target.value)}
                      className="input-field"
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleSave(row.id)}
                      className="btn save-btn"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table 2 */} 
          <h2 style={{ marginTop: '50px' }}>Table 2 - Fetched Data</h2>
          <table className="table" style={{marginTop:'100px'}}>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Rate/Gm</th>
                <th>Count</th>
                <th>Total Cost</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {table2Rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="number"
                        value={row.quantity}
                        disabled={editingId !== row.id}
                        onChange={(e) => handleChange(row.id, 'quantity', e.target.value)}
                        className="input-field"
                        style={{ width: "80px", marginRight: "5px" }}
                      />
                      <span>gm</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <span>₹</span>
                    <input
                      type="number"
                      value={row.ratePerKg}
                      disabled={editingId !== row.id}
                      onChange={(e) => handleChange(row.id, 'ratePerKg', e.target.value)}
                      className="input-field"
                      style={{ marginLeft: "5px", width: "100px" }}
                    />
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.count}
                      disabled={editingId !== row.id}
                      onChange={(e) => handleChange(row.id, 'count', e.target.value)}
                      className="input-field"
                    />
                  </td>
                  <td>₹{row.totalCost}</td>
                  <td className="action-buttons">
                    {editingId === row.id ? (
                      <button 
                        onClick={() => handleUpdate(row.id)} 
                        className="btn update-btn"
                      >
                        Update
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleStockOut(row.id)} 
                          className="btn stock-btn"
                          disabled={row.isStockedOut}
                        >
                          Stock Out
                        </button>
                        <button 
                          onClick={() => handleEdit(row.id)} 
                          className="btn edit-btn"
                          disabled={row.isStockedOut}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(row.id)} 
                          className="btn delete-btn"
                          disabled={row.isStockedOut}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}