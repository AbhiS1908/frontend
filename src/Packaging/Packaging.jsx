import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import PackagingStockDetails from './PackagingStockDetails';
import PackagingStockDetailsFarmer from './PackagingStockDetailsFarmer';
import PackagingStockDetailsVendor from './PackagingStockDetailsVendor';

export default function Packaging() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [totals, setTotals] = useState({
    finalTotalWeight: 0,
    totalWeight1: 0,
    totalWeight2: 0,
    totalWeight3: 0,
    totalWeight4: 0,
    totalWeight5: 0,
    totalWeight6: 0,
  });

  // Fetch data from the APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from all three APIs
        const [cashStockResponse, farmerStockResponse, vendorStockResponse] = await Promise.all([
          fetch('https://ane-production.up.railway.app/api/v1/auth/cash-stock').then((res) => res.json()),
          fetch('https://ane-production.up.railway.app/api/v1/auth/farmer-stock').then((res) => res.json()),
          fetch('https://ane-production.up.railway.app/api/v1/auth/vendor-stock').then((res) => res.json()),
        ]);

        // Map the data from each API to the required format
        const cashStockData = cashStockResponse.map((item) => ({
          _id: item._id,
          id: item.id,
          finalWeight: item.finalTotalWeight,
          quantity: item.quantity, // Ensure quantity is available
          product: item.product,
          type: 'cash',
          totalWeight1: item.totalWeight1 || 0,
          totalWeight2: item.totalWeight2 || 0,
          totalWeight3: item.totalWeight3 || 0,
          totalWeight4: item.totalWeight4 || 0,
          totalWeight5: item.totalWeight5 || 0,
          totalWeight6: item.totalWeight6 || 0,
        }));

        const farmerStockData = farmerStockResponse.map((item) => ({
          _id: item._id,
          id: item.id,
          finalWeight: item.finalTotalWeight,
          quantity: item.quantity, // Ensure quantity is available
          product: item.product,
          type: 'farmer',
          totalWeight1: item.totalWeight1 || 0,
          totalWeight2: item.totalWeight2 || 0,
          totalWeight3: item.totalWeight3 || 0,
          totalWeight4: item.totalWeight4 || 0,
          totalWeight5: item.totalWeight5 || 0,
          totalWeight6: item.totalWeight6 || 0,
        }));

        const vendorStockData = vendorStockResponse.map((item) => ({
          _id: item._id,
          id: item.id,
          finalWeight: item.finalTotalWeight,
          quantity: item.quantity, // Ensure quantity is available
          product: item.product,
          type: 'vendor',
          totalWeight1: item.totalWeight1 || 0,
          totalWeight2: item.totalWeight2 || 0,
          totalWeight3: item.totalWeight3 || 0,
          totalWeight4: item.totalWeight4 || 0,
          totalWeight5: item.totalWeight5 || 0,
          totalWeight6: item.totalWeight6 || 0,
        }));

        // Combine all data in the required order: cash, farmer, vendor
        const combinedData = [...cashStockData, ...farmerStockData, ...vendorStockData];
        setData(combinedData);

        // Calculate totals
        const totals = combinedData.reduce(
          (acc, item) => {
            if (item.product === 'Tauli') {
              // Add finalWeight for Tauli to finalTotalWeight
              acc.finalTotalWeight += Number(item.finalWeight) || 0;
        
              // Add Tauli weights to specific totalWeight fields if applicable
              acc.totalWeight1 += Number(item.totalWeight1) || 0;
              acc.totalWeight2 += Number(item.totalWeight2) || 0;
              acc.totalWeight3 += Number(item.totalWeight3) || 0;
              acc.totalWeight4 += Number(item.totalWeight4) || 0;
              acc.totalWeight5 += Number(item.totalWeight5) || 0;
              acc.totalWeight6 += Number(item.totalWeight6) || 0;
            } else {
              // Add quantity for non-Tauli products to finalTotalWeight
              acc.finalTotalWeight += Number(item.quantity) || 0;
        
              // Add to specific totalWeight fields based on product type
              switch (item.product) {
                case '6 Suta':
                  acc.totalWeight1 += Number(item.quantity) || 0;
                  break;
                case '5 Suta':
                  acc.totalWeight2 += Number(item.quantity) || 0;
                  break;
                case '4 Suta':
                  acc.totalWeight3 += Number(item.quantity) || 0;
                  break;
                case '3 Suta':
                  acc.totalWeight4 += Number(item.quantity) || 0;
                  break;
                case 'Others':
                  acc.totalWeight5 += Number(item.quantity) || 0;
                  break;
                case 'Waste':
                  acc.totalWeight6 += Number(item.quantity) || 0;
                  break;
                default:
                  break;
              }
            }
        
            return acc;
          },
          {
            finalTotalWeight: 0,
            totalWeight1: 0,
            totalWeight2: 0,
            totalWeight3: 0,
            totalWeight4: 0,
            totalWeight5: 0,
            totalWeight6: 0,
          }
        );

        setTotals(totals); // Set the totals in state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle Packaging button click
  const handlePackage = (type, _id, product) => {
    console.log(type, _id);
    if (!_id) {
      alert('Invalid ID');
      return;
    }
    if (product === 'Tauli') {
      switch (type) {
        case 'cash':
          navigate(`/packet-table-cash?cashFormId=${_id}`); // Navigate to cash packaging page
          break;
        case 'farmer':
          navigate(`/packet-table-farmer?farmerFormId=${_id}`); // Navigate to farmer packaging page
          break;
        case 'vendor':
          navigate(`/packet-table-vendor?vendorFormId=${_id}`); // Navigate to vendor packaging page
          break;
        default:
          alert('Invalid type');
      }
    } else {
      switch (type) {
        case 'cash':
          navigate(`/packagingTableNameTBG?cashFormId=${_id}`); // Navigate to cash packaging page
          break;
        case 'farmer':
          navigate(`/packagingTableNameTBGFarmer?farmerFormId=${_id}`); // Navigate to farmer packaging page
          break;
        case 'vendor':
          navigate(`/packagingTableNameTBGVendor?vendorFormId=${_id}`); // Navigate to vendor packaging page
          break;
        default:
          alert('Invalid type');
      }
    }
  };

  // Handle Bulk button click
  const handleBulk = (type, _id, product) => {
    console.log(type, _id);
    if (!_id) {
      alert('Invalid ID');
      return;
    }
    if (product === 'Tauli') {
      switch (type) {
        case 'cash':
          navigate(`/bulk-cash-tauli?cashFormId=${_id}`); // Navigate to cash packaging page
          break;
        case 'farmer':
          navigate(`/bulk-farmer-tauli?farmerFormId=${_id}`); // Navigate to farmer packaging page
          break;
        case 'vendor':
          navigate(`/bulk-vendor-tauli?vendorFormId=${_id}`); // Navigate to vendor packaging page
          break;
        default:
          alert('Invalid type');
      }
    } else {
      switch (type) {
        case 'cash':
          navigate(`/bulk-cash-suta?cashFormId=${_id}`); // Navigate to cash packaging page
          break;
        case 'farmer':
          navigate(`/bulk-farmer-suta?farmerFormId=${_id}`); // Navigate to farmer packaging page
          break;
        case 'vendor':
          navigate(`/bulk-vendor-suta?vendorFormId=${_id}`); // Navigate to vendor packaging page
          break;
        default:
          alert('Invalid type');
      }
    }
  };

  const handleSeeDetails = (row) => {
    setSelectedRow(row); // Set the selected row to display details
  };

  // Close the details view
  const closeDetails = () => {
    setSelectedRow(null); // Clear the selected row to hide details
  };

  const handle6sutta = () =>{
    navigate(`/6-sutta-page`);
  }

  const handle5sutta = () =>{
    navigate(`/5-sutta-page`);
  }
  const handle4sutta = () =>{
    navigate(`/4-sutta-page`);
  }

  const handle3sutta = () =>{
    navigate(`/3-sutta-page`);
  }
  const handleHandPickedsutta = () =>{
    navigate(`/hand-picked-sutta-page`);
  }
  const handleWastesutta = () =>{
    navigate(`/waste-sutta-page`);
  }
  return (
    <Layout>
      {/* Summary Section */}
      <div style={summaryContainerStyle}>
        <h3 style={summaryTitleStyle}>Stock Summary</h3>
        <div style={summaryRowStyle}>
          <div style={summaryCardStyle}>
            <h4>Final Total Weight</h4>
            <p>{totals.finalTotalWeight} kg</p>
          </div>
          <div onClick={handle6sutta} style={summaryCardStyle}>
            <h4>6 Sutta</h4>
            <p>{totals.totalWeight1} kg</p>
          </div>
          <div onClick={handle5sutta} style={summaryCardStyle}>
            <h4>5 Sutta</h4>
            <p>{totals.totalWeight2} kg</p>
          </div>
          <div onClick={handle4sutta} style={summaryCardStyle}>
            <h4>4 Sutta</h4>
            <p>{totals.totalWeight3} kg</p>
          </div>
          <div onClick={handle3sutta} style={summaryCardStyle}>
            <h4>3 Sutta</h4>
            <p>{totals.totalWeight4} kg</p>
          </div>
          <div onClick={handleHandPickedsutta} style={summaryCardStyle}>
            <h4>Hand Picked</h4>
            <p>{totals.totalWeight5} kg</p>
          </div>
          <div onClick={handleWastesutta} style={summaryCardStyle}>
            <h4>Waste</h4>
            <p>{totals.totalWeight6} kg</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>S. No.</th>
            <th style={tableHeaderStyle}>Product</th>
            <th style={tableHeaderStyle}>Final Weight</th>
            <th style={tableHeaderStyle}>Action</th>
            <th style={tableHeaderStyle}>Packaging</th>
            <th style={tableHeaderStyle}>Bulk</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id} style={tableRowStyle}>
              <td style={tableCellStyle}>{index + 1}</td>
              <td style={tableCellStyle}>{row.product === 'Others' ? 'Hand Picked' : row.product}</td>
              <td style={tableCellStyle}>
                {row.product === 'Tauli' ? `${row.finalWeight} kg` : `${row.quantity} kg`}
              </td>
              <td style={tableCellStyle}>
                <button onClick={() => handleSeeDetails(row)} style={buttonStyle}>See Details</button>
              </td>
              <td style={tableCellStyle}>
                <button onClick={() => handlePackage(row.type, row._id, row.product)} style={buttonStyle}>Packaging</button>
              </td>
              <td style={tableCellStyle}>
                <button onClick={() => handleBulk(row.type, row._id, row.product)} style={buttonStyle}>Bulk</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Details */}
      {selectedRow && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <button onClick={closeDetails} style={closeButtonStyle}>
              &times;
            </button>
            {selectedRow.type === 'cash' && (
              <PackagingStockDetails row={selectedRow} _id={selectedRow._id} />
            )}
            {selectedRow.type === 'farmer' && (
              <PackagingStockDetailsFarmer row={selectedRow} _id={selectedRow._id} />
            )}
            {selectedRow.type === 'vendor' && (
              <PackagingStockDetailsVendor row={selectedRow} _id={selectedRow._id} />
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

// Styles for the table
const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
};

const tableRowStyle = {
  border: '1px solid #ddd',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

const buttonStyle = {
  padding: '5px 10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

// Styles for the modal overlay
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

// Styles for the modal
const modalStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '80%',
  maxWidth: '65%',
  position: 'relative',
};

// Styles for the close button
const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
};

// Styles for the summary section
const summaryContainerStyle = {
  marginBottom: '20px',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const summaryTitleStyle = {
  marginBottom: '16px',
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#333',
};

const summaryRowStyle = {
  display: 'flex',
  gap: '16px',
  overflowX: 'auto',
};

const summaryCardStyle = {
  flex: 1,
  minWidth: '150px',
  padding: '16px',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

summaryCardStyle[':hover'] = {
  transform: 'translateY(-4px)',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};