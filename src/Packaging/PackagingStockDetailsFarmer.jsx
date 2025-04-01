import React, { useEffect, useState } from 'react'

const PackagingStockDetailsFarmer = ({ row, _id }) => {
    const [stockDetails, setStockDetails] = useState(null);

    useEffect(() => {
        const fetchStockDetails = async () => {
          try {
            const response = await fetch(`http://localhost:8000/api/v1/auth/farmer-stock-one/${_id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch stock details');
            }
            const data = await response.json();
            setStockDetails(data);
          } catch (error) {
            console.error('Error fetching stock details:', error);
          }
        };
    
        if (_id) {
          fetchStockDetails();
        }
      }, [_id]);
    
      if (!stockDetails) {
        return <div>Loading...</div>;
      }

      return (
        <div style={modalContentStyle}>
          <h2 style={modalHeaderStyle}>Details for {row.farmerName || row.name}</h2>
          <div style={gridContainerStyle}>
            <div style={gridStyle}>
              {/* Always displayed fields */}
              <div style={fieldStyle}>
                <strong>Name:</strong> {stockDetails.farmerName || stockDetails.name}
              </div>
    
              <div style={fieldStyle}>
                <strong>poNo:</strong> {stockDetails.poNo}
              </div>

              <div style={fieldStyle}>
              <strong>Date:</strong> {new Date(stockDetails.eDate).toLocaleDateString('en-GB')}
              </div>
    
              {/* Conditionally displayed fields for "Tauli" */}
              {stockDetails.product === "Tauli" && (
                <>
                  <div style={fieldStyle}>
                    <strong>6 Suta:</strong> {stockDetails.totalWeight1}kg
                  </div>
                  <div style={fieldStyle}>
                    <strong>5 Suta:</strong> {stockDetails.totalWeight2}kg
                  </div>
                  <div style={fieldStyle}>
                    <strong>4 Suta:</strong> {stockDetails.totalWeight3}kg
                  </div>
                  <div style={fieldStyle}>
                    <strong>3 Suta:</strong> {stockDetails.totalWeight4}kg
                  </div>
                  <div style={fieldStyle}>
                    <strong>Hand Picked:</strong> {stockDetails.totalWeight5}kg
                  </div>
                  <div style={fieldStyle}>
                    <strong>Waste:</strong> {stockDetails.totalWeight6}kg
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      );
    };

export default PackagingStockDetailsFarmer;

// Styles for the modal content
const modalContentStyle = {
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#fff',
  width: '100%',
  maxWidth: '800px',
  maxHeight: '90vh', // Limit height to 90% of the viewport height
  overflowY: 'auto', // Make the content scrollable
};

const modalHeaderStyle = {
  marginBottom: '20px',
  fontSize: '24px',
  textAlign: 'center',
};

// Container for the grid to ensure proper scrolling
const gridContainerStyle = {
  maxHeight: 'calc(90vh - 100px)', // Adjust height to account for header and padding
  overflowY: 'auto', // Make the grid content scrollable
};

// Grid layout for fields
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr', // 2 columns
  gap: '10px',
};

// Style for each field
const fieldStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  backgroundColor: '#f9f9f9',
};