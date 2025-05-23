import { useState } from 'react';
import { uploadModel } from '@/lib/api';

interface ModelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModelUploadModal({ isOpen, onClose, onSuccess }: ModelUploadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model_type: '',
    version: '',
    docker_image: '',
    config: '{}',
    resource_limits: '{}',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Form data before submission:', formData);

    let configObj, resourceLimitsObj;
    try {
      configObj = formData.config ? JSON.parse(formData.config) : {};
      console.log('Parsed config:', configObj);
    } catch (err) {
      setError('Config must be valid JSON.');
      setLoading(false);
      return;
    }
    try {
      resourceLimitsObj = formData.resource_limits ? JSON.parse(formData.resource_limits) : {};
      console.log('Parsed resource limits:', resourceLimitsObj);
    } catch (err) {
      setError('Resource Limits must be valid JSON.');
      setLoading(false);
      return;
    }

    const modelData = {
      name: formData.name,
      description: formData.description,
      model_type: formData.model_type,
      version: formData.version,
      docker_image: formData.docker_image,
      config: configObj,
      resource_limits: resourceLimitsObj,
    };

    console.log('Sending model data to API:', modelData);

    try {
      await uploadModel(modelData);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload model. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Upload New Model</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Model Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="model_type" className="block text-sm font-medium text-gray-700 mb-1">
              Model Type
            </label>
            <input
              id="model_type"
              type="text"
              value={formData.model_type}
              onChange={(e) => setFormData(prev => ({ ...prev, model_type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
              Version
            </label>
            <input
              id="version"
              type="text"
              value={formData.version}
              onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="docker_image" className="block text-sm font-medium text-gray-700 mb-1">
              Docker Image
            </label>
            <input
              id="docker_image"
              type="text"
              value={formData.docker_image}
              onChange={(e) => setFormData(prev => ({ ...prev, docker_image: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="config" className="block text-sm font-medium text-gray-700 mb-1">
              Config (JSON)
            </label>
            <textarea
              id="config"
              value={formData.config}
              onChange={(e) => setFormData(prev => ({ ...prev, config: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              rows={3}
              required
            />
          </div>
          <div>
            <label htmlFor="resource_limits" className="block text-sm font-medium text-gray-700 mb-1">
              Resource Limits (JSON)
            </label>
            <textarea
              id="resource_limits"
              value={formData.resource_limits}
              onChange={(e) => setFormData(prev => ({ ...prev, resource_limits: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Model'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 