import React from 'react';
import Layout from '../components/Layout';
import { useLocation } from 'react-router-dom';
import PurchaseStockKG from '../components/PurchaseStockKG';
import PurchaseStockBAG from '../components/PurchaseStockBAG';

export default function PurchaseOrderQuantity() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cashFormId = searchParams.get('cashId');
  const unitType = searchParams.get('unitType'); // Extract unitType from query params
  console.log('cashFormId:', cashFormId);

  return (
    <Layout>
      <div>
        <h3>Purchase Quantity - Cash</h3>
        <p>Cash ID: {cashFormId}</p>
        {unitType === 'kg' && <PurchaseStockKG cashFormId={cashFormId} />}
        {unitType === 'bag' && <PurchaseStockBAG cashFormId={cashFormId} />}
      </div>
    </Layout>
  );
}
