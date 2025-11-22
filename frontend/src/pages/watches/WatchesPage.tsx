import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { watchesAPI } from '../../lib/api';
import { Link } from 'react-router-dom';
import { Watch, Plus, Search } from 'lucide-react';
import { LoadingSpinner } from '../../components/Loading';
import { useState } from 'react';

export const WatchesPage = () => {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: watchesData, isLoading } = useQuery({
    queryKey: ['watches', user?.id],
    queryFn: () => watchesAPI.getAll(user?.id),
  });

  const watches = watchesData?.data || [];
  const filteredWatches = watches.filter((watch: any) =>
    watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    watch.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    watch.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Watches</h1>
          <p className="text-gray-600 mt-1">Manage your luxury watch collection</p>
        </div>
        <Link
          to="/dashboard/watches/add"
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Watch
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by brand, model, or serial number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Watches Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredWatches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Watch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No watches found' : 'No watches yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search'
              : 'Start building your collection by adding your first watch'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWatches.map((watch: any) => (
            <Link
              key={watch.id}
              to={`/dashboard/watches/${watch.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Watch className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">
                    {watch.brand}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                <p className="text-gray-700 font-medium">{watch.model}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Serial: {watch.serialNumber}
                </p>
                {watch.year && (
                  <p className="text-sm text-gray-500">Year: {watch.year}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
