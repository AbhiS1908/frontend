import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useLocation } from "react-router-dom";

// Added 
const fixedMakhanaTypes = ["6 Sutta", "5 Sutta", "4 Sutta", "3 Sutta", "Other", "Waste"];
const standardRates = { "6 Sutta": 1420, "5 Sutta": 1220, "4 Sutta": 930, "3 Sutta": 380, "Other": 1500, "Waste": 0 };


export default function SegregationTableVendor() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const vendorStockId = params.get("vendorFormId");// Extract vendorStockId from URL
    const stockDataString = params.get("stockData"); // Extract stockData from URL
    const [weight, setWeight] = useState("");
    const [editing, setEditing] = useState(null);

    // Decode and parse stockData
    let stockData = null;
    let totalBagWeight = 0;
    let getTotalValue = 0;
    if (stockDataString) {
        try {
            stockData = JSON.parse(decodeURIComponent(stockDataString));
            totalBagWeight = stockData.totalBagWeight || 0;
            getTotalValue = stockData.totalValue || 0;
            console.log("Extracted totalBagWeight Data:", totalBagWeight);
            console.log("Extracted totalBagWeight Data:", stockData);
        } catch (error) {
            console.error("Error parsing stockData:", error);
        }
    }
    
    // State for rows and pricePerKgBag
    // ** Initial State with Empty Data **
    const [rows, setRows] = useState(
        fixedMakhanaTypes.map(type => ({
            percentage: "",
            makhana: type,
            totalWeight: "",
            finalPrice: "",
            ratePerKg: standardRates[type],
            transportationCharge: "",
            totalPriceFinal: "",
            totalPriceStandard: "",
            isNew: true
        }))
    );
const fetchCashStockData = async () => {
        try {
            const response = await fetch(`https://ane-production.up.railway.app/api/v1/auth/vendor-stock-one/${vendorStockId}`);
            const data = await response.json();
            
            setWeight(data)
        } catch (error) {
            console.error("Error fetching cash stock data:", error);
        }
    };
    useEffect(() => {
            fetchCashStockData();
        }, []);
    // Fetch saved data from API
    // Fetch saved data from API
    const fetchSavedData = async () => {
        if (!vendorStockId) return;  // Prevent API call if no ID

        try {
            const response = await fetch(`https://ane-production.up.railway.app/api/v1/auth/vendor-segregate/${vendorStockId}`);
            if (!response.ok) throw new Error("Failed to fetch data");

            const savedData = await response.json();

            const updatedRows = fixedMakhanaTypes.map(type => {
                const existingRow = savedData.find(row => row.makhana === type);
                return existingRow
                    ? { ...existingRow, isNew: false }
                    : {
                          percentage: "",
                          makhana: type,
                          totalWeight: "",
                          finalPrice: "",
                          ratePerKg: standardRates[type],
                          transportationCharge: "",
                          totalPriceFinal: "",
                          totalPriceStandard: "",
                          isNew: true
                      };
            });

            setRows(updatedRows);
        } catch (error) {
            console.error("Error fetching saved data:", error);
        }
    };

    useEffect(() => {
        fetchSavedData();
    }, [vendorStockId]); 

    // Handle input changes updated
    const handleChange = (index, field, value) => {
        setRows(prevRows => {
            let newRows = prevRows.map((row, i) =>
                i === index ? { ...row, [field]: value } : row
            );

            const totalWeightSum = newRows.reduce((sum, row) => sum + (parseFloat(row.totalWeight) || 0), 0);
            if (totalWeightSum > totalBagWeight) {
                alert("Total weight cannot exceed totalBagWeight!");
                return prevRows;
            }

            newRows = newRows.map(row => ({
                ...row,
                totalPriceFinal: (parseFloat(row.totalWeight) || 0) * (parseFloat(row.finalPrice) || 0) +
                                (parseFloat(row.transportationCharge) || 0),
                totalPriceStandard: (parseFloat(row.totalWeight) || 0) * row.ratePerKg,
                percentage: totalBagWeight > 0 ? ((parseFloat(row.totalWeight) || 0) / totalBagWeight * 100).toFixed(2) : 0
            }));

            return newRows;
        });
    };



    // Save data and refresh table
    const handleSave = async (index) => {
        const rowData = rows[index];
        if (!rowData.percentage || !rowData.totalWeight || !rowData.finalPrice) {
            alert("Please fill all required fields.");
            return;
        }

        const payload = { vendorStockId, ...rowData };

        try {
            await fetch("https://ane-production.up.railway.app/api/v1/auth/vendor-segregate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            fetchSavedData(); // Fetch new data only after saving
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    // Enable editing for a specific row
    const handleEdit = (index) => {
        setEditing(index);
    };

    // Update data and refresh table
    const handleUpdate = async (index) => {
        const rowData = rows[index];
        if (!rowData.percentage || !rowData.totalWeight || !rowData.finalPrice) {
            alert("Please fill all required fields.");
            return;
        }

        const payload = { vendorStockId, ...rowData };

        try {
            await fetch(`https://ane-production.up.railway.app/api/v1/auth/vendor-segregate/${rowData._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            setEditing(null); // Disable editing mode
            fetchSavedData(); // Fetch new data only after updating
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    // Delete a row
    const handleDelete = async (index) => {
        const rowData = rows[index];
        if (!rowData._id) {
            alert("Cannot delete unsaved row.");
            return;
        }

        try {
            await fetch(`https://ane-production.up.railway.app/api/v1/auth/vendor-segregate/${rowData._id}`, {
                method: "DELETE",
            });
            fetchSavedData(); // Refresh the table after deletion
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const [summary, setSummary] = useState({
        finalTotalWeight: 0,
        totalFinalPrice: 0,
        finalTotalPriceStandard: 0,
        finalTotalPriceFinal: 0,
        profit: 0
    });

    const handleGetSummary = async () => {
        try {
            // Step 1: Call the GET API to fetch data
            const response = await fetch(`https://ane-production.up.railway.app/api/v1/auth/vendor-stock-one/${vendorStockId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch summary data");
            }
            const data = await response.json();
    
            const finalTotalPriceFinal = data.finalTotalPriceFinal || 0;
            const transportationCost = data.transportationCost || 0;
            const calculatedProfit = finalTotalPriceFinal - getTotalValue - transportationCost;
    
            // Update the state with fetched values
            setSummary({
                finalTotalWeight: data.finalTotalWeight || 0,
                totalFinalPrice: data.totalFinalPrice || 0,
                finalTotalPriceStandard: data.finalTotalPriceStandard || 0,
                finalTotalPriceFinal: data.finalTotalPriceFinal || 0,
                transportationCost: data.transportationCost || 0,
                profit: calculatedProfit
            });
    
            // Step 2: Call the PUT API to update the profit field
            const updateResponse = await fetch(`https://ane-production.up.railway.app/api/v1/auth/vendor-stock/${vendorStockId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ profit: calculatedProfit }),
            });
    
            if (!updateResponse.ok) {
                throw new Error("Failed to update profit");
            }
    
            console.log("Profit updated successfully");
        } catch (error) {
            console.error("Error in process:", error);
        }
    };

    return (
        <Layout>
            <div>
                <h2>Segregation Vendor Details</h2>
                <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                        <th>S. No.</th>
                            <th>Percentage</th>
                            <th>Types of Makhana</th>
                            <th>Total Weight</th>
                            <th>Standard Rate</th>
                            <th>Final Value</th>
                            <th>Total St. Price</th> {/* Added Total St. Price Column */}
                            <th>Total Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.percentage}
                                        disabled={!row.isNew && editing !== index}
                                        onChange={(e) => handleChange(index, "percentage", e.target.value)}
                                    />
                                </td>
                                <td>  {row.makhana === 'Other' ? 'Hand Picked' : row.makhana}
                                </td> {/* Fixed Makhana Type */}
                                <td>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <input
                                        type="number"
                                        value={row.totalWeight}
                                        disabled={!row.isNew && editing !== index}
                                        onChange={(e) => handleChange(index, "totalWeight", e.target.value)}
                                        style={{ width: "80px", marginRight: "5px" }} // Adjust width and spacing
                                        />
                                        <span>kg</span>
                                    </div>
                                </td>
                                <td>₹{row.ratePerKg}</td> {/* Standard Rate Column */}
                                <td>
                                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                        <span style={{ position: "absolute", left: "10px", fontSize: "16px" }}>₹</span>
                                        <input
                                            type="number"
                                            style={{ paddingLeft: "25px", width: "100px" }}
                                            value={row.finalPrice}
                                            disabled={!row.isNew && editing !== index}
                                            onChange={(e) => handleChange(index, "finalPrice", e.target.value)}
                                        />
                                    </div>
                                </td>
                                <td>₹{row.totalPriceStandard}</td> {/* Added Total St. Price Column */}
                                <td>₹{row.totalPriceFinal}</td>
                                <td>
                                    {row.isNew ? (
                                        <button onClick={() => handleSave(index)}>Save</button>
                                    ) : (
                                       <>
                                            {editing === index ? (
                                                <button onClick={() => handleUpdate(index)}>Update</button>
                                            ) : (
                                                <button onClick={() => handleEdit(index)}>Edit</button>
                                            )}
                                            <button onClick={() => handleDelete(index)}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <h3>Summary</h3>
                    <p>Bag Weight: {weight.weight}kg</p>
                    <p>Total Bag Weight: {weight.totalBagWeight}kg</p>
                    <p>Final Total Weight: {summary.finalTotalWeight}kg</p>
                    <p>Total Final Price: ₹{summary.totalFinalPrice}</p>
                    <p>Final Total Standard Price:₹{summary.finalTotalPriceStandard}</p>
                    <p>Final Total Price:₹{summary.finalTotalPriceFinal}</p>
                    <p>Transportation Cost: ₹{summary.transportationCost}</p>
                    <p style={{ color: summary.profit > 0 ? "green" : "red" }}>Profit: ₹{summary.profit.toFixed(2)}</p>
                    <button onClick={handleGetSummary}>Get Summary</button>
                </div>
            </div>
        </Layout>
    );
}
