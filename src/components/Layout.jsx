import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div style={styles.layout}>
      
      <Sidebar />
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    
  },
  content: {
    flex: 1,
    padding: '20px',
  },
};

export default Layout;