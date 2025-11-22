import { Lock, Eye, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const PrivacySettings = () => {
  const handleExportData = () => {
    toast.success('Data export will be sent to your email');
  };

  return (
    <div className="space-y-6">
      {/* Privacy Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <Lock className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Privacy Controls</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Public Profile</p>
              <p className="text-sm text-gray-600">
                Allow others to see your profile and collection
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Show Collection Value</p>
              <p className="text-sm text-gray-600">
                Display the total value of your collection publicly
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Activity Status</p>
              <p className="text-sm text-gray-600">
                Show when you're online to other users
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <Download className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Your Data</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Download your data or request account information under GDPR regulations.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Download className="w-5 h-5 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Export Your Data</p>
                <p className="text-sm text-gray-600">Download all your account data</p>
              </div>
            </div>
            <span className="text-sm text-primary-600 font-semibold">Export</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Privacy Policy</p>
                <p className="text-sm text-gray-600">View our privacy policy</p>
              </div>
            </div>
            <span className="text-sm text-primary-600 font-semibold">View</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Data Access Request</p>
                <p className="text-sm text-gray-600">Request access to your data (GDPR)</p>
              </div>
            </div>
            <span className="text-sm text-primary-600 font-semibold">Request</span>
          </button>
        </div>
      </div>

      {/* Cookie Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Cookie Preferences</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Essential Cookies</p>
              <p className="text-sm text-gray-600">
                Required for the platform to function properly
              </p>
            </div>
            <span className="text-sm text-gray-500 font-medium">Always Active</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Analytics Cookies</p>
              <p className="text-sm text-gray-600">
                Help us understand how you use the platform
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
