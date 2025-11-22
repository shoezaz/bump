import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { User, Shield, Bell, Lock, HelpCircle } from 'lucide-react';

export const SettingsLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Account', href: '/dashboard/settings/account', icon: User },
    { name: 'Security', href: '/dashboard/settings/security', icon: Shield },
    { name: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell },
    { name: 'Privacy', href: '/dashboard/settings/privacy', icon: Lock },
    { name: 'Help & Support', href: '/dashboard/settings/help', icon: HelpCircle },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1 bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
