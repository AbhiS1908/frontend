import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons from react-icons
import EditComponentMLVendor from '../Edit-delete/editComponentMLVendor'; // Import the Edit Component

const MasterListVender = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // State for selected item
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handlePurchaseClick = (id) => {
    navigate(`/purchase-order-vendor/${id}`);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ane-production.up.railway.app/api/v1/auth/vendor');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDetailsClick = (id) => {
    navigate(`/purchase-details-by-idvendor/${id}`);
  };
  const handleSegregationBtn = (id) => {
    navigate(`/segregation-master-vendor/${id}`);
  };

  const handlePacketBtn = (id) => {
    navigate(`/packet-master-vendor/${id}`);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item); // Set the clicked row's data
    setIsEditModalOpen(true); // Open the modal
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`https://ane-production.up.railway.app/api/v1/auth/vendor/${id}`);
      // Remove the deleted item from the state
      setData(data.filter(item => item._id !== id));
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
      <h1>Master List - Vendor</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>S. No.</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>GST</th>
            <th style={styles.th}>GSTIN No.</th>
            <th style={styles.th}>Number</th>
            <th style={styles.th}>Email</th>
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
              <td style={styles.td}>{item.address}</td>
              <td style={styles.td}>{item.gst}</td>
              <td style={styles.td}>{item.gstNumber}</td>
              <td style={styles.td}>{item.phoneNumber}</td>
              <td style={styles.td}>{item.email}</td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handlePurchaseClick(item._id)}>Purchase</button>
                <FaEdit style={styles.icon} onClick={() => handleEditClick(item)} />
                <FaTrash style={styles.icon} onClick={() => handleDeleteClick(item._id)} />
              </td>
              <td style={styles.td}>
              <button style={styles.button} onClick={() => handleDetailsClick(item._id)}>See Details</button>
              </td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handleSegregationBtn(item._id)}>Segregation</button>
              </td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handlePacketBtn(item._id)}>Packeting</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Render Edit Component as Modal */}
      {isEditModalOpen && selectedItem &&(
        <EditComponentMLVendor
          item={selectedItem}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
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
};

export default MasterListVender;
