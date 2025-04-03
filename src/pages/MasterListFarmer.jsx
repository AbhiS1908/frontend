import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons from react-icons
import EditComponentMLFarmer from '../Edit-delete/EditComponentMLFarmer'; // Import the Edit Component

const MasterListFarmer = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // State for selected item
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handlePurchaseClick = (id) => {
    navigate(`/purchase-order-farmer/${id}`);
  };
  const handleSegregationBtn = (id) => {
    navigate(`/segregation-master-farmer/${id}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ane-production.up.railway.app/api/v1/auth/farmer');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDetailsClick = (id) => {
    navigate(`/purchase-details-by-idfarmer/${id}`);
  };
  const handlePacketBtn = (id) => {
    navigate(`/packet-master-farmer/${id}`);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item); // Set the clicked row's data
    setIsEditModalOpen(true); // Open the modal
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`https://ane-production.up.railway.app/api/v1/auth/farmer/${deleteItemId}`);
      setData(data.filter(item => item._id !== deleteItemId));
      setIsDeleteModalOpen(false);
      setDeleteItemId(null);
      alert('Master Deleted Successfully');

    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdateSuccess = (updatedItem) => {
    setData(data.map(item => (item._id === updatedItem._id ? updatedItem : item)));
    setIsEditModalOpen(false);
  };
  return (
    <Layout>
      <h1>Master List - Farmer</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>S. No.</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Village</th>
            <th style={styles.th}>District</th>
            <th style={styles.th}>State</th>
            <th style={styles.th}>Action</th>
            <th style={styles.th}>Purchase List</th>
            <th style={styles.th}>Segregation List</th>
            <th style={styles.th}>Packeting List</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{item.name}</td>
              <td style={styles.td}>{item.village}</td>
              <td style={styles.td}>{item.district}</td>
              <td style={styles.td}>{item.state}</td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handlePurchaseClick(item._id)}>Purchase</button>
                
              </td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handleDetailsClick(item._id)}>See Details</button>
              </td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handleSegregationBtn(item._id)}>Segregation</button>
              </td>
              <td style={styles.td}>
              <FaEdit style={styles.icon} onClick={() => handleEditClick(item)} />
              <FaTrash style={styles.icon} onClick={() => handleDeleteClick(item._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Render Edit Component as Modal */}
      {isEditModalOpen && selectedItem &&(
        <EditComponentMLFarmer
          item={selectedItem}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      {isDeleteModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this item?</p>
            <div style={styles.modalButtons}>
              <button 
                style={styles.cancelButton} 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                style={styles.deleteButton} 
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    width: '25%', // Ensure each column has a uniform size
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    width: '25%', // Ensure each column has a uniform size
  },
  button: {
    padding: '5px 10px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    border: 'none',
    cursor: 'pointer',
  },
  icon: {
    cursor: 'pointer',
    marginLeft: '10px', // Add margin to separate icons
    color: '#2c3e50', // Icon color
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    textAlign: 'center',
  },
  modalButtons: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-around',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#bdc3c7',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
 
};

export default MasterListFarmer;
