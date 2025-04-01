import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const role = localStorage.getItem('role') || 'guest'; // Get role from storage

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const menuConfig = [
    {
      label: 'Create Master',
      path: '/xyz',
      roles: ['admin', 'purchase'],
    },
    {
      label: 'List',
      roles: ['admin', 'purchase'],
      subItems: [
        {
          label: 'Master List',
          roles: ['admin', 'purchase'],
          subItems: [
            { label: 'Cash List', path: '/master-list-cash', roles: ['admin', 'purchase'] },
            { label: 'Vendor List', path: '/master-list-vendor', roles: ['admin', 'purchase'] },
            { label: 'Farmer List', path: '/master-list-farmer', roles: ['admin', 'purchase'] },
          ],
        },
        {
          label: 'Purchase List',
          roles: ['admin', 'purchase'],
          subItems: [
            { label: 'Cash List', path: '/purchase-list-cash', roles: ['admin', 'purchase'] },
            { label: 'Vendor List', path: '/purchase-list-vendor', roles: ['admin', 'purchase'] },
            { label: 'Farmer List', path: '/purchase-list-farmer', roles: ['admin', 'purchase'] },
          ],
        },
      ],
    },
    {
      label: 'Segregation',
      roles: ['admin', 'segregation'],
      subItems: [
        { label: 'Cash Segregation', path: '/cash-segregation-list', roles: ['admin', 'segregation'] },
        { label: 'Farmer Segregation', path: '/farmer-segregation-list', roles: ['admin', 'segregation'] },
        { label: 'Vendor Segregation', path: '/vendor-segregation-list', roles: ['admin', 'segregation'] },
      ],
    },
    {
      label: 'Packaging',
      path: '/packaging',
      roles: ['admin', 'packaging'],
    },
    {
      label: 'Expense',
      path: '/expense',
      roles: ['admin', 'expense'],
    },
    {
      label: 'Expense Darbhanga',
      path: '/expenseD',
      roles: ['admin', 'expenseD'],
    },
    {
      label: 'Credentials',
      path: '/credentials',
      roles: ['admin', 'credentials'],
    },
  ];

  const renderMenuItems = (items) => {
    return items.map((item, index) => {
      if (!item.roles.includes(role)) return null;

      const hasSubItems = item.subItems && item.subItems.length > 0;

      return (
        <li key={`${item.label}-${index}`} style={styles.menuItem}>
          <span style={styles.bullet}>•</span>
          {hasSubItems ? (
            <>
              <span onClick={() => toggleMenu(item.label)} style={styles.link}>
                {item.label}
              </span>
              {openMenus[item.label] && (
                <ul style={styles.subMenu}>
                  {renderMenuItems(item.subItems)}
                </ul>
              )}
            </>
          ) : (
            <Link to={item.path} style={styles.link}>
              {item.label}
            </Link>
          )}
        </li>
      );
    });
  };

  return (
    <div style={styles.sidebar}>
      <img src="/image/abso.jpeg" alt="Company Logo" style={styles.logo} />
      <h2 style={styles.title}>Absolute Nuts Enterprises</h2>
      <ul style={styles.menu}>
        {renderMenuItems(menuConfig)}
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    padding: '20px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  menu: {
    listStyle: 'none',
    padding: '0',
  },
  menuItem: {
    marginBottom: '10px',
  },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  subMenu: {
    listStyle: 'none',
    padding: '0 0 0 20px',
  },
  bullet: {
    marginRight: '10px',
    verticalAlign: 'middle', // Added to align bullets correctly
  },
  logo: {
    width: '4rem',
    marginLeft:'4rem'
  },
};

export default Sidebar;