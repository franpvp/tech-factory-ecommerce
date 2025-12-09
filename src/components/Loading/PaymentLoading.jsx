import React from "react";
import "./PaymentLoading.css";

export default function PaymentLoading() {
  return (
    <div className="payment-loading">
      <div className="loader"></div>
      <h2>Procesando pago...</h2>
      <p>No cierres ni recargues esta ventana.</p>
    </div>
  );
}