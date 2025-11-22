import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { watchesAPI } from '../../lib/api';
import { Link } from 'react-router-dom';
import { Watch, Plus, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/Loading';

export const DashboardHome = () => {
  const user = useAuthStore((state) => state.user);

  const { data: watchesData, isLoading } = useQuery({
    queryKey: ['watches', user?.id],
    queryFn: () => watchesAPI.getAll(user?.id),
  });

  const watches = watchesData?.data || [];
  const certifiedCount = watches.filter((w: any) => w.status === 'certified').length;
  const warningCount = watches.filter((w: any) => w.status === 'warning').length;
  const stolenCount = watches.filter((w: any) => w.status === 'stolen').length;

  const stats = [
    {
      name: 'Total Watches',
      value: watches.length,
      icon: Watch,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Certified',
      value: certifiedCount,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Warnings',
      value: warningCount,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      name: 'Stolen Reports',
      value: stolenCount,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || user?.email}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your luxury watch collection securely
          </p>
        </div>
        <Link
          to="/dashboard/watches/add"
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Watch
        </Link>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.name}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Watches */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Watches</h2>
                <Link
                  to="/dashboard/watches"
                  className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {watches.length === 0 ? (
                <div className="text-center py-12">
                  <Watch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No watches yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start building your collection by adding your first watch
                  </p>
                  <Link
                    to="/dashboard/watches/add"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Watch
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {watches.slice(0, 5).map((watch: any) => (
                    <Link
                      key={watch.id}
                      to={`/dashboard/watches/${watch.id}`}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Watch className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {watch.brand} {watch.model}
                          </p>
                          <p className="text-sm text-gray-500">
                            Serial: {watch.serialNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
