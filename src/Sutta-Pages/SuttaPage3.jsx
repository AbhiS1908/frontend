import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';


export default function SuttaPage3() {
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
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // Fetch data from the APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from all three APIs
        const [cashStockResponse, farmerStockResponse, vendorStockResponse] = await Promise.all([
          fetch('http://localhost:8000/api/v1/auth/cash-stock').then((res) => res.json()),
          fetch('http://localhost:8000/api/v1/auth/farmer-stock').then((res) => res.json()),
          fetch('http://localhost:8000/api/v1/auth/vendor-stock').then((res) => res.json()),
        ]);

        // Map the data from each API to the required format
        const cashStockData = cashStockResponse.map((item) => ({
          _id: item._id,
          id: item.id,
          finalWeight: item.finalTotalWeight,
          quantity: item.quantity, // Ensure quantity is available
          product: item.product,
          name: item.cashName, // Add name from cash API
          type: 'cash',
          totalWeight1: item.totalWeight1 || 0,
          totalWeight2: item.totalWeight2 || 0,
          totalWeight3: item.totalWeight3 || 0,
          totalWeight4: item.totalWeight4 || 0,
          totalWeight5: item.totalWeight5 || 0,
          totalWeight6: item.totalWeight6 || 0,
          eDate: item.eDate, // Add eDate field
        }));

        const farmerStockData = farmerStockResponse.map((item) => ({
          _id: item._id,
          id: item.id,
          finalWeight: item.finalTotalWeight,
          quantity: item.quantity, // Ensure quantity is available
          product: item.product,
          name: item.farmerName, // Add name from farmer API
          type: 'farmer',
          totalWeight1: item.totalWeight1 || 0,
          totalWeight2: item.totalWeight2 || 0,
          totalWeight3: item.totalWeight3 || 0,
          totalWeight4: item.totalWeight4 || 0,
          totalWeight5: item.totalWeight5 || 0,
          totalWeight6: item.totalWeight6 || 0,
          eDate: item.eDate, // Add eDate field
        }));

        const vendorStockData = vendorStockResponse.map((item) => ({
          _id: item._id,
          id: item.id,
          finalWeight: item.finalTotalWeight,
          quantity: item.quantity, // Ensure quantity is available
          product: item.product,
          name: item.vendorName, // Add name from vendor API
          type: 'vendor',
          totalWeight1: item.totalWeight1 || 0,
          totalWeight2: item.totalWeight2 || 0,
          totalWeight3: item.totalWeight3 || 0,
          totalWeight4: item.totalWeight4 || 0,
          totalWeight5: item.totalWeight5 || 0,
          totalWeight6: item.totalWeight6 || 0,
          eDate: item.eDate, // Add eDate field
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

 

  return (
    <Layout>
      {/* Table Section */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>S. No.</th>
            <th style={tableHeaderStyle}>Name</th> {/* New column */}
            <th style={tableHeaderStyle}>Product</th>
            <th style={tableHeaderStyle}>Final Weight</th>
            <th style={tableHeaderStyle}>3 Suta</th>
            <th style={tableHeaderStyle}>EDOD</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter(row => row.product === '3 Suta' || row.product === 'Tauli')
            .map((row, index) => (
              <tr key={row.id} style={tableRowStyle}>
                <td style={tableCellStyle}>{index + 1}</td>
                <td style={tableCellStyle}>{row.name}</td> {/* New data cell */}
                <td style={tableCellStyle}>{row.product}</td>
                <td style={tableCellStyle}>
                  {row.product === 'Tauli' 
                    ? `${row.finalWeight} kg` 
                    : `${row.quantity} kg`
                  }
                </td>
                <td style={tableCellStyle}>
                  {row.product === 'Tauli' 
                    ? `${row.totalWeight4} kg` 
                    : '-'
                  }
                </td>
                <td style={tableCellStyle}>
                  {formatDate(row.eDate)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Keep modal and other existing code the same */}
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