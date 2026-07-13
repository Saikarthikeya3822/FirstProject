import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const AIErrorPage = ({
  title = "Something went wrong",
  message,
  buttonLabel = "Go Back",
  onButtonClick,
}) => {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        className="shadow-4 text-center p-5"
        style={{ maxWidth: "600px" }}
      >
        <i
          className="pi pi-exclamation-triangle"
          style={{
            fontSize: "4rem",
            color: "#f59e0b",
          }}
        />

        <h2 className="mt-4">{title}</h2>

        <p className="mt-3">{message}</p>

        <Button
          label={buttonLabel}
          icon="pi pi-arrow-left"
          className="mt-3"
          onClick={onButtonClick}
        />
      </Card>
    </div>
  );
};

export default AIErrorPage;