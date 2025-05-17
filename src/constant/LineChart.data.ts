export const LineChartData = {
  labels: ["01:00 PM", "02:00 PM", "03:00 PM"],
  datasets: [
    {
      label: "Today",
      data: [0, 40, 50],
      backgroundColor: "#303F9F",
      borderColor: "#303F9F",
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Yesterday",
      data: [20, 5, 40],
      backgroundColor: "#C5CAE9",
      borderColor: "#C5CAE9",
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

export const LineChartData2 = {
  labels: ["01:00 PM", "02:00 PM", "03:00 PM"],
  datasets: [
    {
      label: "Today",
      data: [0, 40, 50],
      backgroundColor: "#4CAF50",
      borderColor: "#4CAF50",
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Yesterday",
      data: [20, 5, 40],
      backgroundColor: "#81C784",
      borderColor: "#81C784",
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

export const BarChartData = {
  labels: ["01:00 PM", "02:00 PM", "03:00 PM"],
  datasets: [
    {
      label: "Today",
      data: [30, 40, 50],
      backgroundColor: "#303F9F",
      borderColor: "#303F9F",
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Yesterday",
      data: [20, 10, 40],
      backgroundColor: "#C5CAE9",
      borderColor: "#C5CAE9",
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

export const CostPerHourData = {
  labels: ["01:00 PM", "02:00 PM", "03:00 PM"],
  datasets: [
    {
      label: "GPT4 ",
      data: [300000, 800000, 100000],
      backgroundColor: "#303F9F",
      borderColor: "#303F9F",
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: "Midjourney ",
      data: [1000, 1000000, 500000],
      backgroundColor: "#e60076",
      borderColor: "#e60076",
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: "Claude ",
      data: [1000000, 500000, 800000],
      backgroundColor: "#009966",
      borderColor: "#009966",
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

export const StackBarChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr"],
  datasets: [
    {
      label: "Midjourney",
      data: [10, 20, 30, 15],
      backgroundColor: "#6366f1", // blue
    },
    {
      label: "Gpt4",
      data: [15, 25, 35, 20],
      backgroundColor: "#f472b6", // pink
    },
    {
      label: "Claude",
      data: [20, 10, 25, 18],
      backgroundColor: "#2dd4bf", // teal
    },
  ],
};

export const BarChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

export const PerformanceData = {
  labels: ["GPT4", "Midjourney", "Claude"],
  datasets: [
    {
      label: "My First Dataset",
      data: [50, 150, 180],
      backgroundColor: ["#9f3fe5", "#008080", "#e60076"],
      hoverOffset: 4,
    },
  ],
};

export const PerformanceDataOptions = {
  responsive: true,
  cutout: "60%",
  plugins: {
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          const dataset = tooltipItem.dataset;
          const total = dataset.data.reduce(
            (sum: number, val: number) => sum + val,
            0
          );
          const currentValue = dataset.data[tooltipItem.dataIndex];
          const percentage = ((currentValue / total) * 100).toFixed(1);
          return `${dataset.label || ""}: ${percentage}%`;
        },
      },
    },
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
      },
    },
  },
};
