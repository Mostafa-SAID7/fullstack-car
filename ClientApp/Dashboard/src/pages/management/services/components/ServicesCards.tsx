import React from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  Clock, 
  DollarSign,
  MapPin,
  Shield,
  Zap,
  Calendar,
  Users
} from 'lucide-react';
import type { Service } from '../types';

interface ServicesCardsProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onView: (service: Service) => void;
}

export const ServicesCards: React.FC<ServicesCardsProps> = ({
  services,
  onEdit,
  onDelete,
  onView
}) => {
  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'text-green-600 bg-green-50 border-green-200';
      case 0: return 'text-gray-600 bg-gray-50 border-gray-200';
      case 2: return 'text-red-600 bg-red-50 border-red-200';
      case 3: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: number) => {
    switch (type) {
      case 1: return <Shield className="w-5 h-5" />;
      case 2: return <Edit className="w-5 h-5" />;
      case 3: return <Eye className="w-5 h-5" />;
      case 4: return <Zap className="w-5 h-5" />;
      case 5: return <MapPin className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: number) => {
    switch (type) {
      case 1: return 'text-blue-600 bg-blue-50';
      case 2: return 'text-red-600 bg-red-50';
      case 3: return 'text-green-600 bg-green-50';
      case 4: return 'text-purple-600 bg-purple-50';
      case 5: return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">No services found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by creating a new service.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div
          key={service.id}
          className="bg-card rounded-lg border border-border hover:shadow-lg transition-shadow duration-200"
        >
          {/* Service Image */}
          {service.imageUrl && (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </div>
          )}

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(service.type)} mr-3`}>
                    {getTypeIcon(service.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{service.typeName}</p>
                  </div>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(service.status)}`}>
                {service.statusName}
              </span>
            </div>

            {/* Description */}
            {service.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {service.description}
              </p>
            )}

            {/* Provider */}
            <div className="flex items-center mb-4">
              <Users className="w-4 h-4 text-muted-foreground mr-2" />
              <span className="text-sm text-foreground">{service.serviceProviderName}</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-muted-foreground mr-1" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    ${service.basePrice}
                    {service.maxPrice && service.maxPrice !== service.basePrice && (
                      <span className="text-muted-foreground"> - ${service.maxPrice}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Price</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {service.estimatedDuration}
                  </div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>
            </div>

            {/* Rating and Bookings */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium text-foreground">
                  {service.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({service.totalReviews} reviews)
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-muted-foreground mr-1" />
                <span className="text-sm text-muted-foreground">
                  {service.totalBookings} bookings
                </span>
              </div>
            </div>

            {/* Emergency/24x7 Badges */}
            {(service.isEmergencyService || service.isAvailable24x7) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {service.isEmergencyService && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    <Zap className="w-3 h-3 mr-1" />
                    Emergency
                  </span>
                )}
                {service.isAvailable24x7 && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    24/7
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                onClick={() => onView(service)}
                className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(service)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                
                <button
                  onClick={() => onDelete(service)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};