"use client";
import { DatePicker } from "@/components/DatePicker";
import { BarOptions, ChartDataProps } from "@/constant/Dashboard.data";
import {
  BarChartData,
  LineChartData,
  LineChartData2,
} from "@/constant/LineChart.data";
import { useState } from "react";
import { Line, Bar } from "react-chartjs-2";

const insights = [
  {
    title: "Peak Usage Pattern",
    description: "Highest activity: 2-5 PM EST",
  },
  {
    title: "Anomaly Detected",
    description: "Unusal spike in errors",
  },
  {
    title: "Cost Optimization",
    description: "Potential 15% savings",
  },
];

const Analytics = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [currDate, setCurrDate] = useState<Date>(today);
  const [prevDate, setPrevDate] = useState<Date>(yesterday);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex items-center justify-between px-10 py-4">
          <h1 className="text-2xl font-bold "> Analytics </h1>
          <div className="flex gap-2">
            <DatePicker date={currDate} onDateChange={setCurrDate} />
            <DatePicker date={prevDate} onDateChange={setPrevDate} />
            <div className="flex items-center gap-2 text-indigo-700 bg-white py-2 px-5 rounded-lg cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line"
              >
                <path d="M12 17V3" />
                <path d="m6 11 6 6 6-6" />
                <path d="M19 21H5" />
              </svg>
              Export
            </div>
          </div>
        </div>
        <div className=" grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-5">
            <LineChartCard
              title="Total Latency"
              value="125 ms"
              color="#303F9F"
              data={LineChartData}
            />
          </div>
          <div className="bg-white rounded-lg p-5">
            <LineChartCard
              title="Success Rate"
              value="120"
              color="#4CAF50"
              data={LineChartData2}
            />
          </div>
          <div className="bg-white rounded-lg p-5">
            <LineChartCard
              title="Resource Utilization"
              value="80%"
              color="#303F9F"
              data={LineChartData}
            />
          </div>
          <div className="bg-white rounded-lg p-5">
            <BarChartCard
              title="Total Request"
              label="1.2 M"
              color="#303F9F"
              data={BarChartData}
            />
          </div>
          <div className="bg-white rounded-lg p-5">
            <BarChartCard
              title="Request Trends"
              color="#303F9F"
              data={BarChartData}
            />
          </div>
          <div className="bg-white rounded-lg p-5">
            <h1 className="text-xl font-bold"> AI-Powered Insights </h1>
            <div className="flex flex-col gap-2 py-3">
              {insights.map((insight, index) => (
                <div key={index} className="bg-indigo-100 rounded-lg p-3">
                  <h1> {insight.title} </h1>
                  <p> {insight.description} </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LineChartCard = ({
  title,
  color,
  value,
  data,
}: {
  title: string;
  color: string;
  value: string;
  data: ChartDataProps;
}) => {
  return (
    <div className="bg-transparent pt-3 pb-6 px-3 flex flex-col gap-3">
      <div>
        <h1 className="font-bold text-xl text-gray-800 py-1"> {title} </h1>
        <h3 className={`font-bold text-2xl`} style={{ color: color }}>
          {" "}
          {value}{" "}
        </h3>
      </div>
      <Line
        data={data}
        options={{
          scales: {
            x: {
              beginAtZero: true,
            },
          },
          indexAxis: "x",
        }}
      />
    </div>
  );
};

const BarChartCard = ({
  title,
  label,
  color,
  data,
}: {
  title: string;
  label?: string;
  color: string;
  data: ChartDataProps;
}) => {
  return (
    <div className="bg-transparent pt-1 pb-6 px-3 flex flex-col gap-3">
      <div>
        <h1 className="font-bold text-xl text-gray-800 py-1"> {title} </h1>
        <h3 className={`font-bold text-2xl`} style={{ color: color }}>
          {" "}
          {label}{" "}
        </h3>
      </div>
      <Bar data={data} options={BarOptions} />
    </div>
  );
};

export default Analytics;
