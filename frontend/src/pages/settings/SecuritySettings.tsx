import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Shield, Smartphone, Clock, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';

export const SecuritySettings = () => {
  const user = useAuthStore((state) => state.user);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Mock active sessions
  const sessions = [
    {
      id: '1',
      device: 'Chrome on MacOS',
      location: 'Paris, France',
      lastActive: '2 minutes ago',
      current: true,
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'Paris, France',
      lastActive: '2 hours ago',
      current: false,
    },
  ];

  const handleEnable2FA = () => {
    toast.success('2FA setup will be available soon');
  };

  const handleRevokeSession = (sessionId: string) => {
    toast.success('Session revoked successfully');
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Smartphone className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h2>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              twoFactorEnabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        <p className="text-gray-600 mb-6">
          Add an extra layer of security to your account by requiring a verification code
          in addition to your password when signing in.
        </p>

        {!twoFactorEnabled ? (
          <button
            onClick={handleEnable2FA}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            Enable Two-Factor Authentication
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✓ Two-factor authentication is protecting your account
              </p>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(false)}
              className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors"
            >
              Disable Two-Factor Authentication
            </button>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <Monitor className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Active Sessions</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Manage your active sessions and sign out from devices you don't recognize.
        </p>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Monitor className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">{session.location}</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {session.lastActive}
                  </p>
                </div>
              </div>

              {!session.current && (
                <button
                  onClick={() => handleRevokeSession(session.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 border border-red-600 rounded-lg transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="mt-4 text-sm text-red-600 hover:text-red-700 font-semibold">
          Sign out from all other sessions
        </button>
      </div>

      {/* Security Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Security Recommendations</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-start p-3 bg-gray-50 rounded-lg">
            <span className="text-green-600 mr-3">✓</span>
            <div>
              <p className="font-medium text-gray-900">Strong password</p>
              <p className="text-sm text-gray-600">Your password meets security requirements</p>
            </div>
          </div>

          <div className="flex items-start p-3 bg-amber-50 rounded-lg">
            <span className="text-amber-600 mr-3">⚠</span>
            <div>
              <p className="font-medium text-gray-900">Enable two-factor authentication</p>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>

          <div className="flex items-start p-3 bg-gray-50 rounded-lg">
            <span className="text-green-600 mr-3">✓</span>
            <div>
              <p className="font-medium text-gray-900">Email verified</p>
              <p className="text-sm text-gray-600">Your email address has been verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
