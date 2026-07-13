const AIResponseRenderer = ({ data, BASE_URL }) => {
  if (!data) {
    return null;
  }

  // ================= GENERAL =================

  if (data.responseType === "GENERAL") {
    return null;
  }

  // ================= PRODUCTS =================

  if (data.responseType === "PRODUCT_RECOMMENDATION") {
    return (
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginTop: "10px",
          maxWidth: "70%",
        }}
      >
        {data.products?.map((product) => (
          <div
            key={product.prodid}
            style={{
              width: "220px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "12px",
              backgroundColor: "#fff",
            }}
          >
            {product.imagename && (
              <img
                src={`${BASE_URL}/products/image/${product.prodid}`}
                alt={product.prodname}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
            )}

            <h4>{product.prodname}</h4>

            <p>Category: {product.category}</p>

            <p
              style={{
                fontWeight: "bold",
              }}
            >
              ₹{product.price}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // ================= ORDERS =================

  if (data.responseType === "ORDER_HISTORY") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "10px",
          maxWidth: "70%",
        }}
      >
        {data.orders?.map((order) => (
          <div
            key={order.orderId}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "12px",
              backgroundColor: "#fff",
            }}
          >
            <h4>{order.productName}</h4>

            <p>Category: {order.category}</p>

            <p>₹{order.price}</p>

            <p
              style={{
                fontSize: "12px",
                color: "#666",
              }}
            >
              {order.orderDate}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default AIResponseRenderer;
