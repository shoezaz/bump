import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { watchesAPI, transfersAPI } from '../../lib/api';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/Loading';
import toast from 'react-hot-toast';

export const TransferPage = () => {
  const { watchId } = useParams();
  const navigate = useNavigate();
  const [transfer, setTransfer] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds

  const { data: watchData, isLoading } = useQuery({
    queryKey: ['watch', watchId],
    queryFn: () => watchesAPI.getById(watchId!),
  });

  const watch = watchData?.data;

  const createTransferMutation = useMutation({
    mutationFn: (data: any) => transfersAPI.create(data),
    onSuccess: (response) => {
      setTransfer(response.data);
      toast.success('Transfer initiated! Show QR code to buyer.');
    },
    onError: () => {
      toast.error('Failed to initiate transfer');
    },
  });

  useEffect(() => {
    if (watch && !transfer) {
      createTransferMutation.mutate({
        watchId: watch.id,
        fromUserId: watch.currentOwnerId,
      });
    }
  }, [watch]);

  // Countdown timer
  useEffect(() => {
    if (!transfer) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('QR code expired. Please create a new transfer.');
          navigate(`/dashboard/watches/${watchId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [transfer, navigate, watchId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading || createTransferMutation.isPending) {
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
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Transfer Ownership
          </h1>
          <p className="text-gray-600">
            {watch.brand} {watch.model}
          </p>
          <p className="text-sm text-gray-500">Serial: {watch.serialNumber}</p>
        </div>

        {transfer && (
          <>
            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="p-8 bg-white rounded-lg border-2 border-gray-200">
                <QRCodeSVG
                  value={transfer.qrToken}
                  size={256}
                  level="H"
                  includeMargin
                />
              </div>
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center px-6 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 mr-2" />
                <span className="text-2xl font-bold text-amber-600">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                QR code expires in {formatTime(timeRemaining)}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Transfer Instructions:
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold mr-3 mt-0.5">
                    1
                  </span>
                  <span>Ask the buyer to scan this QR code with their Watch Passport app</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold mr-3 mt-0.5">
                    2
                  </span>
                  <span>The buyer must be logged in with a verified KYC account</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold mr-3 mt-0.5">
                    3
                  </span>
                  <span>You'll receive a confirmation once the transfer is complete</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold mr-3 mt-0.5">
                    4
                  </span>
                  <span>This QR code expires in 2 minutes for security</span>
                </li>
              </ol>
            </div>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Security:</strong> This transfer will be recorded on the blockchain
                and cannot be reversed once completed. Ensure you trust the buyer before
                proceeding.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
