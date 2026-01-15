import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, CheckCircle, Users } from 'lucide-react';
import { useLocations } from '../hooks/useLocations';
import { LocationCategory } from '@/types/community/location';

export const LocationAnalyticsComponent: React.FC = () => {
  const { locations, loading } = useLocations({ pageNumber: 1, pageSize: 100 });

  if (loading || !locations) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalCheckIns = locations.items.reduce((sum, l) => sum + l.checkInsCount, 0);
  const totalReviews = locations.items.reduce((sum, l) => sum + l.reviewsCount, 0);
  const avgRating = locations.items.length > 0 
    ? (locations.items.reduce((sum, l) => sum + l.rating, 0) / locations.items.length).toFixed(1)
    : 0;

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

  // Category distribution
  const categoryDistribution = [
    { category: LocationCategory.Dealership, name: 'Dealership', count: locations.items.filter(l => l.category === LocationCategory.Dealership).length },
    { category: LocationCategory.ServiceCenter, name: 'Service Center', count: locations.items.filter(l => l.category === LocationCategory.ServiceCenter).length },
    { category: LocationCategory.BodyShop, name: 'Body Shop', count: locations.items.filter(l => l.category === LocationCategory.BodyShop).length },
    { category: LocationCategory.PartsStore, name: 'Parts Store', count: locations.items.filter(l => l.category === LocationCategory.PartsStore).length },
    { category: LocationCategory.GasStation, name: 'Gas Station', count: locations.items.filter(l => l.category === LocationCategory.GasStation).length },
    { category: LocationCategory.CarWash, name: 'Car Wash', count: locations.items.filter(l => l.category === LocationCategory.CarWash).length },
    { category: LocationCategory.ParkingLot, name: 'Parking Lot', count: locations.items.filter(l => l.category === LocationCategory.ParkingLot).length },
    { category: LocationCategory.ChargingStation, name: 'Charging Station', count: locations.items.filter(l => l.category === LocationCategory.ChargingStation).length },
    { category: LocationCategory.RacingTrack, name: 'Racing Track', count: locations.items.filter(l => l.category === LocationCategory.RacingTrack).length },
    { category: LocationCategory.Museum, name: 'Museum', count: locations.items.filter(l => l.category === LocationCategory.Museum).length }
  ].filter(c => c.count > 0);

  const stats = [
    {
      label: 'Total Locations',
      value: locations.totalCount,
      icon: MapPin,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Average Rating',
      value: avgRating,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Total Check-ins',
      value: totalCheckIns.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Total Reviews',
      value: totalReviews.toLocaleString(),
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Distribution */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Category Distribution</h3>
          <p className="text-sm text-muted-foreground">Breakdown by location category</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {categoryDistribution.map(({ name, count }) => {
              const percentage = locations.items.length > 0 
                ? ((count / locations.items.length) * 100).toFixed(0)
                : 0;
              return (
                <div key={name} className="flex items-center space-x-4">
                  <div className="w-32">
                    <span className="text-sm font-medium text-foreground">{name}</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground w-24 text-right">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Rated Locations */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Top Rated Locations</h3>
          <p className="text-sm text-muted-foreground">Highest rated locations</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {locations.items
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 10)
              .map((location) => (
                <div key={location.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    {location.imageUrls && location.imageUrls.length > 0 ? (
                      <img
                        src={location.imageUrls[0]}
                        alt={location.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{location.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getCategoryName(location.category)} • {location.city}, {location.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-foreground">{location.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Most Popular Locations */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Most Popular Locations</h3>
          <p className="text-sm text-muted-foreground">Locations with most check-ins</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {locations.items
              .sort((a, b) => b.checkInsCount - a.checkInsCount)
              .slice(0, 10)
              .map((location) => (
                <div key={location.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    {location.imageUrls && location.imageUrls.length > 0 ? (
                      <img
                        src={location.imageUrls[0]}
                        alt={location.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{location.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getCategoryName(location.category)} • {location.city}, {location.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-foreground">{location.checkInsCount}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
