import React from 'react';
import Layout from '../components/Layout';
import { useLocation } from 'react-router-dom';
import PurchaseStockKGVendor from '../components/PurchaseStockKGVendor';
import PurchaseStockBAGVendor from '../components/PurchaseStockBAGVendor';

export default function PurchaseOrderQuantity() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const vendorFormId = searchParams.get('vendorId');
  const unitType = searchParams.get('unitType'); // Extract unitType from query params
  

  return (
    <Layout>
      <div>
        <h3>Purchase Quantity - Vendor</h3>
        <p>Vendor ID: {vendorFormId}</p>
        {unitType === 'kg' && <PurchaseStockKGVendor vendorFormId={vendorFormId} />}
        {unitType === 'bag' && <PurchaseStockBAGVendor vendorFormId={vendorFormId} />}
      </div>
    </Layout>
  );
}
