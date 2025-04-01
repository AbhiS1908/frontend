import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useLocation } from "react-router-dom";

export default function DetailLogPerBag() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const cashStockId = params.get("cashFormId");

    // Parse stockDataString synchronously
    const stockDataString = params.get("stockData");
    let quantity = 0;
    if (stockDataString) {
        try {
            const stockData = JSON.parse(decodeURIComponent(stockDataString));
            quantity = parseInt(stockData.quantity);
        } catch (error) {
            console.error("Error parsing stockData:", error);
        }
    }

    const [rows, setRows] = useState([]);
    const [pricePerKgBag, setPricePerKgBag] = useState("");
    const [weight, setWeight] = useState("");
    const [summary, setSummary] = useState({
        totalBagWeight: "",
        totalPurchaseRate: "",
        totalValue: "",
        actualValue: "",
        valueDiff: ""
    });
    const [editingRow, setEditingRow] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    const fetchCashStockData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/auth/cash-stock-one/${cashStockId}`);
            const data = await response.json();
            if (data && data.pricePerKgBag) {
                setPricePerKgBag(data.pricePerKgBag);
            }
            setWeight(data.weight);
        } catch (error) {
            console.error("Error fetching cash stock data:", error);
        } finally {
            setIsLoading(false); // Set loading to false after fetching
        }
    };

    const createEmptyRow = () => {
        return {
            name: "",
            purchaseDate: new Date().toISOString().split("T")[0],
            bagWeight: "",
            purchaseRate: pricePerKgBag || "",
            totalValue: "",
            actualValue: "",
            valueDiff: "",
            isNew: true
        };
    };

    const fetchSavedData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/auth/cash-single-stock/${cashStockId}`);
            const savedData = await response.json();

            if (savedData && Array.isArray(savedData)) {
                let newRows = savedData;
                while (newRows.length < quantity) {
                    newRows.push(createEmptyRow());
                }
                setRows(newRows.slice(0, quantity));
            } else {
                let emptyRows = [];
                for (let i = 0; i < quantity; i++) {
                    emptyRows.push(createEmptyRow());
                }
                setRows(emptyRows);
            }
        } catch (error) {
            console.error("Error fetching saved data:", error);
        }
    };

    const handleChange = (index, field, value) => {
        setRows((prevRows) =>
            prevRows.map((row, i) => {
                if (i === index) {
                    const updatedRow = { ...row, [field]: value };
                    const purchaseRate = parseFloat(updatedRow.purchaseRate) || 0;
                    const bagWeight = parseFloat(updatedRow.bagWeight) || 0;
                    updatedRow.totalValue = purchaseRate * 10;
                    updatedRow.actualValue = purchaseRate * bagWeight;
                    updatedRow.valueDiff = updatedRow.totalValue - updatedRow.actualValue;
                    return updatedRow;
                }
                return row;
            })
        );
    };

    const handleSave = async (index) => {
        const rowData = rows[index];

        if (!rowData.purchaseDate || !rowData.bagWeight || !rowData.purchaseRate) {
            alert("Please fill all required fields.");
            return;
        }

        const payload = {
            cashStockId,
            purchaseDate: rowData.purchaseDate,
            cashName: rowData.name,
            bagSrNo: index + 1,
            bagWeight: rowData.bagWeight.toString(),
            purchaseRate: rowData.purchaseRate.toString(),
            totalValue: rowData.totalValue,
            actualValue: rowData.actualValue,
            valueDiff: rowData.valueDiff
        };

        try {
            let response;
            if (rowData.isNew) {
                response = await fetch("http://localhost:8000/api/v1/auth/cash-single-stock", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                response = await fetch(`http://localhost:8000/api/v1/auth/cash-single-stock/${rowData._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            const result = await response.json();
            console.log("Saved successfully:", result);

            await fetchSavedData();
            setEditingRow(null);
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const handleDelete = async (index) => {
        const rowData = rows[index];

        if (!rowData._id) {
            alert("Cannot delete a new row.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/auth/cash-single-stock/${rowData._id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();
            console.log("Deleted successfully:", result);

            setRows((prevRows) => prevRows.filter((row, i) => i !== index));
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/auth/cash-stock/calculate-totals/${cashStockId}`);
            const data = await response.json();

            if (data.updatedCashStock) {
                setSummary({
                    totalBagWeight: data.updatedCashStock.totalBagWeight,
                    totalPurchaseRate: data.updatedCashStock.totalPurchaseRate,
                    totalValue: data.updatedCashStock.totalValue,
                    actualValue: data.updatedCashStock.actualValue,
                    valueDiff: data.updatedCashStock.valueDiff,
                });
            } else {
                console.error("Invalid response format:", data);
            }
        } catch (error) {
            console.error("Error fetching summary:", error);
        }
    };

    useEffect(() => {
        fetchCashStockData();
    }, []);

    useEffect(() => {
        if (pricePerKgBag && quantity > 0) {
            fetchSavedData();
        }
    }, [pricePerKgBag, quantity]);

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading indicator
    }

    return (
        <Layout>
            <div>
                <h2>Detail Log Per Bag</h2>
                <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th>S. No.</th>
                            <th>Name</th>
                            <th>purchaseDate</th>
                            <th>Bag Weight</th>
                            <th>Purchase Rate</th>
                            <th>Total Value</th>
                            <th>Actual Value</th>
                            <th>Diff. Value</th>
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
                                        value={row.cashName}
                                        onChange={(e) => handleChange(index, "cashName", e.target.value)}
                                        disabled={!row.isNew && editingRow !== index}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={row.purchaseDate}
                                        onChange={(e) => handleChange(index, "purchaseDate", e.target.value)}
                                        disabled={!row.isNew && editingRow !== index}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.bagWeight}
                                        onChange={(e) => handleChange(index, "bagWeight", e.target.value)}
                                        disabled={!row.isNew && editingRow !== index}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={parseFloat(row.purchaseRate).toFixed(2)}
                                        onChange={(e) => handleChange(index, "purchaseRate", e.target.value)}
                                        disabled={!row.isNew && editingRow !== index}
                                    />
                                </td>
                                <td>{row.totalValue ? row.totalValue.toFixed(2) : ""}</td>
                                <td>{row.actualValue ? row.actualValue.toFixed(2) : ""}</td>
                                <td style={{ color: row.valueDiff > 0 ? "red" : "green" }}>
                                    {row.valueDiff ? row.valueDiff.toFixed(2) : ""}
                                </td>
                                <td>
                                    {row.isNew ? (
                                        <button
                                            style={{
                                                padding: "5px 10px",
                                                fontSize: "14px",
                                                backgroundColor: "aqua",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => handleSave(index)}
                                        >
                                            Generate
                                        </button>
                                    ) : editingRow === index ? (
                                        <button
                                            style={{
                                                padding: "5px 10px",
                                                fontSize: "14px",
                                                backgroundColor: "green",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => handleSave(index)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                style={{
                                                    padding: "5px 10px",
                                                    fontSize: "14px",
                                                    backgroundColor: "orange",
                                                    cursor: "pointer",
                                                    marginRight: "5px"
                                                }}
                                                onClick={() => setEditingRow(index)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                style={{
                                                    padding: "5px 10px",
                                                    fontSize: "14px",
                                                    backgroundColor: "red",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => handleDelete(index)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", maxWidth: "100%" }}>
                    <p><strong>Actual Bag Weight:</strong> {summary.totalBagWeight}</p>
                    <p><strong>Total Purchase Rate:</strong> {summary.totalPurchaseRate}</p>
                    <p><strong>Total Bag Weight:</strong> {weight}</p>
                    <p><strong>Total Value:</strong> {summary.totalValue}</p>
                    <p><strong>Actual Value:</strong> {summary.actualValue}</p>
                    <p style={{ gridColumn: "span 2", color: summary.valueDiff > 0 ? "red" : "green" }}><strong>Diff. Value:</strong> {summary.valueDiff}</p>
                </div>
                <button onClick={fetchSummary} style={{ marginTop: "10px", background: 'aqua', border: '2px solid black' }}>Get Summary</button>
            </div>
        </Layout>
    );
}