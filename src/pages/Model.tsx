import { useState, useEffect } from 'react';
import { getModels } from '@/lib/api';
import { ModelUploadModal } from '@/components/ModelUploadModal';
import { DeployModelDropdown } from '@/components/DeployModelDropdown';
import { Toaster } from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChartOptions,
  CostPerHourData,
  PerformanceData,
  PerformanceDataOptions,
  StackBarChartData,
} from "@/constant/LineChart.data";
import { Bar, Doughnut, Line } from "react-chartjs-2";

interface Model {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'STOPPED' | 'PENDING';
  performance: number;
}

const Models = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchModels = async () => {
    try {
      const data = await getModels();
      setModels(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-10">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
          <div className="flex items-center gap-2 justify-between">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="w-20 h-6 bg-gray-200 rounded" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No models found</h3>
      <p className="text-gray-600 mb-6">Upload your first model to get started!</p>
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="bg-indigo-700 px-6 py-3 rounded-lg text-white font-semibold text-lg hover:bg-indigo-800 transition-colors"
      >
        Deploy New Model
      </button>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-[1320px] mx-auto flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10 justify-start px-4 sm:px-10 py-4 text-gray-900">
          <h1 className="font-bold text-2xl">Models</h1>
          <input
            type="text"
            placeholder="Search models, costs, alerts"
            className="border-2 border-gray-500 rounded-lg px-5 py-2 text-md w-full sm:w-60 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {error && (
          <div className="mx-4 sm:mx-10 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          renderSkeletonLoader()
        ) : models.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-4 sm:px-10">
            {models.map((model) => (
              <ModelCard
                key={model.id}
                icon={"/icons/chatgpt.png"}
                title={model.name}
                state={model.status}
                value={`${model.performance}%`}
                isPositive={model.status === 'ACTIVE'}
                className={model.status === 'ACTIVE' ? 'bg-green-100' : 'bg-red-50'}
                deployButton={
                  <DeployModelDropdown
                    modelId={model.id}
                    modelName={model.name}
                    onSuccess={fetchModels}
                  />
                }
              />
            ))}
            <div className="bg-transparent flex justify-center items-center">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-indigo-700 px-5 py-5 rounded-lg text-white font-semibold text-xl cursor-pointer hover:bg-indigo-800 transition-colors w-full"
              >
                Deploy New Model
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-4 sm:px-10 mb-5">
          <div className="bg-white row-span-2 col-span-2 py-5 px-4 sm:px-8 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-bold text-gray-900">Cost per hour</h3>
              <div>
                <Select>
                  <SelectTrigger className="w-[180px] text-black">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Line
                data={CostPerHourData}
                options={{
                  plugins: {
                    legend: {
                      position: "top" as const,
                      labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 20,
                      },
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-5">
            <h1 className="text-xl font-bold text-gray-900 py-2">
              Health Monitoring
            </h1>
            <Bar data={StackBarChartData} options={BarChartOptions} />
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-5">
            <h1 className="text-xl font-bold text-gray-900 py-2">
              Performance
            </h1>
            <div className="w-[80%] mx-auto">
              <Doughnut
                data={PerformanceData}
                options={PerformanceDataOptions}
              />
            </div>
          </div>
        </div>
      </div>

      <ModelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchModels}
      />
    </div>
  );
};

const ModelCard = ({
  icon,
  title,
  state,
  value,
  isPositive,
  className,
  deployButton,
}: {
  icon: string;
  title: string;
  state: string;
  value: string;
  isPositive: boolean;
  className?: string;
  deployButton?: React.ReactNode;
}) => {
  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Deployed' },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      STOPPED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Stopped' },
    };
    const badge = badges[status as keyof typeof badges] || badges.STOPPED;
    return (
      <span className={`${badge.bg} ${badge.text} px-2 py-1 rounded-full text-xs font-medium absolute top-2 right-2`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div
      className={`rounded-lg shadow-md p-4 flex flex-col gap-5 py-8 px-5 ${className} relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out`}
    >
      {getStatusBadge(state)}
      <div className="flex items-center gap-2 justify-between">
        <img
          src={icon}
          alt={title}
          className="w-10 h-10"
          width={40}
          height={40}
        />
        <div
          className={`${
            isPositive ? "text-green-500" : "text-red-500"
          } font-bold`}
        >
          <span>{isPositive ? "↑" : "↓"}</span> {value}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-gray-900 font-bold text-2xl">{title}</div>
        <div className="font-semibold flex items-center gap-2 px-2">
          <div
            className={`${
              isPositive ? "bg-green-500" : "bg-red-500"
            } rounded-full size-3`}
          />
          {state}
        </div>
        {deployButton && (
          <div className="mt-2">
            {deployButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default Models;
