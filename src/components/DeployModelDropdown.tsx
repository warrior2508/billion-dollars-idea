import { useState } from 'react';
import { deployModel } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DeployModelDropdownProps {
  modelId: string;
  modelName: string;
  onSuccess: () => void;
}

export function DeployModelDropdown({ modelId, modelName, onSuccess }: DeployModelDropdownProps) {
  const [loading, setLoading] = useState(false);

  const handleDeploy = async (cloudProvider: 'AWS' | 'GCP' | 'Azure') => {
    setLoading(true);
    const toastId = toast.loading(`Deploying ${modelName} to ${cloudProvider}...`);

    try {
      await deployModel(modelId, cloudProvider);
      toast.success(`Successfully deployed ${modelName} to ${cloudProvider}!`, {
        id: toastId,
      });
      onSuccess();
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || `Failed to deploy to ${cloudProvider}. Please try again.`,
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <Select
        onValueChange={(value: 'AWS' | 'GCP' | 'Azure') => handleDeploy(value)}
        disabled={loading}
      >
        <SelectTrigger 
          className={`w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''} bg-white hover:bg-gray-50 transition-colors`}
        >
          <SelectValue placeholder={loading ? "Deploying..." : "Deploy to..."} />
        </SelectTrigger>
        <SelectContent className="w-full min-w-[200px]">
          <SelectItem value="AWS" disabled={loading} className="cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-2 py-1">
              <img src="/icons/aws.png" alt="AWS" className="w-5 h-5" />
              <span>AWS</span>
            </div>
          </SelectItem>
          <SelectItem value="GCP" disabled={loading} className="cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-2 py-1">
              <img src="/icons/gcp.png" alt="GCP" className="w-5 h-5" />
              <span>Google Cloud</span>
            </div>
          </SelectItem>
          <SelectItem value="Azure" disabled={loading} className="cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-2 py-1">
              <img src="/icons/azure.png" alt="Azure" className="w-5 h-5" />
              <span>Azure</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 