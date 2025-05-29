import { useEffect, useState } from 'react';
import { getModels } from '@/lib/api';

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

// Mock metrics generator
const generateMockMetrics = () => ({
  latency: (Math.random() * 500 + 100).toFixed(2) + ' ms',
  throughput: (Math.random() * 50 + 10).toFixed(2) + ' r/s',
  accuracy: (Math.random() * 10 + 90).toFixed(2) + '%'
});

export default function ModelPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchModels();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Uploaded Models</h1>

      {loading && <p>Loading models...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && models.length === 0 && <p>No models found.</p>}

      {!loading && models.length > 0 && (
        <div className="space-y-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{model.name}</h2>
                <span className="text-sm px-2 py-1 bg-gray-100 rounded-md">
                  {model.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Type:</strong> {model.model_type}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Version:</strong> {model.version}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Docker Image:</strong> {model.docker_image}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Created:</strong>{' '}
                {new Date(model.created_at).toLocaleString()}
              </p>

              {model.metrics && (
                <div className="mt-4">
                  <h3 className="font-medium mb-1 text-gray-800">Performance Metrics</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Latency:</span> {model.metrics.latency}
                    </div>
                    <div>
                      <span className="font-medium">Throughput:</span> {model.metrics.throughput}
                    </div>
                    <div>
                      <span className="font-medium">Accuracy:</span> {model.metrics.accuracy}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
