import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { watchesAPI } from '../../lib/api';
import { ArrowLeft, Share2, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import { LoadingSpinner } from '../../components/Loading';
import { ReportStolenModal } from '../../components/watches/ReportStolenModal';

export const WatchDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: watchData, isLoading } = useQuery({
    queryKey: ['watch', id],
    queryFn: () => watchesAPI.getById(id!),
  });

  const { data: historyData } = useQuery({
    queryKey: ['watch-history', id],
    queryFn: () => watchesAPI.getHistory(id!),
  });

  const watch = watchData?.data;
  const history = historyData?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Watch not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Watches
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Image */}
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-sm">No image uploaded</p>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{watch.brand}</h1>
                  <p className="text-xl text-gray-700">{watch.model}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    watch.status === 'certified'
                      ? 'bg-green-100 text-green-800'
                      : watch.status === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {watch.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Serial Number</p>
                  <p className="font-semibold text-gray-900">{watch.serialNumber}</p>
                </div>
                {watch.reference && (
                  <div>
                    <p className="text-sm text-gray-600">Reference</p>
                    <p className="font-semibold text-gray-900">{watch.reference}</p>
                  </div>
                )}
                {watch.year && (
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-semibold text-gray-900">{watch.year}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/dashboard/transfer/${watch.id}`}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Transfer Ownership
                </Link>
                {watch.status !== 'stolen' && (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors"
                  >
                    Report Stolen
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">History</h2>
            {history.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No history recorded yet</p>
            ) : (
              <div className="space-y-4">
                {history.map((event: any) => (
                  <div key={event.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 capitalize">
                        {event.eventType.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      {event.entityName && (
                        <p className="text-sm text-gray-500 mt-1">By: {event.entityName}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(event.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Valuation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Valuation</h3>
            <div className="space-y-3">
              {watch.purchasePrice && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Purchase Price</span>
                  <span className="font-semibold text-gray-900">
                    ${watch.purchasePrice.toLocaleString()}
                  </span>
                </div>
              )}
              {watch.currentValue && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Current Value</span>
                  <span className="font-semibold text-green-600">
                    ${watch.currentValue.toLocaleString()}
                  </span>
                </div>
              )}
              {watch.purchasePrice && watch.currentValue && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Appreciation</span>
                    <span className={`font-semibold ${
                      watch.currentValue > watch.purchasePrice ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {((watch.currentValue - watch.purchasePrice) / watch.purchasePrice * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Blockchain */}
          {watch.blockchainHash && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Blockchain</h3>
              <p className="text-xs text-gray-500 break-all">
                {watch.blockchainHash}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Verified on blockchain
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Report Stolen Modal */}
      <ReportStolenModal
        watch={watch}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
};
