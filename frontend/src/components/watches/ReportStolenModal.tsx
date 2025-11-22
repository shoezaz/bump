import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsAPI, watchesAPI } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReportStolenModalProps {
  watch: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportStolenModal = ({ watch, isOpen, onClose }: ReportStolenModalProps) => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    theftDate: '',
    policeReference: '',
    location: '',
    confirmed: false,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => reportsAPI.create(data),
    onSuccess: async () => {
      // Update watch status
      await watchesAPI.update(watch.id, { status: 'stolen' });

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['watch', watch.id] });
      queryClient.invalidateQueries({ queryKey: ['watches'] });

      toast.success('Stolen report submitted successfully. Blockchain record created.');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.confirmed) {
      toast.error('Please confirm that you understand this action is irreversible');
      return;
    }

    mutation.mutate({
      watchId: watch.id,
      reportedById: user?.id,
      theftDate: formData.theftDate,
      policeReference: formData.policeReference || undefined,
      location: formData.location || undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 relative animate-scaleIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Report Stolen</h2>
            <p className="text-sm text-gray-600">
              {watch.brand} {watch.model}
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 font-medium mb-2">
            ⚠️ Important: This action is irreversible
          </p>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• A permanent record will be created on the blockchain</li>
            <li>• All dealers and manufacturers will be notified</li>
            <li>• The watch will be flagged in our global database</li>
            <li>• False reports may result in legal action</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Theft *
            </label>
            <input
              type="date"
              name="theftDate"
              required
              value={formData.theftDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Police Reference Number
            </label>
            <input
              type="text"
              name="policeReference"
              value={formData.policeReference}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="POL-2025-123456"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: File a police report first
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location of Theft
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Paris, France"
            />
          </div>

          {/* Confirmation checkbox */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="confirmed"
              id="confirmed"
              checked={formData.confirmed}
              onChange={handleChange}
              className="mt-1 mr-3 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="confirmed" className="text-sm text-gray-700">
              I understand this creates a permanent blockchain record and may have legal
              implications if the information is false.
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !formData.confirmed}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              {mutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
