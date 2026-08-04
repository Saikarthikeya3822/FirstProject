import React, { useEffect, useState } from "react";
import { getProductAnalytics } from "../service/productService";
import "../styles/Dashboard.css";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const ProductAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [topViewedProducts, setTopViewedProducts] = useState([]);

  const [topCartProducts, setTopCartProducts] = useState([]);

  const [topPurchasedProducts, setTopPurchasedProducts] = useState([]);

  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalCartAdds: 0,
    totalPurchases: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getProductAnalytics();

      setAnalytics(data.dashboard);
      setTopViewedProducts(data.viewed);
      setTopCartProducts(data.cart);
      setTopPurchasedProducts(data.purchased);
    } catch (error) {
      console.error("Analytics Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const conversionRate =
    analytics.totalViews === 0
      ? 0
      : ((analytics.totalPurchases / analytics.totalViews) * 100).toFixed(2);

  if (loading) {
    return (
      <div className="flex justify-content-center mt-8">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Product Intelligence Dashboard</h2>

      {/* KPI SECTION */}

      <div className="kpi-grid">
        <Card title="👀 Product Views" className="kpi-card">
          <div className="kpi-value">{analytics.totalViews}</div>
        </Card>

        <Card title="🛒 Cart Adds" className="kpi-card">
          <div className="kpi-value">{analytics.totalCartAdds}</div>
        </Card>

        <Card title="✅ Purchases" className="kpi-card">
          <div className="kpi-value">{analytics.totalPurchases}</div>
        </Card>

        <Card title="📈 Conversion Rate" className="kpi-card">
          <div className="kpi-value">{conversionRate}%</div>
        </Card>
      </div>

      {/* ANALYTICS TABLES */}

      <div className="analytics-grid">
        <Card title="🏆 Top Viewed Products" className="analytics-card">
          <DataTable
            value={topViewedProducts}
            stripedRows
            emptyMessage="No Data Found"
          >
            <Column field="productName" header="Product Name" />

            <Column field="category" header="Category" />

            <Column field="count" header="Views" />
          </DataTable>
        </Card>

        <Card title="🛒 Top Cart Products" className="analytics-card">
          <DataTable
            value={topCartProducts}
            stripedRows
            emptyMessage="No Data Found"
          >
            <Column field="productId" header="Product ID" />
            <Column field="count" header="Cart Adds" />
          </DataTable>
        </Card>

        <Card title="📦 Top Purchased Products" className="analytics-card">
          <DataTable
            value={topPurchasedProducts}
            stripedRows
            emptyMessage="No Data Found"
          >
            <Column field="productId" header="Product ID" />
            <Column field="count" header="Orders" />
          </DataTable>
        </Card>
      </div>
    </div>
  );
};

export default ProductAnalyticsPage;
