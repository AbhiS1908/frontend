import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';

const BulkVendorTauli = () => {
    const [searchParams] = useSearchParams();
    const vendorStockId = searchParams.get('vendorFormId'); // Extract vendorFormId from URL

    const [formData, setFormData] = useState({
        vendorStockId: vendorStockId || '', // Pre-fill vendorStockId from URL
        makhana: '',
        quantity: 0,
        bagCount: 0,
        mixingDetails: [], // Start with an empty array for mixing details
    });
    const [records, setRecords] = useState([]);
    const [editRecordId, setEditRecordId] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    // Fetch all records on component mount or when vendorStockId changes
    useEffect(() => {
        if (vendorStockId) {
            fetchRecords();
        }
    }, [vendorStockId]); // Only re-run if vendorStockId changes

    // Fetch all records for the given vendorStockId
    const fetchRecords = async () => {
        setIsLoading(true); // Start loading
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/auth/vendor-makhana/vendorStock/${vendorStockId}`);
            setRecords(response.data.data);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle mixing details input changes
    const handleMixingDetailChange = (index, field, value) => {
        const newMixingDetails = [...formData.mixingDetails];
        newMixingDetails[index] = { ...newMixingDetails[index], [field]: value }; // Update specific field
        setFormData({ ...formData, mixingDetails: newMixingDetails });

        // Calculate and update the total quantity
        const totalQuantity = newMixingDetails.reduce((sum, detail) => sum + (parseFloat(detail.quantitySmall) || 0, 0));
        setFormData((prev) => ({ ...prev, quantity: totalQuantity }));
    };

    // Add a new row to the mixing table
    const addMixingRow = () => {
        setFormData((prev) => ({
            ...prev,
            mixingDetails: [
                ...prev.mixingDetails,
                { productInfo: '', ratePerKgSmall: 0, quantitySmall: 0 },
            ],
        }));
    };

    // Remove a row from the mixing table
    const removeMixingRow = (index) => {
        const newMixingDetails = formData.mixingDetails.filter((_, i) => i !== index);
        setFormData({ ...formData, mixingDetails: newMixingDetails });

        // Recalculate the total quantity
        const totalQuantity = newMixingDetails.reduce((sum, detail) => sum + (parseFloat(detail.quantitySmall) || 0, 0));
        setFormData((prev) => ({ ...prev, quantity: totalQuantity }));
    };

    // Handle form submission (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editRecordId) {
                // Update existing record
                await axios.put(`http://localhost:8000/api/v1/auth/vendor-makhana/${editRecordId}`, formData);
                setEditRecordId(null);
            } else {
                // Create new record
                await axios.post('http://localhost:8000/api/v1/auth/vendor-makhana/calculate', formData);
            }
            fetchRecords(); // Refresh the records
            setFormData({
                vendorStockId: vendorStockId || '', // Reset form with vendorStockId from URL
                makhana: '',
                quantity: 0,
                bagCount: 0,
                mixingDetails: [], // Reset mixingDetails to empty
            });
        } catch (error) {
            console.error('Error saving record:', error);
        }
    };

    // Handle edit button click
    const handleEdit = (record) => {
        setFormData(record);
        setEditRecordId(record._id);
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/v1/auth/vendor-makhana/${id}`);
            fetchRecords(); // Refresh the records
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    // Handle bag out button click
    const handleBagOut = async (makhanaId, makhanaType, packetCount) => {
        try {
            let response;
            if (makhanaType === 'Mixing') {
                // Call the bag-out API for Mixing
                response = await axios.put('http://localhost:8000/api/v1/auth/vendor-bag-out', {
                    makhanaId,
                    packetCount,
                });
            } else {
                // Call the bag-out-by-type API for other makhana types
                response = await axios.put('http://localhost:8000/api/v1/auth/vendor-bag-out-by-type', {
                    makhanaId,
                });
            }
            console.log('Bag Out successful:', response.data);
            fetchRecords(); // Refresh the records to reflect the updated weights
        } catch (error) {
            console.error('Error during bag out:', error);
        }
    };

    // Show loading state while fetching data
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div style={styles.container}>
            <h1 style={styles.heading}>Bulk vendor Tauli</h1>

            {/* Form for creating/updating records */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>vendorStock ID:</label>
                    <input
                        type="text"
                        name="vendorStockId"
                        value={formData.vendorStockId}
                        onChange={handleInputChange}
                        required
                        readOnly
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Makhana:</label>
                    <select
                        name="makhana"
                        value={formData.makhana}
                        onChange={handleInputChange}
                        required
                        style={styles.select}
                    >
                        <option value="">Select</option>
                        <option value="6 Sutta">6 Sutta</option>
                        <option value="5 Sutta">5 Sutta</option>
                        <option value="4 Sutta">4 Sutta</option>
                        <option value="3 Sutta">3 Sutta</option>
                        <option value="Others">Hand Picked</option>
                        <option value="Waste">Waste</option>
                        <option value="Mixing">Mixing</option>
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        style={styles.special_input}
                    />
                    <span style={{marginLeft:'10px'}}>kg</span>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Bag Count:</label>
                    <input
                        type="number"
                        name="bagCount"
                        value={formData.bagCount}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>

                {formData.makhana === 'Mixing' && (
                    <div style={styles.mixingSection}>
                        <button type="button" onClick={addMixingRow} style={styles.addButton}>
                            Add Row
                        </button>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.tableHeader}>Product Info</th>
                                    <th style={styles.tableHeader}>Rate Per Kg (Small)</th>
                                    <th style={styles.tableHeader}>Quantity (Small)</th>
                                    <th style={styles.tableHeader}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.mixingDetails.map((detail, index) => (
                                    <tr key={index} style={styles.tableRow}>
                                        <td>
                                            <select
                                                value={detail.productInfo}
                                                onChange={(e) =>
                                                    handleMixingDetailChange(index, 'productInfo', e.target.value)
                                                }
                                                style={styles.select}
                                            >
                                                <option value="">Select</option>
                                                <option value="6 Sutta">6 Sutta</option>
                                                <option value="5 Sutta">5 Sutta</option>
                                                <option value="4 Sutta">4 Sutta</option>
                                                <option value="3 Sutta">3 Sutta</option>
                                                <option value="Others">Hand Picked</option>
                                                <option value="Waste">Waste</option>
                                            </select>
                                        </td>
                                        <td>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{marginRight:'0.2rem'}}>₹</span>
                                            <input
                                                type="number"
                                                value={detail.ratePerKgSmall}
                                                readOnly
                                                style={styles.input}
                                            />
                                            </div>
                                        </td>
                                        <td>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <input
                                                type="number"
                                                value={detail.quantitySmall}
                                                onChange={(e) =>
                                                    handleMixingDetailChange(index, 'quantitySmall', e.target.value)
                                                }
                                                style={styles.input}
                                            /><span style={{marginLeft:'0.2rem'}}>kg</span>
                                            </div>
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => removeMixingRow(index)} style={styles.removeButton}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <button type="submit" style={styles.submitButton}>
                    {editRecordId ? 'Update Record' : 'Create Record'}
                </button>
            </form>

            {/* Table to display records */}
            <table style={styles.recordsTable}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>vendorStock ID</th>
                        <th style={styles.tableHeader}>Makhana</th>
                        <th style={styles.tableHeader}>Quantity</th>
                        <th style={styles.tableHeader}>Bag Count</th>
                        <th style={styles.tableHeader}>Total Cost</th>
                        <th style={styles.tableHeader}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => (
                        <tr key={record._id} style={styles.tableRow}>
                            <td style={styles.tableCell}>{record.vendorStockId}</td>
                            <td style={styles.tableCell}>{record.makhana === 'Others' ? 'Hand Picked' : record.makhana}</td>
                            <td style={styles.tableCell}>{record.quantity}kg</td>
                            <td style={styles.tableCell}>{record.bagCount}</td>
                            <td style={styles.tableCell}>₹{record.totalCost}</td>
                            <td style={styles.tableCell}>
                                <button onClick={() => handleEdit(record)} style={styles.actionButton}>Edit</button>
                                <button onClick={() => handleDelete(record._id)} style={styles.actionButton}>Delete</button>
                                <button onClick={() => handleBagOut(record._id, record.makhana, record.bagCount)} style={styles.actionButton}>
                                    Bag Out
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </Layout>
    );
};

// CSS Styles
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    form: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        width: '90%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px',
    },
    special_input: {
        width: '10%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px',
    },
    select: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px',
    },
    mixingSection: {
        marginTop: '20px',
    },
    addButton: {
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    removeButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    submitButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        width: '100%',
        marginTop: '10px',
    },
    recordsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    tableHeader: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '12px',
        textAlign: 'left',
    },
    tableRow: {
        borderBottom: '1px solid #ddd',
    },
    tableCell: {
        padding: '12px',
        textAlign: 'left',
    },
    actionButton: {
        backgroundColor: '#ffc107',
        color: '#000',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        marginRight: '5px',
    },
};

export default BulkVendorTauli;