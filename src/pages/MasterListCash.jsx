import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons from react-icons
import EditComponentMLCash from '../Edit-delete/editComponentMLCash'; // Import the Edit Component

const MasterListCash = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // State for selected item
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handlePurchaseClick = (id) => {
    console.log(id);
    navigate(`/purchase-order/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/auth/cash');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDetailsClick = (id) => {
    navigate(`/purchase-details-by-idcash/${id}`);
  };

  const handleSegregationBtn = (id) => {
    navigate(`/segregation-master-cash/${id}`);
  };
  const handlePacketBtn = (id) => {
    navigate(`/packet-master-cash/${id}`);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item); // Set the clicked row's data
    setIsEditModalOpen(true); // Open the modal
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/auth/cash/${id}`);
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
      <h1>Master List - Cash</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>S. No.</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Address</th>
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
        <EditComponentMLCash
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

export default MasterListCash;
