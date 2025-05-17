import { Doughnut, Line, Bar, Chart as RChart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  Tooltip,
  Legend,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  Chart,
} from "chart.js";
import {
  BarChartData,
  BarOptions,
  ChartDataProps,
  HalfDoughnutData,
  HalfDoughnutOption,
  HDCenterTextPlugin,
  LineData,
  LineData2,
  MixBarData,
  MixBarOptions,
  PieData,
} from "../constant/Dashboard.data";
import { MoveDown, TrendingDown } from "lucide-react";
import { ModelArray } from "../constant/constant";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: false,
      grid: {
        display: false, // Remove vertical grid lines
      },
      ticks: { color: "#666" },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
      ticks: { color: "#666" },
    },
  },
};

const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart: Chart) => {
    const { width, height, ctx } = chart;
    ctx.save();
    ctx.font = `2em sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const text = "$12,478"; // Change this value dynamically if needed
    const textX = width / 2;
    const textY = height / 2; // Adjusted for full doughnut chart

    ctx.fillText(text, textX, textY);
    ctx.restore();
  },
};

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex items-center gap-10 px-10 py-4 text-gray-900">
          <h1 className="font-bold text-xl"> AI Control </h1>
          <input
            type="text"
            placeholder="Search models, costs, alerts"
            className="border-2 border-gray-500 rounded-lg px-5 py-2 text-md w-60 outline-none"
          />
        </div>
        <div className="">
          <div className="grid grid-cols-3 grid-rows-2 gap-5 items-center pb-5">
            <div className=" bg-white row-span-2 rounded-md flex flex-col gap-3 px-10 py-5">
              <div className="flex justify-between p-5 ">
                <h1 className="text-xl font-semibold"> Open AI </h1>
                <button className="text-base border-2 px-2 py-1 rounded-md tracking-tight cursor-pointer text-indigo-600">
                  {" "}
                  View All{" "}
                </button>
              </div>
              <div className="max-h-[250px] mx-auto">
                <Doughnut
                  data={PieData}
                  options={{
                    responsive: true,
                    cutout: "70%",
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                  plugins={[centerTextPlugin]}
                />
              </div>
              <h1 className="text-center font-bold text-lg">
                {" "}
                40% under budget{" "}
              </h1>
              <div className="bg-green-300/50 mx-10 rounded-md p-5">
                <div className="flex justify-between">
                  <TrendingDown />
                  <div className="flex">
                    <MoveDown className="text-base" />
                    5%
                  </div>
                </div>
                <div>Per Hour</div>
                <h1 className="text-xl font-bold"> $ 1.25 </h1>
              </div>
              <div className="mx-10 rounded-md px-5 bg-gray-100/50 py-5 mb-5">
                <div> Statistics </div>
                <Line data={LineData} options={options} />
              </div>
            </div>
            <div className="h-full col-span-2 bg-white grid grid-cols-2 gap-3 gap-y-0.5 px-6 py-0 rounded-md">
              {ModelArray.map((item, idx) => (
                <ModelCard
                  key={idx}
                  img={item.img}
                  title={item.title}
                  data={item.data}
                  value={item.value}
                  footerValue={item.footerValue}
                  footerText={item.footerText}
                  className="w-full"
                />
              ))}
            </div>
            <div className=" bg-white rounded-md p-5 h-full">
              <div className="flex justify-between ">
                <h1 className="text-xl font-semibold"> Model Status </h1>
                <button className="text-base border-2 px-2 py-1 rounded-md tracking-tight cursor-pointer text-indigo-600">
                  {" "}
                  View All{" "}
                </button>
              </div>
              <div className="h-[180px] mx-auto">
                <Bar
                  data={BarChartData}
                  options={BarOptions}
                  className="h-full "
                />
              </div>
              <div className=" flex flex-col gap-3">
                <h1 className="text-lg font-semibold">
                  {" "}
                  System Notifications{" "}
                </h1>
                <div className="bg-gray-100 px-5 py-3 rounded-md">
                  <h2 className="text-blue-700 font-medium">
                    {" "}
                    Model Health Alerts{" "}
                  </h2>
                  <div> Next scheduled maintenance: 2025-01-2020</div>
                </div>
              </div>
            </div>
            <div className=" bg-white rounded-md p-5 h-full">
              <div className="flex justify-between ">
                <h1 className="text-xl font-semibold"> Model Status </h1>
                <button className="text-base border-2 px-2 py-1 rounded-md tracking-tight cursor-pointer text-indigo-600">
                  {" "}
                  View All{" "}
                </button>
              </div>
              <div className="h-[180px] mx-auto">
                <Doughnut
                  data={HalfDoughnutData}
                  options={HalfDoughnutOption}
                  plugins={[HDCenterTextPlugin]}
                  className="mx-auto w-full"
                />
              </div>
              <div className=" flex flex-col gap-3">
                <h1 className="text-lg font-semibold">Running: 15 models</h1>
                <div className="bg-gray-100 px-5 py-3 rounded-md">
                  <h2 className="text-blue-700 font-medium">
                    {" "}
                    Critical Alerts{" "}
                  </h2>
                  <div> ⚠️ Performance degradation detected</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 pb-5">
            <div className="bg-white rounded-md px-7 py-8">
              <h1 className="font-semibold text-lg"> Alert & Insights </h1>
              <div>
                <Line data={LineData2} />
              </div>
            </div>
            <div className="bg-white rounded-md px-7 py-8">
              <h1 className="font-semibold text-lg">
                {" "}
                Cost threshold Reached for Model{" "}
              </h1>
              <div>
                <RChart type="bar" data={MixBarData} options={MixBarOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ModelCardProps {
  img: string;
  title: string;
  value: string;
  data: ChartDataProps;
  footerValue: string;
  footerText: string;
  className?: string;
}

const ModelCard = ({
  img,
  title,
  value,
  data,
  footerText,
  footerValue,
  className,
}: ModelCardProps) => (
  <div
    className={`w-fit m-3 border-[1px] border-gray-200 rounded-md cursor-pointer ${className}`}
  >
    <div className="flex items-center justify-evenly border-b-[1px] border-gray-300">
      {" "}
      <img src={img} alt={"icon1"} height={100} width={100} />
      <div className="text-center">
        <p> {title} </p>
        <h1 className="font-bold text-lg"> {value}</h1>
      </div>
      <div className="size-24  flex items-center justify-center px-1 h-20 rounded-md">
        <Line data={data} options={options} />
      </div>
    </div>
    <div className="flex gap-5 px-6 py-2 justify-center">
      <div className="text-base rounded-full bg-green-200/80 w-fit px-2">
        {footerValue}
      </div>
      <p> {footerText} </p>
    </div>
  </div>
);

export default Dashboard;
