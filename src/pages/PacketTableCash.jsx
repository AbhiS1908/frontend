import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaEdit, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import Layout from "../components/Layout";

const PacketTableCash = () => {
  const [stockDetails, setStockDetails] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showProductEntry, setShowProductEntry] = useState(null);
  const [productEntryData, setProductEntryData] = useState(
    Array.from({ length: 6 }, () => ({
      productInfo: "",
      ratePerKg: "",
      quantity: "",
    }))
  );
  const [productEntries, setProductEntries] = useState({});
  const [disabledRows, setDisabledRows] = useState({});
  const [disabledProductRows, setDisabledProductRows] = useState({});
  const [productInfoSequence, setProductInfoSequence] = useState([
    "6 sutta",
    "5 sutta",
    "4 sutta",
    "3 sutta",
    "others",
    "waste",
  ]);
  const [currentProductInfoIndex, setCurrentProductInfoIndex] = useState(0);

  // New state for product entry editing
  const [editProductEntryIndex, setEditProductEntryIndex] = useState(null);
  const [editProductEntryData, setEditProductEntryData] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const cashStockId = params.get("cashFormId");

  const [formData, setFormData] = useState({
    totalMaterialWeight: "",
    plasticWeight: "",
  });

  useEffect(() => {
    if (cashStockId) {
      fetchStockDetails();
    }

    const storedDisabledRows = localStorage.getItem("disabledRows");
    if (storedDisabledRows) {
      setDisabledRows(JSON.parse(storedDisabledRows));
    }
  }, [cashStockId]);

  const fetchStockDetails = async () => {
    try {
      const response = await axios.get(
        `https://ane-production.up.railway.app/api/v1/auth/StockDetailsbyid/${cashStockId}`
      );
      setStockDetails(response.data);
    } catch (error) {
      console.error("Error fetching stock details:", error);
    }
  };

  const fetchProductEntries = async (cashStockDetailsId) => {
    try {
      const response = await axios.get(
        `https://ane-production.up.railway.app/api/v1/auth/get-entry/${cashStockDetailsId}`
      );
      setProductEntries((prev) => ({
        ...prev,
        [cashStockDetailsId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching product entries:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        totalMaterialWeight: formData.totalMaterialWeight / 1000,
        plasticWeight: formData.plasticWeight / 1000,
        cashStockId,
      };
      await axios.post("https://ane-production.up.railway.app/api/v1/auth/createStockDetails", payload);
      fetchStockDetails();
      setFormData({
        totalMaterialWeight: "",
        plasticWeight: "",
      });
    } catch (error) {
      console.error("Error saving stock details:", error);
    }
  };

  const handleEdit = (index) => {
    const stock = stockDetails[index];
    const adminExpense = (stock.totalMaterialCost * 0.05).toFixed(2); // Calculate 15% of totalMaterialCost
    setEditIndex(index);
    setEditData({
      ...stock,
      totalMaterialWeight: stock.totalMaterialWeight * 1000,
      plasticWeight: stock.plasticWeight * 1000,
      adminExpense: adminExpense, // Auto-fill adminExpense
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...editData,
        totalMaterialWeight: editData.totalMaterialWeight / 1000,
        plasticWeight: editData.plasticWeight / 1000,
      };
      await axios.put(
        `https://ane-production.up.railway.app/api/v1/auth/updateStockDetails/${editData._id}`,
        payload
      );
      fetchStockDetails();
      setEditIndex(null);
      setEditData(null);
    } catch (error) {
      console.error("Error updating stock details:", error);
    }
  };

  const handleProductEntryChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProductEntryData = [...productEntryData];
    updatedProductEntryData[index] = {
      ...updatedProductEntryData[index],
      [e.target.name]: e.target.value,
    };
    setProductEntryData(updatedProductEntryData);
  };

  const handleProductEntrySave = async (cashStockDetailsId, index) => {
    try {
      const payload = {
        ...productEntryData[index],
        quantity: productEntryData[index].quantity / 1000,
        cashStockDetailsId,
      };

      await axios.post("https://ane-production.up.railway.app/api/v1/auth/add-entry", payload);

      // Fetch updated product entries
      fetchProductEntries(cashStockDetailsId);

      // Disable the saved row
      setDisabledProductRows((prev) => ({
        ...prev,
        [`${cashStockDetailsId}-${index}`]: true,
      }));

      // Reset the specific row's data
      const updatedProductEntryData = [...productEntryData];
      updatedProductEntryData[index] = {
        productInfo: productInfoSequence[(currentProductInfoIndex + index) % productInfoSequence.length],
        ratePerKg: "",
        quantity: "",
      };
      setProductEntryData(updatedProductEntryData);
    } catch (error) {
      console.error("Error saving product entry:", error);
    }
  };

  const handleProductEntryEdit = (entry, index) => {
    setEditProductEntryIndex(index);
    setEditProductEntryData({
      ...entry,
      quantity: entry.quantity * 1000, // Convert back to grams for editing
    });
  };

  const handleProductEntryUpdate = async (cashStockDetailsId, entryId) => {
    try {
      const payload = {
        ...editProductEntryData,
        quantity: editProductEntryData.quantity / 1000, // Convert back to kilograms for saving
      };

      await axios.put(
        `https://ane-production.up.railway.app/api/v1/auth/product-entry/${entryId}`,
        payload
      );

      // Fetch updated product entries
      fetchProductEntries(cashStockDetailsId);

      // Reset edit mode
      setEditProductEntryIndex(null);
      setEditProductEntryData(null);
    } catch (error) {
      console.error("Error updating product entry:", error);
    }
  };

  const handleStockOut = async (id) => {
    try {
      const response = await axios.post(
        `https://ane-production.up.railway.app/api/v1/auth/packetsOut/${id}`
      );
      if (response.status === 200) {
        alert("Stock out successful!");

        const updatedDisabledRows = { ...disabledRows, [id]: true };
        setDisabledRows(updatedDisabledRows);
        localStorage.setItem("disabledRows", JSON.stringify(updatedDisabledRows));

        fetchStockDetails();
      }
    } catch (error) {
      console.error("Error during stock out:", error);
      alert("Failed to stock out. Please try again.");
    }
  };

  const handleCalculation = async (cashStockDetailsId) => {
    try {
      const response = await axios.post(
        `https://ane-production.up.railway.app/api/v1/auth/calculate/${cashStockDetailsId}`
      );
      if (response.status === 200) {
        alert("Calculated successful!");
      }
    } catch (error) {
      console.error("Error during calculation:", error);
      alert("Failed to calculate. Please try again.");
    }
  };

  const handleAddProductClick = (index, cashStockDetailsId) => {
    setShowProductEntry(showProductEntry === index ? null : index);
    fetchProductEntries(cashStockDetailsId);

    // Auto-fill productInfo for all 6 rows
    const updatedProductEntryData = productEntryData.map((_, idx) => ({
      productInfo: productInfoSequence[(currentProductInfoIndex + idx) % productInfoSequence.length],
      ratePerKg: "", // This will be fetched from the backend
      quantity: "",
    }));
    setProductEntryData(updatedProductEntryData);
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Cash Stock Details</h2>

        {/* Simplified Input Form */}
        <div className="mb-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Total Material Weight</th>
                <th>Plastic Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    className="form-control"
                    name="totalMaterialWeight"
                    value={formData.totalMaterialWeight}
                    onChange={handleChange}
                    style={{ width: "100px", marginRight: "5px" }}
                  />
                  <span>gm</span>
                  </div>
                  
                </td>
                <td>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    className="form-control"
                    name="plasticWeight"
                    value={formData.plasticWeight}
                    onChange={handleChange}
                    style={{ width: "100px", marginRight: "5px" }}
                  />
                   <span>gm</span>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="btn btn-success" onClick={handleSave}>
          Save
        </button>

        {/* Displaying Stock Details */}
        {stockDetails.length > 0 && (
          <>
            <h4 className="mt-4">Saved Stock Details</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Material Cost</th>
                  <th>Rapper Cost</th>
                  <th>Labour Cost</th>
                  <th>Admin Expense</th>
                  <th>Final Cost</th>
                  <th>Total Material Weight</th>
                  <th>Plastic Weight</th>
                  <th>Packet Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stockDetails.map((stock, index) => (
                  <React.Fragment key={index}>
                    <tr className={disabledRows[stock._id] ? "disabled-row" : ""}>
                      {editIndex === index ? (
                        <>
                          <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                          <span>₹</span>
                            <input
                              type="text"
                              className="form-control"
                              name="totalMaterialCost"
                              value={editData.totalMaterialCost}
                              onChange={handleEditChange}
                              style={{ marginLeft: "5px", width: "100px" }}
                            />
                            </div>
                          </td>
                          <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                          <span>₹</span>
                            <input
                              type="text"
                              className="form-control"
                              name="rapperCost"
                              value={editData.rapperCost}
                              onChange={handleEditChange}
                              style={{ marginLeft: "5px", width: "100px" }}
                            />
                            </div>
                          </td>
                          <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                          <span>₹</span>
                            <input
                              type="text"
                              className="form-control"
                              name="labourCost"
                              value={editData.labourCost}
                              onChange={handleEditChange}
                              style={{ marginLeft: "5px", width: "100px" }}
                              />
                              </div>
                          </td>
                          <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                          <span>₹</span>
                            <input
                              type="text"
                              className="form-control"
                              name="adminExpense"
                              value={editData.adminExpense}
                              onChange={handleEditChange}
                              readOnly // Make it read-only
                              style={{ marginLeft: "5px", width: "100px" }}
                              />
                              </div>
                          </td>
                          <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                          <span>₹</span>
                            <input
                              type="text"
                              className="form-control"
                              name="finalCost"
                              value={editData.finalCost?.toFixed(2) || ""}
                              onChange={handleEditChange}
                              readOnly // Make it read-only
                              style={{ marginLeft: "5px", width: "100px" }}
                              />
                              </div>
                          </td>
                          <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                          <span>₹</span>
                            <input
                              type="text"
                              className="form-control"
                              name="totalMaterialWeight"
                              value={editData.totalMaterialWeight}
                              onChange={handleEditChange}
                              style={{ marginLeft: "5px", width: "100px" }}
                              />
                              </div>
                          </td>
                          <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                          <span>₹</span>
                            <input
                              type="text"
                              className="form-control"
                              name="plasticWeight"
                              value={editData.plasticWeight}
                              onChange={handleEditChange}
                              style={{ marginLeft: "5px", width: "100px" }}
                              />
                              </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="packetCount"
                              value={editData.packetCount}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={handleUpdate}
                            >
                              <FaSave /> Save
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setEditIndex(null)}
                            >
                              <FaTimes /> Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>₹{stock.totalMaterialCost || "-"}</td>
                          <td>₹{stock.rapperCost || "-"}</td>
                          <td>₹{stock.labourCost || "-"}</td>
                          <td>₹{stock.adminExpense || "-"}</td>
                          <td>₹{stock.finalCost ? stock.finalCost.toFixed(2) : "-"}</td>
                          <td>{stock.totalMaterialWeight * 1000 || "-"}gm</td>
                          <td>{stock.plasticWeight * 1000 || "-"}gm</td>
                          <td>{stock.packetCount !== null ? stock.packetCount : "-"}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => handleEdit(index)}
                              disabled={disabledRows[stock._id]}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              className="btn btn-info btn-sm me-2"
                              onClick={() => handleAddProductClick(index, stock._id)}
                              disabled={disabledRows[stock._id]}
                            >
                              <FaPlus /> Add Product
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleStockOut(stock._id)}
                              disabled={disabledRows[stock._id]}
                            >
                              Stock Out
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                    {showProductEntry === index && !disabledRows[stock._id] && (
                      <tr>
                        <td colSpan="8">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Product Info</th>
                                <th>Rate per Kg</th>
                                <th>Quantity</th>
                                <th>Total Cost</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {productEntryData.map((entry, idx) => (
                                <tr
                                  key={idx}
                                  className={
                                    disabledProductRows[`${stock._id}-${idx}`] ? "disabled-row" : ""
                                  }
                                >
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="productInfo"
                                      value=  {entry.productInfo === 'others' ? 'Hand Picked' : entry.productInfo}
                                      onChange={(e) => handleProductEntryChange(e, idx)}
                                      readOnly
                                    />
                                  </td>
                                  <td>
                                  <div style={{ display: "flex", alignItems: "center" }}>
                                  <span>₹</span>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="ratePerKg"
                                      value={entry.ratePerKg}
                                      onChange={(e) => handleProductEntryChange(e, idx)}
                                      readOnly // Disable ratePerKg field
                                      style={{ marginLeft: "5px", width: "100px" }} // Adjust spacing and width
                                      />
                                    </div>
                                  </td>
                                  <td>
                                  <div style={{ display: "flex", alignItems: "center" }}>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="quantity"
                                      value={entry.quantity}
                                      onChange={(e) => handleProductEntryChange(e, idx)}
                                      disabled={disabledProductRows[`${stock._id}-${idx}`]} // Disable quantity field after saving
                                      style={{ width: "80px", marginRight: "5px" }} // Adjust width and spacing
                                      />
                                      <span>kg</span>
                                    </div>
                                  </td>
                                  <td>
                                    <span style={{marginLeft:'1rem'}}>₹</span>
                                      {(entry.ratePerKg * (entry.quantity / 1000)).toFixed(2) || "-"}
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => handleProductEntrySave(stock._id, idx)}
                                      disabled={disabledProductRows[`${stock._id}-${idx}`]} // Disable save button after saving
                                    >
                                      <FaSave /> Save
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {productEntries[stock._id]?.map((entry, idx) => (
                                <tr key={idx}>
                                  {editProductEntryIndex === idx ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="productInfo"
                                          value={editProductEntryData.productInfo === 'others' ? 'Hand Picked' : editProductEntryData.productInfo}
                                          onChange={(e) =>
                                            setEditProductEntryData({
                                              ...editProductEntryData,
                                              productInfo: e.target.value,
                                            })
                                          }
                                        />
                                      </td>
                                      <td>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                      <span>₹</span>
                                        <input
                                          type="number"
                                          className="form-control"
                                          name="ratePerKg"
                                          value={editProductEntryData.ratePerKg}
                                          onChange={(e) =>
                                            setEditProductEntryData({
                                              ...editProductEntryData,
                                              ratePerKg: e.target.value,
                                            })
                                          }
                                          style={{ marginLeft: "5px", width: "100px" }} // Adjust spacing and width
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className="form-control"
                                          name="quantity"
                                          value={editProductEntryData.quantity}
                                          onChange={(e) =>
                                            setEditProductEntryData({
                                              ...editProductEntryData,
                                              quantity: e.target.value,
                                            })
                                          }
                                        />
                                      </td>
                                      <td>
                                        {(editProductEntryData.ratePerKg * (editProductEntryData.quantity / 1000)).toFixed(2) || "-"}
                                      </td>
                                      <td>
                                        <button
                                          className="btn btn-primary btn-sm me-2"
                                          onClick={() => handleProductEntryUpdate(stock._id, entry._id)}
                                        >
                                          <FaSave /> Save
                                        </button>
                                        <button
                                          className="btn btn-danger btn-sm"
                                          onClick={() => setEditProductEntryIndex(null)}
                                        >
                                          <FaTimes /> Cancel
                                        </button>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{entry.productInfo === 'others' ? 'Hand Picked' : entry.productInfo}</td>
                                      <td>₹{entry.ratePerKg}</td>
                                      <td>{entry.quantity * 1000}gm</td>
                                      <td>₹{entry.totalCost}</td>
                                      <td>
                                        <button
                                          className="btn btn-warning btn-sm"
                                          onClick={() => handleProductEntryEdit(entry, idx)}
                                        >
                                          <FaEdit /> Edit
                                        </button>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCalculation(stock._id)}
                            disabled={disabledRows[stock._id]}
                          >
                            Calculate
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </Layout>
  );
};

export default PacketTableCash;