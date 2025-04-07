import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from './components/login';
import Purchase from './pages/Purchase';
import PurchaseOrder from './pages/PurchaseOrder';
import PurchaseOrderQuantity from './pages/PurchaseOrderQuantity'
import PurchaseOrderFarmer from './pages/PurchaseOrderFarmer';
import PurchaseOrderVender from './pages/PurchaseOrderVender';
import PurchaseOrderQuantityFarmer from './pages/PurchaseOrderQuantityFarmer';
import PurchaseDashboard from './pages/PurchaseDashboard';
import MasterListCash from './pages/MasterListCash';
import PurchaseListCash from './pages/PurchaseListCash';
import DetailLogPerBag from './pages/DetailLogPerBag';
import DetailLogPerBagVendor from './pages/DetailLogPerBagVendor';
import MasterListFarmer from './pages/MasterListFarmer';
import MasterListVender from './pages/MasterListVender';
import PurchaseCashDetailsByID from './pages/PurchaseCashDetailsByID';
import PurchaseListFarmer from './pages/PurchaseListFarmer';
import PurchaseListVendor from './pages/PurchaseListVendor';
import PurchaseOrderQuantityVendor from './pages/PurchaseOrderQuantityVender';
import PurchaseVendorDetailsByID from './pages/PurchaseVendorDetailsByID';
import PurchaseFarmerDetailsByID from './pages/PurchaseFarmerDetailsByID';
import DetailLogPerBagFarmer from './pages/DetailLogPerBagFarmer';
import CashSegregationList from './segregation/CashSegregationList';
import FarmerSegregationList from './segregation/FarmerSegregationList';
import VendorSegregationList from './segregation/VendorSegregationList';
import SegregationTableCash from './segregation/SegregationTableCash';
import SegregationTableFarmer from './segregation/SegregationTableFarmer';
import SegregationTableVendor from './segregation/SegregationTableVendor';
import SegregationMasterCash from './segregation/SegregationMasterCash';
import SegregationMasterFarmer from './segregation/SegregationMasterFarmer';
import SegregationMasterVendor from './segregation/SegregationMasterVendor';
import PacketMasterCash from './pages/PacketMasterCash';
import PacketTableCash from './pages/PacketTableCash';
import PacketMasterVendor from './pages/PacketMasterVendor';
import PacketTableVendor from './pages/PacketTableVendor';
import PacketMasterFarmer from './pages/PacketMasterFarmer';
import PacketTableFarmer from './pages/PacketTableFarmer';
import Packaging from './Packaging/Packaging';
import PackagingTableNameTBG from './Packaging/PackagingTableNameTBG';
import PackagingTableNameTBGFarmer from './Packaging/PackagingTableNameTBGFarmer';
import PackagingTableNameTBGVendor from './Packaging/PackagingTableNameTBGVendor';
import BulkCashTauli from './Packaging/BulkCashTauli';
import BulkFarmerTauli from './Packaging/BulkFarmerTauli';
import BulkVendorTauli from './Packaging/BulkVendorTauli';
import BulkCashSuta from './Packaging/BulkCashSuta';
import BulkFarmerSuta from './Packaging/BulkFarmerSuta';
import BulkVendorSuta from './Packaging/BulkVendorSuta';
import SuttaPage6 from './Sutta-Pages/SuttaPage6';
import SuttaPageHandPicked from './Sutta-Pages/SuttaPageHandPicked';
import SuttaPageWaste from './Sutta-Pages/SuttaPageWaste';
import SuttaPage5 from './Sutta-Pages/SuttaPage5';
import SuttaPage4 from './Sutta-Pages/SuttaPage4';
import SuttaPage3 from './Sutta-Pages/SuttaPage3';
import Expense from './pages/expense';
import CreateExpense from './components/createExpense';
import ExpenseList from './components/expenseList';
import Electicity from './Expense/electricity';
import Furniture from './Expense/furniture';
import Motor from './Expense/motor';
import OfficeExpense from './Expense/officeExpense';
import Plant from './Expense/plant';
import StaffWelfare from './Expense/staffWelfare';
import MonthlyExpense from './Expense/monthlyExpense';
import MonthReport from './Expense/monthReport';
import Credentials from './components/credentials';
import Fuel from './Expense/fuel';
import Labour from './Expense/labour';
import Transport from './Expense/transport';
import CreateExpenseD from './components/createExpenseD';
import ExpenseListD from './components/expenseListD';
import ElecticityD from './Expense/electricityD';
import FurnitureD from './Expense/furnitureD';
import MotorD from './Expense/motorD';
import OfficeExpenseD from './Expense/officeExpenseD';
import PlantD from './Expense/plantD';
import StaffWelfareD from './Expense/staffWelfareD';
import MonthlyExpenseD from './Expense/monthlyExpenseD';
import MonthReportD from './Expense/monthReportD';
import FuelD from './Expense/fuelD';
import LabourD from './Expense/labourD';
import TransportD from './Expense/transportD';
import ExpenseD from './pages/expenseD';
import Dashboard from './pages/dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/xyz" element={<Purchase />} />
      <Route path="/purchase-order/:_id" element={<PurchaseOrder />} />
      <Route path="/purchase-order-quantity" element={<PurchaseOrderQuantity />} />
      <Route path="/purchase-order-farmer/:_id" element={<PurchaseOrderFarmer></PurchaseOrderFarmer>}/>
      <Route path="/purchase-order-vendor/:_id" element={<PurchaseOrderVender></PurchaseOrderVender>}/>
      <Route path="/purchase-order-quantity-farmer" element={<PurchaseOrderQuantityFarmer/>}/>
      <Route path="/purchase-dashboard" element={<PurchaseDashboard></PurchaseDashboard>}></Route>
      <Route path="/master-list-cash/" element={<MasterListCash></MasterListCash>}></Route>
      <Route path="/purchase-list-cash/:_id" element={<PurchaseListCash></PurchaseListCash>}></Route>
      <Route path="/detail-log-per-bag" element={<DetailLogPerBag></DetailLogPerBag>} />
      <Route path="/detail-log-per-bag-vendor" element={<DetailLogPerBagVendor></DetailLogPerBagVendor>} />
      <Route path="/detail-log-per-bag-farmer" element={<DetailLogPerBagFarmer></DetailLogPerBagFarmer>} />
      <Route path="/purchase-list-cash/" element={<PurchaseListCash></PurchaseListCash>}></Route>
      <Route path="/master-list-farmer" element={<MasterListFarmer></MasterListFarmer>}></Route>
      <Route path="/master-list-vendor/" element={<MasterListVender></MasterListVender>}></Route>
      <Route path="/purchase-details-by-idcash/:cashId" element={<PurchaseCashDetailsByID></PurchaseCashDetailsByID>}></Route>
      <Route path="/purchase-details-by-idvendor/:vendorId" element={<PurchaseVendorDetailsByID></PurchaseVendorDetailsByID>}></Route>
      <Route path="/purchase-details-by-idfarmer/:farmerId" element={<PurchaseFarmerDetailsByID></PurchaseFarmerDetailsByID>}></Route>
      <Route path="/purchase-list-farmer" element={<PurchaseListFarmer></PurchaseListFarmer>}></Route>
      <Route path="/purchase-list-vendor" element={<PurchaseListVendor></PurchaseListVendor>}></Route>
      <Route path="/purchase-order-quantity-vendor" element={<PurchaseOrderQuantityVendor></PurchaseOrderQuantityVendor>}></Route>
      <Route path="/cash-segregation-list" element={<CashSegregationList></CashSegregationList>}></Route>
      <Route path="/farmer-segregation-list" element={<FarmerSegregationList></FarmerSegregationList>}></Route>
      <Route path="/vendor-segregation-list" element={<VendorSegregationList></VendorSegregationList>}></Route>
      <Route path="/segregation-table-cash" element={<SegregationTableCash></SegregationTableCash>}></Route>
      <Route path="/packet-table-cash" element={<PacketTableCash></PacketTableCash>}></Route>
      <Route path="/segregation-table-farmer" element={<SegregationTableFarmer></SegregationTableFarmer>}></Route>
      <Route path="/segregation-table-vendor" element={<SegregationTableVendor></SegregationTableVendor>}></Route>
      <Route path="/segregation-master-cash/:cashId" element={<SegregationMasterCash></SegregationMasterCash>}></Route>
      <Route path="/packet-master-cash/:cashId" element={<PacketMasterCash></PacketMasterCash>}></Route>
      <Route path="/segregation-master-farmer/:farmerId" element={<SegregationMasterFarmer></SegregationMasterFarmer>}></Route>
      <Route path="/segregation-master-vendor/:vendorId" element={<SegregationMasterVendor></SegregationMasterVendor>}></Route>
      <Route path="/purchase-order-quantity-vendor-id" element={<PurchaseVendorDetailsByID></PurchaseVendorDetailsByID>}></Route>
      <Route path='/packet-master-vendor/:vendorId' element={<PacketMasterVendor></PacketMasterVendor>}></Route>
      <Route path='/packet-table-vendor' element={<PacketTableVendor></PacketTableVendor>}></Route>
      <Route path='/packet-master-farmer/:farmerId' element={<PacketMasterFarmer></PacketMasterFarmer>}></Route>
      <Route path='/packet-table-farmer' element={<PacketTableFarmer></PacketTableFarmer>}></Route>
      <Route path='/packaging' element={<Packaging></Packaging>}></Route>
      <Route path='/packagingTableNameTBG' element={<PackagingTableNameTBG></PackagingTableNameTBG>}></Route>
      <Route path='/packagingTableNameTBGFarmer' element={<PackagingTableNameTBGFarmer></PackagingTableNameTBGFarmer>}></Route>
      <Route path='/packagingTableNameTBGVendor' element={<PackagingTableNameTBGVendor></PackagingTableNameTBGVendor>}></Route>
      <Route path='/bulk-cash-tauli' element={<BulkCashTauli></BulkCashTauli>}></Route>
      <Route path='/bulk-farmer-tauli' element={<BulkFarmerTauli></BulkFarmerTauli>}></Route>
      <Route path='/bulk-vendor-tauli' element={<BulkVendorTauli></BulkVendorTauli>}></Route>
      <Route path='/bulk-cash-suta' element={<BulkCashSuta></BulkCashSuta>}></Route>
      <Route path='/bulk-farmer-suta' element={<BulkFarmerSuta></BulkFarmerSuta>}></Route>
      <Route path='/bulk-vendor-suta' element={<BulkVendorSuta></BulkVendorSuta>}></Route>
      <Route path='/6-sutta-page' element={<SuttaPage6></SuttaPage6>}></Route>
      <Route path='/5-sutta-page' element={<SuttaPage5></SuttaPage5>}></Route>
      <Route path='/4-sutta-page' element={<SuttaPage4></SuttaPage4>}></Route>
      <Route path='/3-sutta-page' element={<SuttaPage3></SuttaPage3>}></Route>
      <Route path='/hand-picked-sutta-page' element={<SuttaPageHandPicked></SuttaPageHandPicked>}></Route>
      <Route path='/waste-sutta-page' element={<SuttaPageWaste></SuttaPageWaste>}></Route>
      <Route path='/expense' element={<Expense></Expense>}></Route>
      <Route path='/createExpense' element={<CreateExpense></CreateExpense>}></Route>
      <Route path='/expenseList' element={<ExpenseList></ExpenseList>}></Route>
      <Route path='/electricity' element={<Electicity></Electicity>}></Route>
      <Route path='/furniture' element={<Furniture></Furniture>}></Route>
      <Route path='/motor' element={<Motor></Motor>}></Route>
      <Route path='/officeExpense' element={<OfficeExpense></OfficeExpense>}></Route>
      <Route path='/plant' element={<Plant></Plant>}></Route>
      <Route path='/staffWelfare' element={<StaffWelfare></StaffWelfare>}></Route>
      <Route path='/monthlyExpense' element={<MonthlyExpense></MonthlyExpense>}></Route>
      <Route path='/monthReport' element={<MonthReport></MonthReport>}></Route>
      <Route path='/credentials' element={<Credentials></Credentials>}></Route>
      <Route path='/transport' element={<Transport></Transport>}></Route>
      <Route path='/labour' element={<Labour></Labour>}></Route>
      <Route path='/fuel' element={<Fuel></Fuel>}></Route>
      <Route path='/expenseD' element={<ExpenseD></ExpenseD>}></Route>
      <Route path='/createExpenseD' element={<CreateExpenseD></CreateExpenseD>}></Route>
      <Route path='/expenseListD' element={<ExpenseListD></ExpenseListD>}></Route>
      <Route path='/electricityD' element={<ElecticityD></ElecticityD>}></Route>
      <Route path='/furnitureD' element={<FurnitureD></FurnitureD>}></Route>
      <Route path='/motorD' element={<MotorD></MotorD>}></Route>
      <Route path='/officeExpenseD' element={<OfficeExpenseD></OfficeExpenseD>}></Route>
      <Route path='/plantD' element={<PlantD></PlantD>}></Route>
      <Route path='/staffWelfareD' element={<StaffWelfareD></StaffWelfareD>}></Route>
      <Route path='/monthlyExpenseD' element={<MonthlyExpenseD></MonthlyExpenseD>}></Route>
      <Route path='/monthReportD' element={<MonthReportD></MonthReportD>}></Route>
      <Route path='/transportD' element={<TransportD></TransportD>}></Route>
      <Route path='/labourD' element={<LabourD></LabourD>}></Route>
      <Route path='/fuelD' element={<FuelD></FuelD>}></Route>
      <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>

      </Routes>
  );
};

export default App;
