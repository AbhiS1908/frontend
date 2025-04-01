import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import DetailsModal from '../components/DetailsModal';
import axios from 'axios'; 
import PacketStockDetailsFarmer from './PacketStockDetailsFarmer';

const PacketMasterFarmer = () => {
  const { farmerId } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [expandedStock, setExpandedStock] = useState(null);
  const navigate = useNavigate();
  const [stockData, setStockData] = useState({});
  const [expandedUnitType, setExpandedUnitType] = useState(null);

  useEffect(() => {
    if (!farmerId) return; // Prevent API call if farmerId is not available

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/auth/farmer-form/${farmerId}`);
        const filteredData = response.data?.filter(item => item.unitType === 'bag') || [];
        console.log(filteredData, 'data')
        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [farmerId]); // Added farmerId as a dependency

  const handleSeeDetailsClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleAddStockClick = (item) => {
    const queryParams = new URLSearchParams({
      farmerId: item._id,
      unitType: item.unitType
    }).toString();
    navigate(`/purchase-order-quantity?${queryParams}`);
  };

  const toggleStockDetails = async (item) => {
    if (expandedStock === item._id) {
      setExpandedStock(null);
      setExpandedUnitType(null);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/auth/farmer-stock/${item._id}`);
      
      if (response.data.error === "No farmer Stock entries found for this farmer Form ID") {
        alert("No Stock Details Available");
        return;
      }
      
      setStockData((prev) => ({ ...prev, [item._id]: response.data }));
      setExpandedStock(item._id);
      setExpandedUnitType(item.unitType);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      alert("Stock Details Unavailable. Add Stock !");
    }
  };

  return (
    <Layout>
      <h1>Packeting List - Farmer</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Sno.</th>
            <th style={styles.th}>Seller Name</th>
            <th style={styles.th}>Seller Address</th>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Unit</th>
            <th style={styles.th}>Action</th>
            <th style={styles.th}>Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={item._id}>
              <tr>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{item.farmerName}</td>
                <td style={styles.td}>{item.sellerAddress}</td>
                <td style={styles.td}>{item.product}</td>
                <td style={styles.td}>
                  {item.unitType}
                  <span 
                    style={styles.arrow} 
                    onClick={() => toggleStockDetails(item)}
                  >
                    ⬇️
                  </span>
                </td>
                <td style={styles.td}>
                  <button style={styles.button} onClick={() => handleAddStockClick(item)}>Add Stock</button>
                </td>
                <td style={styles.td}>
                  <button style={styles.button} onClick={() => handleSeeDetailsClick(item)}>See Details</button>
                </td>
              </tr>
              {expandedStock === item._id && (
                <tr>
                  <td colSpan="7">
                    {expandedUnitType === 'bag' ? (
                      <PacketStockDetailsFarmer stockData={stockData[item._id]} />
                    ) : null}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {selectedItem && <DetailsModal item={selectedItem} onClose={handleCloseModal} />}
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
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
  arrow: {
    marginLeft: '10px',
    cursor: 'pointer',
  },
  button: {
    padding: '5px 10px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px',
  },
};

export default PacketMasterFarmer;
