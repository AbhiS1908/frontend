import React, { useState } from 'react';
import Layout from '../components/Layout';
import {useNavigate} from 'react-router-dom';

const Purchase = () => {
  const navigate  = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');
  const [gstStatus, setGstStatus] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [gstError, setGstError] = useState('');
  const [formData, setFormData] = useState('');
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleGstStatusChange = (event) => {
    setGstStatus(event.target.value);
    setGstNumber('');
    setGstError('');
  };

  const handleGstNumberChange = (event) => {
    const value = event.target.value.toUpperCase();
    const regex = /^[A-Z0-9]*$/;
    if (regex.test(value)) {
      setGstNumber(value);
      if (value.length < 15 && gstStatus === 'Registered') {
        setGstError('GST number invalid');
      } else {
        setGstError('');
      }
    }
  };

  const handleInputChange = (event)=>{
    const {name, value} = event.target;
    setFormData({...formData, [name]:value});
  };

   // Function to handle Cash form submission
   const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ane-production.up.railway.app/api/v1/auth/cash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Cash Registered:', data);
        alert('Master Created Successfully');
        navigate(`/master-list-cash`, { state: { formData, selectedOption } });
      } else {
        throw new Error(data.message || 'Failed to register cash.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterFarmer = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ane-production.up.railway.app/api/v1/auth/farmer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Farmer Registered:', data);
        alert('Master Created Successfully');
        navigate(`/master-list-farmer`, { state: { formData, selectedOption } });
      } else {
        throw new Error(data.message || 'Failed to register farmer.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterVender = async () =>{
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ane-production.up.railway.app/api/v1/auth/vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Cash Registered:', data);
        alert('Master Created Successfully');
        navigate(`/master-list-vendor`, { state: { formData, selectedOption } });
      } else {
        throw new Error(data.message || 'Failed to register vendor.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  const renderForm = () => {
    switch (selectedOption) {
      case 'Cash':
        return (
          <div style={styles.form}>
            <h3>Cash Details</h3>
            <div style={styles.twoColumnLayout}>
              <div style={styles.fieldStyle}>
                <span>Name*:</span>
                <input type="text"  name="name" placeholder="Name" style={styles.input} required onChange={handleInputChange}/>
              </div>
              <div style={styles.fieldStyle}>
                <span>Address*:</span>
                <input type="text" name="address" onChange={handleInputChange} placeholder="Address" style={styles.input} required />
              </div>
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button onClick={handleRegister} style={styles.buttonStyle} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </div>
        );
        case 'Farmer':
          return (
            <div style={styles.form}>
              <h3>Farmer Details</h3>
              <div style={styles.twoColumnLayout}>
                <div style={styles.fieldStyle}>
                  <span>Name*:</span>
                  <input type="text" name="name" placeholder="Name" style={styles.input} required onChange={handleInputChange} />
                </div>
                <div style={styles.fieldStyle}>
                  <span>Plot Name*:</span>
                  <input type="text" name="plotName" placeholder="Plot Name" style={styles.input} required onChange={handleInputChange} />
                </div>
                <div style={styles.fieldStyle}>
                  <span>Village*:</span>
                  <input type="text" name="village" placeholder="Village" style={styles.input} required onChange={handleInputChange} />
                </div>
                <div style={styles.fieldStyle}>
                  <span>Post*:</span>
                  <input type="text" name="post" placeholder="Post" style={styles.input} required onChange={handleInputChange} />
                </div>
                <div style={styles.fieldStyle}>
                  <span>District*:</span>
                  <input type="text" name="district" placeholder="District" style={styles.input} required onChange={handleInputChange} />
                </div>
                <div style={styles.fieldStyle}>
                  <span>State*:</span>
                  <input type="text" name="state" placeholder="State" style={styles.input} required onChange={handleInputChange} />
                </div>
                <div style={styles.fieldStyle}>
                  <span>Pincode/Zip*:</span>
                  <input type="text" name="pincode" placeholder="Pincode/Zip" style={styles.input} required onChange={handleInputChange} />
                </div>
              </div>
              <button style={styles.buttonStyle} onClick={handleRegisterFarmer}>Register</button>
            </div>
          );
        case 'Vendor':
          return (
            <div style={styles.form}>
              <h3>Vendor Details</h3>
              <div style={styles.twoColumnLayout}>
                <div style={styles.fieldStyle}>
                  <span>Name*:</span>
                  <input type="text" name="name" placeholder="Name" style={styles.input} required onChange={handleInputChange} />
                </div>
                <div style={styles.fieldStyle}>
                  <span>GST*:</span>
                  <select
                    value={gstStatus}
                    onChange={handleGstStatusChange}
                    style={styles.dropdown}
                  >
                    <option value="">Select GST Status</option>
                    <option value="Registered">Registered</option>
                    <option value="Unregistered">Unregistered</option>
                  </select>
                </div>
                {gstStatus === 'Registered' && (
                  <div style={styles.fieldStyle}>
                    <span>GST Number*:</span>
                    <input
                      type="text"
                      name="gstNumber"
                      placeholder="GST Number"
                      style={styles.input}
                      value={gstNumber}
                      onChange={handleGstNumberChange}
                      required
                    />
                    {gstError && <p style={styles.error}>{gstError}</p>}
                  </div>
                )}
                <div style={styles.fieldStyle}>
                  <span>Address*:</span>
                  <input type="text" name="address" placeholder="Address" style={styles.input} required onChange={handleInputChange} />
                </div>
                <div style={styles.fieldStyle}>
                  <span>Phone Number*:</span>
                  <input type="text" name="phoneNumber" placeholder="Phone Number" style={styles.input} required onChange={handleInputChange} />
                </div>
                <div style={styles.fieldStyle}>
                  <span>Email:</span>
                  <input type="text" name="email" placeholder="Email" style={styles.input} onChange={handleInputChange} />
                </div>
              </div>
              <button style={styles.buttonStyle} onClick={handleRegisterVender}>Register</button>
            </div>
          );
        default:
          return null;
      }
    };

  return (
    <Layout>
      <h1>Master Page</h1>
      <hr />
      <p>Welcome to the Purchase Master Registration!</p>

      {/* Purchase Field with Dropdown */}
      <div style={styles.purchaseField}>
        <label htmlFor="purchase" style={styles.label}>Purchase:</label>
        <select
          id="purchase"
          name="purchase"
          style={styles.dropdown}
          onChange={handleOptionChange}
          value={selectedOption}
        >
          <option value="">Select an option</option>
          <option value="Cash">Cash</option>
          <option value="Farmer">Farmer</option>
          <option value="Vendor">Vendor</option>
        </select>
      </div>

      {/* Render the form based on the selected option */}
      {renderForm()}
      
    </Layout>
  );
};

const styles = {
  purchaseField: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    marginRight: '10px',
    fontSize: '16px',
  },
  dropdown: {
    padding: '5px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  form: {
    marginTop: '20px',
  },
  twoColumnLayout: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px', // Space between columns
  },
  fieldStyle: {
    flex: '1 1 calc(50% - 10px)', // Two columns with spacing
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginLeft: '10px',
    flex: 1,
  },
  buttonStyle:{
    color:'black',
    // fontWeight:'600',
    fontSize:'16px',
    margin:' 3% 50%',
    background: 'aqua',
    border: 'black 3px solid'
  },
  error: {
    color: 'red',
    fontSize: '12px',
    marginLeft: '10px',
  },
};

export default Purchase;