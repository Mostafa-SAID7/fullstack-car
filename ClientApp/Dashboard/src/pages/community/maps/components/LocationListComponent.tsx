import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trash2, Edit, Star, Users, CheckCircle } from 'lucide-react';
import { useLocations } from '../hooks/useLocations';
import { locationManagementService } from '../services/LocationManagementService';
import { LocationCategory } from '@/types/community/location';

export const LocationListComponent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<number | undefined>();

  const { locations, loading, error, refetch } = useLocations({
    pageNumber: currentPage,
    pageSize,
    category: filterCategory
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && locations) {
      setSelectedIds(locations.items.map(l => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0 || !confirm(`Delete ${selectedIds.length} location(s)?`)) return;
    try {
      await locationManagementService.bulkDelete(selectedIds);
      setSelectedIds([]);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete locations');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this location?')) return;
    try {
      await locationManagementService.deleteLocation(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete location');
    }
  };

  const getCategoryName = (category: LocationCategory): string => {
    switch (category) {
      case LocationCategory.Dealership: return 'Dealership';
      case LocationCategory.ServiceCenter: return 'Service Center';
      case LocationCategory.BodyShop: return 'Body Shop';
      case LocationCategory.PartsStore: return 'Parts Store';
      case LocationCategory.GasStation: return 'Gas Station';
      case LocationCategory.CarWash: return 'Car Wash';
      case LocationCategory.ParkingLot: return 'Parking Lot';
      case LocationCategory.ChargingStation: return 'Charging Station';
      case LocationCategory.RacingTrack: return 'Racing Track';
      case LocationCategory.Museum: return 'Museum';
      default: return 'Unknown';
    }
  };

  const getCategoryColor = (category: LocationCategory): string => {
    switch (category) {
      case LocationCategory.Dealership: return 'bg-blue-100 text-blue-800';
      case LocationCategory.ServiceCenter: return 'bg-green-100 text-green-800';
      case LocationCategory.BodyShop: return 'bg-purple-100 text-purple-800';
      case LocationCategory.PartsStore: return 'bg-orange-100 text-orange-800';
      case LocationCategory.GasStation: return 'bg-red-100 text-red-800';
      case LocationCategory.CarWash: return 'bg-cyan-100 text-cyan-800';
      case LocationCategory.ParkingLot: return 'bg-gray-100 text-gray-800';
      case LocationCategory.ChargingStation: return 'bg-yellow-100 text-yellow-800';
      case LocationCategory.RacingTrack: return 'bg-pink-100 text-pink-800';
      case LocationCategory.Museum: return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!locations) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Filters and Bulk Actions */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filters */}
            <select
              value={filterCategory || ''}
              onChange={(e) => setFilterCategory(e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-2 border border-border rounded-md text-sm"
            >
              <option value="">All Categories</option>
              <option value={LocationCategory.Dealership}>Dealership</option>
              <option value={LocationCategory.ServiceCenter}>Service Center</option>
              <option value={LocationCategory.BodyShop}>Body Shop</option>
              <option value={LocationCategory.PartsStore}>Parts Store</option>
              <option value={LocationCategory.GasStation}>Gas Station</option>
              <option value={LocationCategory.CarWash}>Car Wash</option>
              <option value={LocationCategory.ParkingLot}>Parking Lot</option>
              <option value={LocationCategory.ChargingStation}>Charging Station</option>
              <option value={LocationCategory.RacingTrack}>Racing Track</option>
              <option value={LocationCategory.Museum}>Museum</option>
            </select>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="btn btn-sm btn-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Locations Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === locations.items.length && locations.items.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Check-ins</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reviews</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {locations.items.map((location) => (
                  <tr key={location.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(location.id)}
                        onChange={(e) => handleSelectOne(location.id, e.target.checked)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {location.imageUrls && location.imageUrls.length > 0 ? (
                          <img
                            src={location.imageUrls[0]}
                            alt={location.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">{location.name}</p>
                          {location.phone && (
                            <p className="text-xs text-muted-foreground">{location.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(location.category)}`}>
                        {getCategoryName(location.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-foreground">
                        <p>{location.city}</p>
                        <p className="text-xs text-muted-foreground">{location.country}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-foreground">{location.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4" />
                        <span>{location.checkInsCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{location.reviewsCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-1 hover:bg-muted rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(location.id)}
                          className="p-1 hover:bg-destructive/10 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, locations.totalCount)} of {locations.totalCount} locations
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-sm"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {locations.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(locations.totalPages, p + 1))}
            disabled={currentPage === locations.totalPages}
            className="btn btn-sm"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};
