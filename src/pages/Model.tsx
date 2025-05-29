import { useEffect, useState } from 'react';
import { getModels } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ModelUploadModal } from '@/components/ModelUploadModal'; // Adjust path as needed

interface Model {
  id: number;
  name: string;
  description: string;
  model_type: string;
  version: string;
  docker_image: string;
  status: string;
  config: any;
  resource_limits: any;
  created_at: string;
  metrics?: {
    latency: string;
    throughput: string;
    accuracy: string;
  };
}

const generateMockMetrics = () => ({
  latency: (Math.random() * 500 + 100).toFixed(2) + ' ms',
  throughput: (Math.random() * 50 + 10).toFixed(2) + ' r/s',
  accuracy: (Math.random() * 10 + 90).toFixed(2) + '%'
});

export default function ModelPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchModels = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getModels();
      const validModels = data.filter((model: any) =>
        model.name && model.model_type && model.version && model.docker_image
      );
      const modelsWithMetrics = validModels.map((model: any) => ({
        ...model,
        metrics: generateMockMetrics()
      }));
      setModels(modelsWithMetrics);
    } catch (err: any) {
      console.error('Error loading models:', err);
      setError('Failed to load models. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10 justify-between px-4 sm:px-10 py-4 text-gray-900">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <h1 className="font-bold text-2xl">Models</h1>
          <input
            type="text"
            placeholder="Search models, costs, alerts"
            className="border-2 border-gray-500 rounded-lg px-5 py-2 text-md w-full sm:w-60 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-indigo-700 px-5 py-2 rounded-lg text-white font-semibold text-md hover:bg-indigo-800 transition-colors"
        >
          Deploy New Model
        </button>
      </div>

      <ModelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchModels}
      />

      {loading && <p>Loading models...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && models.length === 0 && <p>No models found.</p>}

      {!loading && models.length > 0 && (
        <div className="space-y-6">
          {models.map((model) => (
            <div key={model.id} className="border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{model.name}</h2>
                <span className="text-sm px-2 py-1 bg-gray-100 rounded-md">{model.status}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1"><strong>Type:</strong> {model.model_type}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Version:</strong> {model.version}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Docker Image:</strong> {model.docker_image}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Created:</strong> {new Date(model.created_at).toLocaleString()}</p>

              {model.metrics && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2 text-gray-800">Performance Metrics</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={[{
                        name: 'Metrics',
                        latency: parseFloat(model.metrics.latency),
                        throughput: parseFloat(model.metrics.throughput),
                        accuracy: parseFloat(model.metrics.accuracy)
                      }]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" hide />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="latency" stroke="#8884d8" name="Latency (ms)" />
                      <Line type="monotone" dataKey="throughput" stroke="#82ca9d" name="Throughput (r/s)" />
                      <Line type="monotone" dataKey="accuracy" stroke="#ffc658" name="Accuracy (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
