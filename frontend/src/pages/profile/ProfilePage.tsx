import { useAuthStore } from '../../stores/authStore';
import { User, Mail, Shield, Award } from 'lucide-react';

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email}
              </h2>
              <p className="text-gray-600 capitalize">{user?.userType}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <Mail className="w-5 h-5 mr-3 text-gray-400" />
              <span>{user?.email}</span>
            </div>

            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3 text-gray-400" />
              <span className="text-gray-700 mr-2">KYC Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.kycStatus === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : user?.kycStatus === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {user?.kycStatus}
              </span>
            </div>

            {user?.kycStatus === 'pending' && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Action Required:</strong> Complete your KYC verification to unlock full
                  platform features including transfers and high-value watch registration.
                </p>
                <button className="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  Complete KYC Verification
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Account Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Member Type</span>
              <span className="font-semibold text-gray-900 capitalize">
                {user?.userType}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reputation</span>
              <div className="flex items-center">
                <Award className="w-4 h-4 text-amber-500 mr-1" />
                <span className="font-semibold text-gray-900">0</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Verified</span>
              <span className={`font-semibold ${
                user?.kycStatus === 'verified' ? 'text-green-600' : 'text-amber-600'
              }`}>
                {user?.kycStatus === 'verified' ? 'Yes' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
