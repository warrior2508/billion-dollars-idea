import { Chart, ChartData, ChartOptions } from "chart.js";

export const PieData: ChartData<"doughnut"> = {
  labels: ["Ongoing", "Completed"],
  datasets: [
    {
      label: "My First Dataset",
      data: [300, 50],
      backgroundColor: ["#9f3fe5", "#008080"],
      hoverOffset: 4,
    },
  ],
};

export const LineData: ChartData<"line"> = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Days",
      data: [30, 20, 10, 1, 12, 18, 0],
      borderColor: "blue",
      backgroundColor: "rgba(0, 0, 255, 0.2)",
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Cost in USD",
      data: [1000, 1200, 1500, 1600, 1400, 1100, 900],
      borderColor: "gray",
      backgroundColor: "rgba(128, 128, 128, 0.2)",
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

export const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill: boolean;
  tension: number;
  pointRadius: number;
}

export interface ChartDataProps {
  labels: string[];
  datasets: ChartDataset[];
}

export const LineData1: ChartDataProps = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Days",
      data: [30, 25, 20, 18, 22, 28, 30], // Example data
      borderColor: "blue",
      backgroundColor: "rgba(0, 0, 255, 0.2)",
      fill: false,
      tension: 0.4, // Smooth curve
      pointRadius: 0,
    },
  ],
};

export const BarChartData: ChartData<"bar"> = {
  labels: ["Jan", "Feb", "Mar"],
  datasets: [
    {
      label: "Sales",
      data: [4000, 3000, 5000],
      backgroundColor: "rgb(63, 81, 181)",
      borderColor: "rgb(63, 81, 181)",
      borderWidth: 1,
    },
  ],
};

export const BarOptions: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    title: {
      display: true,
      text: "Monthly Sales Data",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

export const HalfDoughnutData: ChartData<"doughnut"> = {
  labels: ["Red", "Blue"],
  datasets: [
    {
      data: [40, 30],
      backgroundColor: ["rgb(63, 81, 181)", "#CED0F8"],
      hoverBackgroundColor: ["rgb(63, 81, 195)", "#CED0F9"],
      borderWidth: 2,
    },
  ],
};

export const HalfDoughnutOption: ChartOptions<"doughnut"> = {
  responsive: true,
  cutout: "70%",
  rotation: -90,
  circumference: 180,
  plugins: {
    legend: {
      display: false,
      position: "bottom",
    },
  },
};

export const HDCenterTextPlugin = {
  id: "centerText",
  beforeDraw: (chart: Chart) => {
    const { width, height, ctx } = chart;
    ctx.save();

    const fontSize = (height / 100).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const text = "75%";
    const textX = width / 2;
    const textY = height / 1.6;

    ctx.fillText(text, textX, textY);
    ctx.restore();
  },
};

export const LineData2: ChartData<"line"> = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Days",
      data: [30, 25, 20, 18, 22, 28, 20],
      borderColor: "rgb(57, 73, 171)",
      backgroundColor: "rgb(57, 73, 171)",
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Days",
      data: [15, 28, 10, 8, 14, 18, 20],
      borderColor: "rgb(233, 30, 99)",
      backgroundColor: "rgb(233, 30, 99)",
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Days",
      data: [25, 24, 26, 16, 12, 23, 27],
      borderColor: "rgb(0, 150, 136)",
      backgroundColor: "rgb(0, 150, 136)",
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

export const MixBarOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
      },
    },
    title: {
      display: true,
      text: "Sales and Revenue Overview",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const MixBarData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      type: "bar" as const, // Bar Chart
      label: "Sales",
      data: [400, 300, 500, 700, 600],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
    {
      type: "line" as const, // Line Chart
      label: "Revenue",
      data: [320, 280, 450, 650, 580],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderWidth: 2,
      tension: 0.4, // Smooth Line
      pointRadius: 5, // Size of data points
      pointBackgroundColor: "rgba(255, 99, 132, 1)",
    },
  ],
};
