import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { getUserAnalytics } from "../service/productService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Timeline } from "primereact/timeline";
import { Dropdown } from "primereact/dropdown";
import { Chart } from "primereact/chart";
import { getUserInsights } from "../service/productService";
import "../styles/UserAnalyticsPage.css";

const UserAnalyticsPage = () => {
  const [userId, setUserId] = useState("");
  const [days, setDays] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [insight, setInsight] = useState(null);

  const searchUser = async () => {
    if (!userId) return;

    try {
      const analyticsData = await getUserAnalytics(userId, days);

      setAnalytics(analyticsData);

      const insightData = await getUserInsights(userId);

      setInsight(insightData);
    } catch (error) {
      console.error(error);
    }
  };
  const categoryChartData = {
    labels: analytics?.categoryBreakdown?.map((item) => item.category) || [],

    datasets: [
      {
        data: analytics?.categoryBreakdown?.map((item) => item.count) || [],
      },
    ],
  };
  return (
    <div>
      <h2>User Analytics Dashboard</h2>

      {/* Search Section */}
      <Card className="mb-4">
        <h3>User Search</h3>

        <div className="flex gap-2 mb-3">
          <InputText
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
          />

          <Dropdown
            value={days}
            options={[
              { label: "Last 7 Days", value: 7 },
              { label: "Last 30 Days", value: 30 },
              { label: "Last 90 Days", value: 90 },
            ]}
            onChange={(e) => setDays(e.value)}
            placeholder="Select Period"
          />

          <Button label="Search" onClick={searchUser} />
        </div>
      </Card>

      {analytics && (
        <>
          {/* KPI Metrics */}
          <h3 className="mt-4">User Performance Metrics</h3>

          <div className="grid">
            <div className="col-12 md:col-3">
              <Card title="Views">
                <h2>{analytics.totalViews}</h2>
              </Card>
            </div>

            <div className="col-12 md:col-3">
              <Card title="Cart Adds">
                <h2>{analytics.totalCartAdds}</h2>
              </Card>
            </div>

            <div className="col-12 md:col-3">
              <Card title="Purchases">
                <h2>{analytics.totalPurchases}</h2>
              </Card>
            </div>

            <div className="col-12 md:col-3">
              <Card title="Conversion Rate">
                <h2>{analytics?.conversionRate?.toFixed(2) || "0.00"}%</h2>
              </Card>
            </div>
          </div>

          {/* Category Insights */}
          <h3 className="mt-4">Category Insights</h3>

          <div className="grid">
            <div className="col-12 md:col-6">
              <Card title="Favorite Category">
                <h2>{analytics?.mostViewedCategory || "N/A"}</h2>
              </Card>
            </div>

            <div className="col-12 md:col-6">
              <Card title="Most Purchased Category">
                <h2>{analytics?.mostPurchasedCategory || "N/A"}</h2>
              </Card>
            </div>
          </div>

          {/* Product Insights */}
          <h3 className="mt-4">Product Insights</h3>

          <div className="grid">
            <div className="col-12 md:col-4">
              <Card title="Most Viewed Product">
                <h3>{analytics?.mostViewedProduct?.productName}</h3>

                <p>Category: {analytics?.mostViewedProduct?.category}</p>

                <p>Views: {analytics?.mostViewedProduct?.count}</p>
              </Card>
            </div>

            <div className="col-12 md:col-4">
              <Card title="Most Cart Added Product">
                <h3>{analytics?.mostCartAddedProduct?.productName}</h3>

                <p>Category: {analytics?.mostCartAddedProduct?.category}</p>

                <p>Cart Adds: {analytics?.mostCartAddedProduct?.count}</p>
              </Card>
            </div>

            <div className="col-12 md:col-4">
              <Card title="Most Purchased Product">
                <h3>{analytics?.mostPurchasedProduct?.productName}</h3>

                <p>Category: {analytics?.mostPurchasedProduct?.category}</p>

                <p>Purchases: {analytics?.mostPurchasedProduct?.count}</p>
              </Card>
            </div>
          </div>

          {/* Category Breakdown */}
          <h3 className="mt-4">Category Breakdown</h3>

          <Card>
            <div
              style={{
                height: "350px",
                width: "500px",
                margin: "auto",
              }}
            >
              <Chart
                type="pie"
                data={categoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  radius: "65%",
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </Card>

          {/* AI Insights */}
          {insight && (
            <>
              <h3 className="mt-4">AI Customer Insights</h3>

              <Card>
                <div className="grid">
                  <div className="col-12">
                    <h4>Customer Summary</h4>
                    <p>{insight.customerSummary}</p>
                  </div>

                  <div className="col-12">
                    <h4>Purchase Intent</h4>
                    <p>{insight.purchaseIntent}</p>
                  </div>

                  <div className="col-12">
                    <h4>Product Interests</h4>
                    <p>{insight.productInterests}</p>
                  </div>

                  <div className="col-12">
                    <h4>Recommended Action</h4>
                    <p>{insight.recommendedAction}</p>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* User Activity */}
          <h3 className="mt-4">User Activity</h3>

          <div className="grid">
            <div className="col-12 md:col-7">
              <Card title="Recent Views">
                <DataTable value={analytics?.recentViews} paginator rows={5}>
                  <Column field="productName" header="Product" />

                  <Column field="category" header="Category" />

                  <Column
                    field="viewedAt"
                    header="Viewed At"
                    body={(rowData) =>
                      new Date(rowData.viewedAt).toLocaleString()
                    }
                  />
                </DataTable>
              </Card>
            </div>

            <div className="col-12 md:col-5">
              <Card title="Activity Timeline">
                <div className="timeline-container">
                  <Timeline
                    value={analytics?.timeline}
                    content={(item) => (
                      <div>
                        <b>{item.activityType}</b>

                        <br />

                        {item.productName}

                        <br />

                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    )}
                  />
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserAnalyticsPage;
