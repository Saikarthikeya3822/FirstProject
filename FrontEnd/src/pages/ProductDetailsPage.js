import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getProductById } from "../service/productService";
import { analyzeProduct } from "../service/productService";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import { getComparisonOptions } from "../service/productService";
import ErrorPage from "../components/AIErrorPage";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [rating] = useState(4);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
    loadAnalysis();
  }, [id]);
  useEffect(() => {
    if (product?.category) {
      loadSimilarProducts();
    }
  }, [product]);

  useEffect(() => {
    trackViewProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const trackAiAnalysisViewed = async () => {
    try {
      await axios.post(
        "http://localhost:8080/activities",
        {
          userId: localStorage.getItem("userId"),
          productId: id,
          activityType: "AI_ANALYSIS_VIEWED",
          metadata: "AI Verdict Opened",
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  const loadAnalysis = async () => {
    try {
      const result = await analyzeProduct(id);

      setAnalysis(result);
      trackAiAnalysisViewed();
    } catch (error) {
      console.error("AI Analysis Error:", error);

      if (error.response?.status === 429) {
        setAiError(
          error.response?.data?.message ||
            "AI quota exceeded. Please try again later.",
        );
      } else {
        setAiError(
          error.response?.data?.message || "Unable to generate AI analysis.",
        );
      }
    }
  };
  const handleAskAI = () => {
    if (!question.trim()) {
      return;
    }

    setAnswer(
      `Based on the available information, ${product.prodname} appears to be a good choice for users looking for a stylish and reliable ${product.category}.`,
    );
  };
  const loadSimilarProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8080/products/category/${product.category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const filtered = response.data.filter((p) => p.prodid !== product.prodid);

      setSimilarProducts(filtered);
    } catch (err) {
      console.error(err);
    }
  };
  const trackCompareProduct = async (comparedProductId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/activities",
        {
          userId: localStorage.getItem("userId"),
          productId: id,
          activityType: "COMPARE_PRODUCT",
          metadata: JSON.stringify({
            comparedProductId: comparedProductId,
          }),
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  const compareProducts = async (compareProduct) => {
    setComparisonLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/springai/products/compare",
        {
          product1: product,
          product2: compareProduct,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Comparison Result:", response.data);

      setComparisonResult(response.data);
      trackCompareProduct(compareProduct.prodid);
    } catch (err) {
      console.error(err);
    } finally {
      setComparisonLoading(false);
    }
  };
  const trackViewProduct = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/activities",
        {
          userId: userId,
          productId: id,
          activityType: "VIEW_PRODUCT",
          metadata: "Product Details Viewed",
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };
  const trackPriceActivity = async () => {
    try {
      await axios.post(
        "http://localhost:8080/activities",
        {
          userId: localStorage.getItem("userId"),
          productId: id,
          activityType: "TRACK_PRICE",
          metadata: "Price Tracking Enabled",
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleTrackPrice = async () => {
    // existing logic
    trackPriceActivity();
  };
  if (aiError) {
    return (
      <ErrorPage
        title="AI Service Unavailable"
        message={aiError}
        buttonLabel="Back To Products"
        onButtonClick={() => navigate("/home")}
      />
    );
  }
  if (loading) return <h3>Loading...</h3>;

  if (!product) return <h3>Product not found</h3>;

  return (
    <div className="container mt-5">
      <Button
        label="Back to Products"
        icon="pi pi-arrow-left"
        outlined
        className="mb-4"
        onClick={() => navigate("/home")}
      />
      <div className="row g-4">
        {/* Product Image */}
        <div className="col-lg-4">
          <Card className="shadow-2">
            <img
              src={`http://localhost:8083${product.imageUrl}`}
              alt={product.prodname}
              className="img-fluid rounded"
              style={{
                maxHeight: "450px",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </Card>
        </div>
        {/* Product Information */}

        <div className="col-lg-8">
          <Card className="shadow-2">
            <h1>{product.prodname}</h1>

            <div className="mb-3">
              <Rating value={rating} readOnly cancel={false} />

              <span className="ms-2">4.0</span>
            </div>

            <h2 className="text-success">₹ {product.price}</h2>

            <p>
              Category:
              <strong> {product.category}</strong>
            </p>

            <div className="d-flex gap-2 mt-4">
              <Button
                label="Track Price"
                icon="pi pi-bell"
                severity="success"
                outlined
                onClick={handleTrackPrice}
              />
              <Button label="Ask AI" icon="pi pi-comments" severity="info" />
            </div>
          </Card>
          <hr />
          <Card title="Product Description" className="mt-4 shadow-2">
            <p>{product.description}</p>
          </Card>
          <hr />
          {analysis && (
            <Card title="AI Verdict">
              <p>{analysis.summary}</p>

              <h4>Pros</h4>

              <ul>
                {analysis.pros.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>

              <h4>Cons</h4>

              <ul>
                {analysis.cons.map((con, index) => (
                  <li key={index}>{con}</li>
                ))}
              </ul>

              <h4>Alternatives</h4>

              <ul>
                {analysis.alternatives.map((alt, index) => (
                  <li key={index}>{alt}</li>
                ))}
              </ul>
            </Card>
          )}
          <hr />
          <Card className="mt-4">
            <h2>Compare With Similar Products</h2>

            <div className="d-flex flex-wrap gap-3 mt-3">
              {similarProducts.map((p) => (
                <Button
                  key={p.prodid}
                  label={`${p.prodname} ₹${p.price}`}
                  icon="pi pi-sync"
                  onClick={() => compareProducts(p)}
                />
              ))}
            </div>
          </Card>

          {/* AI Comparison Result */}

          {comparisonLoading && (
            <Card className="mt-4">
              <ProgressSpinner />
              <h5 className="mt-3">AI is comparing products...</h5>
            </Card>
          )}

          {comparisonResult && (
            <Card className="mt-4 shadow-3">
              <h2>🏆 AI Product Comparison</h2>

              <Divider />

              <h4>Winner</h4>

              <Tag
                value={comparisonResult.recommendedProduct}
                severity="success"
              />

              <Divider />

              <h4>Summary</h4>

              <p>{comparisonResult.summary}</p>

              <Divider />

              <h4>Why AI Chose This Product</h4>

              <p>{comparisonResult.reason}</p>
            </Card>
          )}

          <Card
            title={`Ask AI About ${product.prodname}`}
            className="mt-4 shadow-2"
          >
            <div className="d-flex flex-column gap-3">
              <InputText
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about this product..."
              />

              <Button
                label="Ask AI"
                icon="pi pi-send"
                severity="info"
                onClick={handleAskAI}
              />

              {answer && (
                <div className="p-3 border rounded bg-light">
                  <h5>AI Answer</h5>

                  <p>{answer}</p>
                </div>
              )}
            </div>
          </Card>
          <Card title="Price History" className="mt-4 shadow-2">
            Chart coming soon...
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
