import React, { useState } from "react";

const PurchaseStockBAGFarmer = ({ farmerFormId }) => {
  const [rows, setRows] = useState([
    { id: 1, particular: "", quantity: "", ratePaid: "", gst: "", amountPaid: "", pricePerKg: "", weight: "" },
  ]);
  
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    // Recalculate ratePaid if pricePerKg or quantity changes
    if (field === "pricePerKg" || field === "quantity") {
      const quantity = parseFloat(updatedRows[index].quantity) || 0;
      const pricePerKg = parseFloat(updatedRows[index].pricePerKg) || 0;
      updatedRows[index].ratePaid = (quantity * 10 * pricePerKg).toFixed(2);
    }

    // Auto-fill weight when quantity changes
    if (field === "quantity") {
      const quantity = parseFloat(value) || 0;
      updatedRows[index].weight = (quantity * 10).toFixed(2); // weight = quantity * 10
    }

    setRows(updatedRows);
  };

  const isSaveButtonDisabled = (row) => {
    return !row.particular && !row.quantity && !row.ratePaid && !row.gst && !row.amountPaid;
  };

  const handleSave = async (row, index) => {
    if (!row.particular && !row.quantity && !row.ratePaid && !row.gst && !row.amountPaid) {
      return;
    }

    const { totalCost, amountLeft, status } = calculateValues(row);

    const payload = {
      farmerFormId: farmerFormId,
      farmerName: "", // Not taking a post value
      particular: "Tauli",
      product:"Tauli",
      hsn: "080290", // Hardcoded as per your requirement
      quantity: row.quantity || 0,
      rate: row.ratePaid || 0,
      pricePerKgBag: row.pricePerKg || 0,
      amount: totalCost,
      amountPaid: row.amountPaid || 0,
      amountLeft,
      status,
      weight: row.weight || 0, // Include weight in the payload
    };

    console.log("Payload:", payload);
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/farmer-stock", {
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
          particular: "",
          quantity: "",
          ratePaid: "",
          gst: "",
          amountPaid: "",
          pricePerKg: "",
          weight: "", // Add weight to the new row
        },
      ]);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const calculateValues = (row) => {
    const quantity = parseFloat(row.quantity) || 0;
    const ratePaid = parseFloat(row.ratePaid) || 0;
    const gst = parseFloat(row.gst) || 0;
    const amountPaid = parseFloat(row.amountPaid) || 0;

    const totalCost = ratePaid + (ratePaid * gst) / 100;
    const amountLeft = totalCost - amountPaid;
    
    let status = "Partial Paid";
    if (amountLeft === 0) status = "Paid";
    else if (amountLeft === totalCost) status = "Unpaid";
    
    return { totalCost, amountLeft, status };
  };

  return (
    <div style={styles.container}>
      <h2>Purchase Stock (BAG)</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>S. No.</th>
            <th>Particular</th>
            <th>HSN</th>
            <th>Quantity (Bag)</th>
            <th>Weight (kg)</th> {/* New column for weight */}
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
            const { totalCost, amountLeft, status } = calculateValues(row);
            return (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>Tauli</td>
                <td>080290</td>
                <td><input type="number" value={row.quantity} name="quantity" onChange={(e) => handleInputChange(index, "quantity", e.target.value)} /></td>
                <td>{row.weight}</td> {/* Display weight (auto-filled) */}
                <td>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: "10px", fontSize: "16px" }}>₹</span>
                  <input type="number" value={row.pricePerKg} name="pricePerKg"  style={{ paddingLeft: "25px", width: "100px" }} onChange={(e) => handleInputChange(index, "pricePerKg", e.target.value)} />
                  </div>
                </td>
                <td>₹{row.ratePaid}</td>
                <td><input type="number" value={row.gst} name="gst" onChange={(e) => handleInputChange(index, "gst", e.target.value)} /></td>
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
    addStockbtn:{
        borderRadius: '8px',
        marginTop: '25px',
        border:' 2px solid blue',
        padding:' 0.6em 1.2em',
        fontSize: '1em',
        cursor: 'pointer',
        transition: 'border-color 0.25s',
    },
    td: {
      padding: "10px",
      border: "1px solid #ddd",
    }
  };

export default PurchaseStockBAGFarmer;