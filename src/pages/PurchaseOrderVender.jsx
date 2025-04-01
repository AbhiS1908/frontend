import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

const PurchaseOrderVendor = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [companyAddressSelected, setCompanyAddressSelected] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [edod, setEdod] = useState('');
  const [stateName, setStateName] = useState('');
  const [transport, setTransport] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [ewayBillNumber, setEwayBillNumber] = useState('');
  const [gstinPurchase, setGstinPurchase] = useState('');
  const [remarks, setRemarks] = useState('');
  const [product, setProduct] = useState([]); // Change to array
  const [unit, setUnit] = useState('');
  const [transportationCost, setTransportationCost] = useState();
  const [adminCost, setAdminCost] = useState();
  const [stateCode, setStateCode] = useState('');

  useEffect(() => {
    const formatDate = (date) => {
      return date.toLocaleDateString('en-GB').replace(/\//g, '-');
    };

    const today = new Date();
    setCurrentDate(formatDate(today));
  }, []);

  const productOptions = [
      { value: 'Tauli', label: 'Tauli' },
      { value: '6 Suta', label: '6 Suta' },
      { value: '5 Suta', label: '5 Suta' },
      { value: '4 Suta', label: '4 Suta' },
      { value: '3 Suta', label: '3 Suta' },
      { value: 'Others', label: 'Hand Picked' },
      { value: 'Waste', label: 'Waste' },
    ];
  
    useEffect(() => {
      if (product.length === 0) {
        setUnit('');
      } else if (product.includes('Tauli')) {
        setUnit('bag');
      } else {
        setUnit('kg');
      }
    }, [product]);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setCompanyAddressSelected(selectedValue);
    setStateName(selectedValue.toUpperCase());
    setStateCode(getStateCode(selectedValue)); // Autofill state code based on company address
  };

  const handleDateChange = (event, field) => {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters

    if (value.length > 8) {
      value = value.slice(0, 8); // Limit input to 8 digits (DDMMYYYY)
    }

    // Format input dynamically
    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = value.slice(0, 2);
    }
    if (value.length > 2) {
      formattedValue += '-' + value.slice(2, 4);
    }
    if (value.length > 4) {
      formattedValue += '-' + value.slice(4, 8);
    }

    // Update the correct state based on the field
    if (field === 'edod') {
      setEdod(formattedValue);
    } else if (field === 'invoiceDate') {
      setInvoiceDate(formattedValue);
    }
  };

  const convertDateFormat = (date) => {
    if (!date) return null;
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
  };

  const handleSaveDetails = async () => {
    const vendorFormData = {
      vendorId: _id,
      companyName: 'Absolute Nuts Enterprises Pvt Ltd',
      companyAddress: companyAddressSelected,
      gstinSelf: '07AAZCA0953A1ZP',
      stateName,
      stateCode,
      email: 'info@absolutenuts.in',
      gstinPurchase,
      date: convertDateFormat(currentDate), // Convert to YYYY-MM-DD
      remarks,
      transport,
      vehicleNo: vehicleNumber,
      eDate: convertDateFormat(edod), // Convert to YYYY-MM-DD
      invoiceDate: convertDateFormat(invoiceDate), // Convert to YYYY-MM-DD
      eBill: ewayBillNumber,
      product: product.join(', '), // Join array into comma-separated string
      unitType: unit, // Added unitType field
      transportationCost,
      adminCost,
    };

    console.log('Sending Data:', vendorFormData); // Log the data being sent

    try {
      const response = await axios.post(`https://ane-production.up.railway.app/api/v1/auth/vendor-form`, vendorFormData);
      console.log('API Response:', response.data);
      const createdVendorFormId = response.data.vendorForm._id;
      navigate(`/master-list-vendor/`);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
    }
  };

  const getStateCode = (company) => {
    const codes = {
      Delhi: 'D',
      Uttrakhand: 'U',
      Bihar: 'B',
    };
    return codes[company] || '';
  };

  return (
    <Layout>
      <h1>Purchase Page</h1>
      <p>This is the Purchase Order page.</p>
      <hr></hr>
      <div style={styles.form}>
        <h3>Purchase Order Details</h3>

        <h2>Product Master</h2>
        <hr></hr>
        <div style={styles.twoColumnLayout}>
        <div style={styles.fieldStyle}>
    <label htmlFor="Product" style={styles.label}>
      Product:
    </label>
    <Select
      isMulti
      options={productOptions}
      value={product.map(p => ({ value: p, label: p }))}
      onChange={(selected) => {
        const selectedValues = selected ? selected.map(s => s.value) : [];
        if (selectedValues.includes('Tauli')) {
          setProduct(['Tauli']);
        } else {
          setProduct(selectedValues);
        }
      }}
      styles={{
        control: (provided) => ({
          ...provided,
          padding: '2px',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          minHeight: '40px',
        }),
      }}
      placeholder="Select Product"
      isOptionDisabled={(option) => 
        product.includes('Tauli') && option.value !== 'Tauli'
      }
    />
  </div>
          <div style={styles.fieldStyle}>
            <label htmlFor="Unit" style={styles.label}>
              Unit:
            </label>
            <select
              id="Unit"
              name="Unit"
              style={styles.input}
              onChange={(e) => setUnit(e.target.value)}
              value={unit}
              disabled
            >
              <option value="">Select Unit</option>
              <option value="kg">kg</option>
              <option value="bag">bag</option>
            </select>
          </div>
          <div style={styles.fieldStyle}>
            <label htmlFor="transportationCharges" style={styles.label}>
              Transportation Charges:
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span style={{ position: "absolute", left: "20px", fontSize: "16px" }}>₹</span>
              <input
                type="number"
                id="transportationCost"
                name="transportationCost"
                style={{ ...styles.input, paddingLeft: "25px" }} // Add padding to prevent overlap
                value={transportationCost}
                onChange={(e) => setTransportationCost(e.target.value)}
              />
            </div>
          </div>
          <div style={styles.fieldStyle}>
            <label htmlFor="adminCost" style={styles.label}>
              Admin Cost:
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span style={{ position: "absolute", left: "20px", fontSize: "16px" }}>₹</span>
              <input
                type="number"
                id="adminCost"
                name="adminCost"
                style={{ ...styles.input, paddingLeft: "25px" }}
                value={adminCost}
                onChange={(e) => setAdminCost(e.target.value)}
              />
            </div>
          </div>
        </div>

        <h2>Company Details</h2>
        <hr></hr>
        <div style={styles.twoColumnLayout}>
          <div style={styles.fieldStyle}>
            <span>Company Name*:</span>
            <span type="text" name="Company Name" placeholder="Name" style={styles.input} required>
              Absolute Nuts Enterprises Pvt Ltd
            </span>
          </div>
          <div style={styles.fieldStyle}>
            <label htmlFor="CompanyAddress" style={styles.label}>
              Company's Address:
            </label>
            <select
              id="CompanyAddress"
              name="CompanyAddress"
              style={styles.input}
              onChange={handleOptionChange}
              value={companyAddressSelected}
            >
              <option value="">Select Company's Address</option>
              <option value="Delhi">Delhi</option>
              <option value="Uttrakhand">Uttrakhand</option>
              <option value="Bihar">Bihar</option>
            </select>
          </div>
          <div style={styles.fieldStyle}>
            <span>GSTIN/UIN:</span>
            <span type="text" name="Company Name" placeholder="Name" style={styles.input} required>
              07AAZCA0953A1ZP
            </span>
          </div>
          <div style={styles.fieldStyle}>
            <span>State Name:</span>
            <span type="text" name="Company Name" placeholder="Name" style={styles.input} required>
              {stateName}
            </span>
          </div>
          <div style={styles.fieldStyle}>
            <span>State Code:</span>
            <span type="text" name="Company Name" placeholder="Name" style={styles.input} required>
              {stateCode}
            </span>
          </div>
          <div style={styles.fieldStyle}>
            <span>Email:</span>
            <span type="text" name="Company Name" placeholder="Name" style={styles.input} required>
              info@absolutenuts.in
            </span>
          </div>
        </div>

        <h2>Purchase Details - Vendor</h2>
        <hr></hr>
        <div style={styles.twoColumnLayout}>
          <div style={styles.fieldStyle}>
            <span>GSTIN/UIN*:</span>
            <input
              type="text"
              name="gst"
              placeholder="GSTIN/UIN"
              onChange={(e) => setGstinPurchase(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.fieldStyle}>
            <span>Date*:</span>
            <input type="text" name="Date" placeholder="Date" style={styles.input} value={currentDate} required />
          </div>
          <div style={styles.fieldStyle}>
            <span>Remarks*:</span>
            <input
              type="text"
              name="Remarks"
              placeholder="Remarks"
              style={styles.input}
              onChange={(e) => setRemarks(e.target.value)}
              required
            />
          </div>

          <div style={styles.fieldStyle}>
            <label htmlFor="Transport">Transport:</label>
            <select
              id="Transport"
              name="Transport"
              style={styles.input}
              onChange={(e) => setTransport(e.target.value)}
              value={transport}
            >
              <option value="">Select Transport</option>
              <option value="By Road">By Road</option>
              <option value="By Train">By Train</option>
              <option value="By Air">By Air</option>
            </select>
          </div>
          <div style={styles.fieldStyle}>
            <span>Vehicle Number:</span>
            <input
              type="text"
              name="VehicleNumber"
              placeholder="Vehicle Number"
              style={styles.input}
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
            />
          </div>
        </div>

        <h2>Effective Delivery Details</h2>
        <hr></hr>
        <div style={styles.twoColumnLayout}>
          <div style={styles.fieldStyle}>
            <span>EDOD*:</span>
            <input
              type="text"
              name="edod"
              placeholder="DD-MM-YYYY"
              style={styles.input}
              value={edod}
              onChange={(e) => handleDateChange(e, 'edod')}
              maxLength={10}
              required
            />
          </div>
          <div style={styles.fieldStyle}>
            <span>Invoice Date*:</span>
            <input
              type="text"
              name="invoiceDate"
              placeholder="DD-MM-YYYY"
              style={styles.input}
              value={invoiceDate}
              onChange={(e) => handleDateChange(e, 'invoiceDate')}
              maxLength={10}
              required
            />
          </div>
          <div style={styles.fieldStyle}>
            <span>EWAY Bill No.:</span>
            <input
              type="text"
              name="EWAYBillNumber"
              placeholder="EWAY Bill No."
              style={styles.input}
              value={ewayBillNumber}
              onChange={(e) => setEwayBillNumber(e.target.value)}
            />
          </div>
        </div>
        <hr />
        <button style={styles.buttonStyle} onClick={handleSaveDetails}>
          Save Details
        </button>
      </div>
    </Layout>
  );
};

const styles = {
  buttonStyle: {
    color: 'black',
    fontSize: '16px',
    margin: ' 3% 40%',
    background: 'aqua',
    border: 'black 3px solid',
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
    gap: '20px',
  },
  fieldStyle: {
    flex: '1 1 calc(50% - 10px)',
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
};

export default PurchaseOrderVendor;