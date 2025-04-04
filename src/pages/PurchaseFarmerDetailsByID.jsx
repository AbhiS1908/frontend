import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate,useParams } from 'react-router-dom';
import DetailsModalFarmer from '../components/DetailsModalFarmer';
import axios from 'axios'; 
import StockSumDetailsFarmer from '../components/StockSumDetailsFarmer';
import StockSumDetailsFarmerKG from '../components/StockSumDetailsFarmerKG';

const PurchaseFarmerDetailsByID = () => {
  const {farmerId} = useParams();
  console.log("Extracted Farmer ID:", farmerId);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [expandedStock, setExpandedStock] = useState(null); 
  const navigate = useNavigate();
  const [stockData, setStockData] = useState({}); 
  const [expandedUnitType, setExpandedUnitType] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://ane-production.up.railway.app/api/v1/auth/farmer-form/${farmerId}`);
        console.log("Fetched Data:", response.data);
        setData(response.data || []); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (farmerId) fetchData();
  }, [farmerId]);

  const handleSeeDetailsClick = (item) => {
    setSelectedItem(item);
  };

  const fetchStockData = async (farmerFormId) => {
    try {
      const response = await axios.get(`https://ane-production.up.railway.app/api/v1/auth/farmer-stock/${farmerFormId}`);
      setStockData(prev => ({ ...prev, [farmerFormId]: response.data }));
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setStockData(prev => ({ ...prev, [farmerFormId]: [] }));
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleAddStockClick = (item) => {
    const queryParams = new URLSearchParams({
      farmerId: item._id,
      unitType: item.unitType // Sending unitType as well
    }).toString();
    navigate(`/purchase-order-quantity-farmer?${queryParams}`);
  };

  const toggleStockDetails = async (item) => {
    if (expandedStock === item._id) {
      setExpandedStock(null);
      setExpandedUnitType(null);
      return;
    }
    await fetchStockData(item._id);
    setExpandedStock(item._id);
    setExpandedUnitType(item.unitType);
  };

  const handleSaveDetails = (updatedItem) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  const handleDelete = (deletedId) => {
    setData(prevData => prevData.filter(item => item._id !== deletedId));
  };

  return (
    <Layout>
      <h1>Purchase List - Farmer</h1>
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
            <React.Fragment key={index}>
              <tr>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{item.farmerName}</td>
                <td style={styles.td}>{item.sellerAddress}</td>
                <td style={styles.td}>{Array.isArray(item.product)
                  ? item.product.map(prod => prod === 'Others' ? 'Hand Picked' : prod).join(', ')
                  : item.product.split(',').map(prod => prod.trim() === 'Others' ? 'Hand Picked' : prod.trim()).join(', ')}</td>
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
                      <StockSumDetailsFarmer 
                        stockData={stockData[item._id]} 
                        farmerFormId={item._id}
                        fetchStockData={fetchStockData}
                      />
                    ) : expandedUnitType === 'kg' ? (
                      <StockSumDetailsFarmerKG 
                        stockData={stockData[item._id]}
                        farmerFormId={item._id}
                        fetchStockData={fetchStockData}
                      />
                    ) : null}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {selectedItem && <DetailsModalFarmer item={selectedItem} onClose={handleCloseModal} onSave={handleSaveDetails} onDelete={handleDelete}/>}
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

export default PurchaseFarmerDetailsByID;
