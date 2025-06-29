import React, { useEffect, useRef } from "https://esm.sh/react@18";
import { createRoot } from "https://esm.sh/react-dom@18/client";
import Chart from "https://esm.sh/chart.js@4/auto";

function App() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  async function fetchAndDraw() {
    // Fetch all products
    const res = await fetch("https://dummyjson.com/products");
    const { products } = await res.json();

    // Pick 10 random products
    const sample = [...products].sort(() => 0.5 - Math.random()).slice(0, 10);

    const labels = sample.map((p) => p.title);
    const prices = sample.map((p) => p.price);

    // Destroy previous chart (if any)
    chartRef.current?.destroy();

    // Draw bar chart
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Price (USD)",
            data: prices,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  // Initial load
  useEffect(() => {
    fetchAndDraw();
    return () => chartRef.current?.destroy();
  }, []);

  return (
    <div className="container">
      <h1>a1-products Prices</h1>
      <div className="chart-wrapper">
        <canvas ref={canvasRef}></canvas>
      </div>
      <button onClick={fetchAndDraw}>Refresh</button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
