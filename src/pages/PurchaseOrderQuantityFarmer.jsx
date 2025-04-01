import React from 'react';
import Layout from '../components/Layout';
import { useLocation } from 'react-router-dom';
import PurchaseStockKGFarmer from '../components/PurchaseStockKGFarmer';
import PurchaseStockBAGFarmer from '../components/PurchaseStockBAGFarmer';


export default function PurchaseOrderQuantityFarmer() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const farmerFormId = searchParams.get('farmerId');
  const unitType = searchParams.get('unitType'); // Extract unitType from query params


  return (
    <Layout>
      <div>
        <h3>Purchase Quantity - Farmer</h3>
        <p>Farmer ID: {farmerFormId}</p>
        <p>Unit Type: {unitType}</p>
        {unitType === 'kg' && <PurchaseStockKGFarmer farmerFormId={farmerFormId} />}
        {unitType === 'bag' && <PurchaseStockBAGFarmer farmerFormId={farmerFormId} />}
      </div>
    </Layout>
  );
}
