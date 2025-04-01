import React from 'react';
import Layout from '../components/Layout';
import {useNavigate} from 'react-router-dom';

export default function PurchaseDashboard() {

    const navigate  = useNavigate();
  // Function to handle box clicks
    const handleBoxClickNavigate = (navAddress) => {
        navigate(navAddress)
    };

  return (
    <Layout>
      <h1>Purchase Dashboard</h1>
      <hr />
      <div style={styles.container}>
        <div style={styles.navBox} onClick={() => handleBoxClickNavigate('/po-file')}>PO FILE</div>
        <div style={styles.navBox} onClick={() => handleBoxClickNavigate('/unadjusted')}>UNADJUSTED</div>
        <div style={styles.navBox} onClick={() => handleBoxClickNavigate('/adjusted')}>ADJUSTED</div>
        <div style={styles.navBox} onClick={() => handleBoxClickNavigate('/sendForProcessing')}>SEND FOR PROCESSING</div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap', // Allows the boxes to wrap into multiple rows
    justifyContent: 'space-around', // Adjusts spacing between boxes
  },
  navBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px',
    backgroundColor: 'blue',
    height: '100px',
    width: 'calc(50% - 20px)', // Adjusts width to fit 2 boxes in a row considering margins
    cursor: 'pointer', // Changes cursor to pointer to indicate clickability
    color: 'white', // Optional: Change text color for better visibility
    fontSize: '20px', // Optional: Adjust font size
  },
};