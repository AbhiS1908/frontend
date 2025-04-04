import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import DetailsModalVendor from '../components/DetailsModalVendor';
import axios from 'axios'; 
import StockSumDetailsVendor from '../components/StockSumDetailsVendor';
import StockSumDetailsVendorKG from '../components/StockSumDetailsVendorKG';

const PurchaseListVendor = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [expandedStock, setExpandedStock] = useState(null); 
  const navigate = useNavigate();
  const [stockData, setStockData] = useState({}); 
  const [expandedUnitType, setExpandedUnitType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ane-production.up.railway.app/api/v1/auth/vendor-form');
        setData(response.data); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSeeDetailsClick = (item) => {
    setSelectedItem(item);
  };

  const fetchStockData = async (vendorFormId) => {
    try {
      const response = await axios.get(`https://ane-production.up.railway.app/api/v1/auth/vendor-stock/${vendorFormId}`);
      setStockData(prev => ({ ...prev, [vendorFormId]: response.data }));
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setStockData(prev => ({ ...prev, [vendorFormId]: [] }));
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleAddStockClick = (item) => {
    const queryParams = new URLSearchParams({
      vendorId: item._id,
      unitType: item.unitType // Sending unitType as well
    }).toString();
    navigate(`/purchase-order-quantity-vendor?${queryParams}`);
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
      <h1>Purchase List - Vendor</h1>
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
                <td style={styles.td}>{item.vendorName}</td>
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
                      <StockSumDetailsVendor 
                        stockData={stockData[item._id]} 
                        vendorFormId={item._id}
                        fetchStockData={fetchStockData}
                      />
                    ) : expandedUnitType === 'kg' ? (
                      <StockSumDetailsVendorKG 
                        stockData={stockData[item._id]}
                        vendorFormId={item._id}
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
      {selectedItem && <DetailsModalVendor item={selectedItem} onClose={handleCloseModal}  onSave={handleSaveDetails} onDelete={handleDelete}/>}
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

export default PurchaseListVendor;
