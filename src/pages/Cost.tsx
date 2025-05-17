import { PerformanceDataOptions } from "@/constant/LineChart.data";
import { lazy, Suspense } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Lazy load chart components
const Doughnut = lazy(() => import('react-chartjs-2').then(mod => ({ default: mod.Doughnut })));
const Line = lazy(() => import('react-chartjs-2').then(mod => ({ default: mod.Line })));
const Bar = lazy(() => import('react-chartjs-2').then(mod => ({ default: mod.Bar })));

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = [
  {
    title: "Annual AI Infrastructure Budget",
    value: "$250,000",
    color: "#c6d2ff",
    txtColor: "#4f39f6",
  },
  {
    title: "Monthly AI Spend",
    value: "$12,000",
    color: "#a4f4cf",
    txtColor: "#00a63e",
  },
];

const PieChartData2 = {
  labels: ["Available Capacity", "Reserved Capacity", "Active Resources"],
  datasets: [
    {
      label: "My First Dataset",
      data: [20, 100, 80],
      backgroundColor: ["#379AE6", "#1DD75B", "#EFB034"],
      hoverOffset: 4,
    },
  ],
};

const lineChartData = {
  labels: [
    "10%",
    "20%",
    "30%",
    "40%",
    "50%",
    "60%",
    "70%",
    "80%",
    "90%",
    "100%",
  ],
  datasets: [
    {
      label: "CPU/GPU utilize",
      data: [30, 50, 70, 60, 80, 85, 75, 90, 95, 100],
      borderColor: "#4f39f6",
      fill: false,
      tension: 0.4,
    },
    {
      label: "Memory Usage",
      data: [20, 40, 60, 50, 70, 35, 55, 65, 75, 85],
      borderColor: "#a4f4cf",
      fill: false,
      tension: 0.4,
    },
    {
      label: "Cost Trend",
      data: [25, 45, 65, 55, 75, 35, 50, 60, 70, 80],
      borderColor: "#00a63e",
      fill: false,
      tension: 0.4,
    },
  ],
};

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": $";
          }
          label += context.raw;
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const activeOptimizations = [
  {
    title: "Auto-scaling",
    description: "Status: Enabled",
    properties: "Last scaled: 2h ago",
  },
  {
    title: "Spot Instances",
    description: "Utilization: 60%",
    properties: "Savings: $800/mo",
  },
  {
    title: "Cache Hit Rate",
    description: "Rate: 85%",
    properties: "Savings: $400/mo",
  },
  {
    title: "Auto-scaling Status",
    description: "Current 8 instances",
    scaleup: "Scale-Up: CPU > 80%",
    scaledown: "Scale-Down: CPU < 20%",
  },
];

const savingOpportunities = [
  {
    title: "Right size GPU Instances",
    description: "Potential Savings: $800/mo",
    severity: "High Impact",
    color: "#FF9800",
  },
  {
    title: "Enable Response Caching",
    description: "Potential Savings: $400/mo",
    severity: "Medium",
    color: "#4CAF50",
  },
  {
    title: "Schedule Down Scaling",
    description: "Potential Savings: $800/mo",
    severity: "Easy",
    color: "#2196F3",
  },
];

const waterfallData = {
  labels: [
    "Model API Costs",
    "Compute Resources",
    "Inventory Purchases",
    "Storage Costs",
    "Network Usage",
    "Training Costs",
    "Inference Costs",
    "Backup/Storage",
    "Total",
  ],
  datasets: [
    {
      label: "Resource Allocation/Usage",
      data: [100, -50, -20, 30, -40, 20, -30, 50, 60],
      backgroundColor: "#379AE6",
    },
    {
      label: "Actual Costs",
      data: [80, -40, -10, 20, -30, 10, -20, 40, 50],
      backgroundColor: "#EFB034",
    },
  ],
};

const waterfallOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Resource Usage & Cost Flow",
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const Cost = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-[1320px] mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 uppercase py-5">
          {" "}
          Cost Management{" "}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
          <div className="bg-white rounded-lg p-5 flex flex-col gap-4 ">
            {data.map((item, index) => (
              <div
                key={index}
                className=" rounded-lg p-5 flex flex-col gap-2"
                style={{ backgroundColor: item.color }}
              >
                <div className="text-gray-800 font-semibold">
                  {" "}
                  {item.title}{" "}
                </div>
                <div className="flex justify-between items-end">
                  <div
                    className="font-bold text-2xl text-gray-900"
                    style={{ color: item.txtColor }}
                  >
                    {" "}
                    {item.value}{" "}
                  </div>
                  <div
                    className="cursor-pointer font-medium"
                    style={{ color: item.txtColor }}
                  >
                    {" "}
                    Details <span> ›</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-5 col-span-2">
            <h1 className="text-gray-900 font-bold text-xl px-5">
              {" "}
              Model Cost Distribution{" "}
            </h1>
            <div className="flex gap-5 justify-center">
              <PieChart
                title="Model Type Distribution"
                data={{
                  labels: ["LLM", "Vision", "Speech"],
                  datasets: [
                    {
                      data: [40, 30, 20], // Example percentages
                      backgroundColor: [
                        "rgb(63, 81, 181)",
                        "#BED0F8",
                        "#CED0F9",
                      ],
                      hoverBackgroundColor: [
                        "rgb(63, 81, 195)",
                        "#BED0F9",
                        "#CED0F9",
                      ],
                      borderWidth: 2,
                    },
                  ],
                }}
                value="$60,000"
              />
              <PieChart
                title="Cost Type Breakdown"
                data={{
                  labels: ["Infrastructure Cost", "API Cost"],
                  datasets: [
                    {
                      data: [40, 30], // Example percentages
                      backgroundColor: ["rgb(63, 81, 181)", "#CED0F8"],
                      hoverBackgroundColor: ["rgb(63, 81, 195)", "#CED0F9"],
                      borderWidth: 2,
                    },
                  ],
                }}
                value="$25,000"
              />
            </div>
          </div>
        </div>
        <div className=" py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-lg p-5 col-span-2">
            <h1 className="text-gray-900 font-bold text-xl px-5">
              Resource Usage vs Cost
            </h1>
            <Suspense fallback={<div>Loading chart...</div>}>
              <Line data={lineChartData} options={lineChartOptions} />
            </Suspense>
          </div>
          <div className="bg-white rounded-lg p-5">
            <h3 className="text-gray-900 font-semibold text-xl mx-5 my-4">
              {" "}
              Key Metrics Panel{" "}
            </h3>
            <div className="flex flex-col gap-5 py-5 mx-5">
              {[
                "Compute hrs 240 h/month",
                "Memory utilization 75%",
                "Cost per Hour $1.25",
                "Cost per 1k interference $0.05",
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-3 border-2 border-gray-400 rounded-md cursor-pointer hover:bg-gray-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
          <div className="col-span-2 bg-white rounded-lg shadow-lg">
            <div className="p-5 flex justify-between items-center mx-5">
              <h3 className="text-xl font-semibold text-gray-900">
                {" "}
                Cost Optimization{" "}
              </h3>
              <div className="bg-green-200 rounded-lg py-2 px-4 font-semibold">
                {" "}
                Potentional savings: $3,200/month
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mx-5 mb-5">
              <div className="p-5 bg-gray-200 rounded-lg flex flex-col gap-3 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900">
                  {" "}
                  Active Optimizations{" "}
                </h4>
                {activeOptimizations.map((item, index) => (
                  <div
                    key={index}
                    className="leading-7 bg-white rounded-md py-3 px-5 shadow-lg cursor-pointer hover:bg-gray-50"
                  >
                    <h4 className="text-lg font-semibold text-gray-900">
                      {" "}
                      {item.title}{" "}
                    </h4>
                    <p>
                      {" "}
                      {item.description} | {item?.properties}{" "}
                    </p>
                    <p>{item?.scaleup}</p>
                    <p>{item?.scaledown}</p>
                  </div>
                ))}
              </div>
              <div className="p-5 bg-gray-200 rounded-lg flex flex-col gap-3 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900">
                  Saving Opportunities
                </h4>
                {savingOpportunities.map((item, index) => (
                  <div
                    key={index}
                    className={`leading-7 rounded-md py-3 px-5 shadow-lg cursor-pointer hover:bg-gray-50 bg-white`}
                    // style={{ backgroundColor: item.color  }}
                  >
                    <h4 className="text-lg font-semibold text-gray-900">
                      {" "}
                      {item.title}{" "}
                    </h4>
                    <p> {item.description}</p>
                    <div
                      style={{ backgroundColor: item.color }}
                      className="py-1 px-3 uppercase font-semibold w-fit rounded-md"
                    >
                      {item.severity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 text-center py-5">
              {" "}
              Key Metrics Panel
            </h3>
            <Suspense fallback={<div>Loading chart...</div>}>
              <Doughnut data={PieChartData2} options={PerformanceDataOptions} />
            </Suspense>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5  shadow-lg">
          <h1 className="text-gray-900 font-bold text-xl px-5">
            Resource Usage & Cost Flow
          </h1>
          <Bar data={waterfallData} options={waterfallOptions} />
        </div>
      </div>
    </div>
  );
};

const PieChart = ({
  title,
  data,
  value,
}: {
  title: string;
  data: any;
  value: string;
}) => {
  return (
    <div className="bg-transparent flex flex-col gap-3 py-3">
      <h3 className="text-center font-semibold text-lg"> {title}</h3>
      <Suspense fallback={<div>Loading chart...</div>}>
        <Doughnut data={data} options={PerformanceDataOptions} />
      </Suspense>
      <div className="text-center font-bold text-lg"> {value} </div>
    </div>
  );
};

export default Cost;
