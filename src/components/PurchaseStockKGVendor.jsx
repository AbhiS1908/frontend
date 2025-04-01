import React, { useState } from "react";

const PurchaseStockKGVendor = ({vendorFormId}) => {
  const [rows, setRows] = useState([
    { id: 1, product: "", particular: "", quantity: "", pricePerKg: "", gst: "", amountPaid: "" },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const isSaveButtonDisabled = (row) => {
    return !row.product || !row.particular && !row.quantity && !row.pricePerKg && !row.gst && !row.amountPaid;
  };
  const handleSave = async (row, index) => {
    if (isSaveButtonDisabled(row)) {
      return;
    }

    const { totalCost, pricePerKg, amountLeft, status } = calculateValues(row);

    const payload = {
      vendorFormId: vendorFormId,
      vendorName: "", // Not taking a post value
      hsn: "080290", // Hardcoded as per your requirement
      quantity: row.quantity || 0,
      product: row.product,
      rate: row.pricePerKg || 0,
      pricePerKgBag: pricePerKg,
      amount: totalCost,
      amountPaid: row.amountPaid || 0,
      amountLeft,
      status,
    };

    console.log("Payload:", payload);
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/vendor-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      const result = await response.json();
      console.log("Data saved successfully:", result);

      // Add a new row after saving
      setRows((prevRows) => [
        ...prevRows,
        {
          id: prevRows.length + 1,
          product: "",
          particular: "",
          quantity: "",
          pricePerKg: "",
          gst: "",
          amountPaid: "",
        },
      ]);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const calculateValues = (row) => {
    const quantity = parseFloat(row.quantity) || 0;
    const pricePerKg = parseFloat(row.pricePerKg) || 0;
    const gst = parseFloat(row.gst) || 0;
    const amountPaid = parseFloat(row.amountPaid) || 0;

    const ratePaid = quantity * pricePerKg;
    const totalCost = ratePaid + (ratePaid * gst) / 100;
    const amountLeft = totalCost - amountPaid;
    
    let status = "Partial Paid";
    if (amountLeft === 0) status = "Paid";
    else if (amountLeft === totalCost) status = "Unpaid";
    
    return { ratePaid, totalCost, amountLeft, status, pricePerKg };
  };

  return (
    <div style={styles.container}>
      <h2>Purchase Stock (KG)</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>S. No.</th>
            <th>Product</th>
            <th>HSN</th>
            <th>Quantity (kg)</th>
            <th>Price/kg</th>
            <th>Rate Paid</th>
            <th>GST%</th>
            <th>Total Cost</th>
            <th>Amount Paid</th>
            <th>Amount Left</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const { ratePaid, totalCost, amountLeft, status } = calculateValues(row);
            return (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>
                  <select value={row.product} onChange={(e) => handleInputChange(index, "product", e.target.value)}>
                    <option value="">Select Product</option>
                    <option value="6 Suta">6 Suta</option>
                    <option value="5 Suta">5 Suta</option>
                    <option value="4 Suta">4 Suta</option>
                    <option value="3 Suta">3 Suta</option>
                    <option value="Others">Hand Picked</option>
                    <option value="Waste">Waste</option>
                  </select>
                </td>
                <td>080290</td>
                <td><input name="quantity" type="number" value={row.quantity} onChange={(e) => handleInputChange(index, "quantity", e.target.value)} /></td>
                <td>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: "10px", fontSize: "16px" }}>₹</span>
                  <input type="number" value={row.pricePerKg} name="pricePerKg"  style={{ paddingLeft: "25px", width: "100px" }} onChange={(e) => handleInputChange(index, "pricePerKg", e.target.value)} />
                  </div>
                </td>
                <td>₹{ratePaid.toFixed(2)}</td>
                <td><input name="gst" type="number" value={row.gst} onChange={(e) => handleInputChange(index, "gst", e.target.value)} /></td>
                <td>₹{totalCost.toFixed(2)}</td>
                <td>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: "10px", fontSize: "16px" }}>₹</span>
                    <input type="number" style={{ paddingLeft: "25px", width: "100px" }} value={row.amountPaid} name="amountPaid" onChange={(e) => handleInputChange(index, "amountPaid", e.target.value)} />
                  </div>
                 </td>
                <td>₹{amountLeft.toFixed(2)}</td>
                <td>{status}</td>
                <td><button
                    style={styles.button}
                    onClick={() => handleSave(row, index)}
                    disabled={isSaveButtonDisabled(row)}
                  >
                    Save
                  </button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
    container: {
      padding: "10px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      textAlign: "left",
    },
    addStockbtn:{
        borderRadius: '8px',
        marginTop: '25px',
        border:' 2px solid blue',
        padding:' 0.6em 1.2em',
        fontSize: '1em',
        cursor: 'pointer',
        transition: 'border-color 0.25s',
    },
    input: {
      width: "100%",
      padding: "5px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    button: {
      padding: "6px 12px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      cursor: "pointer",
      borderRadius: "4px",
    },
    th: {
      backgroundColor: "#f2f2f2",
      padding: "10px",
      border: "1px solid #ddd",
    },
    td: {
      padding: "10px",
      border: "1px solid #ddd",
    }
  };

export default PurchaseStockKGVendor;

